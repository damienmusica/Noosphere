# Charter 개정안 3건 — 초안 (비준 전)

기안: CTO · 2026-08-20 · 발의 근거: R11 외부 리뷰 + CPO 판정

**상태: 전부 초안이다.** 결정 (129) 선례에 따라 **비준 전에는 어떤 거버넌스
문서도 바꾸지 않는다.** 이 파일은 개정 제안일 뿐이며 `docs/project-charter.md`
는 그대로다.

**CPO 판정으로 이미 확정된 경계 (2026-08-20):**

> **제휴 링크와 외부 사업자 추적의 허용은 비준하지 않는다.**

아래 개정안 ③은 추적의 **정의를 명확히 할 뿐**, 제휴·외부 추적을 허용하는
문구를 포함하지 않는다. 개정안 ②는 "검토 대상으로 올린다"까지가 주문이다.

---

## 개정안 ① — UGC 경계 명문화 (긴급도: 높음)

### 왜 지금인가

현행 charter §2: *"No user-generated content, comments, or public editing."*

이 문구를 문자 그대로 읽으면 **이미 구현된 R11 개인 성좌 기능이 위태롭다** —
읽음 표시·궤도 담기·읽은 순서 성좌선은 모두 사용자가 만든 상태다. 이것은 CTO
가 만든 부채다: 구현 전에 경계를 명확히 하지 않았다.

문제는 현행 문구가 **무엇을 막으려는지**를 말하지 않고 **무엇이 존재하는지**만
말한다는 점이다. 실제로 막으려는 것은 (a) 조정(moderation) 부담 (b) 정본
코퍼스 오염 (c) 우리 이름으로 나가는 타인의 주장이다.

### 개정 문안 (제안)

> **No hosted user content.** Noosphere does not collect, host, index, search,
> recommend, or publicly display user-authored content, and never merges it
> into the canonical corpus. A reader's own state — reading marks, private
> annotations, personal arrangements — may live in their browser and travel in
> a self-contained link they choose to share. Such state is never stored on our
> infrastructure, never appears in evidence or source surfaces, never ranks or
> influences anything the atlas asserts, and is always visually and verbally
> marked as the reader's, not ours.
>
> **호스팅된 사용자 콘텐츠 없음.** Noosphere 는 사용자가 작성한 콘텐츠를
> 수집·호스팅·색인·검색·추천·공개 전시하지 않으며 정본 코퍼스에 병합하지
> 않는다. 독자 자신의 상태 — 독서 표시, 사적 주석, 개인적 배열 — 는 독자의
> 브라우저에 있을 수 있고 독자가 선택해 공유하는 자립적 링크에 담겨 이동할 수
> 있다. 그 상태는 우리 인프라에 저장되지 않고, 증거·출처 표면에 나타나지
> 않으며, 아틀라스가 주장하는 어떤 것의 순위나 내용에도 영향을 주지 않고,
> 항상 시각적·언어적으로 **독자의 것**이라고 표시된다.

### 이 문안이 허용/금지하는 것

| | |
|---|---|
| **허용** | localStorage 독서 기록 · 자립적 공유 URL · 개인 성좌 렌즈 |
| **허용(조건부)** | 독자가 긋는 연결선 — 전용 시각 채널 + "독자의 연결" 표기 + 증거 패널 배제. **자유 텍스트는 V1 에서 제외** |
| **금지** | 공개 갤러리 · 검색 · 좋아요 · 랭킹 · 서버 저장 · 정본 병합 |

미비준 시 대안: **공유를 막고 로컬 전용으로 축소한다.** 그 경우 현행 문구로도
방어 가능하다.

---

## 개정안 ② — 결제 표면과 외부 지원의 분리 (긴급도: 중간 · 검토 대상)

### 왜

현행 charter §2 *"No ads, no payments"* 는 두 가지 다른 것을 한 문장에 묶는다:
**제품 안에 결제·광고 표면이 없다**(정체성)와 **프로젝트가 어떤 자금도 받을 수
없다**(운영). 후자는 의도된 적이 없지만 문구는 그렇게 읽힌다. 자료 커버리지
파도(기록 초상·육필 지각)에는 자원이 필요하고, 그 자원의 출처를 헌법이
암묵적으로 봉쇄하고 있다.

### 개정 문안 (제안)

> **No commercialization surface.** The atlas itself carries no advertising, no
> payment flow, no purchase funnel, and no commercial signal in any ranking,
> size, ordering, or recommendation. This constrains the **product**, not the
> **project**: Noosphere may receive public, academic, library, museum, or
> foundation support, provided (a) no supporter influences editorial content or
> ordering, (b) support is disclosed on a page outside the atlas surface, and
> (c) no knowledge in the atlas is placed behind payment.
>
> **상업화 표면 없음.** 아틀라스 자체에는 광고·결제 흐름·구매 퍼널이 없고,
> 어떤 순위·크기·순서·추천에도 상업 신호가 들어가지 않는다. 이것은 **제품**을
> 제약하지 **프로젝트**를 제약하지 않는다: 공공·학술·도서관·박물관·재단의
> 지원을 받을 수 있다. 단 (a) 어떤 지원자도 편집 내용과 순서에 영향을 주지
> 않고, (b) 지원 사실은 아틀라스 표면 **밖의** 페이지에 공개하며, (c) 아틀라스
> 안의 어떤 지식도 결제 뒤에 두지 않는다.

(c)가 중요한 이유: 판본 큐레이션 같은 편집 산출물을 유료화해 정보를 잠그는
것은 제휴 링크보다 이 제품의 정체성을 더 크게 훼손한다.

**이 개정안은 제휴를 허용하지 않는다.** 제휴는 개정안 ③의 대상이며 CPO
판정으로 미비준 상태다.

---

## 개정안 ③ — 추적의 정의 (긴급도: 중간)

### 왜

LP 브리프의 상속 조항 *"사용자 추적 없음"* 은 세 가지를 구분하지 않는다:
① 우리가 심는 분석 도구 ② 우리가 링크로 유발하는 외부 사업자의 추적
③ 사용자가 스스로 자기 기기에 남기는 기록.

③은 이미 존재하고(개인 성좌), ①은 없으며, ②는 **허용되지 않는다.**

### 개정 문안 (제안)

> **No tracking.** Noosphere ships no analytics, no fingerprinting, no
> third-party scripts, and no cookies. It does not carry identifiers that let
> any party — including us — follow a reader across pages, sessions, or sites.
> A reader's own device state (reading marks and personal arrangements) is not
> tracking: it never leaves their browser unless they export it themselves.
> **Links that carry an identifier attributing a reader's action to us or to a
> partner are tracking, and are not permitted.**
>
> **추적 없음.** Noosphere 는 분석 도구·핑거프린팅·서드파티 스크립트·쿠키를
> 싣지 않는다. 우리를 포함한 어떤 주체도 독자를 페이지·세션·사이트에 걸쳐
> 따라갈 수 있게 하는 식별자를 나르지 않는다. 독자 기기의 자기 상태(독서 표시,
> 개인적 배열)는 추적이 아니다 — 독자가 스스로 내보내지 않는 한 브라우저를
> 떠나지 않는다. **독자의 행동을 우리 또는 제휴사에 귀속시키는 식별자를 나르는
> 링크는 추적이며, 허용되지 않는다.**

마지막 문장이 제휴 링크를 명시적으로 배제한다. 향후 제휴를 검토하려면 이
문장을 **다시 개정해야** 하며, 그것이 CPO 가 의도한 문턱이다.

---

## 비준 절차

결정 (129) 선례를 따른다: CPO 비준 → 그 시점에 `docs/project-charter.md` 와
성계 레포(one-book)의 `docs/product-brief.md` 를 동시 개정 → vault 결정 기록에 기입.
비준 전 집행은 없다.
