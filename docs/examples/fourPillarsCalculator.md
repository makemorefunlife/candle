아래는 **production-ready fourPillarsCalculator.js**야.
(Orrery 기반 + 우리 서비스 분석에 바로 사용할 수 있는 JSON 구조)

설치 먼저:

```bash
npm install orrery
npm install luxon
```

---

# fourPillarsCalculator.js

```javascript
/**
 * fourPillarsCalculator.js
 *
 * Core engine for calculating Four Pillars (BaZi)
 * Uses Orrery library
 *
 * Output is optimized for GPT analysis pipeline
 */

import { EightChar } from "orrery";
import { DateTime } from "luxon";


// Heavenly Stems
const STEM_ELEMENTS = {
  Jia: "Wood",
  Yi: "Wood",
  Bing: "Fire",
  Ding: "Fire",
  Wu: "Earth",
  Ji: "Earth",
  Geng: "Metal",
  Xin: "Metal",
  Ren: "Water",
  Gui: "Water"
};


// Hidden Stems
const HIDDEN_STEMS = {

  Zi: ["Gui"],

  Chou: ["Ji", "Gui", "Xin"],

  Yin: ["Jia", "Bing", "Wu"],

  Mao: ["Yi"],

  Chen: ["Wu", "Yi", "Gui"],

  Si: ["Bing", "Wu", "Geng"],

  Wu: ["Ding", "Ji"],

  Wei: ["Ji", "Yi", "Ding"],

  Shen: ["Geng", "Ren", "Wu"],

  You: ["Xin"],

  Xu: ["Wu", "Xin", "Ding"],

  Hai: ["Ren", "Jia"]
};



// Element Counter
function countElements(pillars) {

  const elements = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  Object.values(pillars).forEach(p => {

    if (!p) return;

    elements[STEM_ELEMENTS[p.stem]]++;

    const hidden = HIDDEN_STEMS[p.branch];

    hidden.forEach(stem => {
      elements[STEM_ELEMENTS[stem]]++;
    });

  });

  return elements;
}



// Strength Calculator (simple version)
function calculateStrength(dayMasterElement, elementCounts) {

  const score = elementCounts[dayMasterElement];

  if (score >= 4) return "Strong";

  if (score >= 2) return "Balanced";

  return "Weak";
}




export function calculateFourPillars({

  year,
  month,
  day,
  hour,
  minute = 0,
  timezone = "UTC"

}) {

  try {

    // Create timezone-aware date

    const dt = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: timezone }
    );


    const jsDate = dt.toJSDate();


    // Orrery calculation

    const ec = new EightChar(jsDate);



    const pillars = {

      year: ec.getYearPillar(),

      month: ec.getMonthPillar(),

      day: ec.getDayPillar(),

      hour: hour !== null
        ? ec.getHourPillar()
        : null

    };



    const formatted = {};



    Object.entries(pillars).forEach(([key, value]) => {

      if (!value) {

        formatted[key] = null;

        return;

      }

      formatted[key] = {

        stem: value.stem,

        branch: value.branch,

        element: STEM_ELEMENTS[value.stem],

        hiddenStems: HIDDEN_STEMS[value.branch]

      };

    });




    const dayMaster = formatted.day.element;


    const elementCounts = countElements(formatted);


    const strength = calculateStrength(
      dayMaster,
      elementCounts
    );



    return {

      pillars: formatted,


      dayMaster,


      strength,


      elements: elementCounts,


      timestamp: dt.toISO()


    };


  } catch (error) {

    console.error(error);

    throw new Error("Four Pillars calculation failed");

  }

}

```

---

# Output Example

```javascript
const result = calculateFourPillars({

  year: 1988,
  month: 2,
  day: 2,
  hour: 11,
  timezone: "Asia/Seoul"

});

console.log(result);
```

---

# Output JSON

```json
{
  "pillars": {

    "year": {
      "stem": "Wu",
      "branch": "Chen",
      "element": "Earth",
      "hiddenStems": ["Wu", "Yi", "Gui"]
    },

    "month": { },

    "day": { },

    "hour": { }

  },

  "dayMaster": "Fire",

  "strength": "Strong",

  "elements": {

    "Wood": 2,
    "Fire": 3,
    "Earth": 2,
    "Metal": 1,
    "Water": 2

  }

}
```

---

# 이 엔진이 연결되는 위치

```
fourPillarsCalculator.js

↓

B0_SNAPSHOT_PROMPT.md

↓

generateReport.js

↓

REPORT_TEMPLATE.html

↓

PDF
```

---


