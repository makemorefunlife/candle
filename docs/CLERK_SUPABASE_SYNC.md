# Clerk와 Supabase 사용자 동기화 가이드

Clerk로 회원가입한 사용자 정보를 Supabase에 자동으로 저장하는 방법을 설명합니다.

## 🎯 개요

이 프로젝트는 두 가지 방법으로 Clerk 사용자 정보를 Supabase에 동기화합니다:

1. **Clerk Webhook** (자동, 실시간) - 회원가입/업데이트 시 자동 동기화
2. **클라이언트 동기화** (수동) - 로그인 후 특정 페이지에서 동기화

## 📋 설정된 기능

### 1. Supabase Users 테이블

다음 필드로 사용자 정보를 저장합니다:

- `id` - UUID (Supabase 자동 생성)
- `clerk_user_id` - Clerk의 고유 사용자 ID (UNIQUE)
- `email` - 이메일 주소
- `first_name` - 이름
- `last_name` - 성
- `username` - 사용자명
- `image_url` - 프로필 이미지 URL
- `created_at` - 생성 시간
- `updated_at` - 업데이트 시간 (자동 업데이트)
- `last_sign_in_at` - 마지막 로그인 시간
- `metadata` - 추가 메타데이터 (JSON)

### 2. Clerk Webhook API

**경로**: `/api/webhooks/clerk`

Clerk에서 다음 이벤트를 받아 자동으로 동기화합니다:

- `user.created` - 새 사용자 생성 시
- `user.updated` - 사용자 정보 업데이트 시
- `user.deleted` - 사용자 삭제 시

### 3. 사용자 동기화 API

**경로**: `/api/sync-user`

현재 로그인한 사용자의 정보를 수동으로 동기화합니다.

### 4. 자동 동기화 컴포넌트

`SyncUserOnMount` 컴포넌트가 페이지에 마운트될 때 자동으로 사용자 정보를 동기화합니다.

## 🚀 설정 방법

### 1. Clerk Webhook 설정 (추천)

Clerk 대시보드에서 webhook을 설정하면 회원가입 시 자동으로 Supabase에 저장됩니다.

#### 단계:

1. [Clerk 대시보드](https://dashboard.clerk.com/)에 로그인
2. **Webhooks** 메뉴로 이동
3. **Add Endpoint** 클릭
4. 다음 정보 입력:
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events**: 다음 이벤트 선택
     - `user.created`
     - `user.updated`
     - `user.deleted`
5. **Signing Secret** 복사
6. 프로젝트의 `.env.local` 파일에 추가:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

#### 로컬 개발 환경 (ngrok 사용):

```bash
# ngrok 설치 및 실행
ngrok http 3000

# ngrok에서 제공하는 URL을 Clerk webhook에 설정
# 예: https://abc123.ngrok.io/api/webhooks/clerk
```

### 2. 환경 변수 설정

`.env.local` 파일에 다음 변수가 설정되어 있어야 합니다:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # Webhook용 (선택사항)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Webhook용 (필수)
```

## 💻 사용 방법

### 방법 1: Webhook 사용 (자동)

Webhook이 설정되어 있으면 회원가입 시 자동으로 Supabase에 저장됩니다. 추가 작업이 필요 없습니다.

### 방법 2: 수동 동기화

특정 페이지에서 사용자 정보를 동기화하려면:

```tsx
import { SyncUserOnMount } from '@/app/components/SyncUserOnMount'

export default function MyPage() {
  return (
    <>
      <SyncUserOnMount />
      {/* 나머지 페이지 내용 */}
    </>
  )
}
```

또는 API를 직접 호출:

```typescript
const response = await fetch('/api/sync-user', {
  method: 'POST',
})
```

### 방법 3: 서버 사이드에서 동기화

서버 컴포넌트나 API 라우트에서:

```typescript
import { syncCurrentUser } from '@/lib/supabase/sync-user'

// 현재 사용자 동기화
const user = await syncCurrentUser()
```

## 🔍 사용자 정보 조회

Supabase에서 사용자 정보를 조회하려면:

```typescript
import { getUserByClerkId } from '@/lib/supabase/sync-user'
import { createAdminClient } from '@/lib/supabase/server'

// 방법 1: 유틸리티 함수 사용
const user = await getUserByClerkId('clerk_user_id_here')

// 방법 2: 직접 쿼리
const supabase = createAdminClient()
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('clerk_user_id', 'clerk_user_id_here')
  .single()
```

## ✅ 확인 방법

### 1. Supabase 대시보드에서 확인

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Table Editor** 메뉴로 이동
4. `users` 테이블 확인
5. 회원가입한 사용자 정보가 저장되어 있는지 확인

### 2. 코드에서 확인

```typescript
import { createAdminClient } from '@/lib/supabase/server'

const supabase = createAdminClient()
const { data, error } = await supabase
  .from('users')
  .select('*')

console.log('Users:', data)
```

## 🐛 문제 해결

### Webhook이 작동하지 않음

1. **CLERK_WEBHOOK_SECRET 확인**
   - `.env.local`에 올바른 secret이 설정되어 있는지 확인
   - Clerk 대시보드에서 webhook의 Signing Secret 확인

2. **Webhook URL 확인**
   - 프로덕션: `https://your-domain.com/api/webhooks/clerk`
   - 로컬 개발: ngrok URL 사용

3. **Clerk 대시보드에서 이벤트 확인**
   - Webhooks → Endpoints → 해당 webhook 클릭
   - Recent deliveries에서 실패한 요청 확인

### 사용자 정보가 동기화되지 않음

1. **환경 변수 확인**
   ```bash
   # .env.local 파일 확인
   cat .env.local
   ```

2. **Supabase 연결 확인**
   ```typescript
   import { createAdminClient } from '@/lib/supabase/server'
   
   const supabase = createAdminClient()
   const { data, error } = await supabase.from('users').select('*')
   console.log('Error:', error)
   ```

3. **수동 동기화 시도**
   - `/api/sync-user` API를 직접 호출하여 테스트
   - 브라우저 개발자 도구의 Network 탭에서 확인

### RLS (Row Level Security) 오류

현재 users 테이블의 RLS 정책은 모든 사용자가 조회/업데이트 가능하도록 설정되어 있습니다. 보안을 강화하려면:

```sql
-- 더 엄격한 RLS 정책 설정
DROP POLICY "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid()::text = clerk_user_id);
```

## 📚 관련 파일

- `app/api/webhooks/clerk/route.ts` - Clerk webhook 핸들러
- `app/api/sync-user/route.ts` - 수동 동기화 API
- `lib/supabase/sync-user.ts` - 동기화 유틸리티 함수
- `app/components/SyncUserOnMount.tsx` - 자동 동기화 컴포넌트

## 🔐 보안 고려사항

1. **Service Role Key 보호**
   - `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트 코드에 노출하지 마세요
   - 서버 사이드에서만 사용하세요

2. **Webhook Secret 보호**
   - `CLERK_WEBHOOK_SECRET`는 환경 변수로만 관리하세요
   - Git에 커밋하지 마세요

3. **RLS 정책**
   - 프로덕션 환경에서는 더 엄격한 RLS 정책을 설정하는 것을 권장합니다


