/**
 * B2_REPORT_GENERATOR.js
 *
 * Premium Report Generator
 *
 * Flow:
 *
 * 1. Load B2 Prompt
 * 2. Call GPT
 * 3. Inject into HTML template
 * 4. Generate PDF
 * 5. Return file path
 */


import OpenAI from "openai";

import fs from "fs";

import path from "path";

import puppeteer from "puppeteer";



const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});



/**
 *
 * PATH CONFIG
 *
 */

const PROMPT_PATH = path.join(

  process.cwd(),

  "prompts",

  "B2_PREMIUM_FULL_REPORT_PROMPT.md"

);


const TEMPLATE_PATH = path.join(

  process.cwd(),

  "templates",

  "REPORT_TEMPLATE.html"

);


const OUTPUT_DIR = path.join(

  process.cwd(),

  "reports"

);




/**
 *
 * MAIN FUNCTION
 *
 */

export async function generatePremiumReport(

  baziAnalysis,

  userMeta

){

try{


/**
 *
 * STEP 1
 *
 * Load Prompt
 *
 */


const SYSTEM_PROMPT =

fs.readFileSync(

PROMPT_PATH,

"utf-8"

);




/**
 *
 * STEP 2
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

JSON.stringify({

analysis:

baziAnalysis.promptInput,

user:

userMeta

})

}

],

response_format: {

type: "json_object"

}

});



const reportData =

JSON.parse(

completion.choices[0]

.message.content

);




/**
 *
 * STEP 3
 *
 * Load HTML Template
 *
 */


let template =

fs.readFileSync(

TEMPLATE_PATH,

"utf-8"

);




/**
 *
 * STEP 4
 *
 * Inject Text Content (85%)
 *
 */


template = template

.replace(

"{{CORE_ENGINE}}",

reportData.core_engine

)

.replace(

"{{DECISION_OS}}",

reportData.decision_os

)

.replace(

"{{PRESSURE_PATTERN}}",

reportData.pressure_pattern

)

.replace(

"{{UNFAIR_ADVANTAGE}}",

reportData.unfair_advantage

)

.replace(

"{{BLIND_SPOT}}",

reportData.blind_spot

)

.replace(

"{{COMPOUNDING_STRATEGY}}",

reportData.compounding_strategy

);




/**
 *
 * STEP 5
 *
 * Inject Visual Components (15%)
 *
 */


template = template

.replace(

"{{BENTO_GRID}}",

generateBentoHTML(

reportData.bento

)

)

.replace(

"{{ENERGY_CHART}}",

generateEnergyChart(

reportData.energy_chart

)

);




/**
 *
 * STEP 6
 *
 * Generate PDF
 *
 */


if (!fs.existsSync(OUTPUT_DIR)){

fs.mkdirSync(OUTPUT_DIR);

}



const fileName =

`report_${Date.now()}.pdf`;


const filePath =

path.join(

OUTPUT_DIR,

fileName

);



const browser =

await puppeteer.launch();



const page =

await browser.newPage();



await page.setContent(

template,

{

waitUntil:

"networkidle0"

}

);



await page.pdf({

path: filePath,

format: "A4",

printBackground: true,

margin: {

top: "40px",

bottom: "40px",

left: "30px",

right: "30px"

}

});



await browser.close();




/**
 *
 * DONE
 *
 */


return {

success: true,

filePath,

fileName

};



}



catch(error){

console.error(error);

return {

success: false,

error:

"PREMIUM_REPORT_FAILED"

};

}

}




/**
 *
 * Bento Grid HTML
 *
 */

function generateBentoHTML(bento){

return `

<div class="bento">

<div class="bento-item large">

${bento.identity}

</div>

<div class="bento-item">

${bento.decision}

</div>

<div class="bento-item">

${bento.execution}

</div>

<div class="bento-item">

${bento.wealth}

</div>

</div>

`;

}




/**
 *
 * Energy Chart HTML
 *
 */

function generateEnergyChart(chart){

return `

<div class="chart">

<img src="${chart.url}"

style="width:100%"/>

</div>

`;

}
