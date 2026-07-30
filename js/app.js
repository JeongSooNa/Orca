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
    function getShardsForLevel(lvl) {
        if (lvl <= 0) return 0;
        if (lvl === 1) return 50;
        if (lvl >= 2 && lvl <= 5) return 50 + (lvl - 1) * 20;
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
        let includeUnlock = includeUnlockCheckbox ? includeUnlockCheckbox.checked : false;

        let costFrom = getShardsForLevel(fromLvl);
        let costTo = getShardsForLevel(toLvl);

        total = costTo - costFrom;

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

    for (let i = from; i < to; i++) {
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
      else totalGuidebooks += 12000;

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
        else if (i <= 540) totalCertificates += 270;
        else if (i <= 590) totalCertificates += 290;
        else totalCertificates += 300;
      }
    }

    const bondRatingsData = [
      { level: 0, badges: 2 },
      { level: 50, badges: 4 },
      { level: 100, badges: 6 },
      { level: 150, badges: 10 },
      { level: 200, badges: 10 },
      { level: 250, badges: 15 },
      { level: 300, badges: 20 },
      { level: 350, badges: 25 },
      { level: 400, badges: 30 },
      { level: 450, badges: 40 },
      { level: 500, badges: 50 },
      { level: 550, badges: 60 },
      { level: 600, badges: 70 }
    ];

    bondRatingsData.forEach(item => {
      if (item.level >= from && item.level < to) {
        totalBadges += (item.badges * 10); 
      }
    });

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

// 서버전 배치 툴 JS (기지 3x3 및 메모 세로 1칸 분리 적용 버전)
document.addEventListener('DOMContentLoaded', () => {
    const gridMap = document.getElementById('grid-map');
    const mapSizeInput = document.getElementById('map-size-input');
    const mudSizeInput = document.getElementById('mud-size-input');
    const capitolSizeInput = document.getElementById('capitol-size-input');
    const showCapitolCheckbox = document.getElementById('show-capitol-checkbox');
    const applyMapConfigBtn = document.getElementById('apply-map-config');
    const clearAllBtn = document.getElementById('clear-all-btn');

    const newBaseNameInput = document.getElementById('new-base-name');
    const newBaseColorSelect = document.getElementById('new-base-color');
    const addBaseBtn = document.getElementById('add-base-item');
    const basePaletteList = document.getElementById('base-palette-list');

    const newMemoTextInput = document.getElementById('new-memo-text');
    const addMemoBtn = document.getElementById('add-memo-item');
    const memoPaletteList = document.getElementById('memo-palette-list');

    let mapSize = 100;
    let mudSize = 20;
    let capitolSize = 20;
    let showCapitol = true;

    let paletteItems = [];
    let placedElements = [];
    let draggedData = null;

    function initMap() {
        if (!gridMap || !mapSizeInput || !mudSizeInput || !capitolSizeInput) return;

        mapSize = parseInt(mapSizeInput.value) || 100;
        mudSize = parseInt(mudSizeInput.value) || 20;
        capitolSize = parseInt(capitolSizeInput.value) || 20;
        showCapitol = showCapitolCheckbox ? showCapitolCheckbox.checked : true;

        gridMap.style.gridTemplateColumns = `repeat(${mapSize}, 20px)`;
        gridMap.style.gridTemplateRows = `repeat(${mapSize}, 20px)`;
        gridMap.innerHTML = '';

        const startCapitol = Math.floor((mapSize - capitolSize) / 2);
        const endCapitol = startCapitol + capitolSize;
        
        const mudOffset = Math.floor(mudSize / 2);
        const startMud = Math.max(0, startCapitol - mudOffset);
        const endMud = Math.min(mapSize, endCapitol + mudOffset);

        const cannons = [
            { r: startCapitol - 1, c: startCapitol - 1 },
            { r: startCapitol - 1, c: endCapitol - 2 },
            { r: endCapitol - 2, c: startCapitol - 1 },
            { r: endCapitol - 2, c: endCapitol - 2 }
        ];

        function isCannon(r, c) {
            if (!showCapitol) return false;
            return cannons.some(can => r >= can.r && r < can.r + 3 && c >= can.c && c < can.c + 3);
        }

        function isCapitol(r, c) {
            return r >= startCapitol && r < endCapitol && c >= startCapitol && c < endCapitol;
        }

        function isMud(r, c) {
            return r >= startMud && r < endMud && c >= startMud && c < endMud && !isCapitol(r, c);
        }

        for (let r = 0; r < mapSize; r++) {
            for (let c = 0; c < mapSize; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = r;
                tile.dataset.col = c;

                if (isCapitol(r, c)) {
                    tile.classList.add('capitol');
                    tile.title = "국회 (Capitol)";
                } else if (isCannon(r, c)) {
                    tile.classList.add('cannon');
                    tile.title = "캐논 (Cannon 3x3)";
                } else if (isMud(r, c)) {
                    tile.classList.add('mud');
                    tile.title = "머드 (Mud)";
                }

                tile.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    highlightPreview(r, c, true);
                });

                tile.addEventListener('dragleave', () => {
                    clearPreview();
                });

                tile.addEventListener('drop', (e) => {
                    clearPreview();
                    handleTileDrop(e, r, c);
                });

                gridMap.appendChild(tile);
            }
        }
        renderPlacedElements();
    }

    function highlightPreview(startR, startC, isValid) {
        clearPreview();
        if (!draggedData) return;

        let canPlace = true;
        let previewTiles = [];

        // 기지는 3x3, 메모는 가로 1칸 x 세로 1칸으로 체크
        let checkWidth = draggedData.type === 'memo' ? 1 : draggedData.size;
        let checkHeight = draggedData.type === 'memo' ? 1 : draggedData.size;

        for (let dr = 0; dr < checkHeight; dr++) {
            for (let dc = 0; dc < checkWidth; dc++) {
                let tr = startR + dr;
                let tc = startC + dc;
                if (tr >= mapSize || tc >= mapSize) {
                    canPlace = false;
                    continue;
                }
                const targetTile = document.querySelector(`.tile[data-row="${tr}"][data-col="${tc}"]`);
                if (targetTile) {
                    if (draggedData.type === 'base' && (targetTile.classList.contains('capitol') || targetTile.classList.contains('cannon'))) {
                        canPlace = false;
                    }
                    previewTiles.push(targetTile);
                }
            }
        }

        previewTiles.forEach(tile => {
            tile.classList.add(canPlace ? 'drag-over-valid' : 'drag-over-invalid');
        });
    }

    function clearPreview() {
        document.querySelectorAll('.tile').forEach(tile => {
            tile.classList.remove('drag-over-valid', 'drag-over-invalid');
        });
    }

    if (addBaseBtn) {
        addBaseBtn.addEventListener('click', () => {
            const name = newBaseNameInput.value.trim();
            if (!name) return alert('기지 이름을 입력해주세요.');
            
            const item = {
                id: 'item_' + Date.now(),
                type: 'base',
                name: name,
                color: newBaseColorSelect.value,
                size: 3 // 기지는 3x3 크기 유지
            };
            paletteItems.push(item);
            newBaseNameInput.value = '';
            renderPalettes();
        });
    }

    if (addMemoBtn) {
        addMemoBtn.addEventListener('click', () => {
            const text = newMemoTextInput.value.trim();
            if (!text) return alert('메모 내용을 입력해주세요.');

            const item = {
                id: 'item_' + Date.now(),
                type: 'memo',
                name: text,
                color: '#f1c40f',
                size: 1 // 메모는 1칸 기준
            };
            paletteItems.push(item);
            newMemoTextInput.value = '';
            renderPalettes();
        });
    }

    function renderPalettes() {
        if (!basePaletteList || !memoPaletteList) return;
        basePaletteList.innerHTML = '';
        memoPaletteList.innerHTML = '';

        paletteItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'draggable-item';
            el.draggable = true;
            el.textContent = item.name;
            if (item.type === 'base') {
                el.style.backgroundColor = item.color;
                el.style.color = item.color === '#ffffff' ? '#333' : '#fff';
                basePaletteList.appendChild(el);
            } else {
                el.style.backgroundColor = '#f39c12';
                el.style.color = '#fff';
                memoPaletteList.appendChild(el);
            }

            el.addEventListener('dragstart', () => {
                draggedData = item;
            });
        });
    }

    function handleTileDrop(e, r, c) {
        e.preventDefault();
        if (!draggedData) return;

        let checkWidth = draggedData.type === 'memo' ? 1 : draggedData.size;
        let checkHeight = draggedData.type === 'memo' ? 1 : draggedData.size;

        for (let dr = 0; dr < checkHeight; dr++) {
            for (let dc = 0; dc < checkWidth; dc++) {
                let tr = r + dr;
                let tc = c + dc;
                if (tr >= mapSize || tc >= mapSize) {
                    return alert('맵 범위를 벗어납니다!');
                }
                const targetTile = document.querySelector(`.tile[data-row="${tr}"][data-col="${tc}"]`);
                if (targetTile && draggedData.type === 'base' && (targetTile.classList.contains('capitol') || targetTile.classList.contains('cannon'))) {
                    return alert('국회 또는 캐논 영역에는 기지를 배치할 수 없습니다!');
                }
            }
        }

        const existingIndex = placedElements.findIndex(el => el.id === draggedData.id);
        if (existingIndex > -1) {
            placedElements[existingIndex].r = r;
            placedElements[existingIndex].c = c;
        } else {
            placedElements.push({
                ...draggedData,
                id: 'placed_' + Date.now(),
                r: r,
                c: c
            });
            paletteItems = paletteItems.filter(i => i.id !== draggedData.id);
            renderPalettes();
        }

        renderPlacedElements();
        draggedData = null;
    }

    function renderPlacedElements() {
        document.querySelectorAll('.placed-object').forEach(el => el.remove());

        placedElements.forEach(item => {
            const startTile = document.querySelector(`.tile[data-row="${item.r}"][data-col="${item.c}"]`);
            if (!startTile) return;

            const objDiv = document.createElement('div');
            objDiv.style.top = `${item.r * 20}px`;
            objDiv.style.left = `${item.c * 20}px`;

            if (item.type === 'memo') {
                objDiv.className = 'placed-object memo-object';
            } else {
                objDiv.className = 'placed-object';
                objDiv.style.width = `${item.size * 20}px`;
                objDiv.style.height = `${item.size * 20}px`;
                objDiv.style.backgroundColor = item.color;
            }
            
            objDiv.innerHTML = `
                <span>${item.name}</span>
                <div class="delete-overlay">삭제</div>
            `;

            objDiv.querySelector('.delete-overlay').addEventListener('click', (e) => {
                e.stopPropagation();
                placedElements = placedElements.filter(el => el.id !== item.id);
                renderPlacedElements();
            });

            gridMap.appendChild(objDiv);
        });
    }

    if (applyMapConfigBtn) applyMapConfigBtn.addEventListener('click', initMap);
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            placedElements = [];
            paletteItems = [];
            renderPalettes();
            renderPlacedElements();
        });
    }

    initMap();
});