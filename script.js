// ==================== GLOBAL VARIABLES ====================
let searchQuery = "";
let selectedRunes = new Set();
let selectedType = 'all';
let selectedSocket = 'all';
let currentSort = 'level-asc';

// 💡 [추가] '내 보관함(개인화)' 모드 상태를 추적하는 변수
// 💡 [수정] 로컬 스토리지에서 이전 상태를 기억해서 불러오기 (기본값은 false)
let isPersonalizeMode = localStorage.getItem('isPersonalizeMode') === 'true';

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let debounceTimer;
function debounce(func, delay) {
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// ==================== LOGIC SECTION ====================
const gridContainer = document.getElementById('rune-grid');
const listContainer = document.getElementById('runeword-list');
const listTitle = document.getElementById('list-title');
const tooltip = document.getElementById('tooltip');

function getSearchTerms(query) {
    if (!query) return [];
    let terms = [query];

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
        searchInput.addEventListener('input', debounce((e) => {
            searchQuery = (e.target.value || "").toLowerCase().trim();
            filterRunewords();
        }, 300));
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

        window.history.replaceState({}, document.title, window.location.pathname);
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
        const tags = document.querySelectorAll(`#${id} .filter-tag`);
        const allTag = Array.from(tags).find(t => t.dataset.type === 'all' || t.dataset.socket === 'all');

        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                if (tag.classList.contains('active') && tag !== allTag) {
                    tag.classList.remove('active');
                    allTag.classList.add('active');
                    callback(allTag);
                } else {
                    tags.forEach(t => t.classList.remove('active'));
                    tag.classList.add('active');
                    callback(tag);
                }
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
        31, null, null, 'btn', null, null, 32  
    ];

    gridContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    GRID_LAYOUT.forEach((dataIndex, index) => {
        const x = index % 9;
        const y = Math.floor(index / 9);
        const distance = Math.sqrt(Math.pow(x - 4, 2) + Math.pow(y - 4, 2));
        const delay = distance * 0.04; 

        if (dataIndex === 'btn') {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'personalize-btn-container';
            
            const activeClass = isPersonalizeMode ? ' active' : '';
            btnContainer.innerHTML = `<button id="personalizeBtn" class="personalize-btn${activeClass}">내 보관함</button>`;
            
            if (isPersonalizeMode) gridContainer.classList.add('personalize-mode');
            
            const btn = btnContainer.querySelector('#personalizeBtn');
            btn.addEventListener('click', () => {
                const cards = document.querySelectorAll('.rune-card:not(.empty)');
                
                // 💡 [핵심] 모드 전환 시에만 파도타기 애니메이션과 딜레이 임시 적용
                cards.forEach(c => {
                    c.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    c.style.transitionDelay = c.dataset.delay;
                });

                isPersonalizeMode = !isPersonalizeMode;
                localStorage.setItem('isPersonalizeMode', isPersonalizeMode);
                btn.classList.toggle('active', isPersonalizeMode);
                gridContainer.classList.toggle('personalize-mode', isPersonalizeMode);
                filterRunewords();

                // 💡 애니메이션 종료 후(1.2초 뒤) 즉각 반응(0.1s) 모드로 복구
                setTimeout(() => {
                    cards.forEach(c => {
                        c.style.transition = 'all 0.1s ease';
                        c.style.transitionDelay = '0s';
                    });
                }, 1200);
            });

            fragment.appendChild(btnContainer);
            return; 
        }

        const card = document.createElement('div');
        
        // 💡 style 대신 dataset에 딜레이 값을 안전하게 보관해 둠
        card.dataset.delay = `${delay}s`;
        
        if (dataIndex === null) {
            card.className = 'rune-card empty';
        } else {
            const rune = runesData[dataIndex];
            card.className = 'rune-card';
            
            if (selectedRunes.has(rune.kr)) card.classList.add('selected');
            
            const imgPath = `images/${rune.name}.png`; 
            card.innerHTML = `
                <div class="rune-icon">
                    <img src="${imgPath}" class="rune-img" alt="${rune.name}" 
                         onerror="this.style.display='none'; this.parentNode.innerText='${rune.name.substring(0,2)}'">
                </div>
                <div class="rune-name">${rune.kr}</div>
            `;
            
            // card.addEventListener('click', () => toggleRune(rune, card));
            card.addEventListener('mouseenter', (e) => showTooltip(e, rune));
            card.addEventListener('mousemove', moveTooltip);
            card.addEventListener('mouseleave', hideTooltip);
        }
        
        fragment.appendChild(card);
    });
    
    gridContainer.appendChild(fragment);
}

function toggleRune(rune, cardElement, forceState = null) {
    // 💡 우클릭 드래그 시 명시적인 상태(add/remove)를 강제할 수 있게 수정
    let willAdd = forceState === null ? !selectedRunes.has(rune.kr) : forceState === 'add';

    if (willAdd) {
        selectedRunes.add(rune.kr);
        if(cardElement) cardElement.classList.add('selected');
    } else {
        selectedRunes.delete(rune.kr);
        if(cardElement) cardElement.classList.remove('selected');
    }
    filterRunewords();
}

function filterRunewords() {
    try {
        const terms = getSearchTerms(searchQuery);

        let filtered = runeWords.filter(rw => {
            if (!rw) return false;

            const itemRunes = Array.isArray(rw.runes) ? rw.runes : [];
            let runeMatch = false;

            // 💡 [핵심 수정] 모드에 따라 룬 매칭 로직을 완전히 뒤바꿈
            if (isPersonalizeMode) {
                // 내 보관함 모드: 룬워드의 '모든 재료 룬'이 내 선택 목록에 있어야 함
                // 선택한 룬이 하나도 없으면 아무것도 만들 수 없으므로 false 반환
                runeMatch = selectedRunes.size > 0 && itemRunes.every(r => selectedRunes.has(r));
            } else {
                // 일반 모드: 내가 선택한 룬들이 룬워드 재료에 포함되어 있어야 함
                runeMatch = selectedRunes.size === 0 || Array.from(selectedRunes).every(r => itemRunes.includes(r));
            }

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
    
    // 💡 [추가] 모드에 따라 리스트 상단 타이틀도 다르게 표시되도록 직관성 강화
    if (isPersonalizeMode) {
        parts.push("조합 가능 룬워드");
    } else if (selectedRunes.size > 0) {
        parts.push(`Runes: ${Array.from(selectedRunes).join(', ')}`);
    }

    let typeLabel = selectedType;
    if(typeLabel === 'MELEE') typeLabel = "근거리 무기";
    if(typeLabel === 'RANGED') typeLabel = "원거리 무기";
    if(typeLabel === 'all') typeLabel = "전체";

    parts.push(`Type: ${typeLabel}`);
    if (selectedSocket !== 'all') parts.push(`${selectedSocket} Sockets`);
    
    listTitle.textContent = parts.length > 0 ? `${parts.join(' | ')}` : "All Runewords";
}

function renderRunewordsList(data) {
    if (data.length === 0) {
        // 💡 [추가] 내 보관함 모드인데 선택한 룬이 없을 경우의 친절한 안내 메시지 추가
        if (isPersonalizeMode && selectedRunes.size === 0) {
            listContainer.innerHTML = `<div class="empty-result">보유하고 있는 룬을 선택하면 제작 가능한 룬워드가 나타납니다.</div>`;
        } else {
            listContainer.innerHTML = `<div class="empty-result">조건에 맞는 룬워드가 없습니다.</div>`;
        }
        return;
    }

    const searchTerms = getSearchTerms(searchQuery).filter(t => t.length > 0);

    let searchRegex = null;
    if (searchTerms.length > 0) {
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = searchTerms.map(escapeRegExp).join('|');
        searchRegex = new RegExp(`(${pattern})`, 'gi');
    }

    listContainer.innerHTML = data.map(rw => {
        const safeRunes = Array.isArray(rw.runes) ? rw.runes : [];
        const runesHtml = safeRunes.map(krName => {
            const rune = RUNE_MAP[krName];
            const isSelected = selectedRunes.has(krName);
            const auraClass = isSelected ? " highlight-aura" : "";
            const textClass = isSelected ? " active-text" : "";

            if (rune) {
                const imgPath = `images/${rune.name}.png`;
                return `<div class="rw-rune-item" data-rune="${krName}">
                    <div class="rw-rune-icon${auraClass}">
                        <img src="${imgPath}" class="rune-img" alt="${rune.name}"
                             onerror="this.style.display='none'; this.parentNode.innerText='${rune.name.substring(0,2)}'">
                    </div>
                    <div class="rw-rune-name${textClass}">${krName}</div>
                </div>`;
            } else {
                return `<div class="rw-rune-item"><div class="rw-rune-icon">??</div></div>`;
            }
        }).join('<span class="rune-plus">+</span>');

        const safeEffects = rw.effects || "";

        const effectsHtml = safeEffects.split(', ').map(eff => {
            let highlightedEff = eff;
            if (searchRegex) {
                highlightedEff = highlightedEff.replace(searchRegex, `<mark>$1</mark>`);
            }
            return `<div class="effect-line">${highlightedEff}</div>`;
        }).join('');

        const safeTypes = Array.isArray(rw.types) ? rw.types : [];
        const typeDisplay = safeTypes.join(', ');

        const subTypeHtml = rw.subType ? `<span class="rw-subtype">(${rw.subType})</span>` : '';
        const noteHtml = rw.note ? `<div class="rw-note">※ ${rw.note}</div>` : '';

        const ladderHtml = rw.ladder ? `<img src="images/flag_ladder.webp" class="ladder-flag" alt="래더 전용" title="래더 전용 룬워드">` : '';
        const ladderClass = rw.ladder ? ' is-ladder' : '';

        return `
        <div class="runeword-card${ladderClass}">
            ${ladderHtml} <div class="runeword-name">${rw.name || "이름 없음"}</div>
            <div class="runeword-info">
                <span class="rw-level">Lv.${rw.level || "-"}</span> |
                <span class="rw-sockets">${rw.sockets || "-"}홈</span> |
                <span class="rw-type">${typeDisplay}${subTypeHtml}</span>
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

let isTooltipTicking = false;

function moveTooltip(e) {
    if (!isTooltipTicking) {
        requestAnimationFrame(() => {
            const offset = 15;
            let x = e.clientX + offset;
            let y = e.clientY + offset;

            if (x + tooltip.offsetWidth > window.innerWidth) x = e.clientX - tooltip.offsetWidth - 10;
            if (y + tooltip.offsetHeight > window.innerHeight) y = e.clientY - tooltip.offsetHeight - 10;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;

            isTooltipTicking = false;
        });
        isTooltipTicking = true;
    }
}

function hideTooltip() { tooltip.style.display = 'none'; }

function resetAllFilters() {
    searchQuery = "";
    selectedRunes.clear();
    selectedType = 'all';
    selectedSocket = 'all';
    currentSort = 'level-asc';

    // 💡 [수정] 초기화 시 로컬 스토리지의 기억도 false로 완전히 리셋
    isPersonalizeMode = false;
    localStorage.setItem('isPersonalizeMode', false);
    
    gridContainer.classList.remove('personalize-mode');
    const btn = document.getElementById('personalizeBtn');
    if (btn) btn.classList.remove('active');

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

window.addEventListener('scroll', hideTooltip, { passive: true });

document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.rune-card') && !e.target.closest('.rw-rune-item')) {
        hideTooltip();
    }
}, { passive: true });

document.addEventListener("DOMContentLoaded", init);

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

if (listContainer) {
    listContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.rw-rune-item');
        if (item && item.dataset.rune) {
            window.open(`?rune=${encodeURIComponent(item.dataset.rune)}`, '_blank');
        }
    });

    listContainer.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.rw-rune-item');
        if (item && item.dataset.rune) {
            showTooltip(e, RUNE_MAP[item.dataset.rune]);
        }
    });

    listContainer.addEventListener('mousemove', (e) => {
        if (e.target.closest('.rw-rune-item')) {
            moveTooltip(e);
        }
    });

    listContainer.addEventListener('mouseout', (e) => {
        if (e.target.closest('.rw-rune-item')) {
            hideTooltip();
        }
    });
}

const ladderToggleBtn = document.getElementById('ladder-toggle-btn');
const ladderStatusText = document.getElementById('ladder-status-text');

if (ladderToggleBtn) {
    ladderToggleBtn.addEventListener('click', () => {
        ladderToggleBtn.classList.toggle('inactive');
        listContainer.classList.toggle('ladder-inactive-mode');

        if (ladderToggleBtn.classList.contains('inactive')) {
            ladderStatusText.textContent = '스탠다드';
            ladderStatusText.style.color = '#888';
        } else {
            ladderStatusText.textContent = '래더';
            ladderStatusText.style.color = '#8ab865';
        }
    });
}

// =========================================
// 💡 [추가] 마우스 우클릭 드래그 다중 선택 로직
// =========================================
let isRightDrag = false;
let dragAction = 'add'; // 'add' (선택) 또는 'remove' (해제)

gridContainer.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // 2는 마우스 우클릭을 의미해
        const card = e.target.closest('.rune-card:not(.empty)');
        if (card) {
            isRightDrag = true;
            const krName = card.querySelector('.rune-name').textContent;
            
            // 처음 클릭한 룬의 상태에 따라 드래그 액션 결정 (켜져있으면 끄기 모드, 꺼져있으면 켜기 모드)
            dragAction = selectedRunes.has(krName) ? 'remove' : 'add';
            
            const runeData = runesData.find(r => r && r.kr === krName);
            if (runeData) toggleRune(runeData, card, dragAction);
        }
    }
});

gridContainer.addEventListener('mouseover', (e) => {
    if (isRightDrag) {
        const card = e.target.closest('.rune-card:not(.empty)');
        if (card) {
            const krName = card.querySelector('.rune-name').textContent;
            const isSelected = selectedRunes.has(krName);
            
            // 현재 룬이 드래그 액션과 다른 상태일 때만 상태 변경 실행
            if ((dragAction === 'add' && !isSelected) || (dragAction === 'remove' && isSelected)) {
                const runeData = runesData.find(r => r && r.kr === krName);
                if (runeData) toggleRune(runeData, card, dragAction);
            }
        }
    }
});

// 마우스 버튼을 떼면 드래그 모드 종료
window.addEventListener('mouseup', (e) => {
    if (e.button === 0) isRightDrag = false;
});

// 그리드 영역에서 브라우저 기본 우클릭 메뉴가 뜨는 것을 방지
gridContainer.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.rune-card')) {
        e.preventDefault();
    }
});