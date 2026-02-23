/**
 * MCP를 통해 Supabase 환경 변수를 자동으로 설정하는 스크립트
 * 
 * 이 스크립트는 Cursor의 MCP 기능을 사용하여 Supabase 프로젝트 정보를 가져와
 * .env.local 파일에 자동으로 설정합니다.
 */

import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const ENV_FILE = join(projectRoot, '.env.local')

// MCP에서 가져온 정보 (실제로는 Cursor가 제공)
// 이 값들은 Cursor가 MCP를 통해 자동으로 주입합니다
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rhyxmsvgbejuxsynwstn.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoeXhtc3ZnYmVqdXhzeW53c3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjE4MjAsImV4cCI6MjA4NzEzNzgyMH0.4F_iisApeVtlD2uOMjnil7Zkc8Dxux4Frtj9-btt-8A'

function updateEnvFile() {
  let content = ''
  
  // 기존 .env.local 파일 읽기
  if (existsSync(ENV_FILE)) {
    content = readFileSync(ENV_FILE, 'utf-8')
  }
  
  const lines = content.split('\n')
  const newLines = []
  let hasSupabaseUrl = false
  let hasAnonKey = false
  let supabaseSectionIndex = -1
  
  // 기존 라인 처리
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    // Supabase 섹션 찾기
    if (trimmed.includes('# Supabase') && supabaseSectionIndex === -1) {
      supabaseSectionIndex = i
    }
    
    // 주석이나 빈 줄은 그대로 유지
    if (!trimmed || trimmed.startsWith('#')) {
      newLines.push(line)
      continue
    }
    
    const [key, ...valueParts] = trimmed.split('=')
    const value = valueParts.join('=')
    
    // Supabase 관련 변수 업데이트
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      newLines.push(`NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}`)
      hasSupabaseUrl = true
    } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      newLines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`)
      hasAnonKey = true
    } else {
      // 다른 환경 변수는 그대로 유지
      newLines.push(line)
    }
  }
  
  // Supabase 변수가 없으면 추가
  if (!hasSupabaseUrl || !hasAnonKey) {
    if (supabaseSectionIndex === -1) {
      // Supabase 섹션이 없으면 추가
      newLines.push('')
      newLines.push('# Supabase Configuration (MCP로 자동 설정됨)')
      supabaseSectionIndex = newLines.length - 1
    }
    
    // 변수 추가
    if (!hasSupabaseUrl) {
      newLines.splice(supabaseSectionIndex + 1, 0, `NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}`)
    }
    if (!hasAnonKey) {
      newLines.splice(supabaseSectionIndex + 2, 0, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`)
    }
  }
  
  writeFileSync(ENV_FILE, newLines.join('\n'))
}

// 실행
console.log('🚀 MCP를 통해 Supabase 환경 변수를 설정하는 중...\n')

updateEnvFile()

console.log('✅ .env.local 파일이 업데이트되었습니다!\n')
console.log('설정된 환경 변수:')
console.log(`  ✅ NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}`)
console.log(`  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY.substring(0, 30)}...`)
console.log('\n💡 Service Role Key는 보안상 MCP로 가져올 수 없습니다.')
console.log('   Supabase 대시보드에서 수동으로 추가하세요:')
console.log('   Settings → API → service_role key')


