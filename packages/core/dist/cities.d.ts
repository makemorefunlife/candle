/** 도시 정보 */
interface City {
    /** 한국어 도시명 */
    name: string;
    /** 한국어 국가명 (국내 도시는 생략) */
    country?: string;
    lat: number;
    lon: number;
}
declare const KOREAN_CITIES: readonly City[];
declare const WORLD_CITIES: readonly City[];
/** 기본값: 서울 */
declare const SEOUL: City;
/** 도시 표시명 (예: "서울", "도쿄, 일본") */
declare function formatCityName(city: City): string;
/** 쿼리로 도시 필터링 (최대 8개, 한국 도시 우선) */
declare function filterCities(query: string): City[];

export { type City, KOREAN_CITIES, SEOUL, WORLD_CITIES, filterCities, formatCityName };
