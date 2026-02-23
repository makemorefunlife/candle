
**결제 완료 → PDF 생성 → 이메일 발송 → 상태 업데이트 → 재전송 관리**까지 포함한 production-level 워크플로우야.

---

# EMAIL_DELIVERY_WORKFLOW.md

````md
# Email Delivery Workflow
# Version: 1.0
# Purpose: Deliver Premium Career Intelligence Report PDF to user email
# Audience: US-based users
# Tone: Professional, calm, intelligent

---

# OVERVIEW

This workflow defines how the system sends the Premium Report email after PDF generation.

Goals:

- Deliver report reliably
- Maintain premium brand perception
- Allow retry if delivery fails
- Track delivery status

---

# FULL FLOW

Payment Success
→ Generate Report PDF
→ Send Email with PDF
→ Confirm Delivery
→ Update Status

---

# EMAIL SERVICE PROVIDER (RECOMMENDED)

Priority order:

1. Resend (BEST for modern SaaS)
2. SendGrid
3. Amazon SES

Recommended choice:

Resend

Reason:

- Simple API
- Reliable delivery
- Great developer experience

---

# STEP 1 — Trigger Email Send

Trigger event:

PDF generation completed

System receives:

user_id
email
nickname
pdf_path

Example:

```json
{
 "user_id": "12345",
 "email": "user@email.com",
 "nickname": "Alex",
 "pdf_path": "/reports/12345.pdf"
}
````

---

# STEP 2 — Prepare Email Content

Load email template:

/templates/email_template.html

Inject:

nickname

Example:

"Your report is ready, Alex."

---

# STEP 3 — Email Subject Line

Use this exact format:

Your Executive Career Intelligence Report is Ready

Alternative (A/B test later):

Your Private Career Intelligence Report

Do NOT use:

"Your astrology report"
"Your fortune"

---

# STEP 4 — Email Body Template

HTML TEMPLATE:

---

Subject:

Your Executive Career Intelligence Report is Ready

---

HTML:

```html
<h2>Your Report is Ready</h2>

<p>Hi {{nickname}},</p>

<p>Your Executive Career Intelligence Report has been prepared.</p>

<p>This report provides a detailed analysis of your career operating system, decision patterns, and long-term strategic positioning.</p>

<p>Please find your report attached to this email.</p>

<br>

<p>Review it carefully. You may discover insights that change how you approach your next career move.</p>

<br>

<p>— Career Intelligence Team</p>

```

---

# STEP 5 — Send Email with Attachment

Example using Resend:

Install:

npm install resend

Code:

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({

 from: 'Career Intelligence <report@yourdomain.com>',

 to: user.email,

 subject: 'Your Executive Career Intelligence Report is Ready',

 html: emailHTML,

 attachments: [

  {
   filename: 'Career_Report.pdf',
   path: pdfPath
  }

 ]

});
```

---

# STEP 6 — Update Database Status

Table:

reports

Update:

status:

sent

Example:

```json
{
 user_id: "12345",
 status: "sent",
 sent_at: "2026-02-15"
}
```

---

# STEP 7 — Delivery Failure Handling

If email fails:

Update:

status:

failed

Retry logic:

Retry up to 3 times

Delay:

10 minutes between retries

---

# STEP 8 — Optional: Store Email Log

Table:

email_logs

Example:

```json
{
 user_id: "12345",
 email: "user@email.com",
 status: "sent",
 timestamp: "2026-02-15"
}
```

---

# STEP 9 — Optional (Recommended): Include Download Link

Instead of attachment only, include:

Secure download link

Example:

[https://yourdomain.com/report/12345](https://yourdomain.com/report/12345)

Benefits:

User can re-download

---

# STEP 10 — Security Best Practice

Use:

Signed URL

Expiration:

24 hours

Example:

AWS S3 signed URL

---

# STEP 11 — Branding Best Practice

Sender name:

Career Intelligence

Email:

[report@yourdomain.com](mailto:report@yourdomain.com)

Avoid:

gmail address

---

# STEP 12 — Expected Timing

Report delivery target:

Within 5–30 minutes after purchase

Maximum promised time:

3 hours

(as shown on purchase page)

---

# STEP 13 — User Experience Enhancement (Recommended)

Immediately after purchase show:

Screen:

"Your report is being prepared.

You will receive it by email shortly."

This reduces anxiety.

---

# STEP 14 — File Structure

/project

/services

sendEmail.js

/templates

email_template.html

---

# STEP 15 — Testing

Test with:

Your own email

Verify:

Attachment works

Formatting correct

No spam folder

---

# STEP 16 — Spam Prevention

Required:

SPF record

DKIM record

DMARC record

Set in domain DNS.

---

# FINAL RESULT

User receives:

Professional email

with

Premium Report attached

---

# END

```

---

