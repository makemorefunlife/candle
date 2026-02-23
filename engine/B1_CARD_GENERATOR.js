

---

# B1_CARD_GENERATOR.js

```javascript
/**
 * B1_CARD_GENERATOR.js
 *
 * Free Version Card Generator
 *
 * Output:
 *
 * 1. Bento Grid Snapshot
 * 2. Executive Insight Cards (5)
 *
 * Uses:
 * B1_DAYMASTER_ANALYSIS_PROMPT.md
 */


import OpenAI from "openai";

import fs from "fs";

import path from "path";



const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});



/**
 *
 * Load Prompt
 *
 */

const PROMPT_PATH = path.join(
  process.cwd(),
  "prompts",
  "B1_DAYMASTER_ANALYSIS_PROMPT.md"
);


const SYSTEM_PROMPT =
  fs.readFileSync(
    PROMPT_PATH,
    "utf-8"
  );



/**
 *
 * MAIN FUNCTION
 *
 */

export async function generateB1Cards(
  baziAnalysis
) {

  try {

    /**
     *
     * Call GPT
     *
     */

    const completion =
      await openai.chat.completions.create({

        model: "gpt-5",

        temperature: 0.7,

        messages: [

          {

            role: "system",

            content: SYSTEM_PROMPT

          },

          {

            role: "user",

            content:
              JSON.stringify(
                baziAnalysis.promptInput
              )

          }

        ],

        response_format: {

          type: "json_object"

        }

      });



    const result =
      JSON.parse(
        completion.choices[0].message.content
      );



    /**
     *
     * Build Final Object
     *
     */

    return {

      success: true,



      bentoGrid:

        buildBentoGrid(
          result.bento
        ),



      executiveCards:

        buildExecutiveCards(
          result.cards
        ),



      meta: {

        generatedAt:
          new Date(),

        version:
          "free_v1"

      }

    };

  }

  catch(error){

    console.error(error);

    return {

      success: false,

      error:
        "CARD_GENERATION_FAILED"

    };

  }

}



/**
 *
 * Bento Grid Builder
 *
 */

function buildBentoGrid(
  bento
){

return [

{

id: "core_identity",

label: "Core Identity",

value:
bento.core_identity,

size: "large"

},

{

id: "decision_style",

label: "Decision Style",

value:
bento.decision_style,

size: "medium"

},

{

id: "execution_mode",

label: "Execution Mode",

value:
bento.execution_mode,

size: "medium"

},

{

id: "risk_profile",

label: "Risk Profile",

value:
bento.risk_profile,

size: "medium"

},

{

id: "wealth_pattern",

label: "Wealth Pattern",

value:
bento.wealth_pattern,

size: "large"

}

];

}



/**
 *
 * Executive Cards Builder
 *
 */

function buildExecutiveCards(
cards
){

return cards.map(
(card, index) => ({

id:
`card_${index+1}`,

category:
card.category,

title:
card.title,

coreInsight:
card.core_insight,

strategicInterpretation:
card.strategic_interpretation,

tacticalEdge:
card.tactical_edge,

confidence:
card.confidence || 0.82

})

);

}
```

---

# GPT Prompt가 반환해야 하는 JSON 형식

(B1_DAYMASTER_ANALYSIS_PROMPT.md에서)

```json
{

"bento": {

"core_identity":
"Strategic Builder",

"decision_style":
"Asymmetric",

"execution_mode":
"Momentum Driven",

"risk_profile":
"High variance",

"wealth_pattern":
"Equity leverage"

},

"cards": [

{

"category":
"CORE ENGINE",

"title":
"Strategic Pattern Recognizer",

"core_insight":
"You identify leverage points faster than others.",

"strategic_interpretation":
"This allows early positioning.",

"tactical_edge":
"Operate in emerging markets.",

"confidence":
0.84

}

]

}
```

---

# 최종 Output Example (Frontend 전달)

```json
{

"bentoGrid":[

{

"label":"Core Identity",

"value":"Strategic Builder"

}

],

"executiveCards":[

{

"category":"CORE ENGINE",

"title":"Strategic Pattern Recognizer",

"coreInsight":"...",

"tacticalEdge":"..."

}

]

}
```

---

# 이제 Frontend에서 바로 사용 가능

React 예:

```javascript
cards.map(card => (

<ExecutiveCard

title={card.title}

insight={card.coreInsight}

/>

))
```

---

# 전체 Free Version Flow 완성

```
User Input
↓
baziAnalyzer.js
↓
B1_CARD_GENERATOR.js
↓
GPT Prompt 실행
↓
Bento Grid 생성
↓
Executive Cards 생성
↓
Frontend 출력
```

---