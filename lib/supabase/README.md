# Supabase 설정 가이드

이 디렉토리는 Supabase 데이터베이스와의 상호작용을 위한 클라이언트 및 유틸리티를 포함합니다.

## 📁 파일 구조

```
lib/supabase/
├── client.ts      # 브라우저 클라이언트 (클라이언트 컴포넌트용)
├── server.ts      # 서버 클라이언트 (서버 컴포넌트, API 라우트용)
├── env.ts         # 환경 변수 검증 유틸리티
├── errors.ts      # 커스텀 에러 클래스
├── types.ts       # 공통 타입 정의
├── utils.ts       # 유틸리티 함수 및 헬퍼
└── README.md      # 이 파일
```

## 🚀 빠른 시작

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

환경 변수는 Supabase 대시보드의 **Settings → API**에서 확인할 수 있습니다.

### 2. 클라이언트 컴포넌트에서 사용

```tsx
'use client'

import { supabase } from '@/lib/supabase/client'

export default function MyComponent() {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    console.log('Data:', data)
  }

  return <button onClick={fetchData}>Fetch Data</button>
}
```

### 3. 서버 컴포넌트에서 사용

```tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return <div>{JSON.stringify(data)}</div>
}
```

### 4. API 라우트에서 사용

```ts
// app/api/users/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}
```

### 5. 관리자 작업 (RLS 우회)

```ts
import { createAdminClient } from '@/lib/supabase/server'

// ⚠️ 주의: 이 클라이언트는 RLS를 우회합니다.
// 신뢰할 수 있는 서버 사이드 코드에서만 사용하세요.
const admin = createAdminClient()

const { data } = await admin
  .from('users')
  .select('*')
```

## 🔧 유틸리티 함수

### Clerk User ID로 쿼리

```ts
import { queryByClerkUserId } from '@/lib/supabase/utils'
import { supabase } from '@/lib/supabase/client'

const result = await queryByClerkUserId(
  supabase,
  clerkUserId,
  'user_profiles',
  (query) => query.select('*').eq('clerk_user_id', clerkUserId)
)

if (result.error) {
  console.error('Error:', result.error)
} else {
  console.log('Data:', result.data)
}
```

### 페이지네이션

```ts
import { applyPagination } from '@/lib/supabase/utils'

const query = supabase.from('users').select('*')
const paginatedQuery = applyPagination(query, {
  page: 1,
  pageSize: 10
})

const { data } = await paginatedQuery
```

### 정렬

```ts
import { applySort } from '@/lib/supabase/utils'

const query = supabase.from('users').select('*')
const sortedQuery = applySort(query, {
  column: 'created_at',
  ascending: false
})

const { data } = await sortedQuery
```

## 🛡️ 에러 핸들링

```ts
import { parseSupabaseError, SupabaseError } from '@/lib/supabase/errors'

try {
  const { data, error } = await supabase.from('users').select('*')
  
  if (error) {
    throw error
  }
} catch (error) {
  const supabaseError = parseSupabaseError(error)
  
  if (supabaseError instanceof SupabaseConnectionError) {
    console.error('Connection error:', supabaseError.message)
  } else if (supabaseError instanceof SupabaseQueryError) {
    console.error('Query error:', supabaseError.message)
  }
}
```

## 📝 TypeScript 타입 생성

데이터베이스 스키마가 변경되면 타입을 재생성하세요:

```bash
# Supabase CLI가 설치되어 있어야 합니다
pnpm supabase:types
```

생성된 타입은 `lib/supabase/database.types.ts`에 저장되며, `types.ts`에서 import하여 사용할 수 있습니다.

## 🔐 보안 베스트 프랙티스

1. **환경 변수 보호**
   - `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트 코드에 노출하지 마세요
   - `.env.local` 파일은 Git에 커밋하지 마세요

2. **Row Level Security (RLS)**
   - 가능한 한 RLS 정책을 사용하여 데이터 접근을 제한하세요
   - `createAdminClient()`는 꼭 필요한 경우에만 사용하세요

3. **에러 메시지**
   - 프로덕션에서는 상세한 에러 메시지를 사용자에게 노출하지 마세요
   - 로깅을 통해 내부적으로만 상세 정보를 기록하세요

## 🔗 Clerk와의 연동

Clerk 인증을 사용하는 경우, `clerk_user_id`를 기준으로 데이터를 조회할 수 있습니다:

```ts
import { queryByClerkUserId } from '@/lib/supabase/utils'
import { auth } from '@clerk/nextjs/server'

export async function getUserProfile() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }
  
  const result = await queryByClerkUserId(
    supabase,
    userId,
    'user_profiles',
    (query) => query.select('*').eq('clerk_user_id', userId).single()
  )
  
  return result.data
}
```

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js App Router 가이드](https://nextjs.org/docs/app)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## ❓ 문제 해결

### 환경 변수 에러

```
Missing required Supabase environment variables
```

**해결 방법:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 정확한지 확인
3. 개발 서버를 재시작

### 연결 에러

```
Failed to connect to Supabase
```

**해결 방법:**
1. 인터넷 연결 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. URL과 키가 올바른지 확인

### 타입 에러

TypeScript 타입 에러가 발생하면:

1. 타입을 재생성: `pnpm supabase:types`
2. TypeScript 서버 재시작
3. `types.ts`에서 `Database` 타입이 올바르게 import되었는지 확인

