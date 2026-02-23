/**
 * Supabase 환경 변수 자동 설정 스크립트
 * 
 * 사용법:
 * 1. Supabase CLI 설치: npm install -g supabase
 * 2. 프로젝트 연결: supabase link --project-ref <your-project-ref>
 * 3. 이 스크립트 실행: node scripts/setup-supabase-env.js
 * 
 * 또는 package.json의 스크립트 사용:
 * pnpm supabase:env
 */

import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ENV_FILE = '.env.local'
const ENV_EXAMPLE_FILE = '.env.example'

function getSupabaseEnvVars() {
  try {
    // Supabase CLI를 통해 환경 변수 가져오기
    const statusOutput = execSync('supabase status', { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    })

    // 로컬 개발 환경인 경우
    if (statusOutput.includes('API URL')) {
      const apiUrl = execSync('supabase status --output json', { encoding: 'utf-8' })
      const status = JSON.parse(apiUrl)
      
      return {
        NEXT_PUBLIC_SUPABASE_URL: status?.api?.url || '',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: status?.api?.anon_key || '',
        SUPABASE_SERVICE_ROLE_KEY: status?.api?.service_role_key || '',
      }
    }
  } catch (error) {
    // Supabase CLI가 없거나 연결되지 않은 경우
    console.warn('⚠️  Supabase CLI가 설치되지 않았거나 프로젝트가 연결되지 않았습니다.')
    console.warn('   다음 명령어를 실행하세요:')
    console.warn('   1. npm install -g supabase')
    console.warn('   2. supabase link --project-ref <your-project-ref>')
    return null
  }

  return null
}

function getLinkedProjectEnv() {
  try {
    // 연결된 프로젝트의 환경 변수 가져오기
    const linkOutput = execSync('supabase projects list', { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    })
    
    // 프로젝트가 연결되어 있으면 환경 변수 추출
    // 실제로는 supabase link 후 .supabase/config.toml에서 정보를 읽어야 함
    return null
  } catch (error) {
    return null
  }
}

function updateEnvFile(envVars) {
  const envPath = join(process.cwd(), ENV_FILE)
  const examplePath = join(process.cwd(), ENV_EXAMPLE_FILE)
  
  let existingContent = ''
  if (existsSync(envPath)) {
    existingContent = require('fs').readFileSync(envPath, 'utf-8')
  }

  // 기존 환경 변수 유지하면서 Supabase 변수만 업데이트
  const lines = existingContent.split('\n')
  const newLines = []
  const supabaseKeys = Object.keys(envVars)
  
  let hasSupabaseVars = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      newLines.push(line)
      continue
    }
    
    const [key] = trimmed.split('=')
    if (supabaseKeys.includes(key)) {
      hasSupabaseVars = true
      newLines.push(`${key}=${envVars[key]}`)
    } else {
      newLines.push(line)
    }
  }
  
  // Supabase 변수가 없으면 추가
  if (!hasSupabaseVars) {
    newLines.push('')
    newLines.push('# Supabase (자동 생성됨)')
    for (const [key, value] of Object.entries(envVars)) {
      if (value) {
        newLines.push(`${key}=${value}`)
      }
    }
  }
  
  writeFileSync(envPath, newLines.join('\n'))
  console.log(`✅ ${ENV_FILE} 파일이 업데이트되었습니다.`)
}

// 메인 실행
console.log('🔍 Supabase 환경 변수를 확인하는 중...\n')

const envVars = getSupabaseEnvVars()

if (envVars) {
  updateEnvFile(envVars)
  console.log('\n✅ 완료! 다음 환경 변수가 설정되었습니다:')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL=${envVars.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`)
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}`)
  console.log(`   SUPABASE_SERVICE_ROLE_KEY=${envVars.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}`)
} else {
  console.log('\n📝 수동 설정 방법:')
  console.log('   1. Supabase 대시보드에서 프로젝트 선택')
  console.log('   2. Settings → API 메뉴로 이동')
  console.log('   3. .env.local 파일에 다음 변수 추가:')
  console.log('      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...')
  console.log('      SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...')
}


