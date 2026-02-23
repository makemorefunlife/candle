# Nodemailer 설정 가이드

이 문서는 nodemailer를 사용하여 이메일을 전송하기 위한 설정 방법을 설명합니다.

## 📋 목차

1. [환경 변수 설정](#환경-변수-설정)
2. [주요 이메일 서비스 설정](#주요-이메일-서비스-설정)
3. [API 사용 방법](#api-사용-방법)
4. [테스트 방법](#테스트-방법)

---

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요.

### 필수 환경 변수

```env
# SMTP 서버 호스트 (예: smtp.gmail.com, smtp.naver.com)
SMTP_HOST=smtp.gmail.com

# SMTP 포트 (일반적으로 587 또는 465)
SMTP_PORT=587

# SMTP 사용자명 (이메일 주소)
SMTP_USER=your-email@gmail.com

# SMTP 비밀번호 (일반 비밀번호 또는 앱 비밀번호)
SMTP_PASSWORD=your-password-or-app-password

# 발신자 이메일 주소 (선택사항, 기본값은 SMTP_USER)
SMTP_FROM=your-email@gmail.com
```

### 환경 변수 설명

- **SMTP_HOST**: 이메일을 보낼 SMTP 서버 주소
- **SMTP_PORT**: SMTP 서버 포트 번호
  - `587`: TLS/STARTTLS 사용 (권장)
  - `465`: SSL 사용
- **SMTP_USER**: SMTP 서버에 로그인할 이메일 주소
- **SMTP_PASSWORD**: 이메일 계정 비밀번호 또는 앱 비밀번호
- **SMTP_FROM**: 발신자로 표시될 이메일 주소 (선택사항)

---

## 주요 이메일 서비스 설정

### Gmail 설정

1. **Google 계정 설정**
   - [Google 계정](https://myaccount.google.com/) 접속
   - 보안 → 2단계 인증 활성화
   - 앱 비밀번호 생성 (보안 → 앱 비밀번호)

2. **환경 변수 설정**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=생성한-앱-비밀번호
   SMTP_FROM=your-email@gmail.com
   ```

### Naver 메일 설정

1. **네이버 메일 설정**
   - [네이버 메일](https://mail.naver.com/) 접속
   - 환경설정 → POP3/IMAP 설정
   - POP3/SMTP 사용 설정 활성화

2. **환경 변수 설정**
   ```env
   SMTP_HOST=smtp.naver.com
   SMTP_PORT=587
   SMTP_USER=your-email@naver.com
   SMTP_PASSWORD=네이버-메일-비밀번호
   SMTP_FROM=your-email@naver.com
   ```

### Outlook/Hotmail 설정

1. **환경 변수 설정**
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=outlook-비밀번호
   SMTP_FROM=your-email@outlook.com
   ```

### SendGrid 설정 (프로덕션 권장)

1. **SendGrid 계정 생성**
   - [SendGrid](https://sendgrid.com/) 가입
   - API 키 생성

2. **환경 변수 설정**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=생성한-API-키
   SMTP_FROM=your-email@yourdomain.com
   ```

---

## API 사용 방법

### 기본 사용법

```typescript
// 클라이언트에서 호출
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: '테스트 이메일',
    text: '이것은 테스트 이메일입니다.',
    html: '<h1>테스트 이메일</h1><p>이것은 테스트 이메일입니다.</p>',
  }),
})

const data = await response.json()
console.log(data)
```

### HTML 이메일 전송

```typescript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'HTML 이메일',
    html: `
      <html>
        <body>
          <h1>안녕하세요!</h1>
          <p>이것은 <strong>HTML</strong> 형식의 이메일입니다.</p>
        </body>
      </html>
    `,
  }),
})
```

### 첨부 파일 포함 이메일 전송

```typescript
// 파일 경로를 사용하는 경우
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: '첨부 파일 포함',
    text: '첨부 파일을 확인해주세요.',
    attachments: [
      {
        filename: 'report.pdf',
        path: '/path/to/report.pdf',
      },
    ],
  }),
})

// 파일 내용을 직접 전송하는 경우 (Base64 인코딩)
const fileContent = Buffer.from(base64String, 'base64')
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: '첨부 파일 포함',
    text: '첨부 파일을 확인해주세요.',
    attachments: [
      {
        filename: 'report.pdf',
        content: fileContent,
      },
    ],
  }),
})
```

### 서버 사이드에서 사용

```typescript
// app/api/other-route/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // 다른 로직 수행 후 이메일 전송
  const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'user@example.com',
      subject: '알림',
      html: '<p>작업이 완료되었습니다.</p>',
    }),
  })

  const emailData = await emailResponse.json()
  // ...
}
```

---

## 테스트 방법

### 1. 설정 확인

브라우저나 터미널에서 다음 URL로 접속하여 설정 상태를 확인할 수 있습니다:

```
GET http://localhost:3000/api/send-email
```

응답 예시:
```json
{
  "configured": true,
  "hasHost": true,
  "hasPort": true,
  "hasUser": true,
  "hasPassword": true
}
```

### 2. 테스트 이메일 전송

터미널에서 curl을 사용하거나, 브라우저 개발자 도구에서 다음 코드를 실행하세요:

```javascript
fetch('/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'your-test-email@example.com',
    subject: '테스트 이메일',
    text: '이것은 테스트 이메일입니다.',
    html: '<h1>테스트</h1><p>이것은 테스트 이메일입니다.</p>',
  }),
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

### 3. 에러 처리

API는 다음과 같은 에러를 반환할 수 있습니다:

- **400 Bad Request**: 필수 필드가 누락된 경우
- **500 Internal Server Error**: SMTP 설정 오류 또는 전송 실패

에러 응답 예시:
```json
{
  "error": "이메일 전송에 실패했습니다."
}
```

---

## 보안 주의사항

1. **환경 변수 보호**
   - `.env.local` 파일은 절대 Git에 커밋하지 마세요
   - `.gitignore`에 `.env.local`이 포함되어 있는지 확인하세요

2. **프로덕션 환경**
   - Gmail, Naver 등 개인 이메일 대신 SendGrid, AWS SES 등 전문 서비스를 사용하는 것을 권장합니다
   - API 키와 비밀번호는 안전하게 관리하세요

3. **스팸 방지**
   - SPF, DKIM, DMARC 레코드를 도메인 DNS에 설정하세요
   - 발신자 이메일 주소는 신뢰할 수 있는 도메인을 사용하세요

---

## 문제 해결

### "SMTP 설정이 완료되지 않았습니다" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (대소문자 구분)
- 개발 서버를 재시작했는지 확인

### "인증 실패" 오류

- Gmail의 경우 앱 비밀번호를 사용해야 합니다
- 비밀번호가 정확한지 확인
- 2단계 인증이 활성화되어 있는지 확인

### "연결 시간 초과" 오류

- 방화벽이나 네트워크 설정 확인
- SMTP 포트가 올바른지 확인 (587 또는 465)
- 회사 네트워크에서는 SMTP 포트가 차단될 수 있습니다

---

## 추가 리소스

- [Nodemailer 공식 문서](https://nodemailer.com/)
- [Gmail 앱 비밀번호 설정](https://support.google.com/accounts/answer/185833)
- [SendGrid 문서](https://docs.sendgrid.com/)


