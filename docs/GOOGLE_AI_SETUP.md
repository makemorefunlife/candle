# Google AI Studio API 설정 가이드

이 문서는 OpenAI API 대신 Google AI Studio (Gemini) API를 사용하기 위한 설정 방법을 설명합니다.

## 개요

프리미엄 리포트 생성 시 Google AI Studio의 Gemini 모델을 사용할 수 있습니다.
`GOOGLE_AI_API_KEY`가 설정되어 있으면 Google AI를 사용하고, 없으면 기존 OpenAI를 사용합니다 (하위 호환성).

## 필요한 환경 변수

`.env` 파일에 다음 환경 변수를 추가하세요:

```bash
# Google AI Studio API 키
# Google AI Studio (https://aistudio.google.com/)에서 API 키 생성
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## Google AI Studio API 키 생성 방법

### 1. Google AI Studio 접속

1. [Google AI Studio](https://aistudio.google.com/)에 접속합니다.
2. Google 계정으로 로그인합니다.

### 2. API 키 생성

1. 왼쪽 메뉴에서 **Get API key** 클릭
2. **Create API key** 버튼 클릭
3. Google Cloud 프로젝트 선택 (없으면 새로 생성)
4. 생성된 API 키를 복사합니다

### 3. API 키 설정

`.env` 파일에 복사한 API 키를 붙여넣습니다:

```bash
GOOGLE_AI_API_KEY=AIzaSy...  # 실제 API 키로 변경
```

## 사용 모델

현재 설정된 모델:
- **Google AI**: `gemini-1.5-pro`
- **OpenAI** (대체): `gpt-4o`

## 우선순위

1. `GOOGLE_AI_API_KEY`가 설정되어 있으면 → Google AI (Gemini) 사용
2. `GOOGLE_AI_API_KEY`가 없고 `OPENAI_API_KEY`가 있으면 → OpenAI 사용
3. 둘 다 없으면 → 오류 발생

## 테스트

환경 변수를 설정한 후:

1. 개발 서버를 재시작합니다:
   ```bash
   pnpm run dev
   ```

2. Blueprint 페이지에서 리포트를 생성해봅니다.

3. 콘솔 로그에서 어떤 AI를 사용하는지 확인할 수 있습니다.

## 문제 해결

### API 키 오류가 발생하는 경우

1. API 키가 올바르게 설정되었는지 확인하세요.
2. `.env` 파일이 프로젝트 루트에 있는지 확인하세요.
3. 개발 서버를 재시작했는지 확인하세요.
4. Google AI Studio에서 API 키가 활성화되어 있는지 확인하세요.

### JSON 파싱 오류가 발생하는 경우

Google AI는 때때로 JSON 형식이 아닌 응답을 반환할 수 있습니다. 
이 경우 코드에서 자동으로 처리하지만, 문제가 지속되면 프롬프트를 조정해야 할 수 있습니다.

## 참고 자료

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API 문서](https://ai.google.dev/docs)
- [@google/generative-ai 패키지](https://www.npmjs.com/package/@google/generative-ai)


