# MCP를 사용한 Supabase 환경 변수 자동 설정

Cursor의 MCP(Model Context Protocol) 기능을 사용하면 Supabase 환경 변수를 자동으로 설정할 수 있습니다! 🎉

## 🚀 빠른 시작

### 방법 1: Cursor가 자동으로 설정 (가장 쉬움)

Cursor가 MCP를 통해 Supabase 프로젝트 정보를 가져와서 자동으로 `.env.local` 파일을 업데이트합니다.

**현재 MCP에서 가져온 정보:**
- ✅ 프로젝트 URL: `https://rhyxmsvgbejuxsynwstn.supabase.co`
- ✅ Anon Key: 자동으로 설정됨

### 방법 2: 수동으로 스크립트 실행

```bash
pnpm supabase:env:mcp
```

이 명령어를 실행하면 MCP를 통해 가져온 정보로 `.env.local` 파일이 자동으로 업데이트됩니다.

## 📋 설정되는 환경 변수

MCP를 통해 다음 환경 변수가 자동으로 설정됩니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rhyxmsvgbejuxsynwstn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚠️ Service Role Key는 수동 설정 필요

보안상의 이유로 `SUPABASE_SERVICE_ROLE_KEY`는 MCP를 통해 가져올 수 없습니다. 수동으로 설정해야 합니다:

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings → API** 메뉴로 이동
4. `service_role` 키를 복사
5. `.env.local` 파일에 추가:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🔄 환경 변수 업데이트

MCP를 통해 환경 변수를 다시 설정하려면:

```bash
pnpm supabase:env:mcp
```

또는 Cursor에서 MCP 기능을 다시 사용하면 자동으로 업데이트됩니다.

## ✅ 확인 방법

환경 변수가 제대로 설정되었는지 확인:

```bash
# 개발 서버 실행 (환경 변수 오류가 있으면 여기서 확인됨)
pnpm run dev
```

또는 코드에서 확인:

```typescript
import { validateClientEnv } from '@/lib/supabase/env'

// 환경 변수 검증
validateClientEnv() // 에러가 없으면 정상
```

## 🆚 MCP vs CLI 비교

| 기능 | MCP (Cursor) | Supabase CLI |
|------|-------------|--------------|
| 설치 필요 | ❌ 없음 | ✅ 필요 |
| 자동 설정 | ✅ 가능 | ⚠️ 스크립트 필요 |
| 프로젝트 연결 | ✅ 자동 | ⚠️ 수동 연결 필요 |
| Service Role Key | ❌ 보안상 불가 | ✅ 가능 |

**추천**: MCP를 사용하는 것이 가장 간단합니다!

## 📚 관련 문서

- [Supabase MCP 설정 가이드](CLI_SETUP.md)
- [Supabase 사용 가이드](README.md)


