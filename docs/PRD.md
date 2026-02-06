# Product Requirements Document (PRD)
# Disney/Astro Bot Math Learning Adventure

**Version:** 1.1  
**Last updated:** February 2026  
**Status:** Living document

---

## 1. Executive Summary

**Product name:** Math Learning Adventure (Disney/Astro Bot Style)

**Vision:** A playful, visually rich web app that helps first- and third-grade students practice math and English letters in a supportive, game-like environment. The product combines grade-appropriate exercises with a consistent “Disney/Astro Bot” aesthetic, positive reinforcement, and an optional journey map so children can choose topics and see progress.

**Primary goals:**
- Provide safe, age-appropriate math (addition, subtraction, multiplication, division) and English letter practice.
- Support two grades with different difficulty and UI (Grade 1: simple; Grade 3: multi-digit, more topics).
- Offer a “My Adventure Journey” progress map where users complete 5 questions per topic to advance.
- Deliver a cohesive, joyful UX (glassmorphism, space/rocket theme, sound, optional RTL/Hebrew).

**Modes (additive):** All existing entry points remain. In addition, a separate **Arcade Mode** (“Space Runner”) may be offered per grade: Grade 1 Arcade focuses on addition/subtraction; Grade 3 Arcade on multiplication/division. Arcade does not replace the Journey Map or direct game buttons—it is an extra option from the Main Menu.

---

## 2. Target Users & Personas

| Persona | Description | Needs |
|--------|-------------|--------|
| **Grade 1 child (6–7)** | Early elementary, single-digit math, basic letters | Simple UI, big touch targets, instant feedback, optional sound |
| **Grade 3 child (8–9)** | Multi-digit operations, multiplication/division, letter case/sound | Place-value input, multiple topics, journey map, clear progress |
| **Parent / guardian** | Chooses grade, language, supervises use | Quick grade/language selection, optional sound off, clear navigation |
| **Teacher / homeschooler** | Uses in class or at home | Same as parent; may use on tablet or shared device |

**Supported languages:** English, Hebrew (UI + RTL where applicable).

---

## 3. User Flows & Screens

### 3.1 High-level flow

```
Grade Selection → Main Menu → [Practice Game OR Journey Map]
                                    ↓
                            Topic / Station selection
                                    ↓
                            Practice (5 questions per topic)
                                    ↓
                            Back to Menu or Journey Map
```

### 3.2 Screens (app states)

| Screen | Route / state | Purpose |
|--------|----------------|--------|
| **Grade Selection** | `grade-selection` | Choose Grade 1 or Grade 3; choose Language (EN/HE); optional entry to English Letters only |
| **Main Menu** | `main-menu` | Choose: Addition, Subtraction, (Grade 3 only: Multiplication, Division), “Start My Journey” (progress map), and optionally “Arcade” (per-grade runner game). All options coexist; Arcade is additive. |
| **Progress Map** | `progress-map` | “My Adventure Journey”: map with stations; tap a station to open that topic’s practice |
| **Addition** | `addition` | Addition practice (grade-specific) |
| **Subtraction** | `subtraction` | Subtraction practice (grade-specific) |
| **Multiplication** | `multiplication` | Multiplication practice (Grade 3 only) |
| **Division** | `division` | Division practice (Grade 3 only) |
| **English Letters** | `english-letters` | Letter learning: mode selection or direct mode (case / sound) when opened from map |

### 3.3 Journey map behavior

- **Grade 1:** 3 stations — Addition, Subtraction, English (one station).
- **Grade 3:** 6 stations — Addition, Subtraction, Multiplication, Division, English (case), English (sound).
- Stations are ordered along a fixed path; progress per topic is 0–5 (questions completed).
- A station is “unlocked” only when the previous one has reached 5; first station always unlocked.
- **From map:** Tapping a station opens the corresponding game. For English, `english_1` → case matching, `english_2` → sound identification (no mode-selection screen).
- **Back / completion:** If the user came from the map, Back and “5 completed” return to the map; otherwise return to main menu or grade selection as appropriate.

### 3.4 Arcade Mode (“Space Runner”) — clarification and design

- **Per grade:** Arcade is implemented **separately for each grade**. Grade 1 Arcade uses only addition and subtraction; Grade 3 Arcade uses only multiplication and division. The selected grade (from Grade Selection) determines which Arcade content the user sees.
- **In addition to existing options:** Arcade is **additive**. The Main Menu continues to offer: direct game buttons (Addition, Subtraction, etc.), “Start My Journey” (progress map), and—when implemented—“Arcade.” None of these options are removed or replaced by Arcade; it is an extra way to practice, alongside the Journey and direct topic entry.

**Question difficulty and selection (Arcade):**

- Questions in Arcade are **grade-dependent**: same number ranges and operations as in the rest of the app (e.g. Grade 1 single-digit, Grade 3 multi-digit for the relevant operations).
- Question selection can be **random** within the grade rules; optionally, **difficulty or pace** can increase with score (e.g. harder problems or faster spawns as the score goes up), in parallel to any **speed scaling** of the runner. The PRD leaves the exact curve to implementation; the important point is that difficulty is bounded by grade and can scale with performance.

**Input — mobile vs desktop:**

- **Mobile:** Move between the 3 lanes by **swipe left/right**, or by **two on-screen buttons** (e.g. “←” and “→”) for accessibility. No swipe-only dependency.
- **Desktop:** Move between lanes with **keyboard**: **Left/Right arrow keys** or **A / D**. Documenting this in the PRD keeps UI/UX and implementation aligned.

**VFX — screen shake and sensitivity:**

- **Screen shake** on wrong answer should be **very subtle** (short, low amplitude) to avoid discomfort for motion-sensitive or vestibular users.
- The PRD recommends offering an **option to reduce or disable motion effects** (e.g. in settings) in a future version, so the experience remains inclusive.

**Visual — “3D-like” track:**

- The Arcade track is **2.5D / pseudo-3D**: achieved with **CSS** (`perspective`, `transform`) and/or **sprites**, not a full 3D engine. This avoids unrealistic expectations (e.g. full WebGL/Three.js) and guides technical and design decisions.

---

## 4. Functional Requirements

### 4.1 Grade selection

- **FR-G1:** User can select Grade 1 or Grade 3. Selection is stored in app state and affects main menu and journey map.
- **FR-G2:** User can select interface language: English or Hebrew. Selection applies to all screens.
- **FR-G3:** User can open “English Letters Learning” directly from grade selection (no grade-specific menu).

### 4.2 Main menu

- **FR-M1:** Main menu shows: Addition, Subtraction; if grade is 3, also Multiplication and Division.
- **FR-M2:** Main menu shows “Start My Journey” that opens the progress map.
- **FR-M3:** User can go “Back” to grade selection (e.g. “Change Grade” / “החלף כיתה”).
- **FR-M4:** User can toggle sound on/off and switch language from the main menu (or as per current implementation).
- **FR-M5:** Menu is scrollable so all options (including Division for Grade 3) are reachable on small screens.

### 4.3 Progress map (“My Adventure Journey”)

- **FR-P1:** Map shows a path with stations; each station has an icon (➕, ➖, ✖️, ➗, abc, 🔠) and a number (1–6 for Grade 3, 1–3 for Grade 1).
- **FR-P2:** Stations are locked until the previous station has 5 questions completed; locked stations show a lock and are not tappable.
- **FR-P3:** Tapping an unlocked station opens the corresponding practice game; for English from map, open directly in the correct mode (case or sound).
- **FR-P4:** Map is responsive: full viewport on mobile (e.g. 100dvh), smaller stations on narrow screens, back button and title do not obscure the first station.
- **FR-P5:** Back from map returns to main menu and clears “came from map” so that next Back from a game returns to menu, not map.

### 4.4 Math practice games (Addition, Subtraction, Multiplication, Division)

- **FR-N1:** Each game generates problems appropriate to the selected grade (see Section 5).
- **FR-N2:** Grade 1: single numeric answer input. Grade 3 (where applicable): place-value digit inputs (ones, tens, hundreds, thousands) with right-to-left flow.
- **FR-N3:** User gets immediate feedback (correct / try again / wrong with correct answer); optional sound and visual feedback.
- **FR-N4:** Progress: 0–5 questions completed per topic; when 5 is reached, app may show a short celebration and then navigate back (to map or menu).
- **FR-N5:** User can go Back at any time; Back respects “came from map” (return to map) or normal flow (return to menu).
- **FR-N6:** Each game screen has a consistent “practice” layout: rocket-style background, overlay, glass-style Back and Sound buttons, score/progress display.

### 4.5 English letters

- **FR-E1:** From main menu or grade selection: user sees “Choose a Test Mode” — Case (uppercase/lowercase matching) or Sound (listen and pick letter).
- **FR-E2:** From journey map station `english_1`: open directly in Case mode. From `english_2`: open directly in Sound mode (no mode-selection screen).
- **FR-E3:** Case mode: show one letter (upper or lower), user picks the matching form from 4 options; optional letter sound on option tap.
- **FR-E4:** Sound mode: play a letter sound; user picks correct letter from 4 options. A “Confirm” / “אישור” button submits the selected answer (no submit on letter tap alone).
- **FR-E5:** After correct answer, next problem after a short delay (e.g. 2.5 s). Progress (0–5) is tracked for `englishLetters` regardless of mode.
- **FR-E6:** Letter pronunciation: A–Z sounds available (e.g. from `public/sounds/end_letters/`).

### 4.6 Settings and UX

- **FR-S1:** Sound can be toggled on/off (e.g. from main menu and from each game).
- **FR-S2:** Language (EN/HE) affects all copy and, where implemented, audio labels; Hebrew uses RTL where applicable.
- **FR-S3:** No login or persistence required; progress and settings are in-memory for the session (optional future: local persistence).

---

## 5. Grade-Specific Content & Difficulty

### 5.1 Addition

- **Grade 1:** Single-digit (0–9 + 0–9), result ≤ 18. Single answer field.
- **Grade 3:** Multi-digit (e.g. 10–9999 + 10–9999), sum ≤ 9999. Separate digit inputs (1000s, 100s, 10s, 1s), right-to-left.

### 5.2 Subtraction

- **Grade 1:** Single-digit, non-negative result. Single answer field.
- **Grade 3:** Multi-digit, non-negative. Place-value digit inputs.

### 5.3 Multiplication

- **Grade 1:** (If ever shown) 1–5 × 1–5.
- **Grade 3:** 1–9 × 1–9. Shown in main menu and journey map only for Grade 3.

### 5.4 Division

- **Grade 3 only:** Integer division; quotient 1–9, divisor 2–10 (or similar); dividend = quotient × divisor. Shown in main menu and journey map only for Grade 3.

### 5.5 English letters

- Same for both grades in content; Grade 3 has two journey stations (case + sound). Progress is shared (`englishLetters` 0–5).

---

## 6. Non-Functional Requirements

### 6.1 Technology

- **Stack:** React 18, TypeScript (strict), Vite. Single-page app; no backend required for core flows.
- **Build:** `npm run build` produces static assets in `dist/`; deployable to Vercel or any static host.
- **Routing:** Client-side only; all routes resolve to `index.html` (e.g. Vercel rewrites).

### 6.2 Browsers and devices

- Modern browsers (Chrome, Firefox, Safari, Edge) with ES2022 and Web Audio support.
- Responsive layout: desktop and mobile; map and menus usable on phones (e.g. 100vw / 100dvh, scrollable menu, smaller stations on narrow width).
- Touch-friendly: large tap targets, no hover-only actions for critical flows.

### 6.3 Accessibility and UX

- High contrast and readable fonts (e.g. Nunito, Fredoka One).
- Sound optional; no critical information only in audio.
- Keyboard support where reasonable (e.g. Enter to submit, focus management in digit inputs).
- Consistent “Back” and “Sound” controls across game screens (glass-style buttons).

### 6.4 Performance

- Fast first load (Vite code-splitting, minimal dependencies).
- No blocking network calls for core practice; assets (images, sounds) loaded as needed.

### 6.5 Security and privacy

- No user accounts or PII in scope; no server-side storage of progress in current scope.
- Content suitable for children (no ads, no external links in core flows).

---

## 7. Data Model (in-memory)

### 7.1 Game settings

- `grade`: 1 | 3  
- `language`: 'en' | 'he'  
- `soundEnabled`: boolean  

### 7.2 Progress state (per topic)

- `addition`, `subtraction`, `multiplication`, `division`, `englishLetters`: each 0–5 (questions completed in session).

### 7.3 Navigation state

- `currentScreen`: one of grade-selection | main-menu | progress-map | addition | subtraction | multiplication | division | english-letters.
- `cameFromProgressMap`: boolean (so Back/completion from a game returns to map when true).
- `englishInitialMode`: 'case' | 'sound' | null (so English can open directly in the right mode from map).

### 7.4 Topic IDs (for map and routing)

- Grade 1: `addition`, `subtraction`, `englishLetters`.
- Grade 3: `addition`, `subtraction`, `multiplication`, `division`, `english_1`, `english_2` (both map to `englishLetters` for progress).

---

## 8. Success Metrics (suggested)

- **Usability:** Users can complete a full journey (5 questions per topic) without confusion; Back and navigation behave as expected.
- **Engagement:** Time on app, number of problems solved per session (if analytics added later).
- **Technical:** Build succeeds; no console errors in normal use; works on target browsers and viewports.
- **Content:** Problem generator stays within defined ranges and never produces invalid answers (e.g. negative subtraction, non-integer division).

---

## 9. Out of Scope (current version)

- User accounts, login, or cloud sync.
- Persistent storage of progress across sessions (localStorage/backend).
- New math operations (e.g. fractions, decimals).
- Additional languages beyond EN/HE.
- Ads, in-app purchases, or external links in core flows.
- Offline/PWA installation (possible future extension).

---

*This PRD reflects the application as implemented and is intended as the single source of truth for product behavior and scope.*
