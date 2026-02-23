/**
 * EMAIL_DELIVERY_SERVICE.js
 *
 * Sends Premium Report PDF via Email
 *
 * Production Ready
 */


import fs from "fs";

import path from "path";

import { Resend } from "resend";



const resend = new Resend(

process.env.RESEND_API_KEY

);




/**
 *
 * MAIN FUNCTION
 *
 */

export async function sendPremiumReportEmail({

toEmail,

userName,

reportFilePath,

}){

try{


/**
 *
 * Read PDF
 *
 */


const pdfBuffer =

fs.readFileSync(

reportFilePath

);




/**
 *
 * Email Content
 *
 */


const subject =

"Your Strategic Executive Report";



const html = generateEmailHTML({

userName

});




/**
 *
 * Send Email
 *
 */


const response = await resend.emails.send({

from:

"Executive Concierge <report@yourdomain.com>",

to:

toEmail,

subject,

html,

attachments: [

{

filename:

"Strategic_Report.pdf",

content:

pdfBuffer,

}

],

});




return {

success: true,

id: response.id

};




}

catch(error){

console.error(error);

return {

success: false,

error:

"EMAIL_DELIVERY_FAILED"

};

}

}






/**
 *
 * Email Template
 *
 */

function generateEmailHTML({

userName

}){


return `

<div style="

font-family:

-apple-system,

BlinkMacSystemFont,

Segoe UI,

Roboto;

max-width:600px;

margin:auto;

padding:40px;

color:#111;

line-height:1.6;

">


<h2>

${userName},

your report is ready.

</h2>


<p>

Your Strategic Executive Analysis

has been completed.
