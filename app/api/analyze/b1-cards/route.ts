import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bazi, nickname } = body

    // Validate input
    if (!bazi) {
      return NextResponse.json(
        { success: false, error: 'Bazi data is required' },
        { status: 400 }
      )
    }

    if (!bazi.dayMaster) {
      return NextResponse.json(
        { success: false, error: 'Day Master data is missing from Bazi analysis' },
        { status: 400 }
      )
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json(
        { success: false, error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Load B1 prompt
    const promptPath = path.join(process.cwd(), 'prompts', 'B1_DAYMASTER_ANALYSIS_PROMPT.md')
    
    if (!fs.existsSync(promptPath)) {
      console.error(`Prompt file not found: ${promptPath}`)
      return NextResponse.json(
        { success: false, error: 'Prompt file not found' },
        { status: 500 }
      )
    }

    const systemPrompt = fs.readFileSync(promptPath, 'utf-8')

    // Prepare prompt input from Bazi data
    const dayMaster = bazi.dayMaster
    const promptInput = {
      nickname: nickname || 'Professional',
      dayMaster: {
        stem: dayMaster.stem || '',
        branch: dayMaster.branch || '',
        ganzi: dayMaster.ganzi || ''
      },
      tenGodsSummary: extractTenGodsSummary(bazi),
      strengthLevel: calculateStrengthLevel(bazi),
      traitsSummary: extractTraitsSummary(bazi)
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using gpt-4o instead of gpt-5
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please analyze the following data and return your response in JSON format:\n\n${JSON.stringify(promptInput, null, 2)}`
        }
      ],
      response_format: {
        type: 'json_object'
      }
    })

    if (!completion.choices[0]?.message?.content) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API returned empty response' },
        { status: 500 }
      )
    }

    let result
    try {
      result = JSON.parse(completion.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      console.error('Response content:', completion.choices[0].message.content)
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Build response
    return NextResponse.json({
      success: true,
      bentoGrid: buildBentoGrid(result.bento || {}),
      executiveCards: buildExecutiveCards(result.cards || [])
    })
  } catch (error: any) {
    console.error('B1 card generation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate career intelligence cards',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

function extractTenGodsSummary(bazi: any): string {
  // Extract ten gods information from pillars
  if (!bazi.pillars || !Array.isArray(bazi.pillars)) {
    return 'Standard structure'
  }
  
  const tenGods = bazi.pillars
    .map((p: any) => p?.stemSipsin || p?.pillar?.stemSipsin)
    .filter(Boolean)
  
  return tenGods.length > 0 ? tenGods.join(', ') : 'Standard structure'
}

function calculateStrengthLevel(bazi: any): string {
  // Simple strength calculation based on day master
  // This is a placeholder - actual calculation would be more complex
  return 'Moderate'
}

function extractTraitsSummary(bazi: any): string {
  const dayMaster = bazi.dayMaster
  if (!dayMaster) {
    return 'Day Master: N/A'
  }
  
  const ganzi = dayMaster.ganzi || dayMaster.pillar?.ganzi || 'N/A'
  const unseong = dayMaster.unseong || dayMaster.pillar?.unseong || 'N/A'
  
  return `Day Master: ${ganzi}, Unseong: ${unseong}`
}

function buildBentoGrid(bento: any) {
  return [
    {
      id: 'core_identity',
      label: 'Core Identity',
      value: bento.core_identity || 'Strategic Professional',
      size: 'large'
    },
    {
      id: 'decision_style',
      label: 'Decision Style',
      value: bento.decision_style || 'Data-driven',
      size: 'medium'
    },
    {
      id: 'execution_mode',
      label: 'Execution Mode',
      value: bento.execution_mode || 'Systematic',
      size: 'medium'
    },
    {
      id: 'risk_profile',
      label: 'Risk Profile',
      value: bento.risk_profile || 'Calculated',
      size: 'medium'
    },
    {
      id: 'wealth_pattern',
      label: 'Wealth Pattern',
      value: bento.wealth_pattern || 'Long-term',
      size: 'large'
    }
  ]
}

function buildExecutiveCards(cards: any[]) {
  return cards.map((card, index) => ({
    id: `card_${index + 1}`,
    category: card.category || 'CAREER',
    title: card.title || 'Career Insight',
    coreInsight: card.core_insight || card.coreInsight || '',
    strategicInterpretation: card.strategic_interpretation || card.strategicInterpretation || '',
    tacticalEdge: card.tactical_edge || card.tacticalEdge || '',
    confidence: card.confidence || 0.82
  }))
}

