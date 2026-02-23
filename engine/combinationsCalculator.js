combinationsCalculator.js

(합 충 형 계산)

/**
 * combinationsCalculator.js
 *
 * Clash / Combination
 */


const CLASH = {

  Zi: "Wu",
  Chou: "Wei",
  Yin: "Shen",
  Mao: "You",
  Chen: "Xu",
  Si: "Hai"

};


export function calculateCombinations(pillars) {

  const results = [];

  const branches =
    Object.values(pillars)
    .map(p => p.branch);


  branches.forEach(branch => {

    if (branches.includes(CLASH[branch])) {

      results.push(
        `${branch}-${CLASH[branch]} Clash`
      );

    }

  });


  return results;

}


