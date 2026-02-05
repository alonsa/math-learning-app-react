# פרומפטים ליצירת איורים למפת ההרפתקה
## Image generation prompts for the adventure progress map

Use these prompts in DALL·E, Midjourney, Stable Diffusion, or similar. Generate each image with **transparent background (PNG)** when possible, so we can overlay them in the app. Suggested aspect ratio for background: **16:9 or 4:3**. For character and stations: **square (1:1)**.

---

## 1. רקע למפה — Map background

**English prompt:**

```
Isometric or top-down view of a whimsical, colorful game board path for children. The path is a winding trail made of soft, rounded tiles or stepping stones in pastel colors (mint, peach, sky blue, lavender). The path curves across a gentle landscape: soft green hills, a few small trees, fluffy clouds in the sky. Style: friendly, Disney / Pixar inspired, soft shadows, no text, no characters. Bright and cheerful, suitable for a kids' math learning game. Clean, simple composition so UI elements (stations and character) can be placed on top. 16:9 aspect ratio, illustration, digital art.
```

**פרומפט בעברית (אם הכלי תומך):**

```
תצוגה איזומטרית או מלמעלה של לוח משחק צבעוני וקסום לילדים. המסלול הוא שביל מתפתל מאבני דריכה מעוגלות בצבעי פסטל (מנטה, אפרסק, תכלת, Lavender). השביל מתעקל על נוף עדין: גבעות ירוקות רכות, כמה עצים קטנים, עננים בשמיים. סגנון: ידידותי, השראה דיסני/פיקסאר, צללים רכים, בלי טקסט, בלי דמויות. מואר ושמח, מתאים למשחק לימוד מתמטיקה לילדים. קומפוזיציה נקייה ופשוטה כדי שאפשר להניח עליה תחנות ודמות. יחס 16:9, איור, דיגיטל.
```

---

## 2. תחנות על המסלול — Stations / path nodes

**English prompt:**

```
Single circular game board "station" or "stop" token for a children's learning game. The circle is shown at a slight tilt or angle (like a coin or medal viewed from above at 15–25 degrees), so it appears as a soft ellipse — more dynamic and board-game like. Soft gradient (e.g. light green to teal, or gold when completed). Thick white or light border. Slightly 3D, soft shadow underneath. No icon inside — the circle is empty in the center so we can place a math symbol (+, −, ×, ÷) or letter icon in code. Style: cute, Disney-like, rounded, kid-friendly. Transparent background. Square format 1:1. Illustration, digital art.
```

**Variants you may want to generate:**
- **Unlocked station:** Green/teal gradient (player can tap it).
- **Locked station:** Gray, muted, slightly transparent look.
- **Completed station:** Gold/yellow gradient with a small star or sparkle.

**פרומפט בעברית:**

```
תחנה אחת עגולה ללוח משחק לילדים — כמו מדליה או מטבע גדול וידידותי. העיגול מוטה קלות (כמו מטבע או מדליה שנראים מלמעלה בזווית 15–25 מעלות), כך שנראה אליפסה רכה — דינמי יותר ומתאים ללוח משחק. גרדיאנט רך (למשל ירוק-טורקיז, או זהב כשמושלם). מסגרת לבנה או בהירה עבה. מעט תלת־ממדי, צל רך מתחת. בלי אייקון בתוך העיגול — המרכז ריק כדי שנוכל להציג בקוד סימן מתמטי או אות. סגנון: חמוד, דמוי דיסני, מעוגל, מתאים לילדים. רקע שקוף. פורמט ריבוע 1:1.
```

---

## 3. דמות השחקן — Player character (לא חללית)

**English prompt:**

```
Cute, friendly character for a children's educational game, standing or walking. A child character or a small, round mascot (e.g. a little robot, a friendly animal, or a kid with a backpack). Style: Disney / Astro Bot inspired — big eyes, round shapes, soft colors, no scary details. The character should look like it is "on a journey" or "exploring" (e.g. one hand waving or holding a small map). Full body or from waist up, centered. Transparent background. Square 1:1. Bright, cheerful, suitable for ages 5–10. Illustration, digital art, no text.
```

**פרומפט בעברית:**

```
דמות חמודה וידידותית למשחק חינוכי לילדים, עומדת או הולכת. דמות של ילד/ה או mascot קטן ומעוגל (רובוט קטן, חיה ידידותית, או ילד עם תיק). סגנון: השראה דיסני / Astro Bot — עיניים גדולות, צורות מעוגלות, צבעים רכים, בלי פרטים מפחידים. הדמות נראית כמו "במסע" או "מגלה" (למשל יד אחת מנופפת או אוחזת מפה קטנה). גוף מלא או Waist ומעלה, ממורכז. רקע שקוף. ריבוע 1:1. מואר ושמח, מתאים לגילאי 5–10. איור, דיגיטל, בלי טקסט.
```

---

## שימוש בקוד / Using in the app

After you have the images:

1. **Background:** Save as e.g. `public/assets/journey/map-background.png` and use as CSS `background-image` for the progress map container.
2. **Stations:** Save as e.g. `public/assets/journey/station-unlocked.png`, `station-locked.png`, `station-completed.png`. We can replace the current circular divs with `<img>` or use as background of the node.
3. **Character:** Save as e.g. `public/assets/journey/character.png`. Replace the current emoji/rocket in the map component with `<img src="/assets/journey/character.png" alt="You are here" />`.

If you tell me the exact file paths and image names you used, I can wire them into the code.
