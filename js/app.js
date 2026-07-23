document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            // 모든 버튼 비활성화 및 선택된 버튼 활성화
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 모든 탭 콘텐츠 숨기기 및 타겟 콘텐츠 표시
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // 기존 탭 관련 JS 코드 밑에 추가

    const fromSelect = document.getElementById('from-level');
    const toSelect = document.getElementById('to-level');
    const includeUnlockCheckbox = document.getElementById('include-unlock');
    const resultTitle = document.getElementById('result-title');
    const resultValue = document.getElementById('result-value');

    // 레벨 옵션 생성 (0 ~ 30레벨)
    if (fromSelect && toSelect) {
        for (let i = 0; i <= 30; i++) {
            let option1 = document.createElement('option');
            option1.value = i;
            option1.textContent = i === 0 ? '0 (Unlock)' : i;
            fromSelect.appendChild(option1);

            let option2 = document.createElement('option');
            option2.value = i;
            option2.textContent = i;
            toSelect.appendChild(option2);
        }
        // 기본값 설정 (To Level을 30으로 기본 선택)
        toSelect.value = "30";
    }

    // 레벨별 누적 조각 데이터 (Running Total 기준)
    // 0(해제): 50, 1: 50, 2~5(구간총합 80 -> 누적 130), 6~10(누적 330), 11~15(누적 630), 16~20(누적 1130), 21~25(누적 1880), 26~30(누적 2880)
    // 세부 레벨별 정확한 소모량 정의 함수
    function getShardsForLevel(lvl) {
        if (lvl <= 0) return 0;
        if (lvl === 1) return 50;
        if (lvl >= 2 && lvl <= 5) return 50 + (lvl - 1) * 20; // 대략적 균등 분배 혹은 구간 계산
        // 정확한 누적 기준 계산 로직 구현
        let cumulative = [
            0,   // L0
            50,  // L1
            70,  // L2
            90,  // L3
            110, // L4
            130, // L5
            170, // L6
            210, // L7
            250, // L8
            290, // L9
            330, // L10
            390, // L11
            450, // L12
            510, // L13
            570, // L14
            630, // L15
            730, // L16
            830, // L17
            930, // L18
            1030,// L19
            1130,// L20
            1280,// L21
            1430,// L22
            1580,// L23
            1730,// L24
            1880,// L25
            2080,// L26
            2280,// L27
            2480,// L28
            2680,// L29
            2880 // L30
        ];
        return cumulative[lvl] !== undefined ? cumulative[lvl] : 2880;
    }

    function calculateShards() {
        if (!fromSelect || !toSelect) return;
        
        let fromLvl = parseInt(fromSelect.value);
        let toLvl = parseInt(toSelect.value);

        if (fromLvl > toLvl) {
            resultTitle.textContent = "오류";
            resultValue.textContent = "시작 레벨이 목표 레벨보다 클 수 없습니다.";
            return;
        }

        let total = 0;
        
        // 0레벨에서 시작할 때 해제 비용(50개) 포함 여부 처리
        let includeUnlock = includeUnlockCheckbox ? includeUnlockCheckbox.checked : false;

        let costFrom = getShardsForLevel(fromLvl);
        let costTo = getShardsForLevel(toLvl);

        total = costTo - costFrom;

        // 만약 from이 0이고 includeUnlock이 체크되어 있거나 기본 해제 포함 계산일 때
        if (fromLvl === 0 && !includeUnlock && toLvl > 0) {
            // 0레벨 해제 비용(50개)을 제외하고 싶을 때의 처리 등 맞춤 조절 가능
            // 보통 0부터 시작하면 해제 비용 포함이므로 costTo와 같음
        }

        // 보기 좋은 포맷 (예: 2.88k 또는 숫자)
        let displayStr = total.toString();
        if (total >= 1000) {
            displayStr = (total / 1000).toFixed(2) + 'k (' + total.toLocaleString() + '개)';
        } else {
            displayStr = total.toLocaleString() + '개';
        }

        resultTitle.textContent = `Total Shards Required for Levels ${fromLvl} to ${toLvl}`;
        resultValue.textContent = displayStr;
    }

    if (fromSelect && toSelect && includeUnlockCheckbox) {
        fromSelect.addEventListener('change', calculateShards);
        toSelect.addEventListener('change', calculateShards);
        includeUnlockCheckbox.addEventListener('change', calculateShards);
    }
});