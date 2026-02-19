// ==================== GLOBAL VARIABLES ====================
let searchQuery = ""; 
let selectedRunes = new Set();
let selectedType = 'all'; 
let selectedSocket = 'all';

// ==================== LOGIC SECTION ====================
const gridContainer = document.getElementById('rune-grid');
const listContainer = document.getElementById('runeword-list');
const listTitle = document.getElementById('list-title');
const tooltip = document.getElementById('tooltip');

function init() {
    rebuildFilterUI();
    renderRunes();
    setupFilterEvents();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = (e.target.value || "").toLowerCase().trim();
            filterRunewords();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const initialRune = urlParams.get('rune');
    
    if (initialRune && RUNE_MAP[initialRune]) {
        toggleRune(RUNE_MAP[initialRune], null);
        setTimeout(() => {
             const card = Array.from(document.querySelectorAll('.rune-card')).find(c => c.textContent.includes(initialRune));
             if(card) {
                card.classList.add('selected');
                selectedRunes.add(initialRune);
                filterRunewords();
             }
        }, 50);
    } else {
        filterRunewords();
    }
}

function rebuildFilterUI() {
    const typeGroup = document.querySelector('#type-filters');
    if(typeGroup) {
        typeGroup.style.display = 'flex';
        typeGroup.style.flexWrap = 'wrap';
        typeGroup.style.gap = '8px';
        
        typeGroup.innerHTML = `
            <div style="width:100%; margin-bottom:5px; font-weight:bold; color:#888; font-size:0.8rem;">분류</div>
            <span class="filter-tag active" data-type="all">전체</span>
            <span class="filter-tag" data-type="MELEE">🗡️ 근거리 무기</span>
            <span class="filter-tag" data-type="RANGED">🏹 원거리 무기</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.ARMOR}">${ITEM_TYPES.ARMOR}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.HELM}">${ITEM_TYPES.HELM}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.SHIELD}">${ITEM_TYPES.SHIELD}</span>

            <div style="width:100%; margin:10px 0 5px; font-weight:bold; color:#888; font-size:0.8rem; border-top:1px dashed #333; padding-top:10px;">상세 무기</div>
            <span class="filter-tag" data-type="${ITEM_TYPES.SWORD}">${ITEM_TYPES.SWORD}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.AXE}">${ITEM_TYPES.AXE}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.POLEARM}">${ITEM_TYPES.POLEARM}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.MACE}">${ITEM_TYPES.MACE}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.SCEPTER}">${ITEM_TYPES.SCEPTER}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.STAFF}">${ITEM_TYPES.STAFF}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.WAND}">${ITEM_TYPES.WAND}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.DAGGER}">${ITEM_TYPES.DAGGER}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.CLAW}">${ITEM_TYPES.CLAW}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.SPEAR}">${ITEM_TYPES.SPEAR}</span>
            
            <div style="width:100%; margin:10px 0 5px; font-weight:bold; color:#888; font-size:0.8rem; border-top:1px dashed #333; padding-top:10px;">전용 장비</div>
            <span class="filter-tag" data-type="${ITEM_TYPES.PALADIN_SHIELD}">${ITEM_TYPES.PALADIN_SHIELD}</span>
            <span class="filter-tag" data-type="${ITEM_TYPES.DRUID_PELT}">${ITEM_TYPES.DRUID_PELT}</span>
        `;
    }
}

function setupFilterEvents() {
    const addGroupListener = (id, callback) => {
        document.querySelectorAll(`#${id} .filter-tag`).forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll(`#${id} .filter-tag`).forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                callback(tag);
                filterRunewords();
            });
        });
    };

    addGroupListener('type-filters', (tag) => selectedType = tag.dataset.type);
    addGroupListener('socket-filters', (tag) => selectedSocket = tag.dataset.socket);
}

function renderRunes() {
    const GRID_LAYOUT = [
        0, 1, 2, 3, 4, 5, 6, 7, 8,         
        9, 10, 11, 12, 13, 14, 15, 16, 17, 
        18, 19, 20, 21, 22, 23, 24, 25, 26, 
        27, 28, null, null, null, null, null, 29, 30, 
        31, null, null, null, null, null, null, null, 32  
    ];

    gridContainer.innerHTML = '';
    
    GRID_LAYOUT.forEach(dataIndex => {
        const card = document.createElement('div');
        
        if (dataIndex === null) {
            card.className = 'rune-card empty';
        } else {
            const rune = runesData[dataIndex];
            card.className = 'rune-card';
            
            const imgPath = `images/${rune.name}.png`; 
            
            card.innerHTML = `
                <div class="rune-icon">
                    <img src="${imgPath}" class="rune-img" alt="${rune.name}" 
                         onerror="this.style.display='none'; this.parentNode.innerText='${rune.name.substring(0,2)}'">
                </div>
                <div class="rune-name">${rune.kr}</div>
            `;
            
            card.addEventListener('click', () => toggleRune(rune, card));
            card.addEventListener('mouseenter', (e) => showTooltip(e, rune));
            card.addEventListener('mousemove', moveTooltip);
            card.addEventListener('mouseleave', hideTooltip);
        }
        gridContainer.appendChild(card);
    });
}

function toggleRune(rune, cardElement) {
    if (selectedRunes.has(rune.kr)) {
        selectedRunes.delete(rune.kr);
        if(cardElement) cardElement.classList.remove('selected');
    } else {
        selectedRunes.add(rune.kr);
        if(cardElement) cardElement.classList.add('selected');
    }
    filterRunewords();
}

function filterRunewords() {
    try {
        const filtered = runeWords.filter(rw => {
            if (!rw) return false;
            
            // [방어 코드 1] runes 속성이 제대로 있는지 검사
            const itemRunes = Array.isArray(rw.runes) ? rw.runes : [];
            const runeMatch = selectedRunes.size === 0 || Array.from(selectedRunes).every(r => itemRunes.includes(r));
            
            // [방어 코드 2] 소켓 검사 안전장치
            const rwSockets = rw.sockets ? rw.sockets.toString() : "";
            const socketMatch = selectedSocket === 'all' || rwSockets === selectedSocket;
            
            // [방어 코드 3] 타입 검사 안전장치
            const rwTypes = Array.isArray(rw.types) ? rw.types : [];
            let typeMatch = false;
            if (selectedType === 'all') {
                typeMatch = true;
            } else if (selectedType === 'MELEE') {
                typeMatch = rwTypes.some(t => CATEGORIES.MELEE.includes(t));
            } else if (selectedType === 'RANGED') {
                typeMatch = rwTypes.some(t => CATEGORIES.RANGED.includes(t));
            } else {
                typeMatch = rwTypes.includes(selectedType);
            }

            // [방어 코드 4] 검색어 검사 안전장치
            let searchMatch = true;
            if (searchQuery) {
                const nameMatch = (rw.name || "").toLowerCase().includes(searchQuery);
                const aliasMatch = Array.isArray(rw.alias) && rw.alias.some(a => (a || "").toLowerCase().includes(searchQuery));
                searchMatch = nameMatch || aliasMatch;
            }

            return runeMatch && typeMatch && socketMatch && searchMatch;
        });

        updateListTitle();
        renderRunewordsList(filtered);
    } catch (error) {
        console.error("필터링 중 오류 발생:", error);
    }
}

// =========================================
// [추가] 모든 필터 및 UI 초기화 함수
// =========================================
function resetAllFilters() {
    // 1. 내부 데이터 초기화
    searchQuery = "";
    selectedRunes.clear();
    selectedType = 'all';
    selectedSocket = 'all';

    // 2. 검색창 텍스트 비우기
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = "";

    // 3. 룬 선택 시각적 효과(테두리, 광채) 해제
    document.querySelectorAll('.rune-card.selected').forEach(card => {
        card.classList.remove('selected');
    });

    // 4. 아이템/소켓 필터 버튼 '전체'로 되돌리기
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.type === 'all' || tag.dataset.socket === 'all') {
            tag.classList.add('active');
        }
    });

    // 5. URL에 남아있는 파라미터(?rune=엘 등)를 새로고침 없이 깔끔하게 지우기
    window.history.replaceState({}, document.title, window.location.pathname);

    // 6. 초기화된 상태로 리스트 다시 그리기
    filterRunewords();
}

function updateListTitle() {
    let parts = [];
    if (selectedRunes.size > 0) parts.push(`Runes: ${Array.from(selectedRunes).join(', ')}`);
    
    let typeLabel = selectedType;
    if(typeLabel === 'MELEE') typeLabel = "근거리 무기";
    if(typeLabel === 'RANGED') typeLabel = "원거리 무기";
    if(typeLabel === 'all') typeLabel = "전체";
    
    parts.push(`Type: ${typeLabel}`);
    if (selectedSocket !== 'all') parts.push(`${selectedSocket} Sockets`);
    listTitle.textContent = parts.length > 0 ? `Filtered: ${parts.join(' | ')}` : "All Runewords";
}

function renderRunewordsList(data) {
    if (data.length === 0) {
        listContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#888; padding:30px;">조건에 맞는 룬워드가 없습니다.</div>`;
        return;
    }

    listContainer.innerHTML = data.map(rw => {
        // [방어 코드] 화면 렌더링 시 에러 방지
        const safeRunes = Array.isArray(rw.runes) ? rw.runes : [];
        const runesHtml = safeRunes.map(krName => {
            const rune = RUNE_MAP[krName];
            
            // 💡 [핵심 추가] 내가 위에서 선택한 룬인지 확인!
            const isSelected = selectedRunes.has(krName);
            const auraClass = isSelected ? " highlight-aura" : ""; // 선택됐으면 광채 클래스 추가

            if (rune) {
                const imgPath = `images/${rune.name}.png`;
                return `<div class="rw-rune-item" 
                            onclick="window.open('?rune=${encodeURIComponent(krName)}', '_blank')"
                            onmouseenter="showTooltip(event, RUNE_MAP['${krName}'])"
                            onmousemove="moveTooltip(event)"
                            onmouseleave="hideTooltip()">
                            <div class="rw-rune-icon${auraClass}">
                                <img src="${imgPath}" class="rune-img" alt="${rune.name}"
                                     onerror="this.style.display='none'; this.parentNode.innerText='${rune.name.substring(0,2)}'">
                            </div>
                            <div class="rw-rune-name" style="${isSelected ? 'color: var(--rune-orange); font-weight: bold;' : ''}">${krName}</div>
                        </div>`;
            } else {
                return `<div class="rw-rune-item"><div class="rw-rune-icon">??</div></div>`;
            }
        }).join('<span style="color:#444; margin-top:-15px">+</span>');

        const safeEffects = rw.effects || "";
        const effectsHtml = safeEffects.split(', ').map(eff => `<div class="effect-line">${eff}</div>`).join('');
        
        const safeTypes = Array.isArray(rw.types) ? rw.types : [];
        const typeDisplay = safeTypes.join(', ');
        
        const subTypeHtml = rw.subType ? `<span style="color:#d4c4a9; font-size:0.8em; margin-left:5px;">(${rw.subType})</span>` : '';
        const noteHtml = rw.note ? `<div style="color:#e05a5a; font-size:0.85em; margin-top:8px; padding-top:5px; border-top:1px dashed #333;">※ ${rw.note}</div>` : '';

        return `
            <div class="runeword-card">
                <div class="runeword-name">${rw.name || "이름 없음"}</div>
                <div class="runeword-info">
                    <span class="rw-level">Lv.${rw.level || "-"}</span> | 
                    <span class="rw-sockets">${rw.sockets || "-"}홈</span> | 
                    <span class="rw-type" style="color:#aaa;">${typeDisplay}${subTypeHtml}</span>
                </div>
                <div class="runeword-runes">${runesHtml}</div>
                <div class="runeword-effects">
                    ${effectsHtml}
                    ${noteHtml}
                </div>
            </div>
        `;
    }).join('');
}

// Tooltip Logic
function showTooltip(e, rune) {
    if (!rune) return;
    tooltip.innerHTML = `
        <div class="tooltip-title">${rune.kr} (${rune.name}) 룬</div>
        <div class="tooltip-level">필요 레벨: ${rune.level}</div>
        <div class="tooltip-section"><div class="tooltip-label">[무기]</div><div class="tooltip-value">${rune.weapon}</div></div>
        <div class="tooltip-section"><div class="tooltip-label">[방어구/방패]</div><div class="tooltip-value">${rune.armor}</div></div>
    `;
    tooltip.style.display = 'block';
    moveTooltip(e);
}

function moveTooltip(e) {
    const offset = 15;
    let x = e.clientX + offset;
    let y = e.clientY + offset;
    if (x + tooltip.offsetWidth > window.innerWidth) x = e.clientX - tooltip.offsetWidth - 10;
    if (y + tooltip.offsetHeight > window.innerHeight) y = e.clientY - tooltip.offsetHeight - 10;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

function hideTooltip() { tooltip.style.display = 'none'; }

document.addEventListener("DOMContentLoaded", init);