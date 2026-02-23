godsCalculator.js

(신살 계산)

/**
 * godsCalculator.js
 *
 * Special Stars
 */


export function calculateGods(pillars) {

  const dayBranch =
    pillars.day.branch;

  const gods = [];


  // Example rules


  if (dayBranch === "Wu") {

    gods.push("Peach Blossom");

  }


  if (dayBranch === "You") {

    gods.push("Academic Star");

  }


  if (dayBranch === "Chen") {

    gods.push("Leader Star");

  }


  return gods;

}
