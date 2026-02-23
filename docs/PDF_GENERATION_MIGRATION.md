# PDF 생성 방식 마이그레이션 가이드

## 개요

Puppeteer/Playwright 기반 HTML→PDF 생성을 Vercel 서버리스 환경에서 동작하는 `pdfkit` 기반 방식으로 교체했습니다.

## 변경 사항

### NEW: 서버리스 호환 PDF 생성
- **파일**: `lib/pdf/html-to-pdf.ts`
- **라이브러리**: `pdfkit` + `cheerio`
- **장점**: 브라우저 없이 동작, Vercel 서버리스 환경에서 안정적
- **단점**: 복잡한 CSS/레이아웃 지원 제한적

### LEGACY: Puppeteer 기반 PDF 생성
- **위치**: `app/api/generate-and-send-report/route.ts` (주석 처리됨)
- **라이브러리**: `puppeteer`
- **상태**: 비활성화 (롤백용으로 보관)

## 롤백 방법

새 PDF 생성 방식에 문제가 발생한 경우:

1. `app/api/generate-and-send-report/route.ts` 파일 열기
2. `generatePremiumReport` 함수에서 새 PDF 생성 부분 주석 처리:
   ```typescript
   // NEW: pdfkit을 사용한 HTML to PDF 변환 부분 주석 처리
   // const pdfBuffer = await htmlToPdf(...)
   ```
3. `generatePremiumReportLegacy` 함수의 주석 해제
4. `generatePremiumReport` 함수에서 legacy 함수 호출:
   ```typescript
   return await generatePremiumReportLegacy(baziAnalysis, userMeta, template, filePath, fileName)
   ```
5. `puppeteer` import 주석 해제:
   ```typescript
   import puppeteer from 'puppeteer'
   ```

## 환경 변수

새 방식에서는 추가 환경 변수가 필요하지 않습니다.

Legacy 방식 사용 시:
- Puppeteer 관련 환경 변수 불필요 (Vercel에서는 제한적)

## 한글 폰트 지원

- **현재**: 기본 Helvetica 폰트 사용 (한글 기본 지원)
- **향후 개선**: 한글 폰트 파일 추가 가능 (Noto Sans KR 등)

## 알려진 제한사항

1. **복잡한 CSS**: 일부 CSS 스타일이 제대로 렌더링되지 않을 수 있음
2. **이미지**: 인라인 이미지 지원 제한적
3. **레이아웃**: Flexbox/Grid 레이아웃은 텍스트로 변환됨

## 테스트

로컬 빌드 테스트:
```bash
pnpm run build
```

Vercel 배포 후 API 테스트:
```bash
curl -X POST http://your-domain/api/generate-and-send-report \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "baziAnalysis": {...}, "userMeta": {...}}'
```

