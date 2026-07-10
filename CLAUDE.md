@AGENTS.md

<!-- AGENTS.md 가 정본이다. 프로젝트 지침은 거기에 쓴다. Codex/Gemini/Grok 도 그 파일을 읽는다. -->
<!-- 이 아래는 Claude Code 에서만 의미가 있는 것들만. -->
<!-- Data Foundry 승급 정책은 .claude/rules/data-foundry-policy.md 에 있고, -->
<!-- foundry/** 파일을 열 때 자동으로 로드된다 (매 세션 로드되지 않는다). -->
<!-- 주의: path-scoped rule 은 /compact 후 자동 재주입되지 않는다. 다음번 매칭 파일을 -->
<!-- 읽을 때 다시 로드된다. 루트 CLAUDE.md 와 @AGENTS.md 는 재주입되므로, 정책의 -->
<!-- '존재'를 알리는 포인터는 AGENTS.md 에 두었다. compact 직후 foundry 판단을 -->
<!-- 내려야 하면 docs/data-foundry.md §8/§15 를 먼저 읽을 것. -->

## Claude Code 전용

### 세션 시작

- Single-tool operation via Claude Code. Strategy/decisions upstream lives in the Obsidian vault folder
  `Noosphere/` (index.md decision log, roadmap.md). **Read those at session start; do not reconstruct
  state from memory.**
- `npm run foundry:recheck-held` 로 held/blocked 워크리스트를 먼저 확인한다.

### worktree

이 레포는 `.claude/worktrees/` 를 쓴다. 루트 `CLAUDE.md` 는 `/compact` 이후 다시 주입되지만
하위 디렉토리의 `CLAUDE.md` 는 자동 재주입되지 않는다. 지침은 루트에 둔다.

### 서브에이전트

`.claude/agents/proposal-generator.md` 는 generation 전용이다. **자기 출력을 QC 하지 않는다**
(generation/QC 컨텍스트 분리). 승급 게이트에 LLM 판정이 포함될 때는 generation 과 QC 를
반드시 별도 세션에서 돌린다.
