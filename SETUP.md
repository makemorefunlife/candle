# 🚀 프로젝트 실행 가이드

## 1단계: 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
pnpm install
```

> **참고**: pnpm이 설치되어 있지 않다면 `npm install -g pnpm` 명령어로 먼저 설치하세요.

---

## 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

### 필수 환경 변수

```env
# OpenAI API
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # 서버 사이드 관리 작업용 (선택사항)

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 환경 변수 얻는 방법

#### OpenAI API Key
1. [OpenAI Platform](https://platform.openai.com/)에 로그인
2. API Keys 메뉴로 이동
3. "Create new secret key" 클릭
4. 생성된 키를 복사

#### Supabase
1. [Supabase](https://supabase.com/)에 로그인
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. Settings → API 메뉴에서:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY` (서버 사이드 관리 작업용, 선택사항)
   
> **참고**: Supabase 사용 방법에 대한 자세한 내용은 [`lib/supabase/README.md`](lib/supabase/README.md)를 참고하세요.

#### Clerk
1. [Clerk](https://clerk.com/)에 로그인
2. 애플리케이션 생성 또는 기존 앱 선택
3. API Keys 메뉴에서:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`

---

## 3단계: 개발 서버 실행

환경 변수를 설정한 후, 다음 명령어로 개발 서버를 실행하세요:

```bash
pnpm run dev
```

서버가 시작되면 브라우저에서 다음 주소로 접속하세요:

**http://localhost:3000**

---

## 4단계: 빌드 (프로덕션용)

프로덕션 빌드를 생성하려면:

```bash
pnpm run build
pnpm run start
```

---

## 문제 해결

### 포트가 이미 사용 중인 경우
다른 포트로 실행하려면:
```bash
pnpm run dev -- -p 3001
```

### 의존성 설치 오류
다음을 시도해보세요:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 환경 변수 오류
`.env.local` 파일이 제대로 생성되었는지 확인하고, 변수명에 오타가 없는지 확인하세요.

---

## 추가 정보

- **Node.js 버전**: 18.0.0 이상 필요
- **pnpm 버전**: 8.0.0 이상 필요
- **포트**: 기본값 3000

