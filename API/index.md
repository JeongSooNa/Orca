📋 API 문서 핵심 요약
인증 방식: 모든 요청 헤더에 X-Api-Key 또는 Authorization: Bearer 포함

개발자 키 제한 사항:

에러 403 ENDPOINT_NOT_ALLOWED는 일부 엔드포인트(예: 멤버 전체 목록 등)가 개발자 키 허용 목록에 포함되지 않아 발생합니다.

따라서 접근 가능한 허용 엔드포인트(GET /alliances/search, GET /alliances/{allianceId}, GET /players/search, GET /warzones, Map Scan API 등)를 활용해야 합니다.

주요 속도 및 할당량 제한:

버스트 제한: 분당 60회 요청 (429 RATE_LIMIT_EXCEEDED)

롤링 할당량: 30일 기준 10,000회 요청 (429 QUOTA_EXCEEDED)

플레이어 검색: /players/search는 하루 최대 250회 제한