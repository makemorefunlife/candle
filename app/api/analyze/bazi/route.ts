import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju } from '@orrery/core/saju'
import type { BirthInput } from '@orrery/core/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gender, birthDate, birthTime, birthLocation } = body

    // Parse birth date
    const date = new Date(birthDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // Parse birth time
    const [hour, minute] = birthTime.split(':').map(Number)

    // Convert gender
    const genderMap: Record<string, 'M' | 'F'> = {
      'Male': 'M',
      'Female': 'F',
      'Non-binary': 'M' // Default to M for non-binary
    }

    const birthInput: BirthInput = {
      year,
      month,
      day,
      hour,
      minute,
      gender: genderMap[gender] || 'M'
    }

    // Calculate Bazi (B data)
    const sajuResult = calculateSaju(birthInput)

    // Validate pillars
    if (!sajuResult.pillars || !Array.isArray(sajuResult.pillars) || sajuResult.pillars.length < 2) {
      throw new Error('Invalid pillars data from Bazi calculation')
    }

    // Extract Day Master info
    const dayPillar = sajuResult.pillars[1] // Day pillar (일주)
    
    if (!dayPillar || !dayPillar.pillar) {
      throw new Error('Day pillar data is missing')
    }

    const dayMaster = {
      stem: dayPillar.pillar.stem,
      branch: dayPillar.pillar.branch,
      ganzi: dayPillar.pillar.ganzi,
      stemSipsin: dayPillar.stemSipsin,
      branchSipsin: dayPillar.branchSipsin,
      unseong: dayPillar.unseong
    }

    // Prepare data for B1 analysis
    const baziAnalysis = {
      dayMaster,
      pillars: sajuResult.pillars,
      daewoon: sajuResult.daewoon,
      relations: sajuResult.relations,
      specialSals: sajuResult.specialSals
    }

    return NextResponse.json({
      success: true,
      bazi: baziAnalysis,
      raw: sajuResult
    })
  } catch (error: any) {
    console.error('Bazi calculation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

