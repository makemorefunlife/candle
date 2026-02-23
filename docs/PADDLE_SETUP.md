# Paddle 결제 설정 가이드

이 문서는 blueprint 메일에 Paddle 결제 버튼을 추가하기 위한 설정 방법을 설명합니다.

## 개요

blueprint로 보내는 메일에 Paddle 결제창을 띄우는 버튼이 자동으로 포함됩니다. 
Paddle 환경 변수가 설정되어 있지 않으면 결제 버튼 없이 메일이 전송됩니다.

## 필요한 환경 변수

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Paddle API 키 (필수)
PADDLE_API_KEY=your_paddle_api_key_here

# Paddle Price ID (필수)
# Paddle 대시보드에서 생성한 제품의 가격 ID
PADDLE_PRICE_ID=pri_xxxxxxxxxxxxx

# Paddle Checkout URL (선택사항, 권장)
# Paddle 대시보드의 기본 checkout URL
PADDLE_CHECKOUT_URL=https://buy.paddle.com/product/xxxxx

# 또는 공개 URL (선택사항)
NEXT_PUBLIC_PADDLE_CHECKOUT_URL=https://buy.paddle.com/product/xxxxx
```

## Paddle 설정 방법

### 1. Paddle 계정 생성

1. [Paddle 웹사이트](https://paddle.com)에 접속하여 계정을 생성합니다.
2. 대시보드에 로그인합니다.

### 2. 제품 및 가격 생성

1. Paddle 대시보드에서 **Products** 메뉴로 이동합니다.
2. **Create Product** 버튼을 클릭합니다.
3. 제품 정보를 입력합니다:
   - Name: "Executive Career Intelligence Report"
   - Description: "프리미엄 경력 인텔리전스 리포트"
   - Tax Category: "saas" (또는 적절한 카테고리)
4. **Create Price** 버튼을 클릭하여 가격을 설정합니다:
   - Price: 원하는 가격 (예: $99)
   - Billing Cycle: One-time (일회성 결제)
5. 생성된 **Price ID**를 복사합니다 (형식: `pri_xxxxxxxxxxxxx`)

### 3. API 키 생성

1. Paddle 대시보드에서 **Developer Tools** > **Authentication** 메뉴로 이동합니다.
2. **Create API Key** 버튼을 클릭합니다.
3. API 키 이름을 입력하고 생성합니다.
4. 생성된 **API Key**를 복사합니다 (안전하게 보관하세요)

### 4. Checkout URL 확인

1. Paddle 대시보드에서 **Checkout** 메뉴로 이동합니다.
2. 기본 checkout URL을 확인하거나 생성합니다.
3. 또는 제품 페이지에서 checkout URL을 확인할 수 있습니다.

## 테스트

환경 변수를 설정한 후:

1. 개발 서버를 재시작합니다:
   ```bash
   pnpm run dev
   ```

2. blueprint 페이지에서 이메일을 입력하여 리포트를 요청합니다.

3. 받은 메일에서 Paddle 결제 버튼이 표시되는지 확인합니다.

## 문제 해결

### 결제 버튼이 표시되지 않는 경우

1. 환경 변수가 올바르게 설정되었는지 확인하세요.
2. `.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.
3. 개발 서버를 재시작했는지 확인하세요.
4. 브라우저 콘솔과 서버 로그에서 오류 메시지를 확인하세요.

### Paddle API 오류가 발생하는 경우

1. API 키가 올바른지 확인하세요.
2. Price ID가 올바른지 확인하세요.
3. Paddle 계정이 활성화되어 있는지 확인하세요.
4. API 키에 필요한 권한이 있는지 확인하세요.

## 보안 주의사항

- **절대로** API 키를 코드에 직접 작성하지 마세요.
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다.
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요 (예: Vercel 환경 변수 설정).

## 참고 자료

- [Paddle API 문서](https://developer.paddle.com/)
- [Paddle Checkout 가이드](https://developer.paddle.com/concepts/paddle-checkout/overview)
- [Paddle 환경 변수 설정](https://developer.paddle.com/getting-started/authentication)

