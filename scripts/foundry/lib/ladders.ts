/**
 * Executable transcription of the ratified promotion ladders.
 *
 * The vault decision log remains the AUTHORITY; this module is the arithmetic.
 * Until now every session re-derived "may this end `reviewed`?" from prose
 * (CLAUDE.md + docs/data-foundry.md §8 + the vault log) — with five-plus
 * ladders in force, inconsistent application across sessions was the most
 * plausible next incident. Here the preconditions are pure logic over the
 * decision file and the post-apply graph state; the LLM judgments themselves
 * (supported/disputed, direction, identity referent) stay interactive and
 * arrive as recorded verdict fields.
 *
 * If a check here is found to diverge from ratified policy text, THAT is a
 * stop-point: fix the transcription in the same change as the vault ruling,
 * never silently.
 *
 * Ladders encoded (pointers, not restatements — see docs/data-foundry.md §8):
 *   node-promotion-v1        resolver-verified external grounding
 *   node-promotion-v1.4      QID-less alternative identity anchor (93)
 *   living-person-v2         stricter floor, auto-promotes when clean (70)
 *   edge-promotion-v1-structural / -clause6   (15) incl. contested placements
 *   formalizes-auto-54 / founded-or-formalized-auto-60 / a-relation-auto-68
 *   editorial-v2             summaries (26)/(34) — machine checks live in
 *                            claim-anchor/fetch-verify scripts, not here
 *   manual-cpo               explicit ratification pointer required
 */
import type {
  FoundryDecision,
  IdentityRecord,
  Ladder,
  VerdictRecord,
} from "../../../src/schema/foundry-decision.ts";
import type { Edge } from "../../../src/schema/edge.ts";
import type { Node } from "../../../src/schema/node.ts";

export type LadderFinding = {
  subject_id: string;
  ladder?: Ladder;
  level: "violation" | "advisory";
  message: string;
};

export type LadderInput = {
  decision: FoundryDecision;
  /** Post-apply graph state (adds + promotions already applied in memory). */
  postNodesById: Map<string, Node>;
  postEdgesById: Map<string, Edge>;
};

const EDGE_AUTO_LADDER: Record<string, Ladder> = {
  formalizes: "formalizes-auto-54",
  founded_or_formalized: "founded-or-formalized-auto-60",
  influenced: "a-relation-auto-68",
  critiques: "a-relation-auto-68",
};

function independentSources(verdict: VerdictRecord | undefined): number {
  return verdict?.sources.filter((s) => s.independent).length ?? 0;
}

/** Every node/edge whose FINAL status in this decision is `reviewed`. */
function reviewedOutcomes(input: LadderInput): { kind: "node" | "edge"; id: string }[] {
  const out: { kind: "node" | "edge"; id: string }[] = [];
  const { decision } = input;
  for (const n of decision.adds.nodes) {
    if (n.status === "reviewed") out.push({ kind: "node", id: n.id });
  }
  for (const e of decision.adds.edges) {
    if (e.status === "reviewed") out.push({ kind: "edge", id: e.id });
  }
  for (const p of decision.promotions) {
    // A reviewed→reviewed op is a metadata flip (set_indexable/set_note), not a
    // promotion — it does not (re)earn reviewed status, so it demands no node
    // ladder (CPO-ratified 2026-07-02, session #55 ext.). The indexable earned
    // rule stays machine-enforced by validate-data (indexable ⟹ reviewed
    // status + reviewed en translation), so no gate is lost here.
    if (p.to === "reviewed" && p.from !== "reviewed") out.push({ kind: p.kind, id: p.id });
  }
  return out;
}

export function checkLadders(input: LadderInput): LadderFinding[] {
  const { decision, postNodesById, postEdgesById } = input;
  const findings: LadderFinding[] = [];
  const violation = (subject_id: string, message: string, ladder?: Ladder) =>
    findings.push({ subject_id, ladder, level: "violation", message });
  const advisory = (subject_id: string, message: string, ladder?: Ladder) =>
    findings.push({ subject_id, ladder, level: "advisory", message });

  const verdictBySubject = new Map(decision.verdicts.map((v) => [v.subject_id, v]));
  const identityByNode = new Map<string, IdentityRecord[]>();
  for (const rec of decision.identity) {
    const list = identityByNode.get(rec.node_id) ?? [];
    list.push(rec);
    identityByNode.set(rec.node_id, list);
  }
  const sanctionBySubject = new Map(decision.sanctions.map((s) => [s.subject_id, s]));
  const outcomes = reviewedOutcomes(input);
  const outcomeIds = new Set(outcomes.map((o) => o.id));

  // Metadata-flip ops (reviewed→reviewed): only set_indexable/set_note may ride
  // them — anything identity- or evidence-bearing must go through a real status
  // transition, where a ladder sanction is demanded (CPO-ratified 2026-07-02).
  for (const p of decision.promotions) {
    if (p.from !== "reviewed" || p.to !== "reviewed") continue;
    if (p.set_external_ids || p.set_evidence) {
      violation(
        p.id,
        `reviewed→reviewed is a metadata flip: set_external_ids/set_evidence require a real status transition`,
      );
    }
    if (p.kind === "node" && p.set_indexable !== undefined) {
      advisory(
        p.id,
        `indexable flip — earned rule (reviewed status + reviewed en translation) enforced by validate-data`,
      );
    }
  }

  // Dangling sanctions: a sanction must describe a reviewed outcome of THIS
  // batch — or an editorial translation subject (editorial-v2 sanctions cover
  // translation_updates, which reviewedOutcomes deliberately does not count).
  const editorialSubjects = new Set(
    decision.translation_updates.filter((tu) => tu.reviewed).map((tu) => tu.node_id),
  );
  for (const s of decision.sanctions) {
    if (!outcomeIds.has(s.subject_id) && !editorialSubjects.has(s.subject_id)) {
      advisory(s.subject_id, `sanction (${s.ladder}) has no reviewed outcome in this decision`, s.ladder);
    }
  }

  // Negative verdicts can never end reviewed, under any ladder (clause-6 v2 safety net).
  for (const v of decision.verdicts) {
    if (v.verdict !== "supported" && outcomeIds.has(v.subject_id)) {
      violation(
        v.subject_id,
        `verdict is "${v.verdict}" but the subject ends reviewed — disputed/NEI/reject stop at proposed/foundry`,
      );
    }
  }

  for (const { kind, id } of outcomes) {
    const sanction = sanctionBySubject.get(id);
    if (!sanction) {
      violation(id, `ends reviewed but has no ladder sanction`);
      continue;
    }
    const ladder = sanction.ladder;
    const verdict = verdictBySubject.get(id);

    if (ladder === "manual-cpo") {
      if (!sanction.note?.trim()) {
        violation(id, `manual-cpo sanction requires a vault decision-log pointer in note`, ladder);
      } else {
        advisory(id, `manual-cpo promotion — CPO ratification cited: ${sanction.note}`, ladder);
      }
      continue;
    }

    if (kind === "node") {
      const node = postNodesById.get(id);
      if (!node) {
        violation(id, `sanctioned node not found in post-apply state`, ladder);
        continue;
      }
      const identities = identityByNode.get(id) ?? [];
      const verifiedIds = identities.filter((r) => r.verified);

      if (ladder === "node-promotion-v1") {
        const wikidata = verifiedIds.find((r) => r.provider === "wikidata");
        if (!wikidata) {
          violation(id, `node-promotion-v1 requires a verified wikidata identity record`, ladder);
        } else if (node.external_ids["wikidata"] !== wikidata.external_id) {
          violation(
            id,
            `verified QID ${wikidata.external_id} is not in the node's external_ids (found: ${node.external_ids["wikidata"] ?? "none"})`,
            ladder,
          );
        }
        if (node.is_living_person) {
          violation(id, `living-person nodes promote via living-person-v2, not node-promotion-v1`, ladder);
        }
      } else if (ladder === "node-promotion-v1.4") {
        const alt = verifiedIds.find((r) => r.provider !== "wikidata");
        if (!alt) {
          violation(id, `node-promotion-v1.4 requires a verified non-wikidata identity anchor (e.g. philpapers)`, ladder);
        }
        if (verdict?.verdict !== "supported" || independentSources(verdict) < 2) {
          violation(id, `node-promotion-v1.4 requires a supported verdict with ≥2 independent authorities`, ladder);
        }
        if (node.is_living_person) {
          violation(id, `living-person nodes promote via living-person-v2, not node-promotion-v1.4`, ladder);
        }
      } else if (ladder === "living-person-v2") {
        if (!node.is_living_person) {
          violation(id, `living-person-v2 sanction on a node that is not is_living_person`, ladder);
        }
        const anchored = verifiedIds.find((r) => r.p570_absent_confirmed_at);
        if (verifiedIds.length === 0) {
          violation(id, `living-person-v2 requires a verified identity anchor`, ladder);
        } else if (!anchored) {
          violation(
            id,
            `living-person-v2 requires p570_absent_confirmed_at — aliveness is observed, never assumed (decision (70))`,
            ladder,
          );
        }
        if (verdict?.verdict !== "supported" || independentSources(verdict) < 2) {
          violation(id, `living-person-v2 requires a supported verdict with ≥2 independent live claim-stating sources`, ladder);
        }
        advisory(id, `living person: conservative attributed wording required in summary/notes (prose check)`, ladder);
      } else {
        violation(id, `ladder ${ladder} does not sanction node promotions`, ladder);
      }
      continue;
    }

    // kind === "edge"
    const edge = postEdgesById.get(id);
    if (!edge) {
      violation(id, `sanctioned edge not found in post-apply state`, ladder);
      continue;
    }
    const sourceNode = postNodesById.get(edge.source);
    const targetNode = postNodesById.get(edge.target);
    for (const [role, endpoint] of [
      ["source", sourceNode],
      ["target", targetNode],
    ] as const) {
      if (!endpoint) {
        violation(id, `${role} endpoint missing from post-apply state`, ladder);
      } else if (endpoint.status !== "reviewed") {
        violation(id, `${role} endpoint ${endpoint.id} is "${endpoint.status}" — a reviewed edge needs reviewed endpoints`, ladder);
      }
    }
    if (edge.evidence_kind === "editorial") {
      violation(id, `editorial-evidenced edges stop at proposed (edge promotion policy v1)`, ladder);
    }

    if (ladder === "edge-promotion-v1-structural") {
      if (edge.evidence_kind !== "externally_sourced") {
        violation(id, `structural tier requires evidence_kind externally_sourced`, ladder);
      }
      if (edge.disputed) {
        violation(id, `disputed placements promote via edge-promotion-v1-clause6, not the structural tier`, ladder);
      }
      if (verdict?.verdict !== "supported" || independentSources(verdict) < 1) {
        violation(id, `structural tier requires a supported verdict grounded in ≥1 independent source`, ladder);
      }
    } else if (ladder === "edge-promotion-v1-clause6") {
      if (!edge.disputed) {
        violation(id, `clause-6 sanction on an edge without disputed:true`, ladder);
      }
      if (!edge.note?.trim()) {
        violation(id, `clause 6 requires the minority position recorded in note`, ladder);
      }
      if (verdict?.verdict !== "supported" || independentSources(verdict) < 3) {
        violation(id, `clause 6 requires a supported verdict with ≥3 independent sources (majority + ≥2 supporting)`, ladder);
      }
    } else if (
      ladder === "formalizes-auto-54" ||
      ladder === "founded-or-formalized-auto-60" ||
      ladder === "a-relation-auto-68"
    ) {
      const expected = EDGE_AUTO_LADDER[edge.relation];
      if (expected !== ladder) {
        violation(id, `relation "${edge.relation}" is not sanctioned by ${ladder}${expected ? ` (expected ${expected})` : ""}`, ladder);
      }
      if (!verdict) {
        violation(id, `${ladder} requires a recorded Lane B verdict`, ladder);
      } else {
        if (verdict.verdict !== "supported") {
          violation(id, `${ladder} promotes only supported verdicts (got "${verdict.verdict}")`, ladder);
        }
        if (independentSources(verdict) < 2) {
          violation(id, `${ladder} requires ≥2 independent claim-stating live sources (got ${independentSources(verdict)})`, ladder);
        }
        if (verdict.direction_confirmed !== true) {
          violation(id, `${ladder} requires direction_confirmed:true`, ladder);
        }
        if (ladder !== "formalizes-auto-54" && verdict.identity_referent_verified !== true) {
          violation(id, `${ladder} requires identity_referent_verified:true (right person, right referent)`, ladder);
        }
      }
      // Living-person endpoints: decision (70) — the stricter floor lives on the
      // NODE (living-person-v2); an endpoint being promoted in this same batch
      // must carry that sanction, an already-reviewed one was enforced when
      // it was promoted.
      for (const endpoint of [sourceNode, targetNode]) {
        if (!endpoint?.is_living_person) continue;
        const nodeSanction = sanctionBySubject.get(endpoint.id);
        const promotedNow = outcomeIds.has(endpoint.id);
        if (promotedNow && nodeSanction?.ladder !== "living-person-v2") {
          violation(id, `living endpoint ${endpoint.id} promoted in this batch must use living-person-v2`, ladder);
        } else {
          advisory(id, `living endpoint ${endpoint.id}: (70) floor applies — attributed wording, narrow escalation signals`, ladder);
        }
      }
    } else if (ladder === "editorial-v2") {
      violation(id, `editorial-v2 sanctions translation updates, not edges`, ladder);
    } else {
      violation(id, `ladder ${ladder} does not sanction edge promotions`, ladder);
    }
  }

  // Editorial updates: reviewed summaries need an editorial-v2 sanction on the node.
  for (const tu of decision.translation_updates) {
    if (!tu.reviewed) continue;
    const s = sanctionBySubject.get(tu.node_id);
    if (!s || s.ladder !== "editorial-v2") {
      violation(
        tu.node_id,
        `translation summary set reviewed without an editorial-v2 sanction`,
        "editorial-v2",
      );
    } else {
      advisory(
        tu.node_id,
        `editorial-v2: run claim-anchor + fetch-verify machine checks; close-read sampling per decision (34)`,
        "editorial-v2",
      );
    }
  }

  return findings;
}
