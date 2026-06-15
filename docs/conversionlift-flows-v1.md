# ConversionLift — induló flow-k (v1)

> Cél: három érdemben különböző flow, amiből el lehet indulni a prototípus-építéssel. **Mindhárom egyetlen, implicit termékoldalra szól — sem tömeges generálás, sem termék-megadás nem része.** A flow tisztán a tartalomról szól: URL → (típus) → pozíció → generálás → előnézet.
>
> Alapdokumentumok: `conversionlift-spec-v1.md` (domain model, döntések), `conversionlift-wireframes-v1.md` (app shell + képernyők).

---

## Hatókör: mi NEM része ezeknek a flow-knak

- **Termék-megadás / -kiválasztás nincs.** A termék implicit: az előnézet automatikusan egy **reprezentatív (vagy aktuális) terméken** jelenik meg. A user nem választ/keres terméket a flow-ban.
- **Tömeges / katalógus-szintű generálás nincs.** A generálás a flow-ban egy oldalra szól.
- **Cél/KPI nincs** a flow-ban — az Experiment szintjén áll be (default-tal).

A katalógus-szintű (bulk) generálás és a termék-/scope-kezelés a tool **külön flow-jai**, ezeket később, önállóan tervezzük.

## Közös előfeltételek (mindhárom flow)

- A flow az **aktív domain** kontextusában fut (domain = workspace-szint).
- A **connect** nem része — csak az élesítésnél (Launch) kell. A flow-k a draft + előnézet pontig visznek, connect nélkül is.
- A generált tartalom lehet `text` / `image` / `text+image`; a kép a protóban **placeholder**, a szöveg **mockolt**.
- **Content-type választás:** A esetén az AI-javasolta **pozíció-kártyán** (badge, módosítható); B és C esetén **belépő-döntésként** (`TypeSelectView`).
- **Hibrid AI chat:** mindhárom flow-ban ott a **chat-sáv** azon a képernyőn, ahol a tartalom születik (A/B: `OptimizeView`; C: generálás-nézet), opcionálisan az előnézeten is. **Nem külön lépés** — finomító réteg: „rövidebb headline", „másik kép", „merészebb variáns". A scan/kártyák és a chat ugyanazt az állapotot írják (single source of truth).

---

## Flow A — Assistant-led (oldal-vezérelt)  ⭐ ajánlott elsőnek

**Sorrend:** U → P → G → V
**Filozófia:** az AI elemez és pozíció(ka)t javasol (a típussal együtt), te elfogadod, generálsz, előnézel egy reprezentatív terméken. Legkevesebb döntés a felhasználónak.

| # | Lépés | Képernyő | Mi történik | Kulcs-UI |
|---|---|---|---|---|
| 1 | **U** | `AddDomainView` | URL megadás, (mockolt) elemzés indul. | URL-input, „Analyze". |
| 2 | **P** | `OptimizeView` (hibrid) | Az AI pozíció(ka)t javasol (replace/embed + content-type), indoklással. A user elfogad egyet, a típust módosíthatja; a **chat-sávon finomíthat**. | Optimization-kártya: badge-ek, rationale, mini-preview, Accept + **chat-rail**. |
| 3 | **G** | `OptimizeView` → inline | Az AI az elfogadott pozícióra generál. | Loading → generált tartalom a kártyán. |
| 4 | **V** | `PreviewView` (single) | Élő előnézet egy **reprezentatív terméken**, control ↔ variant kapcsoló. | Renderelt PDP-preview, before/after. |

**Megkülönböztető:** az **AI vezet** — az elemzésből jön a javaslat, a típust az AI választja (módosítható). A legrövidebb flow.
**Erős, ha:** gyors, AI-vezérelt élmény a cél.

---

## Flow B — Type-first (típus-vezérelt)

**Sorrend:** U → Típus → P → G → V
**Filozófia:** a belépő-döntés a **content-type** — előbb eldöntöd, *milyen* tartalmat akarsz (kép, szöveg, kép+szöveg), és az AI ehhez javasol pozíciót.

| # | Lépés | Képernyő | Mi történik | Kulcs-UI |
|---|---|---|---|---|
| 1 | **U** | `AddDomainView` | URL megadás, (mockolt) elemzés. | URL-input, „Continue". |
| 2 | **Típus** | `TypeSelectView` (új) | A user **content-type-ot** választ: `text` / `image` / `text+image` (opcionálisan al-fajtát). | Típus-kártyák, opcionális al-fajta. |
| 3 | **P** | `OptimizeView` (hibrid) | Az AI a **választott típushoz** pozíciót javasol (a kártyák a típusra szűrve). A user elfogad egyet; a **chat-sávon finomíthat**. | Scan-report kártyák (típusra szűrve), Accept + **chat-rail**. |
| 4 | **G** | `OptimizeView` → inline | Az AI a választott típusban generál az elfogadott pozícióra. | Loading → generált tartalom. |
| 5 | **V** | `PreviewView` (single) | Élő előnézet egy reprezentatív terméken. | Renderelt PDP-preview, before/after. |

**Megkülönböztető:** a **típus a belépő** — a user a tartalom-fajtát rögzíti előre, az AI ehhez szűrve javasol pozíciót.
**Erős, ha:** konkrét tartalmi szándék van („képet akarok").

---

## Flow C — Generate-first (előbb tartalom, utána pozíció)

**Sorrend:** U → Típus → G → P → V
**Filozófia:** az AI **előbb tartalom-opciókat generál**, és **utána** dől el, hová kerüljenek. Kreatív/felfedező mód — a user a kész tartalomra reagál. Képeknél különösen természetes.

| # | Lépés | Képernyő | Mi történik | Kulcs-UI |
|---|---|---|---|---|
| 1 | **U** | `AddDomainView` | URL megadás, (mockolt) elemzés. | URL-input, „Continue". |
| 2 | **Típus** | `TypeSelectView` (új) | A user **content-type-ot** választ (mit generáljon az AI). | Típus-kártyák, opcionális al-fajta. |
| 3 | **G** | `OptimizeView` / generálás-nézet (hibrid) | Az AI **tartalom-opciók készletét** generálja — pozíció nélkül. A **chat-sávon iterálsz** rajtuk („másik kép", „merészebb variáns"). | Generált opciók rács/lista + **chat-rail**. |
| 4 | **P** | `PreviewView` (placement) | A user **elhelyezi** a kiválasztott opciót egy pozícióra (az AI javasolhat helyet); replace/embed. | Renderelt PDP, pozíció-zónák, opció → hely hozzárendelés. |
| 5 | **V** | `PreviewView` (single) | Élő előnézet az elhelyezett tartalommal, control ↔ variant. | PDP-preview, before/after. |

**Megkülönböztető:** a **generálás megelőzi a pozíciót** — előbb tartalom, aztán hely. Több kreatív szabadság, jobb illeszkedés a pozíció-független tartalmakhoz (képek); cserébe több kurálás.
**Erős, ha:** a user opciókat akar látni és a jót elhelyezni, vagy főleg képekkel dolgozik.

---

## Flow D — Assistant-led, összevont szerkesztő (Compose)

**Sorrend:** U → Compose (P+G+V egy képernyőn) → Launch
**Filozófia:** a **Flow A összevont változata** — az **Optimize és a Preview egyetlen szerkesztő-vászonná olvad**. Az AI javaslatai **alapból be vannak illesztve** a valódi termékoldalba (variant), és minden szerkesztés **élőben, az oldalon** történik (WYSIWYG). Nincs külön „elfogad → generál → előnéz" lépéssor.

| # | Lépés | Képernyő | Mi történik | Kulcs-UI |
|---|---|---|---|---|
| 1 | **U** | `AddDomainView` (`CLAddDomainStep`) | URL megadás, (mockolt) elemzés. | URL-input, „Analyze". |
| 2 | **Compose (P+G+V)** | `CLComposeStep` | Az AI javaslatai **eleve alkalmazva** a termékoldalon. **Bal:** chat-sáv a tartalom-kártyákkal (a chat indulása után **chipekké** zsugorodnak, kattinthatók, selected state). **Jobb:** az élő PDP a beágyazott tartalmakkal. Elemenként: **pozíció-váltás, ki/bekapcsolás (hide/show), stílus-popover** (font/méret/szín…) és **szabadszavas prompt-szerkesztés**. Felül **Control↔Variant** kapcsoló + **Next**. | Élő PDP-vászon, elem-szerkesztő popover („Describe your change…" + formázás), chat-sáv, Control/Variant. |
| 3 | **Launch** | `Flow4View` (inline) | „Ready to launch" megerősítő képernyő. | „Launch experiment". |

**Megkülönböztető:** **nincs külön Optimize és Preview lépés** — minden egyetlen szerkesztő-vásznon, a tartalmak már alkalmazva, élőben finomíthatók (pozíció + stílus + chat egy helyen).
**Erős, ha:** közvetlen, „szerkeszd a valódi oldalon" élmény a cél, kevesebb lépésváltással.

> **Megjegyzés:** Flow D (és duplikátuma, **Flow E** / `Flow5View.vue`) az újrahasznált `ClStorePage` + `ClRegion`/`ClEmbed` + a step-komponensek fölött épül; a részletes as-built leírás a [conversionlift-implementation.md](conversionlift-implementation.md)-ben van.

---

## Új képernyők, amik a flow-khoz kellenek

- **`TypeSelectView`** (Flow B, C): content-type választó — `text` / `image` / `text+image` kártyákban, opcionális al-fajtával.
- **`PreviewView`** (mindhárom flow): egy **reprezentatív** termékoldal renderelt előnézete a behelyezett tartalommal, control ↔ variant kapcsolóval. Flow C-ben **placement-móddal** is (opció → pozíció hozzárendelés).

A pozíciót A és B esetén az AI javasolja (`OptimizeView` — **hibrid: scan-report kártyák + chat-sáv**); C-ben a user a generált opciókat helyezi el, a generálás-nézeten szintén **chat-sávval**. **Termék-kiválasztó és kézi pozíció-rajzoló nincs.**

---

## Hogyan válassz / mi a javaslat

Mindhárom flow egy implicit termékoldalra szól; a **belépő-döntés** különbözteti meg őket:

- **Flow A** — az AI elemez és javasol; a legrövidebb, legkevesebb döntés. *Jó elsőnek megépíteni.*
- **Flow B** — a típus a belépő; erős, ha konkrét tartalmi szándék van.
- **Flow C** — generate-first; erős kreatív/kép-fókuszú esetben, de több kurálás.
- **Flow D** — a Flow A összevont szerkesztője (Compose): optimize + preview egy WYSIWYG vásznon, élő szerkesztéssel.
- **Flow E** — mint a D, de **Library-vel az elején** (mint a B): Site → Library → Compose → Launch; a kiválasztott elem beíródik a Compose szerkesztőbe.

Közös képernyők: `AddDomainView`, `OptimizeView`, `PreviewView` (+ `TypeSelectView` a B/C-hez). A **Flow A-t építve elsőként** a közös képernyők összeállnak, és B/C ebből nagyrészt a lépések újrarendezése + `TypeSelectView`, illetve a C-nél a `PreviewView` placement-módja.
