/**
 * PDF 리포트 생성 및 이메일 전송 API
 * 
 * 1. 프리미엄 리포트 PDF 생성
 * 2. 생성된 PDF를 이메일로 전송
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { GoogleGenerativeAI } from '@google/generative-ai'
// NEW: 서버리스 호환 PDF 생성 라이브러리
import { htmlToPdf } from '@/lib/pdf/html-to-pdf'
// LEGACY: Puppeteer (롤백용, 비활성화)
// import puppeteer from 'puppeteer'

/**
 * Paddle Checkout URL 생성 함수
 * Paddle API를 사용하여 transaction을 생성하고 checkout URL을 반환합니다.
 */
async function createPaddleCheckoutUrl(email: string, userMeta: any): Promise<string | null> {
  try {
    // Paddle API 키와 Price ID가 설정되어 있는지 확인
    const paddleApiKey = process.env.PADDLE_API_KEY
    const paddlePriceId = process.env.PADDLE_PRICE_ID
    const paddleCheckoutUrl = process.env.PADDLE_CHECKOUT_URL || process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_URL

    // 환경 변수가 설정되지 않은 경우 null 반환 (결제 버튼 없이 진행)
    if (!paddleApiKey || !paddlePriceId) {
      console.warn('Paddle 환경 변수가 설정되지 않았습니다. 결제 버튼이 포함되지 않습니다.')
      return null
    }

    // Paddle API v2를 사용하여 transaction 생성
    // Sandbox 환경인지 확인 (API 키가 test_ 또는 pdl_sdbx_로 시작하거나 PADDLE_SANDBOX=true)
    const isSandbox = 
      paddleApiKey.startsWith('test_') || 
      paddleApiKey.startsWith('pdl_sdbx_') || 
      process.env.PADDLE_SANDBOX === 'true'
    const apiUrl = isSandbox 
      ? (process.env.PADDLE_API_URL || 'https://sandbox-api.paddle.com')
      : (process.env.PADDLE_API_URL || 'https://api.paddle.com')
    // Transaction 생성 시 checkout URL 명시 (기본 URL이 없을 경우 대비)
    const transactionBody: any = {
      items: [
        {
          price_id: paddlePriceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      custom_data: {
        user_name: userMeta?.name || 'User',
        report_type: 'premium',
      },
      collection_mode: 'automatic',
    }

    // Checkout URL이 있으면 transaction 생성 시 포함
    if (paddleCheckoutUrl) {
      transactionBody.checkout = {
        url: paddleCheckoutUrl,
      }
    }

    const response = await fetch(`${apiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
        'Paddle-Version': '1',
      },
      body: JSON.stringify(transactionBody),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Paddle transaction 생성 실패:', errorData)
      
      // 실패 시 대체 방법: Price ID를 사용한 직접 checkout URL 생성
      // Sandbox 환경인지 확인
      const checkoutBaseUrl = isSandbox 
        ? 'https://sandbox-checkout.paddle.com'
        : 'https://checkout.paddle.com'
      
      // 기본 checkout URL이 있으면 사용
      if (paddleCheckoutUrl) {
        return paddleCheckoutUrl
      }
      
      // Price ID를 사용한 직접 링크 생성 (간단한 방법)
      // 형식: https://checkout.paddle.com/product/{price_id}
      const directCheckoutUrl = `${checkoutBaseUrl}/product/${paddlePriceId}`
      console.log('Transaction 생성 실패, 직접 checkout URL 사용:', directCheckoutUrl)
      return directCheckoutUrl
    }

    const transactionData = await response.json()
    
    // Checkout URL 반환 (Paddle API 응답 구조에 따라 다를 수 있음)
    if (transactionData.data?.checkout?.url) {
      return transactionData.data.checkout.url
    }
    
    if (transactionData.checkout?.url) {
      return transactionData.checkout.url
    }

    // Transaction ID가 있으면 기본 checkout URL과 조합
    const transactionId = transactionData.data?.id || transactionData.id
    if (paddleCheckoutUrl && transactionId) {
      return `${paddleCheckoutUrl}?_ptxn=${transactionId}`
    }

    // 기본 checkout URL만 있는 경우
    if (paddleCheckoutUrl) {
      return paddleCheckoutUrl
    }

    return null
  } catch (error) {
    console.error('Paddle checkout URL 생성 오류:', error)
    // 오류가 발생해도 기본 checkout URL이 있으면 사용
    const paddleCheckoutUrl = process.env.PADDLE_CHECKOUT_URL || process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_URL
    return paddleCheckoutUrl || null
  }
}

// Google AI 클라이언트 초기화
// GOOGLE_AI_API_KEY가 있으면 Google AI 사용, 없으면 OpenAI 사용 (하위 호환성)
const googleAiApiKey = process.env.GOOGLE_AI_API_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

const genAI = googleAiApiKey ? new GoogleGenerativeAI(googleAiApiKey) : null

// ============================================================================
// NEW: 서버리스 호환 PDF 생성 함수 (pdfkit 사용)
// ============================================================================
async function generatePremiumReport(baziAnalysis: any, userMeta: any) {
  try {
    // 경로 설정
    const PROMPT_PATH = path.join(process.cwd(), 'prompts', 'B2_PREMIUM_FULL_REPORT_PROMPT.md')
    const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'REPORT_TEMPLATE.html')
    const OUTPUT_DIR = path.join(process.cwd(), 'reports')

    // STEP 1: Load Prompt
    const SYSTEM_PROMPT = fs.readFileSync(PROMPT_PATH, 'utf-8')

    // STEP 2: Call AI (Google AI 또는 OpenAI)
    let reportData: any = {}

    if (genAI) {
      // Google AI Studio (Gemini) 사용
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      })

      const userPrompt = `Please analyze the following data and return the result as a JSON object. ${JSON.stringify({
        analysis: baziAnalysis.promptInput,
        user: userMeta,
      })}`

      const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`

      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const text = response.text()
      
      reportData = JSON.parse(text || '{}')
    } else if (openaiApiKey) {
      // OpenAI 사용 (하위 호환성)
      const { default: OpenAI } = await import('openai')
      const openai = new OpenAI({
        apiKey: openaiApiKey,
      })

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Please analyze the following data and return the result as a JSON object. ${JSON.stringify({
              analysis: baziAnalysis.promptInput,
              user: userMeta,
            })}`,
          },
        ],
        response_format: {
          type: 'json_object',
        },
      })

      reportData = JSON.parse(completion.choices[0].message.content || '{}')
    } else {
      throw new Error('AI API 키가 설정되지 않았습니다. GOOGLE_AI_API_KEY 또는 OPENAI_API_KEY를 설정해주세요.')
    }

    // STEP 3: Load HTML Template
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8')

    // STEP 4: Inject Text Content
    template = template
      .replace('{{CORE_ENGINE}}', reportData.core_engine || '')
      .replace('{{DECISION_OS}}', reportData.decision_os || '')
      .replace('{{PRESSURE_PATTERN}}', reportData.pressure_pattern || '')
      .replace('{{UNFAIR_ADVANTAGE}}', reportData.unfair_advantage || '')
      .replace('{{BLIND_SPOT}}', reportData.blind_spot || '')
      .replace('{{COMPOUNDING_STRATEGY}}', reportData.compounding_strategy || '')

    // STEP 5: Inject Visual Components
    template = template
      .replace('{{BENTO_GRID}}', generateBentoHTML(reportData.bento || {}))
      .replace('{{ENERGY_CHART}}', generateEnergyChart(reportData.energy_chart || {}))

    // STEP 6: Generate PDF (NEW: 서버리스 호환 방식)
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    const fileName = `report_${Date.now()}.pdf`
    const filePath = path.join(OUTPUT_DIR, fileName)

    try {
      // NEW: pdfkit을 사용한 HTML to PDF 변환 (브라우저 없이 동작)
      const pdfBuffer = await htmlToPdf(template, {
        format: 'A4',
        printBackground: true,
        margin: {
          top: 40,
          bottom: 40,
          left: 30,
          right: 30,
        },
      })

      // PDF 버퍼를 파일로 저장
      fs.writeFileSync(filePath, pdfBuffer)

      return {
        success: true,
        filePath,
        fileName,
      }
    } catch (pdfError) {
      console.error('PDF 생성 오류 (새 방식):', pdfError)
      // 새 방식 실패 시 legacy 방식으로 폴백 (선택사항)
      // return await generatePremiumReportLegacy(baziAnalysis, userMeta, template, filePath, fileName)
      throw pdfError
    }
  } catch (error) {
    console.error('PDF 생성 오류:', error)
    return {
      success: false,
      error: 'PREMIUM_REPORT_FAILED',
    }
  }
}

// ============================================================================
// LEGACY: Puppeteer 기반 PDF 생성 함수 (롤백용)
// ============================================================================
// 롤백 방법:
// 1. 위의 generatePremiumReport 함수에서 새 PDF 생성 부분을 주석 처리
// 2. 아래 generatePremiumReportLegacy 함수의 주석을 해제
// 3. route.ts에서 generatePremiumReportLegacy를 호출하도록 변경
// ============================================================================
/*
async function generatePremiumReportLegacy(
  baziAnalysis: any,
  userMeta: any,
  template: string,
  filePath: string,
  fileName: string
) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(template, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '40px',
        bottom: '40px',
        left: '30px',
        right: '30px',
      },
    })
    await browser.close()

    return {
      success: true,
      filePath,
      fileName,
    }
  } catch (error) {
    console.error('PDF 생성 오류 (Legacy):', error)
    return {
      success: false,
      error: 'PREMIUM_REPORT_FAILED',
    }
  }
}
*/

// Bento Grid HTML 생성
function generateBentoHTML(bento: any) {
  return `
<div class="bento">
<div class="bento-item large">
${bento.identity || ''}
</div>
<div class="bento-item">
${bento.decision || ''}
</div>
<div class="bento-item">
${bento.execution || ''}
</div>
<div class="bento-item">
${bento.wealth || ''}
</div>
</div>
`
}

// Energy Chart HTML 생성
function generateEnergyChart(chart: any) {
  return `
<div class="chart">
<img src="${chart.url || ''}" style="width:100%"/>
</div>
`
}

// nodemailer 전송기 생성
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const smtpFrom = process.env.SMTP_FROM || smtpUser

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    throw new Error('SMTP 설정이 완료되지 않았습니다. 환경 변수를 확인해주세요.')
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    ...(smtpHost.includes('gmail') && {
      service: 'gmail',
    }),
  })
}

/**
 * POST /api/generate-and-send-report
 * 프리미엄 리포트를 생성하고 이메일로 전송합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, baziAnalysis, userMeta } = body

    // 필수 필드 검증
    if (!email) {
      return NextResponse.json(
        { error: '이메일 주소가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!baziAnalysis) {
      return NextResponse.json(
        { error: '분석 데이터가 필요합니다.' },
        { status: 400 }
      )
    }

    // 이메일 유효성 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400 }
      )
    }

    // baziAnalysis에 promptInput이 없으면 추가
    // sessionStorage에서 가져온 데이터는 promptInput이 없을 수 있음
    let processedBaziAnalysis = baziAnalysis
    if (!processedBaziAnalysis.promptInput) {
      // promptInput 구조 생성
      processedBaziAnalysis = {
        ...processedBaziAnalysis,
        promptInput: {
          pillars: processedBaziAnalysis.pillars || [],
          dayMaster: processedBaziAnalysis.dayMaster || {},
          daewoon: processedBaziAnalysis.daewoon || [],
          relations: processedBaziAnalysis.relations || {},
          specialSals: processedBaziAnalysis.specialSals || {},
          strategicProfile: {
            core_identity: processedBaziAnalysis.dayMaster?.stem || '',
            decision_style: '',
            risk_profile: '',
            execution_mode: '',
            energy_pattern: {}
          },
          userMeta: userMeta || {}
        }
      }
    }

    // PDF 생성
    console.log('PDF 생성 시작...')
    
    // B2_REPORT_GENERATOR 로직을 직접 구현 (Turbopack 호환성)
    const pdfResult = await generatePremiumReport(processedBaziAnalysis, userMeta)

    if (!pdfResult.success) {
      return NextResponse.json(
        { error: pdfResult.error || 'PDF 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    // PDF 파일 읽기
    if (!pdfResult.filePath) {
      return NextResponse.json(
        { error: 'PDF 파일 경로를 찾을 수 없습니다.' },
        { status: 500 }
      )
    }
    const pdfBuffer = fs.readFileSync(pdfResult.filePath)
    const pdfFileName = pdfResult.fileName || 'Executive_Career_Report.pdf'

    // Paddle Checkout URL 생성
    console.log('Paddle checkout URL 생성 중...')
    const paddleCheckoutUrl = await createPaddleCheckoutUrl(email, userMeta)

    // 이메일 전송
    console.log('이메일 전송 시작...')
    const transporter = createTransporter()
    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER

    // Paddle 결제 버튼 HTML 생성
    const paymentButtonHtml = paddleCheckoutUrl
      ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paddleCheckoutUrl}" 
                 style="display: inline-block; 
                        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;">
                프리미엄 리포트 구매하기
              </a>
            </div>
            <p style="text-align: center; color: #64748b; font-size: 14px; margin-top: 10px;">
              위 버튼을 클릭하여 안전하게 결제하고 프리미엄 리포트를 받아보세요.
            </p>
          `
      : ''

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #334155;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Your Executive Career Intelligence Report</h1>
          </div>
          <div class="content">
            <p>안녕하세요 ${userMeta?.name || '고객'}님,</p>
            <p>프리미엄 경력 인텔리전스 리포트가 준비되었습니다.</p>
            <p>이 리포트는 귀하의 행동 패턴과 시간적 기준 데이터를 동기화하여 생성된 종합적인 전략 분석입니다.</p>
            <p>다음 내용이 포함되어 있습니다:</p>
            <ul>
              <li>Executive System Overview</li>
              <li>Your Unfair Advantage</li>
              <li>Decision OS</li>
              <li>Role Fit & Positioning</li>
              <li>Wealth & Compounding Strategy</li>
              <li>Timing & Career Transition Windows</li>
              <li>Pressure Pattern & Failure Mode</li>
              <li>Energy Curve & Sustainability</li>
              <li>Relationship & Collaboration Map</li>
              <li>10-Year Strategic Trajectory</li>
            </ul>
            <p>첨부된 PDF 파일을 확인해주세요.</p>
            <p>이 리포트를 신중히 검토하시면 다음 경력 결정에 도움이 될 것입니다.</p>
            ${paymentButtonHtml}
            <div class="footer">
              <p>Career Intelligence Team</p>
              <p>이 이메일은 자동으로 전송되었습니다.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
안녕하세요 ${userMeta?.name || '고객'}님,

프리미엄 경력 인텔리전스 리포트가 준비되었습니다.

이 리포트는 귀하의 행동 패턴과 시간적 기준 데이터를 동기화하여 생성된 종합적인 전략 분석입니다.

다음 내용이 포함되어 있습니다:
- Executive System Overview
- Your Unfair Advantage
- Decision OS
- Role Fit & Positioning
- Wealth & Compounding Strategy
- Timing & Career Transition Windows
- Pressure Pattern & Failure Mode
- Energy Curve & Sustainability
- Relationship & Collaboration Map
- 10-Year Strategic Trajectory

첨부된 PDF 파일을 확인해주세요.

이 리포트를 신중히 검토하시면 다음 경력 결정에 도움이 될 것입니다.

Career Intelligence Team
    `

    const info = await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: 'Your Executive Career Intelligence Report is Ready',
      text: emailText,
      html: emailHtml,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer,
        },
      ],
    })

    // 임시 파일 삭제 (선택사항 - 파일을 보관하려면 주석 처리)
    // fs.unlinkSync(pdfResult.filePath)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: '리포트가 성공적으로 생성되어 이메일로 전송되었습니다.',
    })
  } catch (error) {
    console.error('리포트 생성 및 전송 오류:', error)

    const errorMessage =
      error instanceof Error ? error.message : '리포트 생성 및 전송에 실패했습니다.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

