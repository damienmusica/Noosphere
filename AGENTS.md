# AGENTS.md — Noosphere

모든 코딩 에이전트가 읽는 정본이다. 개인 전역 지침은 `~/dotfiles/AGENTS.md`.

Noosphere 는 English-first, 다국어 대비, **읽기 전용** 지식 지구본이다 — 사람·작품·개념을
포함한 백과사전의 현대화. 값은 산출물에 쌓인다. 지금의 우선순위는 유지 가능하고 안전한
데이터 기반이다.

## 먼저 읽을 것

- `docs/project-charter.md` — 정체성·자세·경계·LLM 경계
- `docs/data-foundry.md` — 현 국면의 작업 브리프, **승급 정책(§8)과 결정 자율성(§7.1)**
- `docs/source-of-truth.md` — 어느 문서가 권위인가. 최종 권위는 Obsidian vault 의 결정 로그.
- `docs/ai-usage-policy.md` — AI 가 무엇을 해도 되고 안 되는가

과제가 이 문서들과 충돌하면 **멈추고 묻는다.** 「하나의 책」은 별도 레포다
(github.com/damienmusica/one-book) — 코드를 공유하지 않고, 조인 키는 Wikidata QID.

## 하드 제약

로그인·계정·관리자 UI 없음. 데이터베이스 없음 — `/data` 의 JSON 만. 사용자 생성 콘텐츠·
공개 편집 없음. 스크래핑 없음. 레포와 환경에 비밀 없음. **런타임·빌드·CI 에 LLM 호출
없음** — LLM 은 유지보수자가 대화로만 쓴다. 광고·결제 없음. 나무위키는 외부 링크만.
회사 내부 데이터·코드 금지. AI 가 제안한 노드·엣지는 근거·불확실성·모호 표시를 달고
큐레이션 게이트를 통과해야 `/data` 에 들어간다 — `foundry/proposals/` 는 신뢰되지 않는
초안이다.

## 데이터 불변식

`scripts/validate-data.ts` 가 정본이다 — 규칙과 그 수는 거기 있다. 핵심만: ID 는 언어
독립 슬러그(표시 이름 아님, 외부 ID 는 `external_ids`) · 모든 엣지에 관계 종류·신뢰도·
상태·**출처 있는 근거** · 관계 종류는 `docs/relation-taxonomy.md`(추가는 문서·스키마·
검증을 같은 변경에서) · 번역은 별도 파일, 토폴로지는 표시 텍스트에 의존하지 않는다 ·
`reviewed` 만 색인 가능 · 생존 인물은 더 엄한 근거와 보수적 표현.

## 일하는 법

1. 탐색하고 이해를 요약한다. 2. 짧은 계획 — 넓거나 구조적이면 승인을 받는다.
3. 작고 검토 가능한 변경. 4. `npm run typecheck` · `npm run validate:data`.
5. 바뀐 파일·실행한 명령·결과를 요약하고 가정과 TODO 를 밝힌다.

값을 치르고 얻은 규칙 셋:
- **서브에이전트가 쓰는 중에 `git add -A` 금지.** 명시 경로만. (반쯤 쓰인 배치가 main 을 빨갛게 했다.)
- **"no checks reported" 는 초록이 아니다.** 등록 경쟁이다 — 결론이 날 때까지 기다린다.
- **배치 디렉토리는 완전할 때만 유효하다.** README 색인 행과 앵커까지 한 변경에.
- **결함 기록은 노드·엣지 ID 로 쓴다.** 산문 이름은 기계가 못 잰다. 기록을 고칠 때는 모든
  절을 `/data` 에 다시 대본다.

## 도구

명령은 `package.json` 이 정본이다. 세션 시작은 `npm run foundry:recheck-held` 와
`npm run report:graph`. foundry 파일을 열면 `.claude/rules/data-foundry-policy.md` 가
행동 카드로 붙는다. 스택은 TypeScript + Zod, JSON 우선, 의존성 최소.
