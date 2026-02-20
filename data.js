// ==================== DATA SECTION ====================

// 1. 아이템 종류 상수 정의
const ITEM_TYPES = {
    SWORD: "도검", DAGGER: "단도", AXE: "도끼", MACE: "철퇴",
    POLEARM: "미늘창", SPEAR: "창", STAFF: "지팡이", WAND: "완드",
    SCEPTER: "셉터", CLAW: "손톱", MISSILE: "원거리 무기",
    ARMOR: "갑옷", HELM: "투구", SHIELD: "방패",
    PALADIN_SHIELD: "성기사 전용 방패", DRUID_PELT: "드루이드 전용 투구"
};

// 2. 카테고리 그룹 정의 (data.js)
const CATEGORIES = {
    MELEE: [
        ITEM_TYPES.SWORD, ITEM_TYPES.DAGGER, ITEM_TYPES.AXE, ITEM_TYPES.MACE, 
        ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR, ITEM_TYPES.STAFF, 
        ITEM_TYPES.WAND, ITEM_TYPES.SCEPTER, ITEM_TYPES.CLAW
    ],
    RANGED: [ITEM_TYPES.MISSILE],
    
    // 기본 전체 무기
    get WEAPON_ALL() { return [...this.MELEE, ...this.RANGED]; },

    // [추가할 내용] 4소켓 이상 제작 가능한 무기만 모아둔 카테고리!
    get WEAPON_4_SOCKETS_PLUS() { 
        return this.WEAPON_ALL.filter(type => 
            type !== ITEM_TYPES.DAGGER && 
            type !== ITEM_TYPES.CLAW && 
            type !== ITEM_TYPES.WAND
        ); 
    },
    
    ARMOR_ALL: [ITEM_TYPES.ARMOR, ITEM_TYPES.HELM, ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD, ITEM_TYPES.DRUID_PELT]
};

// 3. 룬 기본 데이터
const runesData = [
    { id: 1, name: "El", kr: "엘", level: 11, weapon: "명중률 +15, 시야 +1", armor: "방어력 +15, 시야 +1" },
    { id: 2, name: "Eld", kr: "엘드", level: 11, weapon: "언데드 피해 +75%<br>언데드 명중률 +50", armor: "투구/갑옷: 지구력 소모 15% 감소<br>방패: 막기 확률 7% 증가" },
    { id: 3, name: "Tir", kr: "티르", level: 13, weapon: "적 처치 시 마나 +2", armor: "적 처치 시 마나 +2" },
    { id: 4, name: "Nef", kr: "네프", level: 13, weapon: "밀쳐내기", armor: "원거리 공격 방어력 +30" },
    { id: 5, name: "Eth", kr: "에드", level: 15, weapon: "적의 방어력 -25%", armor: "마나 재생 15%" },
    { id: 6, name: "Ith", kr: "아이드", level: 15, weapon: "최대 피해 +9", armor: "받는 피해의 15% 만큼 마나 회복" },
    { id: 7, name: "Tal", kr: "탈", level: 17, weapon: "독 피해 +75 (5초에 걸쳐)", armor: "투구/갑옷: 독 저항 +30%<br>방패: 독 저항 +35%" },
    { id: 8, name: "Ral", kr: "랄", level: 19, weapon: "화염 피해 +5-30", armor: "투구/갑옷: 화염 저항 +30%<br>방패: 화염 저항 +35%" },
    { id: 9, name: "Ort", kr: "오르트", level: 21, weapon: "번개 피해 +1-50", armor: "투구/갑옷: 번개 저항 +30%<br>방패: 번개 저항 +35%" },
    { id: 10, name: "Thul", kr: "주울", level: 23, weapon: "냉기 피해 +3-14 (둔화 3초 지속)", armor: "투구/갑옷: 냉기 저항 +30%<br>방패: 냉기 저항 +35%" },
    { id: 11, name: "Amn", kr: "앰", level: 25, weapon: "적중당 생명력 7% 훔침", armor: "공격자가 피해를 14 받음" },
    { id: 12, name: "Sol", kr: "솔", level: 27, weapon: "최소 피해 +9", armor: "물리 피해 7 감소" },
    { id: 13, name: "Shael", kr: "샤엘", level: 29, weapon: "공격 속도 +20%", armor: "투구/갑옷: 타격 회복 속도 +20%<br>방패: 막기 속도 +20%" },
    { id: 14, name: "Dol", kr: "돌", level: 31, weapon: "적중 시 괴물 도주 25%", armor: "생명력 회복 +7" },
    { id: 15, name: "Hel", kr: "헬", level: 0, weapon: "착용 조건 -20%", armor: "착용 조건 -15%" },
    { id: 16, name: "Io", kr: "이오", level: 35, weapon: "활력 +10", armor: "활력 +10" },
    { id: 17, name: "Lum", kr: "룸", level: 37, weapon: "마력 +10", armor: "마력 +10" },
    { id: 18, name: "Ko", kr: "코", level: 39, weapon: "민첩 +10", armor: "민첩 +10" },
    { id: 19, name: "Fal", kr: "팔", level: 41, weapon: "힘 +10", armor: "힘 +10" },
    { id: 20, name: "Lem", kr: "렘", level: 43, weapon: "괴물에게서 얻는 금화 +75%", armor: "괴물에게서 얻는 금화 +50%" },
    { id: 21, name: "Pul", kr: "풀", level: 45, weapon: "악마에게 주는 피해 +75%<br>악마에 대한 명중률 +100", armor: "방어력 +30%" },
    { id: 22, name: "Um", kr: "우움", level: 47, weapon: "상처 악화 확률 +25%", armor: "투구/갑옷: 모든 저항 +15<br>방패: 모든 저항 +22" },
    { id: 23, name: "Mal", kr: "말", level: 49, weapon: "괴물 회복 저지", armor: "마법 피해 7 감소" },
    { id: 24, name: "Ist", kr: "이스트", level: 51, weapon: "매직 아이템 발견 기회 30% 증가", armor: "매직 아이템 발견 기회 25% 증가" },
    { id: 25, name: "Gul", kr: "굴", level: 53, weapon: "명중률 보너스 20%", armor: "최대 독 저항 +5%" },
    { id: 26, name: "Vex", kr: "벡스", level: 55, weapon: "적중당 마나 7% 훔침", armor: "최대 화염 저항 +5%" },
    { id: 27, name: "Ohm", kr: "오움", level: 57, weapon: "피해 +50%", armor: "최대 냉기 저항 +5%" },
    { id: 28, name: "Lo", kr: "로", level: 59, weapon: "치명적 공격 20%", armor: "최대 번개 저항 +5%" },
    { id: 29, name: "Sur", kr: "수르", level: 61, weapon: "적중 시 대상 실명", armor: "투구/갑옷: 최대 마나 +5%<br>방패: 마나 +50" },
    { id: 30, name: "Ber", kr: "베르", level: 63, weapon: "강타 확률 20%", armor: "받는 물리 피해 8% 감소" },
    { id: 31, name: "Jah", kr: "자", level: 65, weapon: "대상의 방어력 무시", armor: "투구/갑옷: 최대 생명력 5% 증가<br>방패: 생명력 +50" },
    { id: 32, name: "Cham", kr: "참", level: 67, weapon: "대상 빙결 +3", armor: "빙결되지 않음" },
    { id: 33, name: "Zod", kr: "조드", level: 69, weapon: "파괴 불가", armor: "파괴 불가" }
];

const RUNE_MAP = runesData.reduce((acc, rune) => { acc[rune.kr] = rune; return acc; }, {});

// 4. 🌟 룬워드 데이터 (앞으로는 여기서만 아이템 옵션을 수정하면 돼!)
const runeWords = [

        // === Level 13 ===

        { name: "강철 (Steel)", alias: ["스틸"], runes: ["티르", "엘"], level: 13, sockets: 2, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], effects: "공격 속도 +25%, 피해 +20% 증가, 최소 피해 +3, 최대 피해 +3, 명중률 +50, 상처 악화 확률 +50%, 적 처치 시 마나 +2, 시야 +1" },
        { name: "구렁텅이 (Nadir)", alias: ["나디르", "천저"], runes: ["네프", "티르"], level: 13, sockets: 2, types: [ITEM_TYPES.HELM], effects: "방어력 +50% 증가, 방어력 +10, 원거리 공격 방어력 +30, 힘 +5, 적 처치 시 마나 +2, 괴물에게서 얻는 금화 -33% 증가, 시야 -3, 13레벨 그림자 망토 (충전 9회)" },
        
        // === Level 15 ===

        { name: "악의 (Malice)", alias: ["멜리스", "원한"], runes: ["아이드", "엘", "에드"], level: 15, sockets: 3, types: CATEGORIES.MELEE, effects: "피해 +33% 증가, 최대 피해 +9, 대상의 방어력 -25%, 명중률 +50, 상처 악화 확률 +100%, 괴물 회복 저지, 적중당 괴물 방어력 -100 감소, 생명력 흡수 -5" },
        
        // === Level 17 ===

        { name: "잠행 (Stealth)", alias: ["스텔스"], runes: ["탈", "에드"], level: 17, sockets: 2, types: [ITEM_TYPES.ARMOR], effects: "달리기/걷기 속도 +25%, 시전 속도 +25%, 타격 회복 속도 +25%, 민첩+6, 마나 재생 15%, 최대 지구력 +15, 독 저항 +30%, 마법 피해 3 감소" },
        
        // === Level 19 ===

        { name: "잎새 (Leaf)", alias: ["꽃잎"], runes: ["티르", "랄"], level: 19, sockets: 2, types: [ITEM_TYPES.STAFF], note: "화염 속성 기술 직업 권장", effects: "화염 기술 +3, 화염 피해 5-30 추가, +3 지옥불 (원소술사 전용), +3 온기 (원소술사 전용), +3 화염탄 (원소술사 전용), 방어력 +(캐릭터 레벨 x2), 냉기 저항 +33%, 적 처치 시 마나 +2" },
        
        // === Level 21 ===

        { name: "고대인의 서약 (Ancient's Pledge)", alias: ["고대인의서약"], runes: ["랄", "오르트", "탈"], level: 21, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "방어력 +50% 증가, 냉기 저항 +43%, 화염 저항 +48%, 번개 저항 +48%, 독 저항 +48%, 받는 피해의 +10%만큼 마나 회복" },
        { name: "서풍 (Zephyr)", alias: ["제퍼"], runes: ["오르트", "에드"], level: 21, sockets: 2, types: [ITEM_TYPES.MISSILE], effects: "피격 시 7% 확률로 1레벨 돌개바람 시전, 걷기/달리기 속도 +25%, 공격 속도 +25%, 피해 +33% 증가, 대상의 방어력 -25%, 명중률 +66, 번개 피해 1-50 추가, 방어력 +25" },
        
        // === Level 23 ===

        { name: "귀감 (Pattern)", alias: ["패턴"], runes: ["탈", "오르트", "주울"], level: 23, sockets: 3, types: [ITEM_TYPES.CLAW], effects: "막기 속도 +30%, 피해 +40-80% 증가, 명중률 보너스 10%, 화염 피해 17-62 추가, 번개 피해 1-50 추가, 냉기 피해 3-14 추가, 독 피해 +75 (5초에 걸쳐), 힘 +6, 민첩 +6, 모든 저항 +15" },

	// === Level 24 ===

        { name: "신성한 천둥 (Holy Thunder)", alias: ["홀리썬더", "신성한 번개"], runes: ["에드", "랄", "오르트", "탈"], level: 24, sockets: 4, types: [ITEM_TYPES.SCEPTER], effects: "피해 +60% 증가, 최대 피해 +10, 대상의 방어력 -25%, 화염 피해 5-30 추가, 번개 피해 21-110 추가, 독 피해 +75 (5초에 걸처), +3 신성한 충격 (성기사 전용), 최대 번개 저항 +5%, 번개 저항 +60%, 7레벨 연쇄 번개 (충전 60회)" },
        
        // === Level 25 ===

        { name: "영혼 (Spirit) - 도검", alias: ["스피릿", "스피리트"], runes: ["탈", "주울", "오르트", "앰"], level: 25, sockets: 4, types: [ITEM_TYPES.SWORD], effects: "모든 기술 +2, 시전 속도 +25-35%, 타격 회복 속도 +55%, 번개 피해 1-50 추가, 냉기 피해 3-14 추가, 독 피해 +75 (5초에 걸쳐), 적중당 생명력 7% 훔침, 원거리 공격 방어력 +250, 활력 +22, 마나 +89-112, 마법 흡수 +3-8" },
        { name: "영혼 (Spirit) - 방패", alias: ["스피릿", "스피리트"], runes: ["탈", "주울", "오르트", "앰"], level: 25, sockets: 4, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "모든 기술 +2, 시전 속도 +25-35%, 타격 회복 속도 +55%, 원거리 공격 방어력 +250, 활력 +22, 마나 +89-112, 냉기 저항 +35%, 번개 저항 +35%, 독 저항 +35%, 마법 흡수 +3-8, 공격자가 피해를 14 받음" },
        { name: "강함 (Strength)", alias: ["스트렝스"], runes: ["앰", "티르"], level: 25, sockets: 2, types: CATEGORIES.MELEE, effects: "피해 +35% 증가, 적중당 생명력 7% 훔침, 강타 확률 +25%, 힘 +20, 활력 +10, 적 처치 시 마나 +2" },
        { name: "왕의 은총 (King's Grace)", alias: ["킹스그레이스", "왕의자비"], runes: ["앰", "랄", "주울"], level: 25, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.SCEPTER], effects: "피해 +100% 증가, 명중률 +150, 악마에게 주는 피해 +100%, 악마에 대한 명중률 +100, 언데드에게 주는 피해 +50%, 언데드에 대한 명중률 +100, 화염 피해 5-30 추가, 냉기 피해 3-14 추가, 적중당 생명력 7% 훔침" },
        { name: "신화 (Myth)", alias: ["미스"], runes: ["헬", "앰", "네프"], level: 25, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 3% 확률로 1레벨 포효 시전, 타격 시 10% 확률로 1레벨 도발 시전, 야만용사 기술 레벨 +2, 원거리 공격 방어력 +30, 생명력 회복 +10, 공격자가 피해를 14 받음, 착용 조건 -15%" },
        { name: "모서리 (Edge)", alias: ["엣지"], runes: ["티르", "탈", "앰"], level: 25, sockets: 3, types: [ITEM_TYPES.MISSILE], effects: "장착 시 15레벨 가시 오라 효과 적용, 공격 속도 +35%, 악마에게 주는 피해 +320-380%, 언데드에게 주는 피해 +280%, 독 피해 +75 (5초에 걸쳐), 적중당 생명력 7% 훔침, 괴물 회복 저지, 모든 능력치 +5-10, 적 처치 시 마나 +2, 상점 물품 가격 15% 하락" },
        
        // === Level 27 ===

        { name: "통찰 (Insight)", alias: ["통찰력", "인사이트"], runes: ["랄", "티르", "탈", "솔"], level: 27, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.STAFF, ITEM_TYPES.MISSILE], note: "2.4 패치부터 활/쇠뇌 제작 가능", effects: "장착 시 12-17레벨 명상 오라 효과 적용, 시전 속도 +35%, 피해 +200-260% 증가, 최소 피해 +9, 명중률 보너스 180-250%, 화염 피해 5-30 추가, 독 피해 +75 (5초에 걸쳐), +1-6 치명타, 모든 능력치 +5, 적 처치 시 마나 +2, 매직 아이템 발견 확률 23% 증가" },
        { name: "전승 (Lore)", alias: ["학식", "로어"], runes: ["오르트", "솔"], level: 27, sockets: 2, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "모든 기술 +1, 마력 +10, 번개 저항 +30%, 피해 7 감소, 적 처치 시 마나 +2, 시야 +2" },
        { name: "명예 (Honor)", alias: ["아너"], runes: ["앰", "엘", "아이드", "티르", "솔"], level: 27, sockets: 5, types: CATEGORIES.MELEE, effects: "모든 기술 +1, 피해 +160% 증가, 최소 피해 +9, 최대 피해 +9, 치명적 공격 +25%, 명중률 +250, 적중당 생명력 7%, 힘 +10, 생명력 회복 +10, 적 처치 시 마나 +2, 시야 +1" },
        { name: "광휘 (Radiance)", alias: ["찬란한빛", "래디언스"], runes: ["네프", "솔", "아이드"], level: 27, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "방어력 +75% 증가, 원거리 공격 방어력 +30, 활력 +10, 마력 +10, 마나 +33, 물리 피해 7 감소, 마법 피해 3 감소, 받는 피해의 +15% 만큼 마나 회복, 시야 +3" },
    
        // === Level 29 ===

        { name: "각운 (Rhyme)", alias: ["제왕운시", "라임"], runes: ["샤엘", "에드"], level: 29, sockets: 2, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "막기 속도 +40%, 막기 확률 20% 증가, 마나 재생 15%, 모든 저항 +25, 빙결되지 않음, 괴물에게서 얻는 금화 50% 증가, 매직 아이템 발견 확률 25% 증가" },
        { name: "평화 (Peace)", alias: ["피스"], runes: ["샤엘", "주울", "앰"], level: 29, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 4% 확률로 5레벨 투사체 감속 시전, 타격 시 2% 확률로 15레벨 발키리 시전, 아마존 기술 레벨 +2, 타격 회복 속도 +20%, +2 치명타, 냉기 저항 +30%, 공격자가 피해를 14 받음" },
	{ name: "권위 (Authority)", alias: ["어소리티"], runes: ["헬", "샤엘", "랄"], level: 29, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "타격 시 10% 확률로 15레벨 독기 사슬 시전, 피격 시 2% 확률로 10레벨 정신 결계 시전, 악마술사 기술 +2, 타격 회복 속도 +20%, 피해 +40-60% 증가, 착용 조건 -15%, 화염 저항 +30%" },
        
        // === Level 35 ===

        { name: "순백 (White)", alias: ["화이트"], runes: ["돌", "이오"], level: 35, sockets: 2, types: [ITEM_TYPES.WAND], note: "뼈 창 +3 재료 권장", effects: "독과 뼈 기술 +3 (강령술사 전용), 시전 속도 +20%, +2 뼈 창 (강령술사 전용), +4 해골 숙련 (강령술사 전용), +3 뼈 갑옷 (강령술사 전용), 적중 시 괴물 도주 +25%, 활력 +10, 마나 +13, 마법 피해 4 감소" },
        { name: "치료 (Cure)", alias: ["큐어"], runes: ["샤엘", "이오", "탈"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], ladder: true, effects: "장착 시 1레벨 정화 오라 효과 적용, 타격 회복 속도 +20%, 방어력 +75-100%, 활력 +10, 최대 생명력 +5%, 독 저항 +40-60%, 중독 시간 50% 감소" },
        { name: "화로 (Hearth)", alias: ["하스"], runes: ["샤엘", "이오", "주울"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], ladder: true, effects: "빙결되지 않음, 타격 회복 속도 +20%, 방어력 +75-100%, 활력 +10, 최대 생명력 +5%, 냉기 저항 +40-60%, 냉기 흡수 +10-15%, 빙결되지 않음" },
        { name: "접지 (Ground)", alias: ["그라운드"], runes: ["샤엘", "이오", "오르트"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], ladder: true, effects: "타격 회복 속도 +20%, 방어력 +75-100%, 활력 +10, 최대 생명력 +5%, 번개 저항 +40-60%, 번개 흡수 +10-15%" },
        { name: "담금질 (Temper)", alias: ["템퍼"], runes: ["샤엘", "이오", "랄"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], ladder: true, effects: "타격 회복 속도 +20%, 방어력 +75-100%, 활력 +10, 최대 생명력 +5%, 화염 저항 +40-60%, 화염 흡수 +10-15%" },
        { name: "방벽 (Bulwark)", alias: ["불워크"], runes: ["샤엘", "이오", "솔"], level: 35, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], ladder: true, effects: "타격 회복 속도 +20%, 적중당 생명력 4-6% 훔침, 방어력 +75-100%, 활력 +10, 최대 생명력 +5%, 생명력 회복 30, 피해 7 감소, 받는 물리 피해 감소 10-15%" },
        { name: "어둠 (Black)", alias: ["블랙"], runes: ["주울", "이오", "네프"], level: 35, sockets: 3, types: [ITEM_TYPES.MACE], note: "망치(Hammer), 곤봉(Club) 포함", effects: "공격 속도 +15%, 피해 +120% 증가, 명중률 +200, 냉기 피해 3-14 추가, 강타 확률 +40%, 밀쳐내기, 활력 +10, 마법 피해 2 감소, 4레벨 시체 폭발(충전 12회)" },
        
        // === Level 37 ===

        { name: "연기 (Smoke)", alias: ["스모크"], runes: ["네프", "룸"], level: 37, sockets: 2, types: [ITEM_TYPES.ARMOR], effects: "타격 회복 속도 +20%, 방어력 +75% 증가, 원거리 공격 방어력 +280, 마력 +10, 모든 저항 +50, 시야 -1, 6레벨 약화(충전 18회)" },
        { name: "기억 (Memory)", alias: ["메모리"], runes: ["룸", "이오", "솔", "에드"], level: 37, sockets: 4, types: [ITEM_TYPES.STAFF], note: "양손 지팡이, 에너지 보호막 옵션 재료 권장", effects: "원소술사 기술 레벨 +3, 시전 속도 +33%, +3 마력 보호막 (원소술사 전용), +2 전자기장 (원소술사 전용), 방어력 +50% 증가, 활력 +10, 마력 +10, 최대 마나 20% 증가, 마법 피해 7 감소, 대상의 방어력 -25%" },
        { name: "광채 (Splendor)", alias: ["스플랜더"], runes: ["에드", "룸"], level: 37, sockets: 2, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], note: "강령술사 전용 방패 권장", effects: "모든 기술 +1, 시전 속도 +10%, 막기 속도 +20%, 방어력 +60-100% 증가, 마력 +10, 마나 재생 15%, 괴물에게서 얻는 금화 50% 증가, 매직 아이템 발견 확률 20% 증가, 시야 +3" },
            
        // === Level 39 ===

        { name: "광기 (Mania) - 무기", alias: ["마니아", "투지", "Hustle", "허슬"], runes: ["샤엘", "코", "엘드"], level: 39, sockets: 3, types: CATEGORIES.WEAPON_ALL, ladder: true, effects: "타격 시 5% 확률로 1레벨 폭발적인 속도 시전, 장착 시 1레벨 광신 오라 효과 적용, 공격 속도 +30%, 피해 +180-200%, 언데드에게 주는 피해 +75%, 언데드에 대한 명중률 +50, 민첩 +10" },
        { name: "발작 (Hysteria) - 갑옷", alias: ["히스테리아", "투지", "Hustle", "허슬"], runes: ["샤엘", "코", "엘드"], level: 39, sockets: 3, types: [ITEM_TYPES.ARMOR], ladder: true, effects: "걷기/달리기 속도 +65%, 공격 속도 +40%, 타격 회복 속도 +20%, +6 피하기, 민첩 +10, 모든 저항 +10, 지구력 고갈 속도 -50%" },
        { name: "선율 (Melody)", alias: ["멜로디"], runes: ["샤엘", "코", "네프"], level: 39, sockets: 3, types: [ITEM_TYPES.MISSILE], effects: "활과 쇠뇌 기술 +3 (아마존 전용), 공격 속도 +20%, 피해 +50% 증가, 언데드에게 주는 피해 +300%, +3 투사체 감속 (아마존 전용), +3 흘리기 (아마존 전용), +3 치명타 (아마존 전용), 밀쳐내기, 민첩 +10" },
        { name: "조화 (Harmony)", alias: ["하모니"], runes: ["티르", "아이드", "솔", "코"], level: 39, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "장착 시 10레벨 원기 오라 효과 적용, 피해 +200-275% 증가, 최소 피해 +9, 최대 피해 +9, 화염 피해 55-160 추가, 번개 피해 55-160 추가, 냉기 피해 55-160 추가, +2-6 발키리, 민첩 +10, 마나 재생 20%, 적 처치 시 마나 +2, 시야 +2, 20레벨 부활 (충전 25회)" },
        
        // === Level 41 ===

	    { name: "용맹 (Lionheart)", alias: ["라이온하트"], runes: ["헬", "룸", "팔"], level: 41, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피해 +20% 증가, 힘 +25, 민첩 +15, 활력 +20, 마력 +10, 생명력 +50, 모든 저항 +30, 착용 조건 -15%" },
        { name: "불굴의 의지 (Unbending Will)", alias: ["언벤딩윌"], runes: ["팔", "이오", "아이드", "엘드", "엘", "헬"], level: 41, sockets: 6, types: [ITEM_TYPES.SWORD], effects: "타격 시 18% 확률로 18레벨 도발 시전, 전투 기술 +3 (야만용사 전용), 공격 속도 +20-30%, 피해 +300-350% 증가, 최대 피해 +9, 명중률 +50, 언데드에게 주는 피해 +75%, 언데드에 대한 명중률 +50, 적중당 생명력 8-10% 훔침, 괴물 회복 저지, 힘 +10, 활력 +10, 피해 8 감소, 시야 +1, 착용 조건 -20%" },
        { name: "순종 (Obedience)", alias: ["오비디언스"], runes: ["헬", "코", "주울", "에드", "팔"], level: 41, sockets: 5, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "적 처치 시 30% 확률로 21레벨 마법부여 시전, 타격 회복 속도 +40%, 피해 +370% 증가, 대상의 방어력 -25%, 냉기 피해 3-14 추가, 적의 화염 저항 -25%, 강타 확률 +40%, 방어력 +200-300, 힘 +10, 민첩 +10, 모든 저항 +20-30, 착용 조건 -20%" },
    
        // === Level 43 ===

        { name: "배신 (Treachery)", alias: ["트렛셔리"], runes: ["샤엘", "주울", "렘"], level: 43, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 5% 확률로 15레벨 흐리기 시전, 타격 시 25% 확률로 15레벨 맹독 시전, 암살자 기술 레벨 +2, 공격 속도 +45%, 타격 회복 속도 +20%, 냉기 저항 +30%, 괴물에게서 얻는 금화 50% 증가" },
        { name: "부 (Wealth)", alias: ["웰쓰"], runes: ["렘", "코", "티르"], level: 43, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "민첩 +10, 적 처치 시 마나 +2, 괴물에게서 얻는 금화 300% 증가, 매직 아이템 발견 확률 100% 증가" },
        { name: "열정 (Passion)", alias: ["패션"], runes: ["돌", "오르트", "엘드", "렘"], level: 43, sockets: 4, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, effects: "공격 속도 +25%, 피해 +160-210% 증가, 명중률 보너스 50-80%, 언데드에게 주는 피해 +75%, 언데드에 대한 명중률 +50, 번개 피해 1-50 추가, +1 광폭화, +1 열의, 적중 시 대상 실명 +10, 적중 시 괴물 도주 +25%, 괴물에게서 얻는 금화 75% 증가, 3레벨 울버린의 심장 (충전 12회)" },
        { name: "집행자 (Lawbringer)", alias: ["법률위반", "로우브링어"], runes: ["앰", "렘", "코"], level: 43, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.SCEPTER, ITEM_TYPES.MACE], note: "철퇴는 망치(Hammer)만 가능", effects: "타격 시 20% 확률로 15레벨 노화 시전, 장착 시 16-18레벨 성역 오라 효과 적용, 대상의 방어력 -50%, 화염 피해 150-210 추가, 냉기 피해 130-180 추가, 적중당 생명력 7% 훔침, 처치한 괴물이 안식에 듦, 원거리 공격 방어력 +200-250, 민첩 +10, 괴물에게서 얻는 금화 75% 증가" },
        { name: "이성의 목소리 (Voice of Reason)", alias: ["보이스오브리즌", "이유있는 항변"], runes: ["렘", "코", "엘", "엘드"], level: 43, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.MACE], effects: "타격 시 15% 확률로 13레벨 얼음 보주 시전, 타격 시 18% 확률로 20레벨 얼음 작렬 시전, 명중률 +50, 악마에게 주는 피해 +220-350%, 언데드에게 주는 피해 +355-375%, 언데드에 대한 명중률 +50, 냉기 피해 100-220 추가, 적의 냉기 저항 -24%, 민첩 +10, 빙결되지 않음, 괴물에게서 얻는 금화 75% 증가, 시야 +1" },
        
        // === Level 45 ===

        { name: "깨우침 (Enlightenment)", alias: ["인라이트먼트"], runes: ["풀", "랄", "솔"], level: 45, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 5% 확률로 15레벨 불길 시전, 공격 시 5% 확률로 15레벨 화염구 시전, 원소술사 기술 레벨 +2, +1 온기, 방어력 +30% 증가, 화염 저항 +30%, 피해 7 감소" },
        { name: "지혜 (Wisdom)", alias: ["위즈덤"], runes: ["풀", "아이드", "엘드"], level: 45, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "관통 공격 +33%, 명중률 보너스 15-25%, 적중당 마나 4-8% 훔침, 방어력 +30% 증가, 마력 +10, 지구력 고갈 속도 15% 감소, 빙결되지 않음, 적 처치 시 마나 +5, 받는 피해의 +15%만큼 마나 회복" },
        
        // === Level 47 ===

        { name: "협박 (Duress)", alias: ["듀레스"], runes: ["샤엘", "우움", "주울"], level: 47, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "타격 회복 속도 +40%, 피해 +10-20% 증가, 냉기 피해 37-133 추가, 강타 확률 +15%, 상처 악화 확률 +33%, 방어력 +150-200% 증가, 지구력 고갈 속도 20% 감소, 냉기 저항 +45%, 번개 저항 +15%, 화염 저항 +15%, 독 저항 +15%" },
        { name: "어스름 (Gloom)", alias: ["글룸"], runes: ["팔", "우움", "풀"], level: 47, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 15% 확률로 3레벨 시야 흐리기 시전, 타격 회복 속도 +10%, 방어력 +200-260% 증가, 힘 +10, 모든 저항 +45, 빙결 지속시간 절반으로 감소, 받는 피해의 +5%만큼 마나 회복, 시야 -3" },
        { name: "초승달 (Crescent Moon)", alias: ["크레센트문"], runes: ["샤엘", "우움", "티르"], level: 47, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.POLEARM], effects: "타격 시 10% 확률로 17레벨 연쇄 번개 시전, 타격 시 7% 확률로 13레벨 전자기장 시전, 공격 속도 +20%, 피해 +180-220% 증가, 대상의 방어력 무시, 적의 번개 저항 -35%, 상처 악화 확률 +25%, 마법 흡수 +9-11, 적 처치 시 마나 +2, 18레벨 영혼 늑대 소환 (충전 30회)" },
        { name: "돌 (Stone)", alias: ["스톤"], runes: ["샤엘", "우움", "풀", "룸"], level: 47, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "타격 회복 속도 +60%, 방어력 +250-290% 증가, 원거리 공격 방어력 +300, 힘 +16, 활력 +16, 마력 +10, 모든 저항 +15, 16레벨 타오르는 바위 (충전 80회), 16레벨 점토 골렘 (충전 16회)" },
        { name: "뼈 (Bone)", alias: ["본"], runes: ["솔", "우움", "우움"], level: 47, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 15% 확률로 10레벨 뼈 갑옷 시전, 타격 시 15% 확률로 10레벨 뼈 창 시전, 강령술사 기술 레벨 +2, 마나 +100-150, 모든 저항 +30, 피해 7 감소" },
        
        // === Level 49 ===

        { name: "맹독 (Venom)", alias: ["베놈"], runes: ["탈", "돌", "말"], level: 49, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE, ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR, ITEM_TYPES.STAFF, ITEM_TYPES.WAND, ITEM_TYPES.SCEPTER, ITEM_TYPES.CLAW, ITEM_TYPES.DAGGER], effects: "대상의 방어력 무시, 독 피해 +273 (6초에 걸쳐), 적중당 마나 7% 훔침, 괴물 회복 저지, 적중 시 괴물 도주 +25%, 13레벨 맹독 확산 (충전 11회), 15레벨 맹독 폭발 (충전 27회)" },
        { name: "신중 (Prudence)", alias: ["프루던스", "현명"], runes: ["말", "티르"], level: 49, sockets: 2, types: [ITEM_TYPES.ARMOR], note: "에테리얼 갑옷에 홈 제작 추천 (내구도 회복)", effects: "타격 회복 속도 +25%, 방어력 +140-170% 증가, 모든 저항 +25-35, 피해 3 감소, 마법 피해 17 감소, 적 처치 시 마나 +2, 시야 +1, 내구도 1 회복 (4초마다)" },
        { name: "성역 (Sanctuary)", alias: ["생츄어리"], runes: ["코", "코", "말"], level: 49, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "타격 회복 속도 +20%, 막기 속도 +20%, 막기 확률 20% 증가, 방어력 +130-160% 증가, 원거리 공격 방어력 +250, 민첩 +20, 모든 저항 +50-70, 마법 피해 7 감소, 12레벨 투사체 감속 (충전 60회)" },
        { name: "비 (Rain)", alias: ["레인"], runes: ["오르트", "말", "아이드"], level: 49, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "피격 시 5% 확률로 15레벨 회오리 갑옷 시전, 타격 시 5% 확률로 15레벨 돌개바람 시전, 드루이드 기술 레벨 +2, 마나 +100-150, 번개 저항 +30%, 마법 피해 7 감소, 받는 피해의 +15%만큼 마나 회복" },
        { name: "서약 (Oath)", alias: ["오쓰", "허약", "빈약", "쇠약"], runes: ["샤엘", "풀", "말", "룸"], level: 49, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], note: "에테리얼 재료 권장 (파괴 불가)", effects: "파괴 불가, 타격 시 30% 확률로 20레벨 뼈 영혼 시전, 공격 속도 +50%, 피해 +210-340% 증가, 악마에게 주는 피해 +75%, 악마에 대한 명중률 +100, 괴물 회복 저지, 마력 +10, 마법 흡수 +10-15, 16레벨 울버린의 심장(충전 20회), 17레벨 강철 골렘(충전 14회)" },
        
        // === Level 51 ===

        { name: "착란 (Delirium)", alias: ["대표위원", "델리리움"], runes: ["렘", "이스트", "이오"], level: 51, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "피격 시 1% 확률로 50레벨 착란 시전, 피격 시 6% 확률로 14레벨 정신 폭발 시전, 피격 시 14% 확률로 13레벨 공포 시전, 타격 시 11% 확률로 18레벨 혼란 시전, 모든 기술 +2, 방어 +261, 활력 +10, 괴물에게서 얻는 금화 50% 증가, 매직 아이템 발견 확률 25% 증가, 17레벨 유혹 (충전 60회)" },
        { name: "마녀단 (Coven)", alias: ["코븐"], runes: ["이스트", "랄", "이오"], level: 51, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "피격 시 5% 확률로 10레벨 인장: 무기력 시전, 모든 기술 +1, 시전 속도 +20%, 방어력 +30-50%, 활력 +10, 화염 저항 +30, 적 처치 시 생명력 +1-5, 매직 아이템 발견 확률 26-40%" },
    
        // === Level 53 ===

        { name: "모자이크 (Mosaic)", alias: ["모자이크"], runes: ["말", "굴", "앰"], level: 53, sockets: 3, types: [ITEM_TYPES.CLAW], effects: "필살기가 충전을 소모하지 않을 확률 +50%, 필살기 사용 시 충전 지속시간 초기화, 무술 +2 (암살자 전용), 공격 속도 +20%, 피해 +200-250%, 생명력 흡수 7%, 냉기 기술 피해 +8-15%, 번개 기술 피해 +8-15%, 화염 기술 피해 +8-15%, 명중률 보너스 20%, 괴물 회복 저지" },
        { name: "왕 시해자 (Kingslayer)", alias: ["킹슬레이어"], runes: ["말", "우움", "굴", "팔"], level: 53, sockets: 4, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE], effects: "공격 속도 +30%, 피해 +230-270% 증가, 대상의 방어력 -25%, 명중률 보너스 20%, 강타 확률 +33%, 상처 악화 확률 +50%, +1 복수, 괴물 회복 저지, 힘 +10, 괴물에게서 얻는 금화 40% 증가" },
        { name: "원칙 (Principle)", alias: ["프린시플", "원리원칙"], runes: ["랄", "굴", "엘드"], level: 53, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "타격 시 100% 확률로 5레벨 신성한 빛줄기 시전, 성기사 기술 레벨 +2, 언데드에게 주는 피해 +50%, 생명력 +100-150, 지구력 고갈 속도 15% 감소, 최대 독 저항 +5%, 화염 저항 +30%" },
        { name: "균열 (Rift)", alias: ["리프트"], runes: ["헬", "코", "렘", "굴"], level: 53, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SCEPTER], effects: "타격 시 20% 확률로 16레벨 회오리바람 시전, 공격 시 16% 확률로 21레벨 얼음 보주 시전, 명중률 보너스 20%, 마법 피해 160-250 추가, 화염 피해 60-180 추가, 모든 능력치 +5-10, 민첩 +10, 받는 피해의 +38%만큼 마나 회복, 괴물에게서 얻는 금화 75% 증가, 15레벨 가시 박힌 철관 (충전 40회), 착용 조건 -20%" },
	    { name: "경계 (Vigilance)", alias: ["비질란스", "비질런스"], runes: ["돌", "굴"], level: 53, sockets: 2, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "피격 시 5% 확률로 10레벨 화염 고리 시전, 달리기/걷기 속도 +10%, 막기 속도 +30%, 방어력 +75-100% 증가, 생명력 +20-40, 마나 +20-40, 모든 저항 +25-35" },
        
        // === Level 55 ===

        { name: "침묵 (Silence)", alias: ["사일런스"], runes: ["돌", "엘드", "헬", "이스트", "티르", "벡스"], level: 55, sockets: 6, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, effects: "모든 기술 +2, 공격 속도 +20%, 타격 회복 속도 +20%, 피해 +200% 증가, 언데드에게 주는 피해 +75%, 언데드에 대한 명중률 +50, 적중당 마나 11% 훔침, 적중 시 대상 실명 +33, 적중 시 괴물 도주 +25%, 모든 저항 +75, 적 처치 시 마나 +2, 매직 아이템 발견 확률 30% 증가, 착용 조건 -20%" },
        { name: "참나무의 심장 (Heart of the Oak)", alias: ["오심", "오크의심장", "호토", "HOTO"], runes: ["코", "벡스", "풀", "주울"], level: 55, sockets: 4, types: [ITEM_TYPES.MACE, ITEM_TYPES.STAFF], note: "⚠️ 망치(Hammer)류 제작 불가. 프레일 권장.", effects: "모든 기술 +3, 시전 속도 +40%, 악마에게 주는 피해 +75%, 악마에 대한 명중률 +100, 냉기 피해 3-14 추가, 적중당 마나 7% 훔침, 민첩 +10, 생명력 회복 +20, 최대 마나 15% 증가, 모든 저항 +30-40, 4레벨 참나무 현자 (충전 25회), 14레벨 큰까마귀 (충전 60회)" },
        { name: "죽음 (Death)", alias: ["데스"], runes: ["헬", "엘", "벡스", "오르트", "굴"], level: 55, sockets: 5, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE], note: "에테리얼 재료 권장 (파괴 불가)", effects: "사망 시 100% 확률로 44레벨 연쇄 번개 시전, 공격 시 25% 확률로 18레벨 빙하 가시 시전, 파괴 불가, 피해 +300-385% 증가, 명중률 보너스 20%, 명중률 +50, 번개 피해 1-50 추가, 적중당 마나 7% 훔침, 강타 확률 +50%, 치명적 공격 +(캐릭터 레벨 ×0.5)%, 시야 +1, 22레벨 피 골렘 (충전 15회), 착용 조건 -20%" },
        { name: "꺼져가는 불길 (Flickering Flame)", alias: ["꺼불", "플리커링플레임"], runes: ["네프", "풀", "벡스"], level: 55, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "장착 시 4-8레벨 화염 저항 오라 효과 적용, 화염 기술 +3, 적의 화염 저항 -(10-15)%, 방어력 +30% 증가, 원거리 공격 방어력 +30, 마나 +50-75, 최대 화염 저항 +5%, 빙결 지속시간 절반으로 감소, 독 지속시간 50% 감소" },
        
        // === Level 57 ===

        { name: "소집 (Call to Arms)", alias: ["콜투", "콜투암스", "CTA"], runes: ["앰", "랄", "말", "이스트", "오움"], level: 57, sockets: 5, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, note: "크리스탈 소드/프레일 권장", effects: "모든 기술 +1, 공격 속도 +40%, 피해 +250-290% 증가, 화염 피해 5-30 추가, 적중당 생명력 7% 훔침, +2-6 전투 명령, +1-6 전투 지시, +1-4 전투의 함성, 괴물 회복 저지, 생명력 회복 +12, 매직 아이템 발견 확률 30% 증가" },
        { name: "혼돈 (Chaos)", alias: ["카오스"], runes: ["팔", "오움", "우움"], level: 57, sockets: 3, types: [ITEM_TYPES.CLAW], effects: "타격 시 9% 확률로 11레벨 얼음 보주 시전, 타격 시 11% 확률로 9레벨 번개 줄기 시전, 공격 속도 +35%, 피해 +290-340% 증가, 마법 피해 216-471 추가, 상처 악화 확률 +25%, +1 소용돌이, 힘 +10, 악마 처치 시 생명력 +15" },
        { name: "추방 (Exile)", alias: ["망명", "엑자일"], runes: ["벡스", "오움", "이스트", "돌"], level: 57, sockets: 4, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], subType: "성기사 전용", note: "에테리얼 전용 방패 권장 (내구 회복)", effects: "타격 시 15% 확률로 5레벨 생명력 추출 시전, 장착 시 13-16레벨 인내 오라 효과 적용, 공격 오라 +2 (성기사 전용), 막기 속도 +30%, 대상 빙결, 방어력 +220-260% 증가, 생명력 회복 +7, 최대 냉기 저항 +5%, 최대 화염 저항 +5%, 매직 아이템 발견 확률 25% 증가, 내구도 1 회복(4초 마다)" },
	    { name: "의식 (Ritual)", alias: ["리추얼"], runes: ["앰", "샤엘", "오움"], level: 57, sockets: 3, types: [ITEM_TYPES.DAGGER], effects: "피격 시 13% 확률로 1레벨 인장: 죽음 시전, 공격 속도 +40%, 피해 +200-270% 증가, 명중률 보너스 200-260%, 악마에게 주는 피해 +150-250%, 적중당 생명력 7% 훔침, 처치한 괴물이 안식에 듦, 적 처치 시 생명력 +3-5" },
        
        // === Level 59 ===

        { name: "인내 (Fortitude) - 무기", alias: ["인내"], runes: ["엘", "솔", "돌", "로"], level: 59, sockets: 4, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, effects: "피격 시 20% 확률로 15레벨 냉기 갑옷 시전, 시전 속도 +25%, 피해 +300% 증가, 최소 피해 +9, 명중률 +50, 치명적 공격 +20%, 적중 시 괴물 도주 +25%, 방어력 +200% 증가, 생명력 +(캐릭터 레벨 ×1)-(캐릭터 레벨 ×1.5), 모든 저항 +25-30, 받는 피해의 +12%만큼 마나 회복, 시야 +1" },
        { name: "인내 (Fortitude) - 갑옷", alias: ["인내"], runes: ["엘", "솔", "돌", "로"], level: 59, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "피격 시 20% 확률로 15레벨 냉기 갑옷 시전, 시전 속도 +25%, 피해 +300% 증가, 방어력 +200% 증가, 방어력 +15, 생명력 +(캐릭터 레벨 ×1)-(캐릭터 레벨 ×1.5), 생명력 회복 +7, 최대 번개 저항 +5%, 모든 저항 +25-30, 피해 7 감소, 받는 피해의 +12%만큼 마나 회복, 시야 +1" },
        { name: "슬픔 (Grief)", alias: ["깊은고뇌", "고뇌", "그리프"], runes: ["에드", "티르", "로", "말", "랄"], level: 59, sockets: 5, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE], effects: "타격 시 35% 확률로 15레벨 맹독 시전, 공격 속도 +30-40%, 피해 +340-400 추가, 대상의 방어력 무시, 대상의 방어력 -25%, 악마에게 주는 피해 +(캐릭터 레벨 ×1.875)%, 화염 피해 5-30 추가, 적의 독 저항 -20-25%, 치명적 공격 +20%, 괴물 회복 저지, 적 처치 시 마나 +2, 적 처치 시 생명력 +10-15" },
        
        // === Level 61 ===

        { name: "바람 (Wind)", alias: ["윈드"], runes: ["수르", "엘"], level: 61, sockets: 2, types: CATEGORIES.MELEE, effects: "타격 시 10% 확률로 9레벨 회오리바람 시전, 걷기/달리기 속도 +20%, 공격 속도 +40%, 타격 회복 속도 +15%, 피해 +120-160% 증가, 대상의 방어력 -50%, 명중률 +50, 적중 시 대상 실명, 시야 +1, 13레벨 돌개바람 (충전 127회)" },
        { name: "찔레 (Bramble)", alias: ["검은딸기", "브램블"], runes: ["랄", "오움", "수르", "에드"], level: 61, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "장착 시 15-21레벨 가시 오라 효과 적용, 타격 회복 속도 +50%, 독 기술 피해 +25-50%, 방어력 +300, 최대 마나 5% 증가, 마나 재생 15%, 최대 냉기 저항 +5%, 화염 저항 +30%, 독 저항 +100%, 적 처치 시 생명력 +13, 13레벨 가시의 영혼 (충전 33회)" },
        { name: "용 (Dragon) - 갑옷", alias: ["드래곤"], runes: ["수르", "로", "솔"], level: 61, sockets: 3, types: [ITEM_TYPES.ARMOR, ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "피격 시 20% 확률로 18레벨 맹독 시전, 타격 시 12% 확률로 15레벨 히드라 시전, 장착 시 14레벨 신성한 불꽃 오라 효과 적용, 방어력 +360, 원거리 공격 방어력 +230, 모든 능력치 +3-5, 힘 +(캐릭터 레벨 ×0.375), 마나 +50, 최대 번개 저항 +5%, 피해 7 감소" },
    
        // === Level 63 ===

        { name: "무한 (Infinity)", alias: ["무공", "무한의공간", "인피니티"], runes: ["베르", "말", "베르", "이스트"], level: 63, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "적 처치 시 50% 확률로 20레벨 연쇄 번개 시전, 장착 시 12레벨 선고 오라 효과 적용, 걷기/달리기 속도 +35%, 피해 255-325% 증가, 적의 번개 저항 -45-55%, 강타 확률 +40%, 괴물 회복 저지, 활력 +(캐릭터 레벨 ×0.5), 매직 아이템 발견 확률 30% 증가, 21레벨 회오리 갑옷 (충전 30회)" },
        { name: "명예의 굴레 (Chains of Honor)", alias: ["명굴", "체인오브아너", "COH"], runes: ["돌", "우움", "베르", "이스트"], level: 63, sockets: 4, types: [ITEM_TYPES.ARMOR], effects: "모든 기술 +2, 악마에게 주는 피해 +200%, 언데드에게 주는 피해 +100%, 적중당 생명력 8% 훔침, 방어력 +70% 증가, 힘 +20, 생명력 회복 +7, 모든 저항 +65, 받는 물리 피해 8% 감소, 매직 아이템 발견 확률 25% 증가" },
        { name: "야수 (Beast)", alias: ["비스트"], runes: ["베르", "티르", "우움", "말", "룸"], level: 63, sockets: 5, types: [ITEM_TYPES.AXE, ITEM_TYPES.SCEPTER, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "모든 기술 +2, 악마에게 주는 피해 +200%, 언데드에게 주는 피해 +100%, 적중당 생명력 8% 훔침, 방어력 +70% 증가, 힘 +20, 생명력 회복 +7, 모든 저항 +65, 받는 물리 피해 8% 감소, 매직 아이템 발견 확률 25% 증가" },
        { name: "영원 (Eternity)", alias: ["이터니티", "불멸"], runes: ["앰", "베르", "이스트", "솔", "수르"], level: 63, sockets: 5, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE, ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR, ITEM_TYPES.STAFF, ITEM_TYPES.SCEPTER], effects: "파괴 불가, 피해 +260-310% 증가, 최소 피해 +9, 적중당 생명력 7% 훔침, 강타 확률 +20%, 적중 시 대상 실명, 대상 감속 33%, 마나 재생 16%, 생명력 회복 +16, 빙결되지 않음, 매직 아이템 발견 확률 30% 증가, 8레벨 부활 (충전 88회)" },
        { name: "진노 (Wrath)", alias: ["래스"], runes: ["풀", "룸", "베르", "말"], level: 63, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "타격 시 30% 확률로 1레벨 노화 시전, 타격 시 5% 확률로 10레벨 생명력 추출 시전, 악마에게 주는 피해 +375%, 악마에 대한 명중률 +100, 언데드에게 주는 피해 +250-300%, 마법 피해 85-120 추가, 번개 피해 41-240 추가, 강타 확률 +20%, 괴물 회복 저지, 마력 +10, 빙결되지 않음" },
        
        // === Level 65 ===

        { name: "수수께끼 (Enigma)", alias: ["수수", "에니그마"], runes: ["자", "아이드", "베르"], level: 65, sockets: 3, types: [ITEM_TYPES.ARMOR], effects: "모든 기술 +2, 이동 속도 +45%, +1 순간이동, 방어력 +750-775, 힘 +0-74 (캐릭터 레벨에 비례), 최대 생명력 5% 증가, 받는 물리 피해 8% 감소, 적 처치 시 생명력 +14, 받는 피해의 +15%만큼 마나 회복, 매직 아이템 발견 확률 1-99% 증가<br>(캐릭터 레벨에 비례)" },
        { name: "불사조 (Phoenix) - 무기", alias: ["피닉스"], runes: ["벡스", "벡스", "로", "자"], level: 65, sockets: 4, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, effects: "레벨 상승 시 100% 확률로 40레벨 불길 시전, 타격 시 40% 확률로 22레벨 화염폭풍 시전, 장착 시 10-15레벨 속죄 오라 효과 적용, 피해 +350-400% 증가, 대상의 방어력 무시, 적중당 마나 14% 훔침, 적의 화염 저항 -28%, 치명적 공격 +20%, 원거리 공격 방어력 +350-400, 화염 흡수 +15-21" },
        { name: "불사조 (Phoenix) - 방패", alias: ["피닉스"], runes: ["벡스", "벡스", "로", "자"], level: 65, sockets: 4, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "레벨 상승 시 100% 확률로 40레벨 불길 시전, 타격 시 40% 확률로 22레벨 화염폭풍 시전, 장착 시 10-15레벨 속죄 오라 효과 적용, 피해 +350-400% 증가, 적의 화염 저항 -28%, 원거리 공격 방어력 +350-400, 생명력 +50, 최대 번개 저항 +5%, 최대 화염 저항 +10%, 화염 흡수 +15-21" },
        { name: "분노 (Fury)", alias: ["퓨리", "원한"], runes: ["자", "굴", "에드"], level: 65, sockets: 3, types: CATEGORIES.MELEE, effects: "공격 속도 +40%, 피해 +209% 증가, 대상의 방어력 무시, 대상의 방어력 -25%, 명중률 보너스 20%, 적중당 생명력 6% 훔침, 치명적 공격 +33%, 상처 악화 확률 +66%, +5 광분 (야만용사 전용), 괴물 회복 저지" },
        { name: "기근 (Famine)", alias: ["패민"], runes: ["팔", "오움", "오르트", "자"], level: 65, sockets: 4, types: [ITEM_TYPES.AXE, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "공격 속도 +30%, 피해 +320-370% 증가, 대상의 방어력 무시, 마법 피해 180-200 추가, 화염 피해 50-200 추가, 번개 피해 51-250 추가, 냉기 피해 50-200 추가, 적중당 생명력 12% 훔침, 괴물 회복 저지, 힘 +10" },
        { name: "꿈 (Dream) - 투구", alias: ["드림"], runes: ["이오", "자", "풀"], level: 65, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], effects: "피격 시 10% 확률로 15레벨 혼란 시전, 장착 시 15레벨 신성한 충격 오라 효과 적용, 타격 회복 속도 +20-30%, 방어력 +30% 증가, 방어력 +150-220, 활력 +10, 최대 생명력 5% 증가, 마나 +(캐릭터 레벨 ×0.625), 모든 저항 +5-20, 매직 아이템 발견 확률 12-25% 증가" },
        { name: "꿈 (Dream) - 방패", alias: ["드림"], runes: ["이오", "자", "풀"], level: 65, sockets: 3, types: [ITEM_TYPES.SHIELD, ITEM_TYPES.PALADIN_SHIELD], effects: "피격 시 10% 확률로 15레벨 혼란 시전, 장착 시 15레벨 신성한 충격 오라 효과 적용, 타격 회복 속도 +20-30%, 방어력 +30% 증가, 방어력 +150-220, 활력 +10, 생명력 +50, 마나 +(캐릭터 레벨 ×0.625), 모든 저항 +5-20, 매직 아이템 발견 확률 12-25% 증가" },
        { name: "신념 (Faith)", alias: ["신뢰", "페이스"], runes: ["오움", "자", "렘", "엘드"], level: 65, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "장착 시 12-15레벨 광신 오라 효과 적용, 모든 기술 +1-2, 피해 330% 증가, 대상의 방어력 무시, 명중률 보너스 300%, 언데드에게 주는 피해 +75%, 언데드에 대한 명중률 +50, 화염 피해 +120, 모든 저항 +15, 처치 시 10% 확률로 되돌아온 자 소생, 괴물에게서 얻는 금화 75% 증가" },
        { name: "얼음 (Ice)", alias: ["아이스"], runes: ["앰", "샤엘", "자", "로"], level: 65, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "레벨 상승 시 100% 확률로 40레벨 눈보라 시전, 타격 시 25% 확률로 22레벨 서릿발 시전, 장착 시 18레벨 신성한 빙결 오라 효과 적용, 공격 속도 +20%, 피해 +140-210% 증가, 대상의 방어력 무시, 냉기 기술 피해 +25-30%, 적중당 생명력 7% 훔침, 적의 냉기 저항 -20%, 치명적 공격 +20%, 괴물에게서 얻는 금화 (캐릭터 레벨 ×3.125)% 증가" },
        { name: "낙인 (Brand)", alias: ["인두", "브랜드"], runes: ["자", "로", "말", "굴"], level: 65, sockets: 4, types: [ITEM_TYPES.MISSILE], effects: "피격 시 35% 확률로 피해 증폭, 뼈 창 발사, 악마에게 피해 +260-340%, 치명적 공격 +20%, 밀쳐내기" },
        { name: "파괴 (Destruction)", alias: ["디스트럭션"], runes: ["벡스", "로", "베르", "자", "코"], level: 65, sockets: 5, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SWORD], effects: "타격 시 23% 확률로 12레벨 화산 시전, 타격 시 5% 확률로 23레벨 타오르는 바위 시전, 사망 시 100% 확률로 45레벨 운석 낙하 시전, 공격 시 15% 확률로 22레벨 번개 파장 시전, 피해 +350% 증가, 대상의 방어력 무시, 마법 피해 100-180 추가, 적중당 마나 7% 훔침, 강타 확률 +20%, 치명적 공격 +20%, 괴물 회복 저지, 민첩 +10" },
        { name: "마지막 소원 (Last Wish)", alias: ["마소", "라스트위시"], runes: ["자", "말", "자", "수르", "자", "베르"], level: 65, sockets: 6, types: [ITEM_TYPES.SWORD, ITEM_TYPES.AXE, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "피격 시 6% 확률로 11 레벨 흐리기 시전, 타격 시 10% 확률로 18레벨 생명력 추출 시전, 공격 시 20% 확률로 20레벨 번개 줄기 시전, 장착 시 17레벨 위세 오라 효과 적용, 피해 +330-375% 증가, 대상의 방어력 무시, 강타 확률 +60-70%, 괴물 회복 저지, 적중 시 대상 실명, 매직 아이템 발견 확률 (캐릭터 레벨 ×0.5)% 증가" },
        
        // === Level 67 ===

        { name: "정의의 손길 (Hand of Justice)", alias: ["정손", "핸드오브저스티스", "HOJ"], runes: ["수르", "참", "앰", "로"], level: 67, sockets: 4, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, effects: "레벨 상승 시 100% 확률로 36레벨 불길 시전, 사망 시 100% 확률로 48레벨 운석 낙하 시전, 장착 시 16레벨 신성한 불꽃 오라 효과 적용, 공격 속도 +33%, 피해 +280-330% 증가, 대상의 방어력 무시, 적의 화염 저항 -20%, 적중당 생명력 7% 훔침, 치명적 공격 +20%, 적중 시 대상 실명, 대상 빙결 +3" },
        { name: "파멸 (Doom)", alias: ["둠"], runes: ["헬", "오움", "우움", "로", "참"], level: 67, sockets: 5, types: [ITEM_TYPES.AXE, ITEM_TYPES.POLEARM, ITEM_TYPES.MACE], note: "망치(Hammer) 사용 가능", effects: "타격 시 5% 확률로 18레벨 화산 시전, 장착 시 12레벨 신성한 빙결 오라 효과 적용, 모든 기술 +2, 공격 속도 +45%, 피해 +330-370% 증가, 적의 냉기 저항 -40-60%, 치명적 공격 +20%, 상처 악화 확률 +25%, 괴물 회복 저지, 대상 빙결 +3, 착용 조건 -20%" },
        { name: "긍지 (Pride)", alias: ["자존심", "프라이드", "존심"], runes: ["참", "수르", "이오", "로"], level: 67, sockets: 4, types: [ITEM_TYPES.POLEARM, ITEM_TYPES.SPEAR], effects: "피격 시 25% 확률로 17레벨 화염벽 시전, 장착 시 16-20레벨 집중 오라 효과 적용, 명중률 보너스 260-300%, 악마에게 주는 피해 +(캐릭터 레벨 ×1)%, 번개 피해 50-280 추가, 치명적 공격 +20%, 적중 시 대상 실명, 대상 빙결 +3, 활력 +10, 생명력 회복 +8, 괴물에게서 얻는 금화<br>(캐릭터 레벨 ×1.875)% 증가" },
        { name: "역병 (Plague)", alias: ["플레이그", "페스트"], runes: ["참", "샤엘", "우움"], level: 67, sockets: 3, types: [ITEM_TYPES.SWORD, ITEM_TYPES.CLAW, ITEM_TYPES.DAGGER], effects: "타격 시 25% 확률로 15레벨 맹독 확산 시전, 피격 시 20% 확률로 12레벨 저항 감소 시전, 장착 시 13-17레벨 정화 오라 효과 적용, 모든 기술 +1-2, 공격 속도 +20%, 피해 +220-320% 증가, 적의 독 저항 -23%, 치명적 공격 +(캐릭터 레벨 ×0.3)%, 상처 악화 확률 +25%, 대상 빙결 +3" },
        { name: "안개 (Mist)", alias: ["미스트", "엷은 안개"], runes: ["참", "샤엘", "굴", "주울", "아이드"], level: 67, sockets: 5, types: [ITEM_TYPES.MISSILE], effects: "장착 시 8-12레벨 집중 오라 효과 적용, 모든 기술 +3, 공격 속도 +20%, 관통 공격 +100%, 피해 325-375% 증가, 최대 피해 +9, 명중률 보너스 20%, 냉기 피해 3-14 추가, 대상 빙결 +3, 활력 +24, 모든 저항 +40" },
        { name: "탈태 (Metamorphosis)", alias: ["메타모포시스"], runes: ["이오", "참", "팔"], level: 67, sockets: 3, types: [ITEM_TYPES.HELM, ITEM_TYPES.DRUID_PELT], ladder: true, effects: "늑대인간으로 타격 시 180초 간 징표 효과 부여<br>(명중률 보너스 30% | 최대 생명력 +40%), 곰인간으로 타격 시 180초 간 징표 효과 부여<br>(공격 속도 +25% | 받는 물리 피해 20% 감소), 변신 기술 +5 (드루이드 전용), 강타 확률 +25%, 방어력 +50-80%, 힘 +10, 활력 +10, 모든 저항 +10, 빙결되지 않음" },
        
        // === Level 69 ===

        { name: "죽어가는 자의 숨결<br>(Breath of the Dying)", alias: ["죽숨", "브레스오브더다잉", "BOTD"], runes: ["벡스", "헬", "엘", "엘드", "조드", "에드"], level: 69, sockets: 6, types: CATEGORIES.WEAPON_4_SOCKETS_PLUS, note: "에테리얼 재료 권장 (파괴 불가)", effects: "적 처치 시 50% 확률로 20레벨 맹독 확산 시전, 파괴 불가, 공격 속도 +60%, 피해 +350-400% 증가, 대상의 방어력 -25%, 명중률 +50, 언데드에게 주는 피해 +200%, 언데드에 대한 명중률 +50, 적중당 마나 7% 훔침, 적중당 생명력 12-15% 훔침, 괴물 회복 저지, 모든 능력치 +30, 시야 +1, 착용 조건 -20%" },
        { name: "집착 (Obsession)", alias: ["옵세션", "집념"], runes: ["조드", "이스트", "렘", "룸", "이오", "네프"], level: 69, sockets: 6, types: [ITEM_TYPES.STAFF], note: "특정 기술 +3 옵션 재료 필수", effects: "파괴 불가, 피격 시 24% 확률로 10레벨 약화 시전, 모든 기술 +4, 시전 속도 +65%, 타격 회복 속도 +60%, 밀쳐내기, 활력 +10, 마력 +10, 최대 생명력 +15-25%, 마나 재생 15-30%, 모든 저항 +60-70, 괴물에게서 얻는 금화 75% 증가, 매직 아이템 발견 확률 30% 증가" },
	    { name: "공허 (Void)", alias: ["보이드"], runes: ["주울", "조드", "이스트"], level: 69, sockets: 3, types: [ITEM_TYPES.DAGGER], effects: "파괴 불가, 모든 기술 +2, 시전 속도 +40%, 냉기 피해 3-14 추가, 마법 기술 피해 +10-15%, +1-3 심연, 모든 능력치 +8-12, 매직 아이템 발견 확률 30% 증가 4레벨 노화 (충전 35회)" },
];