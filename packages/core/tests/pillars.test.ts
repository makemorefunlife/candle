import { describe, it, expect } from 'vitest'
import { getFourPillars } from '../src/pillars.ts'
import { adjustKdtToKst } from '../src/kdt.ts'
import { PILLAR_FIXTURES } from './fixtures.ts'

describe('getFourPillars', () => {
  for (const fixture of PILLAR_FIXTURES) {
    const { year, month, day, hour, minute, expected } = fixture
    it(`${year}-${month}-${day} ${hour}:${minute}`, () => {
      // getFourPillars는 KST 기준이므로, KDT 기간 입력은 보정 후 전달
      const kst = adjustKdtToKst(year, month, day, hour, minute)
      const [yp, mp, dp, hp] = getFourPillars(kst.year, kst.month, kst.day, kst.hour, kst.minute)
      expect(yp).toBe(expected.year)
      expect(mp).toBe(expected.month)
      expect(dp).toBe(expected.day)
      expect(hp).toBe(expected.hour)
    })
  }
})

describe('edge cases', () => {
  it('midnight birth (23:30) advances day pillar', () => {
    const [, , dp1] = getFourPillars(2000, 1, 1, 23, 29)
    const [, , dp2] = getFourPillars(2000, 1, 1, 23, 30)
    // 23:30 이상이면 일주가 다음날로 넘어감
    expect(dp2).not.toBe(dp1)
  })

  it('same day different hours give different hour pillars', () => {
    const [, , , hp1] = getFourPillars(2000, 1, 1, 3, 0)
    const [, , , hp2] = getFourPillars(2000, 1, 1, 15, 0)
    expect(hp1).not.toBe(hp2)
  })
})
