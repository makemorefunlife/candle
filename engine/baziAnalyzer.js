/**
 * baziAnalyzer.js
 *
 * MASTER INTEGRATION ENGINE
 *
 * Converts Four Pillars data into
 * Strategic Analysis Ready JSON
 *
 * Used for:
 *
 * B0 Snapshot
 * B1 Card Analysis
 * B2 Premium Report
 * Bento Grid
 * GPT Prompt Input
 */



import { calculateFourPillars }
from "./fourPillarsCalculator.js";

import { calculateTenGods }
from "./tenGodsCalculator.js";

import { calculateTwelveStages }
from "./twelveStageCalculator.js";

import { calculateHiddenStemStrength }
from "./hiddenStemsStrengthCalculator.js";

import { calculateGods }
from "./godsCalculator.js";

import { calculateCombinations }
from "./combinationsCalculator.js";



/**
 *
 * MAIN ANALYZER FUNCTION
 *
 */

export function analyzeBazi(userInput) {

  /**
   *
   * STEP 1
   *
   * Calculate Base Structure
   *
   */

  const pillars =
    calculateFourPillars(userInput);



  /**
   *
   * STEP 2
   *
   * Ten Gods
   *
   */

  const tenGods =
    calculateTenGods(pillars);



  /**
   *
   * STEP 3
   *
   * 12 Stages
   *
   */

  const stages =
    calculateTwelveStages(pillars);



  /**
   *
   * STEP 4
   *
   * Hidden Stem Strength
   *
   */

  const hiddenStrength =
    calculateHiddenStemStrength(
      pillars.pillars
    );



  /**
   *
   * STEP 5
   *
   * Special Stars
   *
   */

  const gods =
    calculateGods(
      pillars.pillars
    );



  /**
   *
   * STEP 6
   *
   * Combinations / Clash
   *
   */

  const combinations =
    calculateCombinations(
      pillars.pillars
    );



  /**
   *
   * STEP 7
   *
   * Core Strategic Variables
   *
   * (This is the MOST IMPORTANT PART)
   *
   */

  const dayMaster =
    pillars.pillars.day.stem;



  const dayBranch =
    pillars.pillars.day.branch;



  /**
   *
   * Energy Distribution
   *
   */

  const energyMap =
    calculateEnergyDistribution(
      hiddenStrength
    );



  /**
   *
   * Strength Score
   *
   */

  const strengthScore =
    calculateStrengthScore(
      energyMap,
      dayMaster
    );



  /**
   *
   * Create GPT Ready JSON
   *
   */

  const strategicProfile = {

    core_identity:

      buildCoreIdentity(
        dayMaster,
        strengthScore
      ),



    decision_style:

      buildDecisionStyle(
        tenGods
      ),



    risk_profile:

      buildRiskProfile(
        combinations,
        gods
      ),



    execution_mode:

      buildExecutionMode(
        stages
      ),



    energy_pattern:

      energyMap

  };



  /**
   *
   * FINAL OUTPUT
   *
   */

  return {

    raw:

      pillars,



    tenGods,



    stages,



    hiddenStrength,



    gods,



    combinations,



    energyMap,



    strengthScore,



    strategicProfile,



    /**
     *
     * GPT INPUT OBJECT
     *
     */

    promptInput: {

      pillars,

      tenGods,

      stages,

      hiddenStrength,

      gods,

      combinations,

      strategicProfile,

      userMeta:

        userInput.meta || {}

    }

  };

}



/**
 *
 * ENERGY CALCULATION
 *
 */

function calculateEnergyDistribution(
  hiddenStrength
) {

  const elements = {

    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0

  };



  Object.values(hiddenStrength)
  .forEach(stems => {

    stems.forEach(stem => {

      const element =
        getElement(stem.stem);

      elements[element] +=
        stem.strength;

    });

  });



  return elements;

}



/**
 *
 * SIMPLIFIED
 *
 */

function calculateStrengthScore(
  energyMap,
  dayMaster
){

const element =
getElement(dayMaster);

return energyMap[element];

}



function getElement(stem){

const map = {

Jia:"Wood",
Yi:"Wood",

Bing:"Fire",
Ding:"Fire",

Wu:"Earth",
Ji:"Earth",

Geng:"Metal",
Xin:"Metal",

Ren:"Water",
Gui:"Water"

};

return map[stem];

}



/**
 *
 * STRATEGIC BUILDERS
 *
 */

function buildCoreIdentity(
dayMaster,
strength
){

if(strength > 2){

return "High Output Strategic Builder";

}

if(strength >1){

return "Precision Operator";

}

return "Adaptive Intelligence Type";

}



function buildDecisionStyle(
tenGods
){

return "Calculated and asymmetric decision maker";

}



function buildRiskProfile(
combinations,
gods
){

return "High risk-adjusted positioning capability";

}



function buildExecutionMode(
stages
){

return "Momentum based execution system";

}

