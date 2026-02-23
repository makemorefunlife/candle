# Supabase CLI로 환경 변수 자동 설정하기

Supabase CLI를 사용하면 환경 변수를 수동으로 복사-붙여넣기 할 필요 없이 자동으로 설정할 수 있습니다.

## 🚀 빠른 시작

### 방법 1: Supabase CLI 사용 (추천)

#### 1단계: Supabase CLI 설치

```bash
# npm으로 설치
npm install -g supabase

# 또는 pnpm으로 설치
pnpm add -g supabase
```

#### 2단계: Supabase에 로그인

```bash
supabase login
```

브라우저가 열리면 Supabase 계정으로 로그인하세요.

#### 3단계: 프로젝트 연결

```bash
# 프로젝트 참조 ID 확인 (Supabase 대시보드 URL에서 확인)
# 예: https://app.supabase.com/project/abcdefghijklmnop
# 여기서 "abcdefghijklmnop"가 프로젝트 참조 ID입니다

pnpm supabase:link <your-project-ref>
```

또는 직접 명령어 실행:

```bash
supabase link --project-ref <your-project-ref>
```

#### 4단계: 환경 변수 자동 설정

```bash
pnpm supabase:env
```

이 명령어를 실행하면 `.env.local` 파일에 Supabase 환경 변수가 자동으로 추가됩니다!

### 방법 2: 수동 설정 (CLI 없이)

Supabase CLI를 사용하지 않으려면:

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings → API** 메뉴로 이동
4. 다음 값들을 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY` (선택사항)
5. 프로젝트 루트에 `.env.local` 파일 생성하고 붙여넣기

## 📋 사용 가능한 명령어

프로젝트에 다음 스크립트들이 추가되어 있습니다:

```bash
# 환경 변수 자동 설정
pnpm supabase:env

# 프로젝트 연결
pnpm supabase:link <project-ref>

# Supabase 상태 확인 (로컬 개발 환경)
pnpm supabase:status

# TypeScript 타입 생성
pnpm supabase:types
```

## 🔍 환경 변수 확인

설정이 제대로 되었는지 확인하려면:

```bash
# Supabase 상태 확인
pnpm supabase:status

# 또는 직접 확인
supabase status
```

## ⚠️ 주의사항

1. **`.env.local` 파일은 Git에 커밋하지 마세요**
   - 이미 `.gitignore`에 포함되어 있습니다

2. **Service Role Key 보안**
   - `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트 코드에 노출하지 마세요
   - 서버 사이드에서만 사용하세요

3. **프로덕션 환경**
   - Vercel, Netlify 등 배포 플랫폼에서는 환경 변수를 플랫폼 설정에서 직접 입력해야 합니다
   - CLI는 로컬 개발 환경에서만 사용됩니다

## 🐛 문제 해결

### "supabase: command not found"

Supabase CLI가 설치되지 않았습니다:

```bash
npm install -g supabase
```

### "Project not linked"

프로젝트가 연결되지 않았습니다:

```bash
supabase link --project-ref <your-project-ref>
```

### 환경 변수가 설정되지 않음

1. Supabase CLI가 올바르게 설치되었는지 확인:
   ```bash
   supabase --version
   ```

2. 프로젝트가 연결되었는지 확인:
   ```bash
   supabase projects list
   ```

3. 수동으로 `.env.local` 파일을 확인하고 환경 변수가 올바른지 확인

## 📚 추가 리소스

- [Supabase CLI 공식 문서](https://supabase.com/docs/reference/cli)
- [Supabase 환경 변수 가이드](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)


