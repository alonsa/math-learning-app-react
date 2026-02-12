# הערות יישום – התאמה ל-PRD

מסמך עבודה: עוברים סעיף־סעיף, מדברים, ואז מבצעים.

---

## סעיף 1: כניסה ל-English Letters מהתפריט הראשי (FR-E1)

**החלטה:** לא נדרש – נשאר כניסה מ-Grade Selection בלבד.

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

**בוצע:** קבצי `Q.wav` ו-`W.wav` הועתקו ל-`public/sounds/end_letters/`. ב-`soundManager.ts` נטענות כעת כל 26 האותיות A–Z. משחק האותיות משתמש שוב ב-A–Z מלא.

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
