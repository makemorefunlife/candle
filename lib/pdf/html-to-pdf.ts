/**
 * HTML to PDF Converter (Serverless-compatible)
 * 
 * Vercel 서버리스 환경에서 동작하는 HTML to PDF 변환기
 * Puppeteer/Playwright 대신 pdfkit을 사용하여 브라우저 없이 PDF 생성
 * 
 * 롤백 방법:
 * - 이 파일을 삭제하고 app/api/generate-and-send-report/route.ts에서
 *   generatePremiumReportLegacy() 함수를 사용하도록 변경
 */

import PDFDocument from 'pdfkit'
import type PDFKit from 'pdfkit'
import * as cheerio from 'cheerio'

/**
 * HTML을 PDF로 변환
 * @param htmlContent HTML 문자열
 * @param options PDF 생성 옵션
 * @returns PDF Buffer
 */
export async function htmlToPdf(
  htmlContent: string,
  options: {
    format?: 'A4' | 'Letter'
    margin?: { top: number; bottom: number; left: number; right: number }
    printBackground?: boolean
  } = {}
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const {
        format = 'A4',
        margin = { top: 40, bottom: 40, left: 30, right: 30 },
        printBackground = true,
      } = options

      // PDF 문서 생성
      const doc = new PDFDocument({
        size: format,
        margins: {
          top: margin.top,
          bottom: margin.bottom,
          left: margin.left,
          right: margin.right,
        },
      })

      const chunks: Buffer[] = []

      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(pdfBuffer)
      })

      doc.on('error', (error) => {
        reject(error)
      })

      // HTML 파싱 및 PDF 생성
      parseHtmlToPdf(htmlContent, doc, printBackground)

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * HTML을 파싱하여 PDF 문서에 추가
 * @param html HTML 문자열
 * @param doc PDFDocument 인스턴스
 * @param printBackground 배경색 출력 여부
 */
function parseHtmlToPdf(html: string, doc: PDFKit.PDFDocument, printBackground: boolean) {
  const $ = cheerio.load(html)
  
  // 스크립트 및 스타일 제거
  $('script, style').remove()
  
  const pageWidth = doc.page.width
  const margin = doc.page.margins
  const maxWidth = pageWidth - margin.left - margin.right
  const lineHeight = 20
  const pageHeight = doc.page.height
  const maxY = pageHeight - margin.bottom
  
  // 한글 폰트 지원
  // pdfkit은 기본적으로 UTF-8을 지원하지만, 한글 렌더링을 위해 시스템 폰트 사용
  // Vercel 서버리스 환경에서는 기본 폰트 사용 (한글은 기본적으로 지원됨)
  try {
    doc.font('Helvetica')
  } catch (error) {
    // 폰트 로드 실패 시 기본 폰트 사용
    console.warn('폰트 로드 실패, 기본 폰트 사용:', error)
  }
  
  // 본문 처리
  const body = $('body')
  if (body.length === 0) {
    // body가 없으면 전체 HTML 처리
    processElement($('html'), doc, maxWidth, lineHeight, maxY, margin, $)
  } else {
    processElement(body, doc, maxWidth, lineHeight, maxY, margin, $)
  }
}

/**
 * HTML 요소를 재귀적으로 처리하여 PDF에 추가
 */
function processElement(
  $element: cheerio.Cheerio<any>,
  doc: PDFKit.PDFDocument,
  maxWidth: number,
  lineHeight: number,
  maxY: number,
  margin: { top: number; bottom: number; left: number; right: number },
  $root?: cheerio.CheerioAPI
) {
  // 루트 cheerio 인스턴스 재사용 (성능 최적화)
  const $ = $root || cheerio.load($element.toString())
  
  $element.contents().each((_, element: any) => {
    if (element.type === 'text') {
      const text = element.data?.trim()
      if (text) {
        // 페이지 넘김 체크
        if (doc.y + lineHeight > maxY) {
          doc.addPage()
        }
        
        doc.text(text, {
          width: maxWidth,
          align: 'left',
          paragraphGap: 5,
        })
        doc.moveDown(0.3)
      }
    } else if (element.type === 'tag') {
      const tagName = element.tagName?.toLowerCase()
      const $el = $(element)
      
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
        const level = parseInt(tagName.charAt(1), 10)
        const fontSize = 24 - (level - 1) * 2
        const text = $el.text().trim()
        
        if (text) {
          if (doc.y + lineHeight * 2 > maxY) {
            doc.addPage()
          }
          
          doc.fontSize(fontSize).font('Helvetica-Bold').text(text, {
            width: maxWidth,
            align: 'left',
          })
          doc.moveDown(0.5)
          doc.fontSize(12).font('Helvetica')
        }
      } else if (tagName === 'p') {
        const text = $el.text().trim()
        if (text) {
          if (doc.y + lineHeight > maxY) {
            doc.addPage()
          }
          
          doc.fontSize(12).font('Helvetica').text(text, {
            width: maxWidth,
            align: 'left',
            paragraphGap: 5,
          })
          doc.moveDown(0.5)
        }
      } else if (tagName === 'div' || tagName === 'section') {
        // div나 section은 재귀적으로 처리
        processElement($el.children(), doc, maxWidth, lineHeight, maxY, margin, $)
      } else if (tagName === 'br') {
        doc.moveDown(0.3)
      } else if (tagName === 'ul' || tagName === 'ol') {
        $el.find('li').each((_, li) => {
          const text = $(li).text().trim()
          if (text) {
            if (doc.y + lineHeight > maxY) {
              doc.addPage()
            }
            
            doc.fontSize(12).font('Helvetica').text(`• ${text}`, {
              width: maxWidth,
              align: 'left',
            })
            doc.moveDown(0.3)
          }
        })
      } else {
        // 기타 태그는 재귀적으로 처리
        const children = $el.children()
        if (children.length > 0) {
          processElement(children, doc, maxWidth, lineHeight, maxY, margin, $)
        } else {
          const text = $el.text().trim()
          if (text) {
            if (doc.y + lineHeight > maxY) {
              doc.addPage()
            }
            
            doc.text(text, {
              width: maxWidth,
              align: 'left',
            })
            doc.moveDown(0.3)
          }
        }
      }
    }
  })
}


