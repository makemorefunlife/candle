아래는 **production-ready twelveStageCalculator.js** 입니다.
(12 Stages of Life Cycle / 12운성 계산)

이 코드는:

* Day Master 기준
* 각 지지(branch)의 12운성 계산
* Four Pillars 결과와 바로 연결

---

# twelveStageCalculator.js

```javascript
/**
 * twelveStageCalculator.js
 *
 * Calculate 12 Stages (12운성)
 *
 * Based on Day Master Stem
 */


// 12 Stages order

const STAGES = [

  "Chang Sheng (장생)",
  "Mu Yu (목욕)",
  "Guan Dai (관대)",
  "Lin Guan (건록)",
  "Di Wang (제왕)",
  "Shuai (쇠)",
  "Bing (병)",
  "Si (사)",
  "Mu (묘)",
  "Jue (절)",
  "Tai (태)",
  "Yang (양)"

];



// Branch order

const BRANCHES = [

  "Zi",
  "Chou",
  "Yin",
  "Mao",
  "Chen",
  "Si",
  "Wu",
  "Wei",
  "Shen",
  "You",
  "Xu",
  "Hai"

];



// Starting point per Day Master

const START_POINTS = {

  Jia: "Hai",
  Yi: "Wu",

  Bing: "Yin",
  Ding: "You",

  Wu: "Yin",
  Ji: "You",

  Geng: "Si",
  Xin: "Zi",

  Ren: "Shen",
  Gui: "Mao"

};



// Direction

const FORWARD_STEMS = [
  "Jia",
  "Bing",
  "Wu",
  "Geng",
  "Ren"
];



function getStage(dayMaster, branch) {

  const startBranch =
    START_POINTS[dayMaster];


  const startIndex =
    BRANCHES.indexOf(startBranch);


  const branchIndex =
    BRANCHES.indexOf(branch);


  const diff =
    FORWARD_STEMS.includes(dayMaster)
      ? (branchIndex - startIndex + 12) % 12
      : (startIndex - branchIndex + 12) % 12;


  return STAGES[diff];

}



// Main function

export function calculateTwelveStages(
  fourPillarsResult
) {

  const dayMaster =
    fourPillarsResult.pillars.day.stem;


  const result = {};


  Object.entries(
    fourPillarsResult.pillars
  ).forEach(([pillarName, pillar]) => {

    if (!pillar) {

      result[pillarName] = null;
      return;

    }


    result[pillarName] =
      getStage(
        dayMaster,
        pillar.branch
      );

  });


  return {

    dayMaster,

    stages: result

  };

}
```

---

# 사용 방법

```javascript
import { calculateTwelveStages }
from "./twelveStageCalculator.js";


const stages =
  calculateTwelveStages(fourPillarsResult);


console.log(stages);
```

---

# Output Example

```json
{
  "dayMaster": "Bing",

  "stages": {

    "year":
      "Chang Sheng (장생)",

    "month":
      "Lin Guan (건록)",

    "day":
      "Di Wang (제왕)",

    "hour":
      "Mu (묘)"

  }

}
```

---


