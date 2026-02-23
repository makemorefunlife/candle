
hiddenStemsStrengthCalculator.js

(지장간 + 강도 계산)

/**
 * hiddenStemsStrengthCalculator.js
 *
 * Hidden Stems and Strength
 */


const HIDDEN_STEMS = {

  Zi: [{ stem: "Gui", strength: 1.0 }],

  Chou: [
    { stem: "Ji", strength: 0.6 },
    { stem: "Gui", strength: 0.3 },
    { stem: "Xin", strength: 0.1 }
  ],

  Yin: [
    { stem: "Jia", strength: 0.6 },
    { stem: "Bing", strength: 0.3 },
    { stem: "Wu", strength: 0.1 }
  ],

  Mao: [{ stem: "Yi", strength: 1.0 }],

  Chen: [
    { stem: "Wu", strength: 0.6 },
    { stem: "Yi", strength: 0.3 },
    { stem: "Gui", strength: 0.1 }
  ],

  Si: [
    { stem: "Bing", strength: 0.6 },
    { stem: "Wu", strength: 0.3 },
    { stem: "Geng", strength: 0.1 }
  ],

  Wu: [
    { stem: "Ding", strength: 0.7 },
    { stem: "Ji", strength: 0.3 }
  ],

  Wei: [
    { stem: "Ji", strength: 0.6 },
    { stem: "Yi", strength: 0.3 },
    { stem: "Ding", strength: 0.1 }
  ],

  Shen: [
    { stem: "Geng", strength: 0.6 },
    { stem: "Ren", strength: 0.3 },
    { stem: "Wu", strength: 0.1 }
  ],

  You: [{ stem: "Xin", strength: 1.0 }],

  Xu: [
    { stem: "Wu", strength: 0.6 },
    { stem: "Xin", strength: 0.3 },
    { stem: "Ding", strength: 0.1 }
  ],

  Hai: [
    { stem: "Ren", strength: 0.7 },
    { stem: "Jia", strength: 0.3 }
  ]

};



export function calculateHiddenStemStrength(pillars) {

  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {

    if (!pillar) return;

    result[key] =
      HIDDEN_STEMS[pillar.branch];

  });

  return result;

}
