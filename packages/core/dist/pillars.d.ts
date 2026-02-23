import { AllRelations, PairRelation, RelationResult, TransitItem, Relation, SpecialSals } from './types.js';

/**
 * 그레고리력 → 60갑자 인덱스 [연주, 월주, 일주, 시주]
 *
 * @returns [so24(60년 배수), so24year, so24month, so24day, so24hour]
 */
declare function calcPillarIndices(year: number, month: number, day: number, hour: number, min: number): [number, number, number, number, number];
/**
 * 절기 시간 구하기 - 입기, 중기, 출기 날짜/시각
 */
declare function calcSolarTerms(year: number, month: number, day: number, hour: number, min: number): {
    ingiName: number;
    ingiYear: number;
    ingiMonth: number;
    ingiDay: number;
    ingiHour: number;
    ingiMin: number;
    midName: number;
    midYear: number;
    midMonth: number;
    midDay: number;
    midHour: number;
    midMin: number;
    outgiName: number;
    outgiYear: number;
    outgiMonth: number;
    outgiDay: number;
    outgiHour: number;
    outgiMin: number;
};
/** 4주를 60갑자 문자열로 반환 [년주, 월주, 일주, 시주] */
declare function getFourPillars(year: number, month: number, day: number, hour: number, minute: number): [string, string, string, string];
/** 대운 10개 계산 */
declare function getDaewoon(isMale: boolean, year: number, month: number, day: number, hour: number, minute: number): Array<{
    ganzi: string;
    startDate: Date;
}>;
/** 일간 기준 십신 계산 */
declare function getRelation(dayStem: string, targetStem: string): Relation | null;
/** 지장간 반환 */
declare function getHiddenStems(branch: string): string;
/** 지장간의 정기 (마지막 글자) */
declare function getJeonggi(branch: string): string;
/** 한자를 한글로 변환 */
declare function toHangul(hanja: string): string;
/** 12운성 계산 */
declare function getTwelveMeteor(stem: string, branch: string): string;
/** 12신살 계산 (년지 기준) */
declare function getTwelveSpirit(yearBranch: string, targetBranch: string): string;
/** 천간 관계 */
declare function getStemRelation(stem1: string, stem2: string): RelationResult[];
/** 지지 관계 */
declare function getBranchRelation(branch1: string, branch2: string): RelationResult[];
/** 두 주 사이의 관계 분석 */
declare function analyzePillarRelations(pillar1: string, pillar2: string): PairRelation;
/** 삼합 검사 */
declare function checkTripleCompose(branches: string[]): RelationResult[];
/** 방합 검사 */
declare function checkDirectionalCompose(branches: string[]): RelationResult[];
/** 모든 주 관계 분석 */
declare function analyzeAllRelations(pillars: string[]): AllRelations;
declare function getSpecialSals(dayStem: string, dayPillar: string, branches: string[]): SpecialSals;
/** N개월간의 일운/월운과 사주의 관계를 찾음 */
declare function findTransits(natalPillars: string[], months?: number, backward?: boolean): TransitItem[];

export { analyzeAllRelations, analyzePillarRelations, calcPillarIndices, calcSolarTerms, checkDirectionalCompose, checkTripleCompose, findTransits, getBranchRelation, getDaewoon, getFourPillars, getHiddenStems, getJeonggi, getRelation, getSpecialSals, getStemRelation, getTwelveMeteor, getTwelveSpirit, toHangul };
