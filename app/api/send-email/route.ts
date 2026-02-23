/**
 * 이메일 전송 API
 * 
 * nodemailer를 사용하여 이메일을 전송합니다.
 * 환경 변수에 SMTP 설정이 필요합니다.
 */

import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

// 이메일 전송 요청 타입
interface EmailRequest {
  to: string // 수신자 이메일 주소
  subject: string // 이메일 제목
  text?: string // 일반 텍스트 내용
  html?: string // HTML 내용
  attachments?: Array<{
    filename: string
    path?: string
    content?: string | Buffer
  }>
}

/**
 * nodemailer 전송기 생성
 * 환경 변수에서 SMTP 설정을 읽어옵니다.
 */
function createTransporter() {
  // 환경 변수 확인
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
    secure: parseInt(smtpPort, 10) === 465, // 465 포트는 SSL 사용
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    // Gmail 등 일부 서비스는 추가 설정이 필요할 수 있습니다
    ...(smtpHost.includes('gmail') && {
      service: 'gmail',
    }),
  })
}

/**
 * POST /api/send-email
 * 이메일을 전송합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json()

    // 필수 필드 검증
    if (!body.to || !body.subject) {
      return NextResponse.json(
        { error: '수신자(to)와 제목(subject)은 필수입니다.' },
        { status: 400 }
      )
    }

    // 텍스트 또는 HTML 내용이 있어야 합니다
    if (!body.text && !body.html) {
      return NextResponse.json(
        { error: '이메일 내용(text 또는 html)이 필요합니다.' },
        { status: 400 }
      )
    }

    // 전송기 생성
    const transporter = createTransporter()
    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER

    // 이메일 전송
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: body.to,
      subject: body.subject,
      text: body.text,
      html: body.html,
      attachments: body.attachments,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: '이메일이 성공적으로 전송되었습니다.',
    })
  } catch (error) {
    console.error('이메일 전송 오류:', error)

    // 에러 메시지 추출
    const errorMessage =
      error instanceof Error ? error.message : '이메일 전송에 실패했습니다.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/send-email
 * 이메일 설정 상태를 확인합니다. (개발/테스트용)
 */
export async function GET() {
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD

    const isConfigured = !!(smtpHost && smtpPort && smtpUser && smtpPassword)

    return NextResponse.json({
      configured: isConfigured,
      // 보안을 위해 실제 값은 반환하지 않습니다
      hasHost: !!smtpHost,
      hasPort: !!smtpPort,
      hasUser: !!smtpUser,
      hasPassword: !!smtpPassword,
    })
  } catch (error) {
    console.error('설정 확인 오류:', error)
    return NextResponse.json(
      { error: '설정 확인에 실패했습니다.' },
      { status: 500 }
    )
  }
}


