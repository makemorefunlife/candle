아래는 **실제 서비스에서 결제 후 Premium Report를 PDF로 생성하고 이메일로 보내기까지의 전체 워크플로우**를 정리한 production-level 문서야.
(바이브코더 기준으로, 코드 연결 위치까지 포함)

파일명 그대로 저장:

---

# PDF_GENERATION_WORKFLOW.md

````md
# PDF Generation Workflow
# Version: 1.0
# Purpose: Generate Premium Career Intelligence Report PDF after payment

---

# OVERVIEW

This workflow explains how to:

1. Generate the Premium Report using AI
2. Convert the report into a professional PDF
3. Store the PDF
4. Send the PDF to the user via email

This workflow is triggered ONLY after successful payment.

---

# FULL SYSTEM FLOW

Payment Success
→ Generate Analysis Data
→ Generate Report Text
→ Convert to PDF
→ Store PDF
→ Send Email

---

# STEP 1 — Trigger: Payment Success

Trigger event:

Stripe Checkout সফল → webhook

Stripe Webhook:

event:

checkout.session.completed

Server receives:

user_id
email
metadata

Example:

```json
{
  "user_id": "12345",
  "email": "user@email.com",
  "report_type": "premium"
}
````

---

# STEP 2 — Load User Data

Load from database:

Table:

users

Load:

nickname
birth data
industry
role
experience

Table:

four_pillars

Load:

day_master
structure
cycles

---

# STEP 3 — Generate Report Text

Use:

B2_PREMIUM_FULL_REPORT_PROMPT.md

Call:

OpenAI API or Claude API

Example:

```javascript
const report = await openai.chat.completions.create({
 model: "gpt-5",
 messages: [
  {
   role: "system",
   content: B2_PROMPT
  },
  {
   role: "user",
   content: userData
  }
 ]
})
```

Output:

reportText

This is plain text.

---

# STEP 4 — Convert Text to HTML

PDF works best from HTML.

Create:

report.html

Example:

```html
<h1>Executive Career Intelligence Report</h1>

<h2>Executive Overview</h2>

<p>Report content...</p>
```

Use template:

/templates/report_template.html

Insert:

reportText

---

# STEP 5 — Convert HTML to PDF

Use:

Recommended tools:

Option 1 (Best):

Puppeteer

Option 2:

PDFKit

Option 3:

Playwright

---

# Example using Puppeteer

Install:

npm install puppeteer

Code:

```javascript
const puppeteer = require("puppeteer");

const browser = await puppeteer.launch();

const page = await browser.newPage();

await page.setContent(htmlContent);

await page.pdf({

 path: `reports/${user_id}.pdf`,
 format: "A4",
 printBackground: true

});

await browser.close();
```

Output:

PDF file created

---

# STEP 6 — Store PDF

Store location:

Option A:

Local storage

/reports/user_id.pdf

Option B (Recommended):

AWS S3

Example:

s3://career-report/user_id.pdf

Reason:

Secure
Scalable

---

# STEP 7 — Save PDF Record in Database

Table:

reports

Example:

```json
{
 user_id: "12345",
 pdf_url: "https://s3...",
 created_at: "2026-02-15"
}
```

---

# STEP 8 — Send Email with PDF

Use:

Recommended:

Resend (Best)
SendGrid
Amazon SES

Example using Resend:

```javascript
await resend.emails.send({

 from: "report@yourdomain.com",

 to: user.email,

 subject: "Your Career Intelligence Report",

 html: emailTemplate,

 attachments: [

  {
   filename: "report.pdf",
   path: pdfPath
  }

 ]

});
```

---

# STEP 9 — Update Status

Update database:

reports table:

status:

completed

---

# FINAL RESULT

User receives:

Email

with

PDF report attached

---

# FILE STRUCTURE RECOMMENDED

/project

/prompts

/templates

report_template.html

/reports

/services

generateReport.js

generatePDF.js

sendEmail.js

---

# RECOMMENDED PDF DESIGN

Style:

Clean

Professional

Minimal

Font:

Recommended:

Inter
Helvetica
Georgia

Include:

Title Page

Sections

Page numbers

---

# TITLE PAGE STRUCTURE

Executive Career Intelligence Report

Prepared for:

{nickname}

Date:

{date}

---

# SECURITY NOTE

PDF must NOT be public.

Use:

private storage

or

expiring link

---

# PERFORMANCE OPTIMIZATION

Expected generation time:

20–60 seconds

Recommended:

Show loading screen:

"Your report is being prepared"

---

# FUTURE IMPROVEMENTS

Add:

Download page

User dashboard

Re-download option

---

# SUMMARY

This workflow connects:

Payment
AI generation
PDF creation
Email delivery

into one automated system.

---

# END

```

---

# 이 파일의 위치 (중요)

```

/docs

PDF_GENERATION_WORKFLOW.md

/services

generateReport.js
generatePDF.js
sendEmail.js

/templates

report_template.html

```

---

```
