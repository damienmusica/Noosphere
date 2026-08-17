# R10 blind A/B visual review — protocol

Two capture sets, identical choreography (`art-r10/capture-slice.mjs`,
3 slice authors × far/mid/near, same deep links, same waits):

- **set-x** = candidate (paper-planet build; reviewers are NOT told this)
- **set-y** = baseline (frozen functional build @1d00a28; not told either)

Blinding: frames are copied to a neutral session directory (`ab-review/set-x`,
`ab-review/set-y`) so no path or filename reveals which set is which, and the
set→build mapping above is withheld from reviewers (it is recorded here for
the audit trail only). x/y assignment is anti-chronological on purpose, to
counter any "the second set must be the newer one" guess.

Reviewers: 2 independent fresh-context agents (graphic-designer,
visual-art-director), no implementation notes, no repo access instructions —
images only. Neither sees the other's verdict.

Questions (per author, comparing the same LOD pair across sets, then overall):

1. 위계 — 어느 세트에서 "이 화면의 제1주인공"과 "다음에 할 행동"이 더 빨리
   읽히는가?
2. 의미 — 어느 세트가 "여기는 다른 곳 아닌 바로 이 작가의 영토"임을 더
   구체적으로 전달하는가? 화면의 형태·색·높이 가운데 정보를 나르지 않는
   장식이 있으면 지적하라.
3. 미감 — 어느 쪽이 출시 가능한 미감에 가까운가? 약점을 세트별로 최소 1개씩.
4. 종합 — X/Y 중 하나를 고르고 이유를 서술하라. 무승부 금지.

Pass rule (set in advance): the candidate ships only if BOTH reviewers pick
its set on question 4 AND neither finds a hierarchy regression (question 1)
in any pair. Weaknesses found in the winning set are recorded as follow-ups,
not silently dropped.

## Results

### Round 1 (2026-08-18) — SPLIT 1:1 → candidate FAILS the pre-set rule

- graphic-designer → **Y (baseline)**. Decisive finding: in all three mid
  frames the candidate's neighbor/bystander label slips rendered as EMPTY
  paper chips — a hierarchy regression ("다음 행동이 안 읽히는 건 기능
  결함"). Root cause (found in code after the verdict): pre-R10 state
  classes (`.is-neighbor`/`.is-dim`/`.is-normal`) still painted
  light-on-dark text tones over the new light slips at higher cascade
  priority. A bug, not an inherent trade-off of the direction.
- visual-art-director → **X (candidate), conditional**. "3번 중 2번 성공한
  완성도 문제이지 콘셉트 실패가 아니다." Conditions: (1) Tagore's mark is
  an illegible scribble — replace with real handwriting; (2) reduce the
  selected-center stack (signature+frame+dial+slip+disc); (3) unify the
  work-marker language. Also caught a BASELINE bug (unframed 魯 glyph
  leaking at screen edge in set-y natsume-soseki-1mid) — evidence the
  reviewer was genuinely blind.
- Both agreed the candidate's place-specificity (real hands, real paper,
  culture-correct marks) is ahead; both located the loss in execution,
  not concept. The designer's own synthesis suggestion ("Y의 라벨 프레임
  안에 X의 장소 텍스처") is exactly what fixing the label bug yields.

Repairs before round 2: slip-genre state colors re-inked (authors, works,
relations); collector's slip moved below the 감상인 frame; halo disc
silenced for the selected mark-bearer; Tagore mark rebuilt from the real
1920 Bengali ink scan (955×277 Commons, PD) instead of the traced SVG;
cover scans shaved 2.5%/side (catalog borders read as loose polaroids).
Work-marker unification beyond the shared board construction was NOT
attempted — distorting real cover aspects would violate the charter's
nothing-synthetic rule; recorded as a accepted-variance decision.

### Round 2 — fresh reviewers, same protocol

(appended after the review runs)
