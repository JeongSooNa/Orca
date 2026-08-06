import time
import uuid
import json
import requests

# 1. 설정
API_KEY = "lwa_live_eWlqQlgOVySae9fwLrzJ5TY3D1woUCDo"
BASE_URL = "https://api.lwatlas.com/v1"

# 조회할 8개의 전장(서버) ID 리스트
TARGET_WARZONES = [2149, 2152, 2153, 2154, 2158, 2159, 2160, 2162]

def get_headers(custom_headers=None):
    headers = {
        "X-Api-Key": API_KEY,
        "Accept": "application/json"
    }
    if custom_headers:
        headers.update(custom_headers)
    return headers

def handle_response(response):
    """공통 응답 처리 및 레이트 리밋 헤더 확인용 함수"""
    remaining = response.headers.get("X-RateLimit-Remaining")
    if remaining:
        print(f"[Info] 남은 요청 횟수(분당): {remaining}")
        
    if response.status_code == 200:
        return response.json()
    else:
        print(f"API 요청 실패 (상태 코드: {response.status_code}): {response.text}")
        return None

# ---------------------------------------------------------
# 1. 연맹 태그로 연맹 검색 및 보기 쉽게 출력
# ---------------------------------------------------------
def search_alliance_pretty(tag):
    endpoint = f"{BASE_URL}/alliances/search"
    params = {"allianceName": tag}
    
    response = requests.get(endpoint, headers=get_headers(), params=params)
    data = handle_response(response)
    
    if not data:
        return []
        
    alliances = data.get("alliances", [])
    if not alliances:
        print("검색된 연맹이 없습니다.")
        return []
        
    print(f"\n=== 연맹 검색 결과 (검색어: {tag}) ===")
    print(f"{'No':<3} | {'연맹 태그':<10} | {'홈 전장':<15} | {'총 멤버 수':<10} | {'연맹 ID'}")
    print("-" * 75)
    
    for idx, item in enumerate(alliances, 1):
        abbr = item.get('allianceAbbr', 'N/A')
        home_vz = item.get('homeWarzoneName', 'N/A')
        total_members = item.get('totalMembers', 0)
        alliance_id = item.get('allianceId', 'N/A')
        
        print(f"{idx:<3} | {abbr:<10} | {home_vz:<15} | {total_members:<10}명 | {alliance_id}")
    print("-" * 75)
    return alliances

# ---------------------------------------------------------
# 2. 연맹 프로필 조회 (GET /alliances/{allianceId})
# ---------------------------------------------------------
def get_alliance_profile_pretty(alliance_id):
    endpoint = f"{BASE_URL}/alliances/{alliance_id}"
    response = requests.get(endpoint, headers=get_headers())
    data = handle_response(response)
    
    if not data:
        return
        
    print(f"\n=== 연맹 프로필 상세 정보 ===")
    print(f"• 연맹 이름 / 태그 : {data.get('allianceName', 'N/A')} [{data.get('allianceAbbr', 'N/A')}]")
    print(f"• 연맹 ID          : {data.get('allianceId', 'N/A')}")
    print(f"• 홈 전장 ID       : {data.get('homeWarzoneId', 'N/A')}")
    print(f"• 총 멤버 수       : {data.get('totalMembers', 'N/A')}명")
    if 'leaderName' in data:
        print(f"• 연맹장 이름      : {data.get('leaderName')}")
    print("-" * 50)

# ---------------------------------------------------------
# 3. 연맹 도시 조회 (GET /alliances/{allianceId}/cities)
# ---------------------------------------------------------
def get_alliance_cities(alliance_id):
    endpoint = f"{BASE_URL}/alliances/{alliance_id}/cities"
    response = requests.get(endpoint, headers=get_headers())
    return handle_response(response)

# ---------------------------------------------------------
# 4. 플레이어 이름으로 기지 검색 (GET /players/search) - 일일 250회 제한
# ---------------------------------------------------------
def search_player(player_name):
    endpoint = f"{BASE_URL}/players/search"
    params = {"name": player_name}
    response = requests.get(endpoint, headers=get_headers(), params=params)
    return handle_response(response)

# ---------------------------------------------------------
# 5. 전장(Warzone) 목록 및 데이터 신선도 확인 (GET /warzones)
# ---------------------------------------------------------
def check_target_warzones():
    endpoint = f"{BASE_URL}/warzones"
    response = requests.get(endpoint, headers=get_headers())
    data = handle_response(response)
    
    if not data:
        return
        
    warzones = data if isinstance(data, list) else data.get("warzones", [])
    
    print(f"\n=== [8개 지정 서버 정보 및 데이터 최신성(lastScanAt) 확인 비동기 없이 조회] ===")
    print(f"{'서버 ID':<10} | {'서버 이름':<15} | {'마지막 스캔 시점 (lastScanAt)'}")
    print("-" * 55)
    
    found_count = 0
    for wz in warzones:
        wz_id = wz.get("warzoneId")
        if wz_id in TARGET_WARZONES:
            found_count += 1
            wz_name = wz.get("warzoneName", f"Warzone {wz_id}")
            last_scan = wz.get("lastScanAt", "정보 없음")
            print(f"{wz_id:<10} | {wz_name:<15} | {last_scan}")
            
    if found_count == 0:
        print("지정한 서버 정보를 찾지 못했습니다.")
    print("-" * 55)


# --- 메인 실행 영역 ---
if __name__ == "__main__":
    # print("=== [1] 연맹 검색 테스트 ===")
    # alliances = search_alliance_pretty("OrcA")
    
    # if alliances:
    #     sample_alliance_id = alliances[0].get("allianceId")
    #     print(f"\n=== [2] 연맹 프로필 상세 조회 테스트 (ID: {sample_alliance_id}) ===")
    #     get_alliance_profile_pretty(sample_alliance_id)

    print("\n=== [3] 8개 지정 서버 상태 및 마지막 스캔 시점 확인 (GET /warzones) ===")
    check_target_warzones()