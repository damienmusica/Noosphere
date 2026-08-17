#!/usr/bin/env python3
"""R10 art-asset builder — turns the rights-verified staging scans into the
sprites/plates the paper-planet grammar ships. Every output traces to a
provenance.json row; nothing synthetic is introduced (ghosting/recoloring
only). Run after art-r10/render-svg.mjs.

Outputs → public/art/ + public/art/manifest.json
"""
import json, os
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ST = os.path.join(ROOT, "art-r10", "staging")
RAW = os.path.join(ROOT, "art-r10", "build", "raw")
OUT = os.path.join(ROOT, "public", "art")
INK = (43, 32, 21)  # warm near-black ink

for d in ("marks", "archival", "covers", "grounds"):
    os.makedirs(os.path.join(OUT, d), exist_ok=True)

manifest = {"marks": {}, "archival": {}, "covers": {}, "grounds": {}}


def ink_alpha_from_dark(im, thresh=200):
    """dark strokes on light/transparent ground → warm-ink RGBA sprite"""
    g = ImageOps.grayscale(im.convert("RGB"))
    a = g.point(lambda v: 255 - v if v < thresh else 0)
    out = Image.new("RGBA", im.size, INK + (0,))
    out.putalpha(a)
    return out


def tight_bbox(rgba, pad=14):
    bbox = rgba.getchannel("A").getbbox()
    if not bbox:
        return rgba
    l, t, r, b = bbox
    l = max(0, l - pad); t = max(0, t - pad)
    r = min(rgba.width, r + pad); b = min(rgba.height, b + pad)
    return rgba.crop((l, t, r, b))


def save_mark(author, im, target_h=420):
    im = tight_bbox(im)
    w = round(im.width * target_h / im.height)
    im = im.resize((w, target_h), Image.LANCZOS)
    f = f"marks/{author}.png"
    im.save(os.path.join(OUT, f))
    manifest["marks"][author] = {"file": f, "w": im.width, "h": im.height}
    print("mark", author, im.size)


# --- marks -------------------------------------------------------------------
# Kafka / Tagore: rasterized signature SVGs (black strokes, transparent bg)
for author, raw in (
    ("franz-kafka", "franz-kafka-signature.png"),
    ("rabindranath-tagore", "rabindranath-tagore-signature.png"),
):
    im = Image.open(os.path.join(RAW, raw)).convert("RGBA")
    # recolor strokes to warm ink, keep the anti-aliased alpha
    solid = Image.new("RGBA", im.size, INK + (255,))
    solid.putalpha(im.getchannel("A"))
    save_mark(author, solid)

# Soseki: brush signature 漱石 + the two red kanji seals, cut from the real
# hanging-scroll scan (320×1089). Ink becomes tintless warm-black; the seal
# vermilion is MATERIAL red (a fact of the object), preserved as-is and
# distinct from the UI's selection vermilion.
scroll = Image.open(os.path.join(ST, "natsume-soseki", "02_calligraphy_seal_natsume_souseki.jpg")).convert("RGB")
sig = scroll.crop((30, 540, 135, 705))    # 漱石 brush signature
seals = scroll.crop((30, 700, 115, 815))  # two red seals
def scroll_alpha(im):
    """paper → transparent; ink stays dark, seals stay red. The source scan
    is only ~100px across the marks — upscale 3× BEFORE thresholding so the
    brush texture survives, and keep the thresholds gentle."""
    im = im.resize((im.width * 3, im.height * 3), Image.LANCZOS)
    rgba = im.convert("RGBA")
    px = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, _ = px[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            redness = r - (g + b) / 2
            if redness > 16:   # seal vermilion — deepen toward true 인주 red
                a = min(255, int(redness * 5.0))
                px[x, y] = (188, 52, 40, a)
            elif lum < 212:    # brush ink — gentle ramp keeps dry-brush texture
                a = int(min(255, (212 - lum) * 2.6))
                px[x, y] = INK + (a,)
            else:
                px[x, y] = (0, 0, 0, 0)
    return rgba
sig_a = tight_bbox(scroll_alpha(sig)); seals_a = tight_bbox(scroll_alpha(seals))
col_w = max(sig_a.width, seals_a.width) + 8
gap = 26
comp = Image.new("RGBA", (col_w, sig_a.height + gap + seals_a.height), (0, 0, 0, 0))
comp.paste(sig_a, ((col_w - sig_a.width) // 2, 0), sig_a)
comp.paste(seals_a, ((col_w - seals_a.width) // 2, sig_a.height + gap), seals_a)
comp = comp.resize((comp.width * 2, comp.height * 2), Image.LANCZOS)
save_mark("natsume-soseki", comp)

# --- archival portraits ------------------------------------------------------
PORTRAITS = {
    "franz-kafka": ("franz-kafka/kafka-portrait-1923-last-photo.jpg", (60, 60, 1932, 2400)),
    "natsume-soseki": ("natsume-soseki/01_portrait_natsume_souseki_1912.jpg", (40, 30, 984, 1210)),
    "rabindranath-tagore": ("rabindranath-tagore/portrait-1909.jpg", (60, 20, 1011, 1210)),
}
for author, (rel, box) in PORTRAITS.items():
    im = Image.open(os.path.join(ST, rel)).convert("RGB").crop(box)
    im = ImageOps.grayscale(im)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im.thumbnail((760, 950), Image.LANCZOS)
    f = f"archival/{author}.jpg"
    im.convert("RGB").save(os.path.join(OUT, f), quality=86)
    manifest["archival"][author] = {"file": f, "w": im.width, "h": im.height}
    print("archival", author, im.size)

# --- work-cover plates -------------------------------------------------------
COVERS = {
    "franz-kafka--die-verwandlung": ("franz-kafka/kafka-die-verwandlung-1915-firstedition-cover.jpg", "CC-BY-3.0 H.-P. Haack"),
    "franz-kafka--der-process": ("franz-kafka/kafka-der-prozess-1925-firstedition-cover.jpg", "PD"),
    "franz-kafka--das-schloss": ("franz-kafka/kafka-das-schloss-1926-firstedition-cover.jpg", "PD-text"),
    "franz-kafka--in-der-strafkolonie": ("franz-kafka/kafka-in-der-strafkolonie-1919-firstedition-titlepage.jpg", "CC-BY-3.0 H.-P. Haack"),
    "natsume-soseki--wagahai-wa-neko-de-aru": ("natsume-soseki/04_cover_i_am_a_cat_goyo_1906.jpg", "PD"),
    "natsume-soseki--kokoro": ("natsume-soseki/05_cover_kokoro_1914_lowres.jpg", "PD"),
    "natsume-soseki--sorekara": ("natsume-soseki/06_cover_sorekara_1910_shunyodo.jpg", "PD-Japan"),
    "natsume-soseki--sanshiro": ("natsume-soseki/07_cover_sanshiro_1909_shunyodo.jpg", "PD-Japan"),
    "natsume-soseki--botchan": ("natsume-soseki/08_cover_uzurakago-botchan_1907_shunyodo.jpg", "PD-Japan"),
    "rabindranath-tagore--gitanjali": ("rabindranath-tagore/gitanjali_bengali_titlepage_1913_3rdedition.jpg", "PD"),
    "rabindranath-tagore--ghare-baire": ("rabindranath-tagore/home_and_the_world_cover_macmillan.jpg", "PD-US"),
}
for work, (rel, lic) in COVERS.items():
    im = Image.open(os.path.join(ST, rel)).convert("RGB")
    im.thumbnail((420, 620), Image.LANCZOS)
    f = f"covers/{work}.jpg"
    im.save(os.path.join(OUT, f), quality=85)
    manifest["covers"][work] = {"file": f, "w": im.width, "h": im.height, "license": lic}
    print("cover", work, im.size)

# --- manuscript grounds (near-LOD territory paper) ---------------------------
# The author's own page, ghosted to sit UNDER labels: grayscale, lifted to
# paper values, ink at ~14% presence. Sized for the atlas-patch path.
GROUNDS = {
    "franz-kafka": "franz-kafka/kafka-notebook-manuscript-1922.jpg",
    "natsume-soseki": "natsume-soseki/03_manuscript_i_am_a_cat.jpg",
    "rabindranath-tagore": "rabindranath-tagore/gitanjali_manuscript_page20.jpg",
}
for author, rel in GROUNDS.items():
    im = ImageOps.grayscale(Image.open(os.path.join(ST, rel)).convert("RGB"))
    im.thumbnail((1280, 1280), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=2)
    # paper 236 / ink floor lifted: ghost = paper - 0.16*(paper-ink)
    im = im.point(lambda v: int(236 - 0.16 * (236 - v)) if v < 236 else 236)
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    f = f"grounds/{author}.jpg"
    im.convert("RGB").save(os.path.join(OUT, f), quality=82)
    manifest["grounds"][author] = {"file": f, "w": im.width, "h": im.height}
    print("ground", author, im.size)

with open(os.path.join(OUT, "manifest.json"), "w") as fp:
    json.dump(manifest, fp, ensure_ascii=False, indent=1)
print("manifest → public/art/manifest.json")
