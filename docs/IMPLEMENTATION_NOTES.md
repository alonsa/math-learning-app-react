# הערות יישום – התאמה ל-PRD

מסמך עבודה: עוברים סעיף־סעיף, מדברים, ואז מבצעים.

---

## סעיף 1: כניסה ל-English Letters מהתפריט הראשי (FR-E1)

**PRD:** "From main menu or grade selection: user sees 'Choose a Test Mode'."

**מצב נוכחי:** יש כפתור English Letters רק ב-Grade Selection. ב-Main Menu אין.

**לעשות:**
- [ ] להוסיף ב-`MainMenu.tsx` כפתור "English Letters" / "אותיות באנגלית" (אחרי Division / לפני "Start My Journey" או אחרי).
- [ ] ב-`App.tsx`: לתמוך בנווט ל-`english-letters` גם מהתפריט (כבר יש `setCurrentScreen('english-letters')` – חסר רק כפתור בתפריט).
- [ ] טיפ: ה-MainMenu מקבל `onGameSelect` שמקבל `AppScreen` – הטיפוס לא כולל `'english-letters'`. צריך להרחיב את הטיפוס ב-MainMenu ולהוסיף את הכפתור.

**הערות לדיון:**
- מיקום הכפתור: מעדיפים אחרי Division (כיתה ג') או אחרי חיסור (לפני כפל)? או תמיד אחרי כל משחקי החשבון, לפני "Start My Journey"?

---

## סעיף 2: חזרה מ-English Letters – לאן מחזירים (Back)

**PRD:** Back/completion from a game returns to map when came from map; otherwise to menu or grade selection as appropriate.

**מצב נוכחי:** מ-English Letters, כשהמשתמש לא בא מהמפה, תמיד חוזרים ל-`grade-selection`.

**לעשות:**
- [ ] להבדיל: אם נכנסו ל-English מהתפריט הראשי → Back מחזיר ל-main-menu; אם נכנסו מ-Grade Selection → Back מחזיר ל-grade-selection.
- [ ] ב-`App.tsx`: להוסיף state (למשל `cameFromMainMenuForEnglish: boolean` או `englishLettersOrigin: 'grade-selection' | 'main-menu' | 'progress-map'`).
- [ ] כשנכנסים ל-english-letters מהתפריט – לסמן שהמקור main-menu; כשנכנסים מ-grade-selection – לסמן grade-selection; כשנכנסים מהמפה – כמו היום (cameFromProgressMap).
- [ ] ב-`onBack` של EnglishLetterGame: לשלוח/להשתמש ב-origin ולנווט בהתאם (map / main-menu / grade-selection).

**הערות לדיון:**
- עדיף שם משתנה: `englishLettersOrigin` (ברור) או להרחיב את `cameFromProgressMap` ל-enum/שלוש אפשרויות?

---

## סעיף 3: RTL לעברית (FR-S2)

**PRD:** "Hebrew uses RTL where applicable."

**מצב נוכחי:** אין `dir="rtl"` או `direction: rtl` באף מקום.

**לעשות:**
- [ ] כשהשפה היא `he`, להגדיר `dir="rtl"` על אלמנט שורש (למשל `<html>` או ה-div הראשי של האפליקציה).
- [ ] כשהשפה `en` – `dir="ltr"` (או לא להגדיר).
- [ ] איפה: או ב-`index.html` (דינמי עם useEffect שמעדכן document.documentElement.dir), או ב-`App.tsx` על `<div className="App">` עם `dir={gameSettings.language === 'he' ? 'rtl' : 'ltr'}`.

**הערות לדיון:**
- להעדיף עדכון על `<html>` (משפיע על כל הדף כולל title/meta) או רק על `<div className="App">` (רק תוכן האפליקציה)?

---

## סעיף 4: צלילי האותיות Q ו-W (FR-E6)

**PRD:** "Letter pronunciation: A–Z sounds available (e.g. from public/sounds/end_letters/)."

**מצב נוכחי:** חסרים `Q.wav` ו-`W.wav` בתיקייה; ב-soundManager נטענות רק 24 אותיות.

**אפשרויות:**
- **א:** להוסיף קבצי Q.wav ו-W.wav (צריך מקור לצלילים – TTS או הקלטה).
- **ב:** להגביל את משחק האותיות רק ל-24 האותיות שיש להן צליל (למשל להשתמש ב-`soundManager.getAvailableLetters()` ב-`getLetterSet()` או ב-generateLetterProblem).

**לעשות (אם בוחרים א'):**
- [ ] להשיג/ליצור Q.wav, W.wav ב-`public/sounds/end_letters/`.
- [ ] ב-`soundManager.ts`: להוסיף 'Q','W' לרשימת האותיות שנטענות.

**לעשות (אם בוחרים ב'):**
- [ ] ב-`EnglishLetterGame.tsx`: ב-`getLetterSet()` להחזיר רק אותיות שיש להן צליל (למשל `soundManager.getAvailableLetters()` או רשימה קבועה של 24 אותיות בלי Q,W), כדי שבמצב Sound לא יופיעו Q/W בלי צליל.

**הערות לדיון:**
- יש לך קבצי צליל ל-Q ו-W או מעדיפים להגביל ל-24 אותיות בינתיים?

---

## סעיף 5: Arcade Mode

**מצב:** לא במסגרת הגרסה הנוכחית; ה-PRD אומר "when implemented". אין משימה לביצוע עכשיו.

**אופציונלי:** אם רוצים – לעדכן את תיבת "Coming soon" ב-Main Menu לטקסט מפורש כמו "Arcade (Space Runner) – coming soon!" / "ארקדה – בקרוב!".

---

## סדר ביצוע מוצע

1. **סעיף 3 (RTL)** – קטן ועצמאי.
2. **סעיף 1 (כפתור English בתפריט)** – דורש גם הרחבת טיפוס.
3. **סעיף 2 (חזרה נכונה מ-English)** – תלוי ב-1 (צריך לדעת אם נכנסנו מהתפריט).
4. **סעיף 4 (Q/W)** – לפי ההחלטה (צלילים או הגבלת אותיות).

---

*עודכן: פברואר 2026*
