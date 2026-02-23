/**
 * tenGodsCalculator.js
 *
 * Calculates Ten Gods (십성)
 * based on Day Master
 *
 * Input:
 * result from fourPillarsCalculator.js
 *
 * Output:
 * structured Ten Gods JSON
 */


// Stem Elements + Polarity

const STEM_INFO = {

  Jia: { element: "Wood", polarity: "Yang" },
  Yi: { element: "Wood", polarity: "Yin" },

  Bing: { element: "Fire", polarity: "Yang" },
  Ding: { element: "Fire", polarity: "Yin" },

  Wu: { element: "Earth", polarity: "Yang" },
  Ji: { element: "Earth", polarity: "Yin" },

  Geng: { element: "Metal", polarity: "Yang" },
  Xin: { element: "Metal", polarity: "Yin" },

  Ren: { element: "Water", polarity: "Yang" },
  Gui: { element: "Water", polarity: "Yin" }

};



// Element relationships

const GENERATES = {

  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood"

};

const CONTROLS = {

  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood"

};



// Determine Ten God

function getTenGod(dayMasterStem, targetStem) {

  const dm = STEM_INFO[dayMasterStem];
  const target = STEM_INFO[targetStem];

  const sameElement =
    dm.element === target.element;

  const samePolarity =
    dm.polarity === target.polarity;



  // Same element

  if (sameElement) {

    return samePolarity
      ? "Friend (比肩)"
      : "Rob Wealth (劫財)";

  }



  // DM generates target

  if (GENERATES[dm.element] === target.element) {

    return samePolarity
      ? "Eating God (食神)"
      : "Hurting Officer (傷官)";

  }



  // Target generates DM

  if (GENERATES[target.element] === dm.element) {

    return samePolarity
      ? "Indirect Resource (偏印)"
      : "Direct Resource (正印)";

  }



  // DM controls target

  if (CONTROLS[dm.element] === target.element) {

    return samePolarity
      ? "Indirect Wealth (偏財)"
      : "Direct Wealth (正財)";

  }



  // Target controls DM

  if (CONTROLS[target.element] === dm.element) {

    return samePolarity
      ? "Seven Killings (七殺)"
      : "Direct Officer (正官)";

  }



  return "Unknown";

}



// Main function

export function calculateTenGods(fourPillarsResult) {

  const dayMasterStem =
    fourPillarsResult.pillars.day.stem;


  const output = {};



  Object.entries(
    fourPillarsResult.pillars
  ).forEach(([pillarName, pillar]) => {

    if (!pillar) {

      output[pillarName] = null;
      return;

    }



    output[pillarName] = {

      stem:

        getTenGod(
          dayMasterStem,
          pillar.stem
        ),



      hiddenStems:

        pillar.hiddenStems.map(stem =>
          getTenGod(
            dayMasterStem,
            stem
          )
        )

    };

  });



  return {

    dayMaster: dayMasterStem,

    tenGods: output

  };

}

