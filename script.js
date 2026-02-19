// ==================== GLOBAL VARIABLES ====================
let searchQuery = ""; 
let selectedRunes = new Set();
let selectedType = 'all'; 
let selectedSocket = 'all';
let currentSort = 'level-asc'; 

// ==================== LOGIC SECTION ====================
const gridContainer = document.getElementById('rune-grid');
const listContainer = document.getElementById('runeword-list');
const listTitle = document.getElementById('list-title');
const tooltip = document.getElementById('tooltip');

// [추가] 동의어 처리 함수 (매찬 -> 매직 아이템 발견)
function getSearchTerms(query) {
    if (!query) return [];
    let terms = [query];
    
    // 디아블로2 주요 동의어 매핑
    if (query === '매찬') terms.push('매직 아이템 발견');
    if (query === '패캐') terms.push('시전 속도');
    if (query === '패힛') terms.push('타격 회복 속도');
    if (query === '피흡') terms.push('생명력 훔침', '생명력 흡수');
    if (query === '마흡') terms.push('마나 훔침', '마나 흡수');
    if (query === '공속') terms.push('공격 속도');
    if (query === '달려') terms.push('달리기/걷기');
    if (query === '삥') terms.push('금화');
    
    return terms;
}

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

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
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
        const terms = getSearchTerms(searchQuery);

        let filtered = runeWords.filter(rw => {
            if (!rw) return false;
            
            const itemRunes = Array.isArray(rw.runes) ? rw.runes : [];
            const runeMatch = selectedRunes.size === 0 || Array.from(selectedRunes).every(r => itemRunes.includes(r));
            
            const rwSockets = rw.sockets ? rw.sockets.toString() : "";
            const socketMatch = selectedSocket === 'all' || rwSockets === selectedSocket;
            
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

            let searchMatch = true;
            if (searchQuery) {
                const nameMatch = (rw.name || "").toLowerCase().includes(searchQuery);
                const aliasMatch = Array.isArray(rw.alias) && rw.alias.some(a => (a || "").toLowerCase().includes(searchQuery));
                
                // 동의어를 포함한 옵션 검색
                const safeEffects = rw.effects || "";
                const effectMatch = terms.some(term => safeEffects.toLowerCase().includes(term));
                
                searchMatch = nameMatch || aliasMatch || effectMatch;
            }

            return runeMatch && typeMatch && socketMatch && searchMatch;
        });

        filtered.sort((a, b) => {
            if (currentSort === 'level-asc') return (a.level || 0) - (b.level || 0);
            if (currentSort === 'level-desc') return (b.level || 0) - (a.level || 0);
            if (currentSort === 'name-asc') return (a.name || "").localeCompare(b.name || "", 'ko-KR');
            return 0;
        });

        updateListTitle();
        renderRunewordsList(filtered);
    } catch (error) {
        console.error("필터링 중 오류 발생:", error);
    }
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

    const searchTerms = getSearchTerms(searchQuery).filter(t => t.length > 0);
    // 정규식 에러 방지용 이스케이프 함수
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    listContainer.innerHTML = data.map(rw => {
        const safeRunes = Array.isArray(rw.runes) ? rw.runes : [];
        const runesHtml = safeRunes.map(krName => {
            const rune = RUNE_MAP[krName];
            const isSelected = selectedRunes.has(krName);
            const auraClass = isSelected ? " highlight-aura" : "";

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
        
        // [핵심] 효과 텍스트 분리 후 검색어 형광펜 하이라이트 적용
        const effectsHtml = safeEffects.split(', ').map(eff => {
            let highlightedEff = eff;
            if (searchTerms.length > 0) {
                const pattern = searchTerms.map(escapeRegExp).join('|');
                const regex = new RegExp(`(${pattern})`, 'gi');
                highlightedEff = highlightedEff.replace(regex, `<mark>$1</mark>`);
            }
            return `<div class="effect-line">${highlightedEff}</div>`;
        }).join('');
        
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

function resetAllFilters() {
    searchQuery = "";
    selectedRunes.clear();
    selectedType = 'all';
    selectedSocket = 'all';
    currentSort = 'level-asc'; 

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = "";
    
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = "level-asc";

    document.querySelectorAll('.rune-card.selected').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.type === 'all' || tag.dataset.socket === 'all') tag.classList.add('active');
    });

    window.history.replaceState({}, document.title, window.location.pathname);
    filterRunewords();
}

// =========================================
// [추가] 모바일 환경 툴팁(오버레이) 잔상 해결
// =========================================
// 1. 사용자가 화면을 위아래로 스크롤하면 즉시 툴팁 숨기기
window.addEventListener('scroll', hideTooltip, { passive: true });

// 2. 룬 아이콘이 아닌 빈 공간을 터치하면 툴팁 숨기기
document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.rune-card') && !e.target.closest('.rw-rune-item')) {
        hideTooltip();
    }
}, { passive: true });

document.addEventListener("DOMContentLoaded", init);

// =========================================
// [추가] '/' 키를 누르면 검색창 활성화 (단축키)
// =========================================
document.addEventListener('keydown', (e) => {
    // 사용자가 이미 검색창에 글자를 입력 중일 때는 '/'가 입력되도록 방어
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    // 눌린 키가 '/' 일 경우
    if (e.key === '/') {
        e.preventDefault(); // 기본 동작(페이지 스크롤이나 '/' 문자 입력) 방지
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus(); // 검색창으로 커서 이동
        }
    }
});