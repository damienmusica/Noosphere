@AGENTS.md

## Claude Code 전용

- 전략과 결정은 Obsidian vault `Noosphere/` (index.md 결정 로그, roadmap.md) 가 정본이다.
  세션 시작에 읽는다 — 기억으로 상태를 재구성하지 않는다.
- 이 레포는 `.claude/worktrees/` 를 쓴다. 지침은 루트에 둔다 — 하위 `CLAUDE.md` 는
  `/compact` 뒤 다시 주입되지 않는다.
- 생성과 QC 는 다른 세션이다. `proposal-generator` 는 자기 출력을 검증하지 않는다.
- 대량 생성·QC 는 `model: 'opus'`, 판단은 세션 모델이 직접.
