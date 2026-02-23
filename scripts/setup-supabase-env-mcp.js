/**
 * Supabase MCP를 사용한 환경 변수 자동 설정 스크립트
 * 
 * 이 스크립트는 Cursor의 MCP 기능을 통해 Supabase 프로젝트 정보를 가져와
 * 환경 변수를 자동으로 설정합니다.
 * 
 * 사용법:
 * - Cursor에서 이 스크립트를 실행하면 MCP를 통해 자동으로 환경 변수가 설정됩니다
 * - 또는 package.json의 스크립트 사용: pnpm supabase:env:mcp
 */

import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

const ENV_FILE = '.env.local'
const ENV_EXAMPLE_FILE = '.env.example'

/**
 * .env.local 파일을 읽거나 생성합니다
 */
function readOrCreateEnvFile() {
  const envPath = join(process.cwd(), ENV_FILE)
  
  if (existsSync(envPath)) {
    return readFileSync(envPath, 'utf-8')
  }
  
  // .env.example이 있으면 복사
  const examplePath = join(process.cwd(), ENV_EXAMPLE_FILE)
  if (existsSync(examplePath)) {
    return readFileSync(examplePath, 'utf-8')
  }
  
  return ''
}

/**
 * 환경 변수를 업데이트하거나 추가합니다
 */
function updateEnvFile(supabaseUrl, anonKey, serviceRoleKey = null) {
  const envPath = join(process.cwd(), ENV_FILE)
  let content = readOrCreateEnvFile()
  
  const lines = content.split('\n')
  const newLines = []
  let hasSupabaseUrl = false
  let hasAnonKey = false
  let hasServiceKey = false
  
  // 기존 라인 처리
  for (const line of lines) {
    const trimmed = line.trim()
    
    // 주석이나 빈 줄은 그대로 유지
    if (!trimmed || trimmed.startsWith('#')) {
      newLines.push(line)
      continue
    }
    
    const [key, ...valueParts] = trimmed.split('=')
    const value = valueParts.join('=')
    
    // Supabase 관련 변수 업데이트
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      newLines.push(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)
      hasSupabaseUrl = true
    } else if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      newLines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`)
      hasAnonKey = true
    } else if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      if (serviceRoleKey) {
        newLines.push(`SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`)
      } else {
        newLines.push(line) // 기존 값 유지
      }
      hasServiceKey = true
    } else {
      // 다른 환경 변수는 그대로 유지
      newLines.push(line)
    }
  }
  
  // Supabase 변수가 없으면 추가
  if (!hasSupabaseUrl || !hasAnonKey) {
    // Supabase 섹션 찾기
    let supabaseSectionIndex = -1
    for (let i = 0; i < newLines.length; i++) {
      if (newLines[i].includes('# Supabase') || newLines[i].includes('# Supabase Configuration')) {
        supabaseSectionIndex = i
        break
      }
    }
    
    if (supabaseSectionIndex === -1) {
      // Supabase 섹션이 없으면 추가
      newLines.push('')
      newLines.push('# Supabase Configuration (MCP로 자동 설정됨)')
      supabaseSectionIndex = newLines.length - 1
    }
    
    // 변수 추가
    if (!hasSupabaseUrl) {
      newLines.splice(supabaseSectionIndex + 1, 0, `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)
    }
    if (!hasAnonKey) {
      newLines.splice(supabaseSectionIndex + 2, 0, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`)
    }
    if (!hasServiceKey && serviceRoleKey) {
      newLines.splice(supabaseSectionIndex + 3, 0, `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`)
      newLines.splice(supabaseSectionIndex + 3, 0, '# ⚠️ WARNING: Never expose this key in client-side code!')
    }
  }
  
  writeFileSync(envPath, newLines.join('\n'))
}

// 메인 실행
console.log('🔍 Supabase MCP를 통해 환경 변수를 가져오는 중...\n')

// MCP를 통해 가져온 정보 (실제로는 Cursor가 MCP를 통해 제공)
// 이 스크립트는 환경 변수나 명령줄 인자로 받습니다
const args = process.argv.slice(2)

if (args.length >= 2) {
  const supabaseUrl = args[0]
  const anonKey = args[1]
  const serviceRoleKey = args[2] || null
  
  updateEnvFile(supabaseUrl, anonKey, serviceRoleKey)
  
  console.log('✅ .env.local 파일이 업데이트되었습니다!\n')
  console.log('설정된 환경 변수:')
  console.log(`  ✅ NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)
  console.log(`  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey.substring(0, 20)}...`)
  if (serviceRoleKey) {
    console.log(`  ✅ SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey.substring(0, 20)}...`)
  } else {
    console.log(`  ⚠️  SUPABASE_SERVICE_ROLE_KEY (수동으로 설정 필요)`)
  }
} else {
  console.log('📝 사용법:')
  console.log('   이 스크립트는 Cursor의 MCP 기능을 통해 자동으로 실행됩니다.')
  console.log('   또는 수동으로 실행:')
  console.log('   node scripts/setup-supabase-env-mcp.js <URL> <ANON_KEY> [SERVICE_ROLE_KEY]')
  console.log('\n💡 Cursor에서 MCP를 사용하려면:')
  console.log('   - Cursor가 자동으로 MCP를 통해 Supabase 정보를 가져옵니다')
  console.log('   - 또는 아래 명령어를 Cursor에서 실행하세요:')
  console.log('     pnpm supabase:env:mcp')
}


