# ConversionLift — Specifikáció v1 (prototípus-vezérelt)

> **Cél:** ez a dokumentum pont annyira részletes, hogy belőle a Claude Code egyértelműen le tudja generálni a kattintható prototípust. Nem klasszikus PRD — a fókusz a képernyőkön, a flow-n és a domain modellen van. A backend és az AI nagyrészt mockolt (lásd „Nyitott kérdések").

---

## 1. Termékvízió & cél

A **ConversionLift** egy CRO-eszköz webshopoknak: AI segítségével optimalizálja a termékoldalakat. Két fajta beavatkozást támogat:

- **Replace** — meglevő oldal-elem cseréje (pl. termék-headline, leírás, CTA szöveg).
- **Embed** — új, generált blokk beszúrása (pl. trust badge-ek, social proof, FAQ, urgency/stock counter).

A generált tartalom **háromféle típusú** lehet:

- **Szöveg** — headline, leírás, bulletek, CTA, FAQ stb.
- **Kép** — hero/lifestyle kép, badge-grafika, vizuális blokk.
- **Szöveg + kép** — kombinált blokk (pl. generált kép + hozzá írt copy).

### Vezérelv: katalógus-szintű, termékenként egyedi generálás

A tool egyik **fő célja a tömeges tartalom-behelyezés**: egy beavatkozás nem egyetlen oldalra szól, hanem a katalógus sok (akár több ezer) termékoldalára, **termékenként egyedi tartalommal**. A munka egysége ezért nem kézi oldal-szerkesztés, hanem egy **egyszer definiált generálás (Optimization)**, ami szétterül a hatókörébe eső termékekre, és minden termékhez a saját attribútumaiból egyedi kimenetet állít elő.

A javaslatokat egy **mini CRO asszisztens** adja: elemez, optimalizálásokat javasol indoklással (típus + hely + tartalom-típus + ajánlott hatókör), majd ezek alapján generál. A beavatkozásokat **A/B (A/B/n) tesztként** lehet élesíteni és mérni — a control vs. a generált kezelés összevetése a hatókörön **aggregáltan**.

### Vezérelv: kétszintű képesség-modell

| Szint | Connect kell? | Mit lehet csinálni |
|---|---|---|
| **Analízis-szint** | ❌ Nem | Domain hozzáadása URL-lel, CRO-elemzés, target-javaslatok, variáns-generálás, experiment **draft** összerakása — minden preview/szimuláció. |
| **Live-szint** | ✅ Igen | Valódi injektálás, forgalommegosztás, mérés, lift. |

A **connect nem a flow eleje, hanem egy kapu (gate) közvetlenül a Launch előtt.** A teljes asszisztens-élmény végigjátszható connect nélkül; a connect a commitment-pont.

---

## 2. Nem-célok (v1 prototípus)

A prototípus szándékosan **nem** tartalmazza:

- Valódi platform-integráció / OAuth / auth (a connect snippet-beillesztés, mockolt verifikációval).
- Valódi kép-generálás — a kép-tartalmaknál **placeholder képek** (a UI és a flow ettől teljes; valódi kép-gen későbbi iteráció).
- Valódi szöveg-generáló AI — v1-ben **mockolt szöveg** (a generálás-kontraktus szerint, demo-adatból).
- Valódi forgalommegosztó + szignifikancia-**motor** — a szignifikancia-**jelzést megmutatjuk**, de demo-adatból (nincs valódi statisztikai számítás).
- Perzisztencia / valódi mentés (in-memory state, oldal-újratöltésig).
- Billing, csapat/jogosultság-kezelés.
- Nem-PDP oldaltípusok (csak termékoldal).
- Verzió-history, rollback (későbbi iteráció). *(Az auto-winner v1-ben benne van, bekapcsolható opcióként.)*

---

## 3. Domain model

A **Domain a legmagasabb aktív kontextus** — ugyanúgy, ahogy más eszközökben a workspace. Kiválasztasz egy domaint, és onnantól minden (Optimize, Experiments, Analytics) annak a hatókörében történik. A domain-váltó a layout tetején workspace-váltóként viselkedik (Slack/Vercel/Linear-minta).

```
Account                              (implicit; a domain-listát tartja)
 └─ Domain   ◄── AKTÍV KONTEXTUS = "workspace" (connection_status: not_connected | connected)
     ├─ Catalog
     │   └─ Product page[]            (sok; típus: product, attribútumokkal)
     │
     └─ Optimization[]                (újrahasznált generálás-definíció; az AI javasolja)
         │  type: replace | embed
         │  content_type: text | image | text+image
         │  scope: mely termékoldalakra (all / collection / filter / selection)
         │  brief + brand-constraints
         │
         ├─ Generated item[]          (TERMÉKENKÉNT EGY, egyedi tartalommal)
         │      { product_page_id, content:{text?, image?}, status }
         │
         └─ Experiment                (control vs. generált kezelés a hatókörön, AGGREGÁLT mérés)
                 └─ Metric            (conversion rate, ATC, revenue/visitor, lift %)
```

Minden domain-szint alatti adat (katalógus, optimalizálások, experimentek, analytics) az **aktív domainre szűkített** — nincs domaineken átívelő nézet.

A kulcs-átállás az egy-oldal modellhez képest: az **Optimization egyszer van definiálva, de a hatókörébe eső minden termékoldalra külön Generated item-et fan-out-ol, termékenként egyedi tartalommal.**

### Entitások

- **Account** — implicit konténer, ami a user domain-listáját tartja. Nincs saját UI-ja; nem aktív kontextus.
- **Domain** — egy webshop, **és egyben a legmagasabb aktív kontextus (workspace-szint)**. Mezők: `id`, `name`, `url`, `connection_status`, `platform` (pl. Shopify/Shoprenter — v1-ben csak címke). A user több domaint kezel, és a layout tetején lévő **domain-váltóval** vált köztük (workspace-váltó minta). Domain-váltáskor a teljes alkalmazás-kontextus átáll az új domainre.
- **Catalog / Product page** — a domain termékoldalainak halmaza (sok). Mezők: `id`, `url`, `title`, `attributes` (kategória, ár, leírás stb. — ezekből generál az AI egyedi tartalmat), `preview`. A katalógus **platform-syncen** keresztül kerül be (v1-ben mockolt sync).
- **Optimization** — egy **újrahasznált generálás-definíció** (ezt javasolja a CRO asszisztens). Mezők: `id`, `type` (`replace`|`embed`), `location` (pl. "product title", "below ATC"), `content_type` (`text`|`image`|`text+image`), `scope` (mely termékoldalakra: all / collection / filter / selection), `brief` (AI prompt/utasítás), `brand_constraints`, `rationale` (AI indoklás), `status` (`suggested`|`accepted`|`dismissed`).
- **Generated item** — egy Optimization **termékenkénti, egyedi** kimenete. Mezők: `id`, `optimization_id`, `product_page_id`, `content` (`{ text?, image? }`), `status` (`pending`|`generated`|`edited`|`approved`|`rejected`), `editable`. Egy Optimization annyi Generated item-et hoz létre, ahány termék a hatókörében van.
- **Experiment** — egy Optimization élesítése: **control** (eredeti, termékenként) vs. a **generált kezelés** (a Generated item-ek, termékenként egyedi), A/B/n esetén több generált kar. Mezők: `id`, `optimization_id`, `arms` (control + 1..n kezelés), `traffic_split`, `goal_metric`, `duration`, `status` (`draft`|`live`|`completed`). A mérés a hatókörön **aggregált**.
- **Metric / Lift** — mért eredmény: `conversion_rate`, `add_to_cart_rate`, `revenue_per_visitor`, `lift_pct`, idősor — a hatókörre összesítve (opcionálisan szegmensenként).

### AI-agnosztikus kontraktus

A spec nem rögzíti, *hogyan* generál az AI — csak hogy **mit ad vissza strukturáltan**. Két kontraktus van: az asszisztens **javasol** (scan), és a **tömeges generálás** termékenként egyedi tartalmat ad. Így a UI ugyanaz marad, akár mockolt demo-adat, akár valódi minimális API-hívás van mögötte:

```js
// 1) CRO asszisztens kimenet (scan) — optimalizálás-javaslatok
{
  optimizations: [
    {
      type: "replace" | "embed",
      location: "string",
      content_type: "text" | "image" | "text+image",
      suggested_scope: "all" | "collection:..." | "filter:...",
      rationale: "string",          // miért érdemes ide nyúlni
      confidence: 0..1              // opcionális
    }
  ]
}

// 2) Tömeges generálás kimenet — egy Optimization a hatókörére
{
  optimization_id: "string",
  items: [
    {
      product_page_id: "string",
      content: { text?: "string", image?: "url|base64" },  // termékenként EGYEDI
      status: "generated"
    }
    // ... minden hatókörbe eső termékre egy
  ]
}
```

---

## 4. Core loop (flow)

```
Domain hozzáadása (URL)  →  katalógus elérhető (mockolt sync)
        │
        ▼
CRO asszisztens elemez  ───►  Optimalizálás-javaslatok (kártyák + indoklás)
        │                          │  ⇄ chat-finomítás (hibrid)
        ▼                          ▼
   User elfogad egy optimalizálást  +  beállítja a HATÓKÖRT (mely termékek)
        │
        ▼
TÖMEGES GENERÁLÁS  ──►  termékenként egyedi tartalom (szöveg/kép/mindkettő)
        │
        ▼
Bulk review & edit  ──►  termék-lista: spot-check, szerkesztés, regenerálás, approve
        │
        ▼
Experiment konfig (control vs generált kezelés, split, cél, futamidő)  ──►  [DRAFT kész]
        │
        ▼
   🔒 CONNECT GATE  (csak itt kell a shop-bekötés)
        │
        ▼
   Live  ───►  Monitor (aggregált lift a hatókörön)  ───►  Döntés
```

A **connect gate** egy feltételes csomópont: a draft (a teljes tömeges generálással együtt) összerakható nélküle, élesíteni csak vele lehet. Ha a domain már `connected`, a gate átugorható.

---

## 5. Képernyők & registry-leképezés

A meglevő registry-architektúrára (`sections.js` / `views.js` / `flows.js`) szabva.

### Top-level kontextus: domain-váltó (a fő szekciók fölött)

A **domain-váltó nem szekció, hanem a top-level kontextus-választó** a layout tetején (workspace-váltó minta). Megmutatja az aktív domaint + connection-státuszt, dropdownból lehet váltani vagy újat hozzáadni. Ha még nincs aktív domain (első indítás), egy domain-picker landing fogadja a usert.

### Top-level szekciók (`sections.js` → fő navigáció, az **aktív domainen belül**)

1. **Optimize** — a CRO asszisztens (hibrid: scan-report + chat); optimalizálás-javaslatok, hatókör-választás, tömeges generálás és bulk review.
2. **Experiments** — az aktív domain draft / live / completed tesztjei.
3. **Analytics** — az aktív domain eredményei, lift-chartok (ApexCharts).

> Megjegyzés: az Experiments és Analytics az **aktív domainre szűkített**, nincs domaineken átívelő összesítő nézet.

### Nézetek (`views.js`)

| Nézet | Tartalom | Fő interakciók |
|---|---|---|
| `DomainPickerView` / switcher dropdown | Domain-lista kártyákban, mindegyik connection-státusszal; „+ Add domain". Landing, ha nincs aktív domain, és a top-bar váltó tartalma. | Domain kiválasztás (= kontextus-váltás), hozzáadás. |
| `AddDomainView`/modal | URL-input + (opcionális) platform-választó. | URL megadás → elemzés indul. |
| `DomainOverviewView` | Egy domain: oldalai, top „opportunity"-k, connection-státusz, gyors „Optimize" gomb. | Oldal kiválasztás, connect indítás. |
| `OptimizeView` (hibrid asszisztens) | **Fő:** scan-report kártyák (optimalizálás-javaslat: type-badge replace/embed, content-type badge text/image/both, location, indoklás, mini-preview). **Oldalt:** chat-sáv finomításra. | Kártya elfogad / elvet; chat-üzenet → új/módosított javaslat; kártya elfogadása → hatókör-választás. |
| `ScopeSelectView` | A katalógus szűrése: mely termékoldalakra menjen az optimalizálás (all / collection / filter / kézi kijelölés), az érintett termékek számával. | Hatókör beállítása → „Generate". |
| `GenerationView` (bulk review) | **A tömeges generálás központi nézete.** Termék-lista/táblázat: minden sor egy termék + a hozzá generált **egyedi** tartalom (szöveg-snippet és/vagy kép-thumbnail), státusz (pending/generated/edited/approved), generálási progress (X / N kész). Sor megnyitása = részletes preview + inline szerkesztés. **A jóváhagyás nem kötelező** (a generált item jóváhagyás nélkül is élesíthető), de **lehetséges** — spot-checkhez / minőségbiztosításhoz. | Spot-check, inline edit, egyedi regenerálás, opcionális approve (egyedi vagy bulk), „Continue to experiment". |
| `ExperimentBuilderView` (`flows.js`) | Karok kiválasztása (control vs generált kezelés, A/B/n), traffic split (slider), goal-metrika, futamidő (datepicker), **auto-winner toggle** (bekapcsolva a győztes kar automatikusan kiterjed), hatókör-összegzés. | Konfig → „Launch" gomb. |
| `ConnectGateModal` | Mockolt connect **snippet-beillesztéssel**: a user kimásolja a JS-snippetet a webshopjába, majd „Verify" → `connected` (mockolt ellenőrzés). | Snippet másolás → verify → gate feloldás. |
| `ExperimentsListView` | Az aktív domain tesztjei táblázat/kártya formában: státusz, optimalizálás, hatókör (termékszám), lift. | Szűrés státuszra, megnyitás. |
| `ExperimentDetailView` (Analytics) | Aggregált lift %, **szignifikancia-jelzés** (pl. „significant" badge + konfidencia, demo-adatból), conversion/ATC/RPV chartok (ApexCharts), kar-bontás, idősor; auto-winner státusz, ha bekapcsolt; opcionálisan top/flop termékek. | Kar-összevetés, (auto-winner státusz / kézi apply). |

### Flow (`flows.js`)

Az **experiment-létrehozás** lineáris flow-ja:
`Optimalizálás elfogadva → ScopeSelect → Generation (bulk review) → ExperimentBuilder → ConnectGate (ha kell) → Launched confirmation`.

---

## 6. A hibrid CRO asszisztens (központi nézet) — részletek

A termék szíve. Két panel egy nézetben:

- **Scan-report (fő panel):** az elemzés után kártyákban dobja ki a javaslatokat. Egy kártya = egy `Optimization`. Tartalma: type-badge (`replace`/`embed`), content-type badge (`text`/`image`/`text+image`), `location`, az AI **indoklása** (1-2 mondat, miért emel ez konverziót), ajánlott hatókör, egy mini-preview a javasolt tartalomról, és akciók: **Accept / Edit / Dismiss**. Az Accept hatókör-választásra, majd tömeges generálásra visz.
- **Chat-sáv (oldal panel):** szabad szöveggel finomíthatsz — pl. „adj agresszívebb urgency blokkot", „a headline legyen rövidebb", „generálj lifestyle hero képet is". A válasz vagy új kártyát ad, vagy egy meglevőt módosít. Prototípusban a chat-válaszok lehetnek előre definiált, kulcsszó-alapú demo-válaszok (lásd Demo data).

State-kezelés: `useWorkflowState.js` tárolja az aktuális domain / optimization / hatókör / generated-items / experiment kontextust; az asszisztens-szál (kártyák + chat-history) az aktív domainhez kötött.

---

## 7. Demo data (prototípushoz)

Minden képernyőhöz előre megadott fake adat, hogy a flow connect/AI nélkül is végigjátszható legyen.

**Domainek (2 db):**
- `glowskin.example` — `connected`, platform: Shopify, katalógus: ~24 termék.
- `peakgear.example` — `not_connected`, platform: Shoprenter, katalógus: ~36 termék.

**Katalógus** (mockolt): termékenként `title`, `attributes` (kategória, ár, rövid jellemzők), placeholder kép. Ezekből „generál" egyedi tartalmat a mock.

**Optimalizálás-javaslatok** (`peakgear.example`, 4 db, content-type-pal):

1. **Replace — Product title** (`text`) · indoklás: feature-központú cím helyett benefit-led headline. · ajánlott hatókör: minden termék.
2. **Embed — Trust badge-ek (ATC alatt)** (`text+image`) · indoklás: hiányzó bizalmi jelek. · hatókör: minden termék.
3. **Replace — Leírás bulletek** (`text`) · indoklás: szkennelhető előny-bulletek. · hatókör: egy kategória.
4. **Embed — Lifestyle hero kép + caption** (`text+image`) · indoklás: vizuális kontextus emeli az ATC-t. · hatókör: minden termék.

**Tömeges generálás demo:** egy elfogadott optimalizáláshoz a hatókörbe eső ~36 termékre **termékenként egyedi** mock kimenet (a termék attribútumaiból összerakott szöveg + placeholder kép a kép-típusoknál), vegyes státusszal (legtöbb `generated`, néhány `edited`). Progress-animáció a generálás közben (GSAP/Lottie).

**Chat demo-válaszok** (kulcsszó-trigger): „urgency" → új urgency-optimalizálás kártya; „rövidebb" → headline lecserélése tömörebbre; „kép" → kép-típusú variáns; egyébként általános „javaslat finomítva" válasz.

**Analytics demo** (egy live experimenthez): aggregált control vs kezelés conversion (pl. 2.1% vs 2.7%), `lift_pct` ≈ +28%, **szignifikancia-jelzés** (pl. „significant, 95% confidence" badge, demo-adatból), 14 napos idősor, ATC és RPV bontás, auto-winner státusz (ha bekapcsolt), opcionálisan top/flop termékek a hatókörből.

---

## 8. Vizuális / technikai keretek

- OptiMonk brand tokenek (`--color-om-orange-*`, `om-*`) a `@theme` blokkból; PrimeVue 4 + lucide ikonok.
- Domain-váltó, kártyák, badge-ek a `shared/` komponensekből (Button, Modal, Dropdown).
- Chartok: ApexCharts (`vue3-apexcharts`). Datepicker: `@vuepic/vue-datepicker`. Mikro-animációk (kártya-megjelenés, scan-„folyamat"): GSAP / Lottie.
- Opticube `Oc*` komponensek, ahol illeszkedik.

---

## 9. Döntési napló (eldöntött kérdések)

1. **Szöveg-AI:** v1-ben **mockolt szöveg**. Az AI-agnosztikus kontraktus megmarad, így később egy valódi `/v1/messages` hívásra cserélhető a UI változtatása nélkül.
2. **Connect = snippet-beillesztés.** A user kimásolja a JS-snippetet a webshopjába, „Verify" → `connected` (v1-ben mockolt verifikáció).
3. **Katalógus-forrás = platform-sync.** v1-ben mockolt sync tölti be a termékkatalógust.
4. **Bulk-review jóváhagyás: nem kötelező, de lehetséges.** A generált item-ek jóváhagyás nélkül is élesíthetők; az approve (egyedi/bulk) opcionális minőségbiztosítási eszköz.
5. **Szignifikancia: megjelenítjük.** Az experiment-eredménynél van szignifikancia-jelzés (badge + konfidencia), v1-ben demo-adatból (nincs valódi statisztikai motor).
6. **Auto-winner: bekapcsolható.** Az ExperimentBuilderben toggle; ha be van kapcsolva, a győztes kar automatikusan kiterjed.

### Még tisztázandó (build közben)
- Mintaméret / futamidő ajánlás logikája (most fix demo-küszöb).
- Több aktív optimalizálás ütközés-kezelése ugyanazon az oldalon (v1: egyszerre egy optimalizálás/experiment per location).

---

### Következő lépés

Ha ez a váz stimmel, a kézenfekvő folytatás: (a) egy flow + domain model **diagram** vizuális validációhoz, vagy (b) a **képernyőnkénti wireframe-szintű leírás** (mező-mező részletességgel), amiből a Claude Code már közvetlenül építhet.
