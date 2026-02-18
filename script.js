// ==================== GLOBAL VARIABLES ====================
let searchQuery = ""; // [중요] 검색어 저장 변수 (이게 없으면 고장남!)
let selectedRunes = new Set();
let selectedType = 'all'; 
let selectedSocket = 'all';

// ==================== DATA SECTION ====================

// 1. 아이템 종류 상수 정의
const ITEM_TYPES = {
    SWORD: "도검", DAGGER: "단도", AXE: "도끼", MACE: "철퇴",
    POLEARM: "미늘창", SPEAR: "창", STAFF: "지팡이", WAND: "완드",
    SCEPTER: "셉터", CLAW: "손톱", MISSILE: "원거리 무기",
    ARMOR: "갑옷", HELM: "투구", SHIELD: "방패",
    PALADIN_SHIELD: "성기사 전용 방패", DRUID_PELT: "드루이드 전용 투구"
};

// [카테고리 그룹 정의]
const CATEGORIES = {
    MELEE: [
        ITEM_TYPES.SWORD, ITEM_TYPES.DAGGER, ITEM_TYPES.AXE, ITEM_TYPES.MACE, 
        ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR, ITEM_TYPES.STAFF, 
        ITEM_TYPES.WAND, ITEM_TYPES.SCEPTER, ITEM_TYPES.CLAW
    ],
    RANGED: [ITEM_TYPES.MISSILE],
    get WEAPON_ALL() { return [...this.MELEE, ...this.RANGED]; },
    ARMOR_ALL: [ITEM_TYPES.ARMOR, ITEM_TYPES.HELM, ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD, ITEM_TYPES.DRUID_PELT]
};

// 2. 룬 데이터
const runesData = [
    { id: 1, name: "El", kr: "엘", level: 11, weapon: "명중률 +15, 시야 +1", armor: "방어력 +15, 시야 +1" },
    { id: 2, name: "Eld", kr: "엘드", level: 11, weapon: "언데드에게 주는 피해 +75%, 언데드에 대한 명중률 +50", armor: "방기 확률 7% 증가" },
    { id: 3, name: "Tir", kr: "티르", level: 13, weapon: "적 처치 시 마나 +2", armor: "적 처치 시 마나 +2" },
    { id: 4, name: "Nef", kr: "네프", level: 13, weapon: "밀쳐내기", armor: "원거리 공격 방어력 +30" },
    { id: 5, name: "Eth", kr: "에드", level: 15, weapon: "적의 방어력 -25%", armor: "마나 재생 15%" },
    { id: 6, name: "Ith", kr: "아이드", level: 15, weapon: "최대 피해 +9", armor: "피해의 15%를 마나로 돌림" },
    { id: 7, name: "Tal", kr: "탈", level: 17, weapon: "독 피해 +75 (5초에 걸쳐)", armor: "독 저항 +30% (방패: +35%)" },
    { id: 8, name: "Ral", kr: "랄", level: 19, weapon: "화염 피해 +5-30", armor: "화염 저항 +30% (방패: +35%)" },
    { id: 9, name: "Ort", kr: "오르트", level: 21, weapon: "번개 피해 +1-50", armor: "번개 저항 +30% (방패: +35%)" },
    { id: 10, name: "Thul", kr: "주울", level: 23, weapon: "냉기 피해 +3-14 (3초에 걸쳐)", armor: "냉기 저항 +30% (방패: +35%)" },
    { id: 11, name: "Amn", kr: "앰", level: 25, weapon: "타격당 생명력 7% 훔침", armor: "공격자가 피해를 14 받음" },
    { id: 12, name: "Sol", kr: "솔", level: 27, weapon: "최소 피해 +9", armor: "물리 피해 7 감소" },
    { id: 13, name: "Shael", kr: "샤엘", level: 29, weapon: "공격 속도 +20%", armor: "타격 회복 속도 +20% (방패: 막기 속도 +20%)" },
    { id: 14, name: "Dol", kr: "돌", level: 31, weapon: "적중 시 괴물 도망 25%", armor: "생명력 회복 +7" },
    { id: 15, name: "Hel", kr: "헬", level: 0, weapon: "착용 조건 -20%", armor: "착용 조건 -15%" },
    { id: 16, name: "Io", kr: "이오", level: 35, weapon: "활력 +10", armor: "활력 +10" },
    { id: 17, name: "Lum", kr: "룸", level: 37, weapon: "에너지 +10", armor: "에너지 +10" },
    { id: 18, name: "Ko", kr: "코", level: 39, weapon: "민첩 +10", armor: "민첩 +10" },
    { id: 19, name: "Fal", kr: "팔", level: 41, weapon: "힘 +10", armor: "힘 +10" },
    { id: 20, name: "Lem", kr: "렘", level: 43, weapon: "괴물로부터 얻는 금화 75% 증가", armor: "괴물로부터 얻는 금화 50% 증가" },
    { id: 21, name: "Pul", kr: "풀", level: 45, weapon: "악마에게 주는 피해 +75%, 악마에 대한 명중률 +100", armor: "방어력 30% 증가" },
    { id: 22, name: "Um", kr: "우움", level: 47, weapon: "상처 악화 확률 25%", armor: "모든 저항 +15 (방패: +22)" },
    { id: 23, name: "Mal", kr: "말", level: 49, weapon: "괴물 회복 저지", armor: "마법 피해 7 감소" },
    { id: 24, name: "Ist", kr: "이스트", level: 51, weapon: "매직 아이템 발견 기회 30% 증가", armor: "매직 아이템 발견 기회 25% 증가" },
    { id: 25, name: "Gul", kr: "굴", level: 53, weapon: "명중률 20% 증가", armor: "독 저항 최대치 +5%" },
    { id: 26, name: "Vex", kr: "벡스", level: 55, weapon: "타격당 마나 7% 훔침", armor: "화염 저항 최대치 +5%" },
    { id: 27, name: "Ohm", kr: "오움", level: 57, weapon: "피해 50% 증가", armor: "냉기 저항 최대치 +5%" },
    { id: 28, name: "Lo", kr: "로", level: 59, weapon: "치명적 공격 20%", armor: "번개 저항 최대치 +5%" },
    { id: 29, name: "Sur", kr: "수르", level: 61, weapon: "목표물 시야 감소, 적중 시 눈먼 상태로 만듦", armor: "최대 마나 5% 증가 (방패: 마나 +50)" },
    { id: 30, name: "Ber", kr: "베르", level: 63, weapon: "강타 확률 20%", armor: "물리 피해 8% 감소" },
    { id: 31, name: "Jah", kr: "자", level: 65, weapon: "대상 방어력 무시", armor: "최대 생명력 5% 증가 (방패: 생명력 +50)" },
    { id: 32, name: "Cham", kr: "참", level: 67, weapon: "목표물 빙결 +3", armor: "빙결되지 않음" },
    { id: 33, name: "Zod", kr: "조드", level: 69, weapon: "파괴 불가", armor: "파괴 불가" }
];

const RUNE_MAP = runesData.reduce((acc, rune) => { acc[rune.kr] = rune; return acc; }, {});

// 3. 룬워드 데이터 (별칭 포함)
const runeWords = [
    // === Level 13 ===
    { name: "강철 (Steel)", alias: ["스틸"], runes: ["티르", "엘"], level: 13, sockets: 2, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], effects: "공격 속도 +25%, 피해 +20% 증가, 최소/최대 피해 +3, 치명적 공격 25%" },
    { name: "구렁텅이 (Nadir)", alias: ["나디르"], runes: ["네프", "티르"], level: 13, sockets: 2, types: [ITEM_TYPES.HELM], effects: "방어력 +50% 증가, 원거리 공격 방어력 +10, 힘 +5, 마나 +2, 시야 -3" },
    
    // === Level 15 ===
    { name: "악의 (Malice)", alias: ["멜리스"], runes: ["아이드", "엘", "에드"], level: 15, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], effects: "피해 +33% 증가, 상처 악화 확률 100%, 대상 방어력 -25%, 명중률 +50" },
    
    // === Level 17 ===
    { name: "잠행 (Stealth)", alias: ["스텔스"], runes: ["탈", "에드"], level: 17, sockets: 2, types: [ITEM_TYPES.ARMOR], effects: "달리기/걷기 속도 +25%, 시전 속도 +25%, 타격 회복 속도 +25%, 독 저항 +30%" },
    
    // === Level 19 ===
    { name: "잎새 (Leaf)", alias: ["꽃잎"], runes: ["티르", "랄"], level: 19, sockets: 2, types: [ITEM_TYPES.STAFF], note: "원소술사 기술 +3 옵션 재료 권장", effects: "화염 기술 +3, 화염 피해 추가, 마력 +10, 냉기 저항 +33%" },
    
    // === Level 21 ===
    { name: "고대인의 서약 (Ancient's Pledge)", alias: ["고대인의서약"], runes: ["랄", "오르트", "탈"], level: 21, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "방어력 +50% 증가, 냉기 저항 +30%, 화염/번개/독 저항 +35%" },
    { name: "서풍 (Zephyr)", alias: ["제퍼"], runes: ["오르트", "에드"], level: 21, sockets: 2, types: [ITEM_TYPES.MISSILE], effects: "타격 시 7% 확률로 1레벨 돌풍 시전, 달리기/걷기 +25%, 공격 속도 +25%, 피해 +33% 증가, 명중률 +66" },
    { name: "신성한 천둥 (Holy Thunder)", alias: ["홀리썬더"], runes: ["에드", "랄", "오르트", "탈"], level: 21, sockets: 4, types: [ITEM_TYPES.SCEPTER], effects: "피해 +60% 증가, 신성한 충격 +3, 최대 피해 +10, 번개 피해/저항 추가, 화염/독 피해 추가" },
    
    // === Level 23 ===
    { name: "귀감 (Pattern)", alias: ["패턴"], runes: ["탈", "오르트", "주울"], level: 23, sockets: 3, types: [ITEM_TYPES.CLAW], effects: "공격 속도 +30%, 피해 +40~80% 증가, 명중률 10% 보너스, 화염/번개/독 피해 추가, 모든 저항 +15" },
    
    // === Level 25 ===
    { name: "영혼 (Spirit) - 도검", alias: ["스피릿", "스피리트"], runes: ["탈", "주울", "오르트", "앰"], level: 25, sockets: 4, types: [ITEM_TYPES.SWORD], effects: "모든 기술 +2, 시전 속도 +25~35%, 타격 회복 +55%, 활력 +22, 마나 +89~112, 생명력 훔침 7%, 원소 피해 추가" },
    { name: "영혼 (Spirit) - 방패", alias: ["스피릿", "스피리트"], runes: ["탈", "주울", "오르트", "앰"], level: 25, sockets: 4, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], note: "성기사 전용 or 모너크", effects: "모든 기술 +2, 시전 속도 +25~35%, 타격 회복 +55%, 활력 +22, 마나 +89~112, 냉기/번개/독 저항 +35%, 마법 흡수" },
    { name: "강함 (Strength)", alias: ["스트렝스"], runes: ["앰", "티르"], level: 25, sockets: 2, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE, ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "피해 +35% 증가, 강타 확률 25%, 타격당 생명력 7% 훔침, 힘 +20, 활력 +10" },
    { name: "왕의 은총 (King's Grace)", alias: ["킹스그레이스"], runes: ["앰", "랄", "주울"], level: 25, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.SCEPTER], effects: "피해 +100% 증가, 명중률 +150, 악마/언데드에게 피해/명중률 추가, 적중당 생명력 7% 훔침" },
    { name: "신화 (Myth)", alias: ["미스"], runes: ["헬", "앰", "네프"], level: 25, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "야만용사 기술 +2, 착용 조건 -15%, 적중 시 10% 확률로 포효, 생명력 회복 +10" },
    { name: "모서리 (Edge)", alias: ["엣지"], runes: ["티르", "탈", "앰"], level: 25, sockets: 3, types: [ITEM_TYPES.MISSILE], effects: "장착 시 15레벨 가시 오라, 공격 속도 +35%, 악마/언데드에게 피해 추가, 상점 물품 가격 15% 하락" },
    
    // === Level 27 ===
    { name: "통찰 (Insight)", alias: ["통찰력", "인사이트"], runes: ["랄", "티르", "탈", "솔"], level: 27, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.STAFF, ITEM_TYPES.MISSILE], note: "2.4 패치부터 활/쇠뇌 제작 가능", effects: "장착 시 12~17레벨 명상 오라 효과, 시전 속도 +35%, 피해 +200~260% 증가, 명중률 보너스" },
    { name: "전승 (Lore)", alias: ["학식", "로어"], runes: ["오르트", "솔"], level: 27, sockets: 2, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "모든 기술 +1, 에너지 +10, 번개 저항 +30%, 물리 피해 감소 7" },
    { name: "명예 (Honor)", alias: ["아너"], runes: ["앰", "엘", "아이드", "티르", "솔"], level: 27, sockets: 5, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE, ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "모든 기술 +1, 피해 +160% 증가, 생명력 훔침 7%, 치명적 공격 25%, 힘 +10, 생명력 회복 +10" },
    
    // === Level 29 ===
    { name: "각운 (Rhyme)", alias: ["제왕운시", "라임"], runes: ["샤엘", "에드"], level: 29, sockets: 2, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "막기 속도 +40%, 막기 확률 20% 증가, 모든 저항 +25, 빙결되지 않음, 매찬 +25%" },
    { name: "평화 (Peace)", alias: ["피스"], runes: ["샤엘", "주울", "앰"], level: 29, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "아마존 기술 +2, 타격 시 2% 확률로 15레벨 발키리, 타격 회복 속도 +20%, 치명적 공격 +2%, 냉기 저항 +30%" },
    
    // === Level 35 ===
    { name: "순백 (White)", alias: ["화이트"], runes: ["돌", "이오"], level: 35, sockets: 2, types: [ITEM_TYPES.WAND], note: "뼈 창 +3 재료 권장", effects: "독과 뼈 기술 +3, 뼈 창 +2, 뼈 갑옷 +3, 시전 속도 +20%, 활력 +10" },
    { name: "마녀단 (Bulwark)", alias: ["불워크"], runes: ["샤엘", "이오", "솔"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "타격당 생명력 4~6% 훔침, 피해 감소 10~15%, 타격 회복 속도 +20%, 생명력 +10" },
    { name: "치료 (Cure)", alias: ["큐어"], runes: ["샤엘", "이오", "탈"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "장착 시 1레벨 정화 오라 효과, 독 저항 +40~60%, 타격 회복 속도 +20%, 생명력 +10" },
    { name: "경계 (Hearth)", alias: ["하스"], runes: ["샤엘", "이오", "주울"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "빙결되지 않음, 냉기 저항 +40~60%, 타격 회복 속도 +20%, 생명력 +10" },
    { name: "공허 (Ground)", alias: ["그라운드"], runes: ["샤엘", "이오", "오르트"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "번개 저항 +40~60%, 번개 흡수 +10~15%, 타격 회복 속도 +20%, 생명력 +10" },
    { name: "의식 (Temper)", alias: ["템퍼"], runes: ["샤엘", "이오", "랄"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "화염 저항 +40~60%, 화염 흡수 +10~15%, 타격 회복 속도 +20%, 생명력 +10" },
    { name: "광휘 (Radiance)", alias: ["찬란한빛", "래디언스"], runes: ["네프", "솔", "이오"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "방어력 +75% 증가, 활력/에너지 +10, 마나 +33, 물리 피해 7 감소, 마법 피해 3 감소, 시야 +3" },
    { name: "어둠 (Black)", alias: ["블랙"], runes: ["주울", "이오", "네프"], level: 35, sockets: 3, types: [ITEM_TYPES.MACE], note: "망치(Hammer), 곤봉(Club) 포함", effects: "피해 +120% 증가, 강타 확률 40%, 명중률 +200, 활력 +10, 마법 피해 2 감소, 시체 뒤집기" },
    
    // === Level 37 ===
    { name: "연기 (Smoke)", alias: ["스모크"], runes: ["네프", "룸"], level: 37, sockets: 2, types: [ITEM_TYPES.ARMOR], effects: "타격 회복 속도 +20%, 방어력 +75% 증가, 모든 저항 +50, 시야 -1" },
    { name: "기억 (Memory)", alias: ["메모리"], runes: ["룸", "이오", "솔", "에드"], level: 37, sockets: 4, types: [ITEM_TYPES.STAFF], note: "에너지 보호막 옵션 재료 권장", effects: "원소술사 기술 +3, 시전 속도 +33%, 최대 마나 20% 증가, 에너지 +10, 활력 +10, 마법 피해 7 감소" },
    { name: "광채 (Splendor)", alias: ["스플랜더"], runes: ["에드", "룸"], level: 37, sockets: 2, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], note: "강령술사 전용 방패 권장", effects: "모든 기술 +1, 시전 속도 +10%, 방어력 +60~100% 증가, 마나 +10, 마나 재생 15%, 마법 아이템 발견 20%" },
    { name: "순종 (Obedience)", alias: ["오비디언스"], runes: ["헬", "코", "주울", "에드", "팔"], level: 37, sockets: 5, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "적 처치 시 30% 확률로 마법부여 시전, 피해 +370% 증가, 강타 40%, 명중률 +40%, 모든 저항 +20~30, 방어력 +200~300" },
    
    // === Level 39 ===
    { name: "광기 (Hysteria) - 무기", alias: ["히스테리아", "투지", "Hustle", "허슬"], runes: ["샤엘", "코", "엘드"], level: 39, sockets: 3, types: CATEGORIES.WEAPON_ALL, effects: "5% 기회로 1레벨 폭발적인 속도, 1레벨 광신 오라, 공격 속도 +30%, 피해 +180~200% 증가, 언데드 피해 +75%" },
    { name: "발작 (Mania) - 갑옷", alias: ["마니아", "투지", "Hustle", "허슬"], runes: ["샤엘", "코", "엘드"], level: 39, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "달리기/걷기 +65%, 공격 속도 +40%, 타격 회복 속도 +20%, 민첩 +10, 지구력 고갈 속도 50% 둔화" },
    { name: "선율 (Melody)", alias: ["멜로디"], runes: ["샤엘", "코", "네프"], level: 39, sockets: 3, types: [ITEM_TYPES.MISSILE], effects: "피해 +50% 증가, 활과 쇠뇌 기술 +3, 회피/피하기/느리게 쏘기 +3, 공격 속도 +20%, 밀쳐내기" },
    { name: "조화 (Harmony)", alias: ["하모니"], runes: ["티르", "아이드", "솔", "코"], level: 39, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "장착 시 10레벨 원기 오라, 피해 +200~275% 증가, 원소 피해 추가, 민첩 +10, 발키리/부활 등 기술 보너스" },
    
    // === Level 41 ===
    { name: "불굴의 의지 (Unbending Will)", alias: ["언벤딩윌"], runes: ["팔", "이오", "아이드", "엘드", "엘", "헬"], level: 41, sockets: 6, types: [ITEM_TYPES.SWORD], effects: "공격 속도 +20~30%, 피해 +300~350% 증가, 피해 +9, 명중률 +50, 적중 당 생명력 훔침, 괴물 회복 저지" },
    
    // === Level 43 ===
    { name: "배신 (Treachery)", alias: ["트렛셔리"], runes: ["샤엘", "주울", "렘"], level: 43, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 5% 확률로 15레벨 흐리기(Fade) 시전, 공격 속도 +45%, 냉기 저항 +30%" },
    { name: "부 (Wealth)", alias: ["웰스"], runes: ["렘", "코", "티르"], level: 43, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "괴물로부터 얻는 금화 300% 증가, 마법 아이템 발견 확률 100% 증가, 민첩 +10, 적 처치 시 마나 +2" },
    { name: "열정 (Passion)", alias: ["패션"], runes: ["돌", "오르트", "엘드", "렘"], level: 43, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE, ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR, ITEM_TYPES.STAFF, ITEM_TYPES.WAND, ITEM_TYPES.SCEPTER, ITEM_TYPES.CLAW, ITEM_TYPES.DAGGER], effects: "광분 +1, 열의 +1, 공격 속도 +25%, 피해 +160~210% 증가, 명중률 50~80% 보너스, 눈멀기 +10" },
    { name: "집행자 (Lawbringer)", alias: ["법률위반", "로우브링어"], runes: ["앰", "렘", "코"], level: 43, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.SCEPTER, ITEM_TYPES.MACE], note: "철퇴는 망치(Hammer)만 가능", effects: "타격 시 20% 확률로 노화, 장착 시 16~18레벨 성역 오라, 원거리 방어 +75, 괴물 회복 저지" },
    { name: "이성의 목소리 (Voice of Reason)", alias: ["보이스오브리즌"], runes: ["렘", "코", "엘", "엘드"], level: 43, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.MACE], note: "철퇴는 둔기(Mace)류만 가능", effects: "타격 시 15% 확률로 얼음 보주, 빙결되지 않음, 적의 냉기 저항 -24%, 악마/언데드에게 피해 추가" },
    
    // === Level 45 ===
    { name: "깨우침 (Enlightenment)", alias: ["인라이트먼트"], runes: ["풀", "랄", "솔"], level: 45, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "원소술사 기술 +2, 마나 재생 15%, 방어력 +30%, 화염 저항 +30%, 물리 피해 7 감소" },
    { name: "지혜 (Wisdom)", alias: ["위즈덤"], runes: ["풀", "아이드", "엘드"], level: 45, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "관통 +33%, 공격 속도 +20%, 적중 시 마나 4~8% 훔침, 빙결되지 않음, 마나 +5, 적 처치 시 마나 +5" },
    
    // === Level 47 ===
    { name: "협박 (Duress)", alias: ["듀레스"], runes: ["샤엘", "우움", "주울"], level: 47, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "강타 확률 15%, 상처 악화 33%, 방어력 +150~200% 증가, 냉기 피해 추가, 모든 저항 +15, 냉기 저항 +45%" },
    { name: "어스름 (Gloom)", alias: ["글룸"], runes: ["팔", "우움", "풀"], level: 47, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 15% 확률로 3레벨 눈멀기, 방어력 +200~260% 증가, 모든 저항 +45, 타격 회복 속도 +10%" },
    { name: "초승달 (Crescent Moon)", alias: ["크레센트문"], runes: ["샤엘", "우움", "티르"], level: 47, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.POLEARM], note: "⚠️ 철퇴(Mace) 제작 불가", effects: "타격 시 7~10% 확률로 체인 라이트닝, 공격 속도 +20%, 피해 +180~220% 증가, 적의 번개 저항 -35%" },
    { name: "돌 (Stone)", alias: ["스톤"], runes: ["샤엘", "우움", "풀", "룸"], level: 47, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "방어력 +250~290% 증가, 타격 회복 속도 +60%, 힘 +16, 활력 +16, 점토 골렘 소환 (충전)" },
    { name: "뼈 (Bone)", alias: ["본"], runes: ["솔", "우움", "우움"], level: 47, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "강령술사 기술 +2, 마나 +100~150, 모든 저항 +30, 물리 피해 7 감소" },
    
    // === Level 49 ===
    { name: "맹독 (Venom)", alias: ["베놈"], runes: ["탈", "돌", "말"], level: 49, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE, ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR, ITEM_TYPES.STAFF, ITEM_TYPES.WAND, ITEM_TYPES.SCEPTER, ITEM_TYPES.CLAW, ITEM_TYPES.DAGGER], effects: "독 피해 +273 (6초), 괴물 회복 저지, 대상의 방어력 무시, 마나 훔침 7%, 몬스터 도주 25%" },
    { name: "신중 (Prudence)", alias: ["프루던스"], runes: ["말", "티르"], level: 49, sockets: 2, types: [ITEM_TYPES.ARMOR], note: "에테리얼 갑옷에 큐빙 후 제작 추천 (파괴불가 없음, 내구회복 있음)", effects: "방어력 +140~170% 증가, 모든 저항 +25~35, 물리 피해 감소 3, 마법 피해 감소 17, 내구도 1초당 1 회복" },
    { name: "성역 (Sanctuary)", alias: ["생츄어리"], runes: ["코", "코", "말"], level: 49, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "모든 저항 +50~70, 타격 회복 속도 +20%, 막기 속도/확률 +20%, 민첩 +20, 투사체 감속" },
    { name: "비 (Rain)", alias: ["레인"], runes: ["오르트", "말", "아이드"], level: 49, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "드루이드 기술 +2, 마나 +100~150, 번개 저항 +30%, 마법 피해 7 감소, 피격 시 5% 확률로 15레벨 회오리바람" },
    { name: "서약 (Oath)", alias: ["오쓰"], runes: ["샤엘", "풀", "말", "룸"], level: 49, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], note: "에테리얼 재료 필수 (파괴 불가)", effects: "파괴 불가, 공격 속도 +50%, 피해 +210~340% 증가, 16레벨 울버린의 심장(충전), 골렘 소환(충전)" },
    
    // === Level 51 ===
    { name: "착란 (Delirium)", alias: ["대표위원", "델리리움"], runes: ["렘", "이스트", "이오"], level: 51, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "모든 기술 +2, 피격 시 1% 확률로 50레벨 델리리움(변신), 방어력 +261, 활력 +10, 마법 아이템 발견 33%" },
    
    // === Level 53 ===
    { name: "모자이크 (Mosaic)", alias: ["모자이크"], runes: ["말", "굴", "주울"], level: 53, sockets: 3, types: [ITEM_TYPES.CLAW], effects: "피해 +200~250% 증가, 명중률 +20%, 냉기 피해 +3~14, 무술 마무리 기술 사용 시 충전 소모되지 않을 확률 50%" },
    { name: "왕 시해자 (Kingslayer)", alias: ["킹슬레이어"], runes: ["말", "우움", "굴", "팔"], level: 53, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE], effects: "복수 +1, 공격 속도 +30%, 피해 +230~270% 증가, 강타 33%, 상처 악화 50%, 방어력 -25%, 괴물 회복 저지" },
    { name: "원칙 (Principle)", alias: ["프린시플"], runes: ["랄", "굴", "엘드"], level: 53, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "성기사 기술 +2, 생명력 +100~150, 타격 시 50% 신성한 빛줄기, 독 저항 +50%" },
    { name: "균열 (Rift)", alias: ["리프트"], runes: ["헬", "코", "렘", "굴"], level: 53, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SCEPTER], effects: "타격 시 20% 확률로 회오리, 16% 확률로 얼음 보주, 마법/화염 피해 추가, 모든 능력치 +5~10, 민첩 +38" },
    
    // === Level 55 ===
    { name: "침묵 (Silence)", alias: ["사일런스"], runes: ["돌", "엘드", "헬", "이스트", "티르", "벡스"], level: 55, sockets: 6, types: CATEGORIES.WEAPON_ALL, effects: "모든 기술 +2, 공격 속도 +20%, 타격 회복 속도 +20%, 피해 +200% 증가, 모든 저항 +75, 마법 아이템 발견 확률 30% 증가" },
    { name: "참나무의 심장 (Heart of the Oak)", alias: ["오심", "오크의심장", "호토", "HOTO"], runes: ["코", "벡스", "풀", "주울"], level: 55, sockets: 4, types: [ITEM_TYPES.MACE, ITEM_TYPES.STAFF], note: "⚠️ 망치(Hammer)류 제작 불가. 프레일 권장.", effects: "모든 기술 +3, 시전 속도 +40%, 악마에게 피해 +75%, 마나 훔침 7%, 민첩 +10, 모든 저항 +30~40, 최대 마나 15%" },
    { name: "죽음 (Death)", alias: ["데스"], runes: ["헬", "엘", "벡스", "오르트", "굴"], level: 55, sockets: 5, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE], note: "에테리얼 재료 필수 (파괴 불가)", effects: "파괴 불가, 피해 +300~385% 증가, 강타 50%, 치명적 공격 40~50%, 명중률 +20%, 마나 훔침 7%" },
    { name: "꺼져가는 불길 (Flickering Flame)", alias: ["꺼불", "플리커링플레임"], runes: ["네프", "풀", "벡스"], level: 55, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "장착 시 4~8레벨 화염 저항 오라, 화염 기술 +3, 적의 화염 저항 -10~15%, 결빙 시간 절반 감소" },
    
    // === Level 57 ===
    { name: "소집 (Call to Arms)", alias: ["콜투", "콜투암스", "CTA"], runes: ["앰", "랄", "말", "이스트", "옴"], level: 57, sockets: 5, types: CATEGORIES.WEAPON_ALL, note: "크리스탈 소드/프레일 작을 많이 함", effects: "모든 기술 +1, 전투 명령 +1~6, 전투 지시 +1~6, 전투 함성 +1~4, 공격 속도 +40%" },
    { name: "혼돈 (Chaos)", alias: ["카오스"], runes: ["팔", "오움", "우움"], level: 57, sockets: 3, types: [ITEM_TYPES.CLAW], effects: "소용돌이(휠윈드) +1, 피해 +290~340% 증가, 공격 속도 +35%, 상처 악화 25%, 악마에게 피해 추가" },
    { name: "추방 (Exile)", alias: ["망명", "엑자일"], runes: ["벡스", "오움", "이스트", "돌"], level: 57, sockets: 4, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], subType: "성기사 전용", note: "에테리얼 전용 방패 필수 (내구 회복)", effects: "장착 시 13~16레벨 인내 오라, 타격 시 15% 확률로 생명력 추출, 방어력 +220~260%, 내구도 회복, 최대 저항 +5%" },
    
    // === Level 59 ===
    { name: "인내 (Fortitude) - 무기", alias: ["인내"], runes: ["엘", "솔", "돌", "로"], level: 59, sockets: 4, types: CATEGORIES.WEAPON_ALL, effects: "피해 +300% 증가, 20% 확률로 15레벨 냉기 갑옷, 모든 저항 +25~30, 치명적 공격 20%, 명중률 +50, 공격 성공 시 괴물 도주" },
    { name: "인내 (Fortitude) - 갑옷", alias: ["인내"], runes: ["엘", "솔", "돌", "로"], level: 59, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "피해 +300% 증가, 20% 확률로 15레벨 냉기 갑옷, 모든 저항 +25~30, 방어력 +200%, 레벨 비례 생명력 증가, 피해 감소 7" },
    { name: "슬픔 (Grief)", alias: ["깊은고뇌", "고뇌", "그리프"], runes: ["에드", "티르", "로", "말", "랄"], level: 59, sockets: 5, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE], effects: "피해 +340~400 추가(증가 아님), 공격 속도 +30~40%, 악마에게 피해/명중률 추가, 적의 독 저항 -25%, 방어력 무시" },
    
    // === Level 61 ===
    { name: "바람 (Wind)", alias: ["윈드"], runes: ["수르", "엘"], level: 61, sockets: 2, types: CATEGORIES.MELEE, effects: "타격 시 10% 확률로 9레벨 회오리바람, 달리기/걷기 +20%, 공격 속도 +40%, 명중률 +50, 시야 -3" },
    { name: "찔레 (Bramble)", alias: ["검은딸기", "브램블"], runes: ["랄", "오움", "수르", "에드"], level: 61, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "장착 시 15~21레벨 가시 오라, 독 기술 피해 +25~50%, 타격 회복 속도 +50%, 최대 마나 5%" },
    { name: "용 (Dragon) - 갑옷", alias: ["드래곤"], runes: ["수르", "로", "솔"], level: 61, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "장착 시 14레벨 신성한 불꽃, 피격 시 히드라, 힘 +35(레벨), 방어력 +360, 마나 +5% (수르), 최대 번개 저항 +5%" },
    { name: "용 (Dragon) - 방패", alias: ["드래곤"], runes: ["수르", "로", "솔"], level: 61, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "장착 시 14레벨 신성한 불꽃, 피격 시 히드라, 힘 +35(레벨), 방어력 +360, 마나 +50 (수르), 최대 번개 저항 +5%" },

    // === Level 63 ===
    { name: "무한 (Infinity)", alias: ["무공", "무한의공간", "인피니티"], runes: ["베르", "말", "베르", "이스트"], level: 63, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "장착 시 12레벨 선고 오라 효과, 달리기/걷기 +35%, 피해 +255~325% 증가, 적의 번개 저항 깎기" },
    { name: "명예의 굴레 (Chains of Honor)", alias: ["명굴", "체인오브아너", "COH"], runes: ["돌", "우움", "베르", "이스트"], level: 63, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "모든 기술 +2, 악마/언데드에게 피해 +200%/100%, 명중률 보너스, 생명력 훔침 8%, 모든 저항 +65, 힘 +20" },
    { name: "야수 (Beast)", alias: ["비스트"], runes: ["베르", "티르", "우움", "말", "룸"], level: 63, sockets: 5, types: [ITEM_TYPES.AXE, ITEM_TYPES.SCEPTER, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "장착 시 9레벨 광신 오라, 곰인간/변신술 +3, 공격 속도 +40%, 강타 20%, 상처 악화 25%, 힘 +25~40" },
    { name: "영원 (Eternity)", alias: ["이터니티"], runes: ["앰", "베르", "이스트", "솔", "수르"], level: 63, sockets: 5, types: CATEGORIES.MELEE, effects: "파괴 불가, 피해 +260~310% 증가, 적중 시 대상 실명, 감속 33%, 생명력 훔침 7%, 매직 아이템 발견 30%" },
    { name: "진노 (Wrath)", alias: ["래스"], runes: ["풀", "룸", "베르", "말"], level: 63, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "타격 시 30% 확률로 노화, 5% 확률로 생명력 추출, 악마/언데드에게 피해/명중률 대폭 추가, 결빙되지 않음" },
    
    // === Level 65 ===
    { name: "수수께끼 (Enigma)", alias: ["수수", "이니그마"], runes: ["자", "아이드", "베르"], level: 65, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "모든 기술 +2, 달리기/걷기 +45%, +1 순간이동(텔레포트), 레벨 비례 힘 증가, 피해 감소 8%" },
    { name: "불사조 (Phoenix) - 무기", alias: ["피닉스"], runes: ["벡스", "벡스", "로", "자"], level: 65, sockets: 4, types: CATEGORIES.WEAPON_ALL, effects: "10~15레벨 속죄 오라, 피해 +350~400% 증가, 적의 화염 저항 -28%, 치명적 공격 20%, 마나 훔침 14%, 방어력 무시" },
    { name: "불사조 (Phoenix) - 방패", alias: ["피닉스"], runes: ["벡스", "벡스", "로", "자"], level: 65, sockets: 4, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "10~15레벨 속죄 오라, 피해 +350~400% 증가, 적의 화염 저항 -28%, 생명력 +50, 최대 화염 +10%/번개 +5% 저항" },
    { name: "분노 (Fury)", alias: ["퓨리"], runes: ["자", "굴", "에드"], level: 65, sockets: 3, types: CATEGORIES.MELEE, effects: "피해 +209% 증가, 공격 속도 +40%, 상처 악화 66%, 치명적 공격 33%, 대상의 방어력 -25%, 명중률 20% 보너스" },
    { name: "기근 (Famine)", alias: ["패민"], runes: ["팔", "오움", "오르트", "자"], level: 65, sockets: 4, types: [ITEM_TYPES.AXE, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "공격 속도 +30%, 피해 +320~370% 증가, 대상 방어력 무시, 마법/화염/번개/냉기 피해 추가, 생명력 훔침 12%" },
    { name: "꿈 (Dream) - 투구", alias: ["드림"], runes: ["이오", "자", "풀"], level: 65, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "장착 시 15레벨 신성한 충격 오라, 타격 회복 +20~30%, 방어력 +150~220, 생명력 +5% 증가, 모든 저항 +5~20" },
    { name: "꿈 (Dream) - 방패", alias: ["드림"], runes: ["이오", "자", "풀"], level: 65, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "장착 시 15레벨 신성한 충격 오라, 타격 회복 +20~30%, 방어력 +150~220, 생명력 +50, 모든 저항 +5~20" },
    { name: "신념 (Faith)", alias: ["신뢰", "페이스"], runes: ["오움", "자", "렘", "엘드"], level: 65, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "장착 시 12~15레벨 광신 오라, 모든 기술 +1~2, 피해 +280% 증가, 목표물 방어력 무시, 모든 저항 +15, 부활(충전)" },
    { name: "얼음 (Ice)", alias: ["아이스"], runes: ["앰", "샤엘", "자", "로"], level: 65, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "장착 시 18레벨 신성한 빙결 오라, 피해 +140~210% 증가, 냉기 기술 피해 +25~30%, 적의 냉기 저항 -20%, 강타 20%" },
    { name: "낙인 (Brand)", alias: ["인두", "브랜드"], runes: ["자", "로", "말", "굴"], level: 65, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "피격 시 35% 확률로 피해 증폭, 뼈 창 발사, 악마에게 피해 +260~340%, 치명적 공격 20%, 밀쳐내기" },
    { name: "파괴 (Destruction)", alias: ["디스트럭션"], runes: ["벡스", "로", "베르", "자", "코"], level: 65, sockets: 5, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SWORD], effects: "타격 시 화산/타오르는 바위 시전, 강타 20%, 치명적 공격 20%, 대상 방어력 무시, 마나 훔침 7%" },
    { name: "마지막 소원 (Last Wish)", alias: ["마소", "라스트위시"], runes: ["자", "말", "자", "수르", "자", "베르"], level: 65, sockets: 6, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "장착 시 17레벨 위세 오라, 강타 60~70%, 타격 시 생명력 추출/흐리기 시전, 마법 아이템 발견 0.5%(레벨 비례)" },
    
    // === Level 67 ===
    { name: "정의의 손길 (Hand of Justice)", alias: ["정손", "핸드오브저스티스", "HOJ"], runes: ["수르", "참", "앰", "로"], level: 67, sockets: 4, types: CATEGORIES.WEAPON_ALL, effects: "장착 시 16레벨 신성한 불꽃 오라, 공격 속도 +33%, 피해 +280~330% 증가, 대상 방어력 무시, 적의 화염 저항 -20%" },
    { name: "파멸 (Doom)", alias: ["둠"], runes: ["헬", "오움", "우움", "로", "참"], level: 67, sockets: 5, types: [ITEM_TYPES.AXE, ITEM_TYPES.POLEARM, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "장착 시 12레벨 신성한 빙결 오라, 모든 기술 +2, 공격 속도 +45%, 피해 +330~370% 증가, 적의 냉기 저항 -40~60%" },
    { name: "긍지 (Pride)", alias: ["자존심", "프라이드"], runes: ["참", "수르", "이오", "로"], level: 67, sockets: 4, types: [ITEM_TYPES.POLEARM], effects: "장착 시 16~20레벨 집중 오라, 공격 등급 260~300% 보너스, 악마에게 피해 추가, 대상 시야 가림, 생명력 회복 +8" },
    { name: "역병 (Plague)", alias: ["플레이그"], runes: ["참", "샤엘", "우움"], level: 67, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.CLAW, ITEM_TYPES.DAGGER], effects: "피격 시 20% 확률로 저항 감소, 장착 시 13~17레벨 정화 오라, 모든 기술 +1~2, 독 저항 -23%" },
    { name: "안개 (Mist)", alias: ["미스트"], runes: ["참", "샤엘", "굴", "주울", "아이드"], level: 67, sockets: 5, types: [ITEM_TYPES.MISSILE], effects: "장착 시 8~12레벨 집중 오라, 모든 기술 +3, 공격 속도 +20%, 관통 +100%, 피해 +325~375% 증가" },
    
    // === Level 69 ===
    { name: "변신 (Metamorphosis)", alias: ["메타모포시스"], runes: ["참", "샤엘", "조드"], level: 69, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], subType: "드루이드 전용 투구", effects: "늑대인간 적중 시 180초 동안 증표 획득, 곰인간 적중 시 180초 동안 증표 획득, 강타 확률 25%" },
    { name: "죽어가는 자의 숨결 (Breath of the Dying)", alias: ["죽숨", "브레스오브더다잉", "BOTD"], runes: ["벡스", "헬", "엘", "엘드", "조드", "에드"], level: 69, sockets: 6, types: CATEGORIES.WEAPON_ALL, note: "에테리얼 재료 필수", effects: "파괴 불가, 50% 확률로 20레벨 맹독 확산, 피해 +350~400% 증가, 공격 속도 +60%, 마나/생명력 훔침, 모든 능력치 +30" },
    { name: "집착 (Obsession)", alias: ["옵세션"], runes: ["조드", "이스트", "렘", "룸", "이오", "네프"], level: 69, sockets: 6, types: [ITEM_TYPES.STAFF], note: "특정 기술 +3 옵션 재료 필수", effects: "파괴 불가, 모든 기술 +4, 시전 속도 +65%, 타격 회복 속도 +60%, 최대 생명력 15~25%, 모든 저항 +60~70" }
];


// ==================== LOGIC SECTION ====================
const gridContainer = document.getElementById('rune-grid');
const listContainer = document.getElementById('runeword-list');
const listTitle = document.getElementById('list-title');
const tooltip = document.getElementById('tooltip');

// HTML 필터 UI 생성
const filterSection = document.querySelector('.filter-controls');

function init() {
    rebuildFilterUI();
    renderRunes();
    setupFilterEvents();

    // [검색창 이벤트 연결]
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterRunewords();
        });
    }

    // URL 파라미터 처리
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
        }, 0);
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
        0, 1, 2, 3, 4, 5, 6, 7, 8,         // Row 1
        9, 10, 11, 12, 13, 14, 15, 16, 17, // Row 2
        18, 19, 20, 21, 22, 23, 24, 25, 26, // Row 3
        27, 28, null, null, null, null, null, 29, 30, // Row 4
        31, null, null, null, null, null, null, null, 32  // Row 5
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
    const filtered = runeWords.filter(rw => {
        // 1. 룬 매칭
        const runeMatch = selectedRunes.size === 0 || Array.from(selectedRunes).every(r => rw.runes.includes(r));
        // 2. 소켓 매칭
        const socketMatch = selectedSocket === 'all' || rw.sockets.toString() === selectedSocket;
        
        // 3. 타입 매칭
        let typeMatch = false;
        if (selectedType === 'all') {
            typeMatch = true;
        } else if (selectedType === 'MELEE') {
            typeMatch = rw.types.some(t => CATEGORIES.MELEE.includes(t));
        } else if (selectedType === 'RANGED') {
            typeMatch = rw.types.some(t => CATEGORIES.RANGED.includes(t));
        } else {
            typeMatch = rw.types.includes(selectedType);
        }

        // 4. 검색어 매칭 (이름 OR 별칭)
        let searchMatch = true;
        if (searchQuery) {
            const nameMatch = rw.name.toLowerCase().includes(searchQuery);
            const aliasMatch = rw.alias && rw.alias.some(a => a.toLowerCase().includes(searchQuery));
            searchMatch = nameMatch || aliasMatch;
        }

        return runeMatch && typeMatch && socketMatch && searchMatch;
    });

    updateListTitle();
    renderRunewordsList(filtered);
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
    listContainer.innerHTML = data.map(rw => {
        const runesHtml = rw.runes.map(krName => {
            const rune = RUNE_MAP[krName];
            
            if (rune) {
                const imgPath = `images/${rune.name}.png`;
                return `<div class="rw-rune-item" 
                            onclick="window.open('?rune=${encodeURIComponent(krName)}', '_blank')"
                            onmouseenter="showTooltip(event, RUNE_MAP['${krName}'])"
                            onmousemove="moveTooltip(event)"
                            onmouseleave="hideTooltip()">
                            <div class="rw-rune-icon">
                                <img src="${imgPath}" class="rune-img" alt="${rune.name}"
                                     onerror="this.style.display='none'; this.parentNode.innerText='${rune.name.substring(0,2)}'">
                            </div>
                            <div class="rw-rune-name">${krName}</div>
                        </div>`;
            } else {
                return `<div class="rw-rune-item"><div class="rw-rune-icon">??</div></div>`;
            }

        }).join('<span style="color:#444; margin-top:-15px">+</span>');

        const effectsHtml = rw.effects.split(', ').map(eff => `<div class="effect-line">${eff}</div>`).join('');
        
        const typeDisplay = rw.types.join(', ');
        const subTypeHtml = rw.subType ? `<span style="color:#d4c4a9; font-size:0.8em; margin-left:5px;">(${rw.subType})</span>` : '';
        const noteHtml = rw.note ? `<div style="color:#e05a5a; font-size:0.85em; margin-top:8px; padding-top:5px; border-top:1px dashed #333;">※ ${rw.note}</div>` : '';

        return `
            <div class="runeword-card">
                <div class="runeword-name">${rw.name}</div>
                <div class="runeword-info">
                    <span class="rw-level">Lv.${rw.level}</span> | 
                    <span class="rw-sockets">${rw.sockets}홈</span> | 
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

init();