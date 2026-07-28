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

// Overload
document.addEventListener('DOMContentLoaded', () => {
  const fromSelect = document.getElementById('overlord-from-level');
  const toSelect = document.getElementById('overlord-to-level');

  if (fromSelect && toSelect) {
    for (let i = 1; i <= 800; i++) {
      fromSelect.innerHTML += `<option value="${i}">Level ${i}</option>`;
      toSelect.innerHTML += `<option value="${i}" ${i === 800 ? 'selected' : ''}>Level ${i}</option>`;
    }
    fromSelect.value = "1";
    toSelect.value = "100";

    fromSelect.addEventListener('change', calculateOverlord);
    toSelect.addEventListener('change', calculateOverlord);
    
    calculateOverlord();
  }

  function calculateOverlord() {
    const from = parseInt(fromSelect.value);
    const to = parseInt(toSelect.value);

    const guidebooksEl = document.getElementById('result-guidebooks');
    const certificatesEl = document.getElementById('result-certificates');
    const badgesEl = document.getElementById('result-badges');

    if (from >= to) {
      guidebooksEl.textContent = '0';
      certificatesEl.textContent = '0';
      badgesEl.textContent = '0';
      return;
    }

    let totalGuidebooks = 0;
    let totalCertificates = 0;
    let totalBadges = 0;

    // 1. 훈련 레벨 구간별 가이드북 및 인증서(Certificates) 계산
    for (let i = from; i < to; i++) {
      // 가이드북 계산 (레벨 구간별 규칙)
      if (i >= 1 && i <= 20) totalGuidebooks += 600;
      else if (i >= 21 && i <= 40) totalGuidebooks += 800;
      else if (i >= 41 && i <= 50) totalGuidebooks += 1000;
      else if (i >= 51 && i <= 60) totalGuidebooks += 1000;
      else if (i >= 61 && i <= 80) totalGuidebooks += 1200;
      else if (i >= 81 && i <= 100) totalGuidebooks += 1400;
      else if (i >= 101 && i <= 120) totalGuidebooks += 1600;
      else if (i >= 121 && i <= 140) totalGuidebooks += 2000;
      else if (i >= 141 && i <= 150) totalGuidebooks += 2400;
      else if (i >= 151 && i <= 160) totalGuidebooks += 2400;
      else if (i >= 161 && i <= 180) totalGuidebooks += 2800;
      else if (i >= 181 && i <= 200) totalGuidebooks += 3200;
      else if (i >= 201 && i <= 220) totalGuidebooks += 3600;
      else if (i >= 221 && i <= 240) totalGuidebooks += 4000;
      else if (i >= 241 && i <= 250) totalGuidebooks += 4400;
      else if (i >= 251 && i <= 270) totalGuidebooks += 4400;
      else if (i >= 271 && i <= 280) totalGuidebooks += 4800;
      else if (i >= 281 && i <= 300) totalGuidebooks += 5200;
      else if (i >= 301 && i <= 320) totalGuidebooks += 5600;
      else if (i >= 321 && i <= 340) totalGuidebooks += 6000;
      else if (i >= 341 && i <= 350) totalGuidebooks += 6400;
      else if (i >= 351 && i <= 370) totalGuidebooks += 6400;
      else if (i >= 371 && i <= 380) totalGuidebooks += 6800;
      else if (i >= 381 && i <= 400) totalGuidebooks += 7200;
      else if (i >= 401 && i <= 420) totalGuidebooks += 7600;
      else if (i >= 421 && i <= 440) totalGuidebooks += 8000;
      else if (i >= 441 && i <= 450) totalGuidebooks += 8400;
      else if (i >= 451 && i <= 470) totalGuidebooks += 8400;
      else if (i >= 471 && i <= 480) totalGuidebooks += 8800;
      else if (i >= 481 && i <= 500) totalGuidebooks += 9200;
      else if (i >= 501 && i <= 520) totalGuidebooks += 9600;
      else if (i >= 521 && i <= 550) totalGuidebooks += 10000;
      else if (i >= 551 && i <= 570) totalGuidebooks += 10400;
      else if (i >= 571 && i <= 580) totalGuidebooks += 10800;
      else if (i >= 581 && i <= 590) totalGuidebooks += 11200;
      else if (i >= 591 && i <= 595) totalGuidebooks += 11600;
      else if (i >= 596 && i <= 600) totalGuidebooks += 12000;
      else totalGuidebooks += 12000; // 600 이상 고레벨 구간

      // 인증서(Certificates) 규칙 (제공해주신 데이터 기준 5레벨 단위)
      if (i % 5 === 0) {
        if (i <= 40) totalCertificates += 10;
        else if (i <= 90) totalCertificates += 20;
        else if (i <= 140) totalCertificates += 30;
        else if (i <= 190) totalCertificates += 40;
        else if (i <= 240) totalCertificates += 50;
        else if (i <= 290) totalCertificates += 60;
        else if (i <= 340) totalCertificates += 70;
        else if (i <= 390) totalCertificates += 80;
        else if (i <= 440) totalCertificates += 90;
        else if (i <= 490) totalCertificates += 100;
        else if (i <= 540) totalCertificates += 270; // 데이터 상 중간 단위 반영
        else if (i <= 590) totalCertificates += 290;
        else totalCertificates += 300;
      }
    }

    // 2. 본드 배지(Badges) 계산 (해당 레벨 구간에 포함되는 본드 등급 배지 누적)
    // 제공된 데이터의 해제 훈련 레벨(Unlocks Training Level) 기준 매핑
    const bondRatingsData = [
      { level: 0, badges: 2 },   // No Rating ~ New Partner X (Level 0 ~ 50)
      { level: 50, badges: 4 },  // New Partner X ~ Rookie Partner I (Level 50 ~ 100)
      { level: 100, badges: 6 }, // Rookie Partner I ~ Trusted Friend I (Level 100 ~ 150)
      { level: 150, badges: 10 },// Trusted Friend I ~ Reliable Partner I (Level 150 ~ 200)
      { level: 200, badges: 10 },// Reliable Partner II ~ X 구간 세부 반영
      { level: 250, badges: 15 },// Loyal Friend I
      { level: 300, badges: 20 },// Bonded Partner I
      { level: 350, badges: 25 },// Perfect Sync I
      { level: 400, badges: 30 },// Strategic Pillar I
      { level: 450, badges: 40 },// Heart Bond I
      { level: 500, badges: 50 },// Team Anchor I
      { level: 550, badges: 60 },// Elite Ace I
      { level: 600, badges: 70 } // Ultimate Overlord I ~ X
    ];

    // 선택한 From ~ To 범위 사이에 걸치는 본드 승급 배지 합산
    bondRatingsData.forEach(item => {
      if (item.level >= from && item.level < to) {
        // 각 등급 내의 세부 단계(I~X, 총 10단계 혹은 세부 뱃지 총합) 반영
        totalBadges += (item.badges * 10); 
      }
    });

    // 결과 출력 텍스트 변환 (1000 이상은 k 단위 표기 혹은 일반 숫자)
    guidebooksEl.textContent = formatNumber(totalGuidebooks);
    certificatesEl.textContent = formatNumber(totalCertificates);
    badgesEl.textContent = totalBadges.toLocaleString();
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
  }
});

// 서버전 배치 툴 JS 전체 코드 (국회 및 캐논 텍스트 추가 버전)
document.addEventListener('DOMContentLoaded', () => {
  const mapSize = 100;
  const tileWidth = 20;
  const tileHeight = 17;
  
  const gridMap = document.getElementById('grid-map');
  const mapContainer = document.querySelector('.map-container-large');
  const clearBtn = document.getElementById('clear-bases-btn');
  const statusEl = document.getElementById('tool-status');

  let placedBases = new Map(); 
  let placedMemos = new Map(); 
  let memoIdCounter = 0;
  let draggedData = null;

  const capitolStart = 40; 
  const capitolEnd = 60;

  // 4개 캐논의 시작 좌표 설정 (북, 동, 서, 남 방향별 배치)
  const cannons = [
    { name: "북", r: capitolStart - 1, c: capitolStart - 1 }, 
    { name: "동", r: capitolStart - 1, c: capitolEnd - 2 },   
    { name: "서", r: capitolEnd - 2, c: capitolStart - 1 },   
    { name: "남", r: capitolEnd - 2, c: capitolEnd - 2 }      
  ];

  function isCannon(r, c) {
    return cannons.some(can => r >= can.r && r < can.r + 3 && c >= can.c && c < can.c + 3);
  }

  function isCapitol(r, c) {
    return r >= capitolStart && r < capitolEnd && c >= capitolStart && c < capitolEnd;
  }

  function initMap() {
    if (!gridMap) return;
    gridMap.innerHTML = '';
    
    // 1단계: 전체 기본 타일 생성
    for (let r = 0; r < mapSize; r++) {
      for (let c = 0; c < mapSize; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.row = r;
        tile.dataset.col = c;

        tile.addEventListener('dragover', (e) => {
          e.preventDefault();
          showDragPreview(r, c);
        });

        tile.addEventListener('drop', (e) => handleDrop(e, r, c));

        gridMap.appendChild(tile);
      }
    }

    // 2단계: 국회(Capitol) 영역 색칠 및 중앙에 텍스트 표시
    for (let r = capitolStart; r < capitolEnd; r++) {
      for (let c = capitolStart; c < capitolEnd; c++) {
        const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
        if (tile) {
          tile.classList.add('capitol');
          tile.title = "국회 (Capitol)";
        }
      }
    }
    // 국회 정중앙 타일에 텍스트 삽입 (49행, 49열 부근)
    const capitolCenterTile = document.querySelector(`.tile[data-row="${capitolStart + 9}"][data-col="${capitolStart + 9}"]`);
    if (capitolCenterTile) {
      const textSpan = document.createElement('span');
      textSpan.className = 'map-label-text';
      textSpan.textContent = '국회';
      capitolCenterTile.appendChild(textSpan);
    }

    // 3단계: 캐논(Cannon) 영역 색칠 및 각 캐논 중앙에 방향 텍스트 표시
    cannons.forEach(can => {
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          let tr = can.r + dr;
          let tc = can.c + dc;
          const tile = document.querySelector(`.tile[data-row="${tr}"][data-col="${tc}"]`);
          if (tile) {
            tile.classList.remove('capitol');
            tile.classList.add('cannon');
            tile.title = `캐논 (${can.name})`;
          }
        }
      }
      // 각 캐논의 정중앙 타일에 방향 텍스트 삽입 (시작점 + 1, + 1)
      const cannonCenterTile = document.querySelector(`.tile[data-row="${can.r + 1}"][data-col="${can.c + 1}"]`);
      if (cannonCenterTile) {
        // 기존에 국회 텍스트 등이 겹치지 않도록 초기화 후 삽입
        const textSpan = document.createElement('span');
        textSpan.className = 'map-label-text cannon-text';
        textSpan.textContent = can.name;
        cannonCenterTile.appendChild(textSpan);
      }
    });

    // 드래그 아이템 이벤트 바인딩
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedData = {
          type: item.dataset.type,
          color: item.dataset.color || ''
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
      });

      item.addEventListener('dragend', () => {
        draggedData = null;
        clearDragPreview();
      });
    });

    renderMap();
    scrollToCapitolCenter();
  }

  function scrollToCapitolCenter() {
    if (!mapContainer) return;
    const capitolCenterX = (capitolStart + capitolEnd) / 2 * tileWidth;
    const capitolCenterY = (capitolStart + capitolEnd) / 2 * tileHeight;

    const targetX = capitolCenterX - mapContainer.clientWidth / 2;
    const targetY = capitolCenterY - mapContainer.clientHeight / 2;
    mapContainer.scrollLeft = Math.max(0, targetX);
    mapContainer.scrollTop = Math.max(0, targetY);
  }

  function showDragPreview(r, c) {
    clearDragPreview();
    if (!draggedData) return;

    if (draggedData.type === 'base') {
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          let tr = r + dr;
          let tc = c + dc;
          if (tr < mapSize && tc < mapSize) {
            const tile = document.querySelector(`.tile[data-row="${tr}"][data-col="${tc}"]`);
            if (tile) tile.classList.add('drag-preview');
          }
        }
      }
    } else if (draggedData.type === 'memo') {
      const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
      if (tile) tile.classList.add('drag-preview');
    }
  }

  function clearDragPreview() {
    document.querySelectorAll('.tile.drag-preview').forEach(tile => {
      tile.classList.remove('drag-preview');
    });
  }

  function handleDrop(e, r, c) {
    e.preventDefault();
    clearDragPreview();

    try {
      const data = draggedData || JSON.parse(e.dataTransfer.getData('text/plain'));

      if (data.type === 'base') {
        for (let dr = 0; dr < 3; dr++) {
          for (let dc = 0; dc < 3; dc++) {
            let tr = r + dr;
            let tc = c + dc;
            if (tr >= mapSize || tc >= mapSize) {
              if (statusEl) statusEl.textContent = "맵 범위를 벗어납니다!";
              return;
            }
            if (isCapitol(tr, tc) || isCannon(tr, tc)) {
              if (statusEl) statusEl.textContent = "국회 또는 캐논 영역에는 기지를 배치할 수 없습니다!";
              return;
            }
          }
        }

        for (let dr = 0; dr < 3; dr++) {
          for (let dc = 0; dc < 3; dc++) {
            if (checkBaseOverlap(r + dr, c + dc)) {
              if (statusEl) statusEl.textContent = "다른 기지와 겹칠 수 없습니다!";
              return;
            }
          }
        }

        const key = `${r},${c}`;
        placedBases.set(key, { color: data.color, r, c });
        if (statusEl) statusEl.textContent = `${data.color}색 기지가 (${r}, ${c})에 배치되었습니다.`;
        renderMap();

      } else if (data.type === 'memo') {
        const memoText = prompt("메모 내용을 입력하세요:", "중요 거점");
        if (!memoText) return;

        const memoKey = `memo_${memoIdCounter++}`;
        placedMemos.set(memoKey, { text: memoText, r, c });
        if (statusEl) statusEl.textContent = `메모가 (${r}, ${c})에 추가되었습니다.`;
        renderMap();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function checkBaseOverlap(targetR, targetC) {
    for (let [key, base] of placedBases) {
      if (targetR >= base.r && targetR < base.r + 3 && targetC >= base.c && targetC < base.c + 3) {
        return true;
      }
    }
    return false;
  }

  function renderMap() {
    document.querySelectorAll('.tile').forEach(tile => {
      const r = parseInt(tile.dataset.row);
      const c = parseInt(tile.dataset.col);
      
      tile.className = 'tile';
      if (isCapitol(r, c)) {
        tile.classList.add('capitol');
        tile.title = "국회 (Capitol)";
      }
      if (isCannon(r, c)) {
        tile.classList.remove('capitol');
        tile.classList.add('cannon');
        const foundCannon = cannons.find(can => r >= can.r && r < can.r + 3 && c >= can.c && c < can.c + 3);
        tile.title = foundCannon ? `캐논 (${foundCannon.name})` : "캐논";
      } else if (!isCapitol(r, c)) {
        tile.title = '';
      }
      
      tile.onclick = null;
    });

    // 국회 및 캐논 중앙 텍스트 재삽입
    const capitolCenterTile = document.querySelector(`.tile[data-row="${capitolStart + 9}"][data-col="${capitolStart + 9}"]`);
    if (capitolCenterTile) {
      const textSpan = document.createElement('span');
      textSpan.className = 'map-label-text';
      textSpan.textContent = '국회';
      capitolCenterTile.appendChild(textSpan);
    }

    cannons.forEach(can => {
      const cannonCenterTile = document.querySelector(`.tile[data-row="${can.r + 1}"][data-col="${can.c + 1}"]`);
      if (cannonCenterTile) {
        const textSpan = document.createElement('span');
        textSpan.className = 'map-label-text cannon-text';
        textSpan.textContent = can.name;
        cannonCenterTile.appendChild(textSpan);
      }
    });

    document.querySelectorAll('.map-memo').forEach(el => el.remove());

    // 기지 렌더링
    placedBases.forEach((base, key) => {
      const { color, r, c } = base;
      const colorClass = `base-${color}`;

      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          const tile = document.querySelector(`.tile[data-row="${r + dr}"][data-col="${c + dc}"]`);
          if (tile && !tile.classList.contains('capitol') && !tile.classList.contains('cannon')) {
            tile.classList.add('has-base', colorClass);

            tile.onclick = () => {
              placedBases.delete(key);
              renderMap();
              if (statusEl) statusEl.textContent = "기지가 삭제되었습니다.";
            };
          }
        }
      }
    });

    // 메모 렌더링
    placedMemos.forEach((memo, memoKey) => {
      const tile = document.querySelector(`.tile[data-row="${memo.r}"][data-col="${memo.c}"]`);
      if (tile) {
        const memoEl = document.createElement('div');
        memoEl.className = 'map-memo';
        memoEl.textContent = memo.text;
        
        memoEl.style.left = `${memo.c * tileWidth}px`;
        memoEl.style.top = `${memo.r * tileHeight}px`;

        memoEl.onclick = (e) => {
          e.stopPropagation();
          placedMemos.delete(memoKey);
          renderMap();
          if (statusEl) statusEl.textContent = "메모가 삭제되었습니다.";
        };

        gridMap.appendChild(memoEl);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      placedBases.clear();
      placedMemos.clear();
      renderMap();
      if (statusEl) statusEl.textContent = "모든 기지와 메모가 초기화되었습니다.";
    });
  }

  initMap();
});