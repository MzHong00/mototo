import type { JobClass } from "@/types/job";

import type { SkillTreeDef } from "@/types/skillTree";

const W_A = "🔴 광전사";
const W_B = "🔵 지배자";
const AR_A = "🟢 기동형";
const AR_B = "🟣 포격형";
const M_A = "🔥 파괴형";
const M_B = "❄️ 통제형";
const R_A = "🗡️ 표창형";
const R_B = "⚔️ 단검형";

const WARRIOR_TREES: SkillTreeDef[] = [
  {
    skillId: "slash",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "slash_t1_a",
            label: "강타",
            description: "데미지 +40%, 단일 타격 유지",
            archetype: W_A,
            modifier: { damageMultiplier: 1.4 },
          },
          {
            id: "slash_t1_b",
            label: "회전베기",
            description: "360° 원형 광역으로 전환",
            archetype: W_B,
            modifier: { behaviorTag: "aoe_360" },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "slash_t2_a",
            label: "맹공",
            description: "동일 적 3타 연속 적중 시 다음 타격 데미지 +60%",
            archetype: W_A,
            modifier: { damageMultiplier: 1.6 },
          },
          {
            id: "slash_t2_b",
            label: "충격",
            description: "매 5타마다 피격 적 넉백 (0.3초 밀려남)",
            archetype: W_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "charge",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "charge_t1_a",
            label: "강습",
            description: "돌진 거리 비례 데미지 (최대 ATK × 2.0)",
            archetype: W_A,
            modifier: { damageMultiplier: 2.0 },
          },
          {
            id: "charge_t1_b",
            label: "관통",
            description: "경로 위 모든 적 연속 타격",
            archetype: W_B,
            modifier: { behaviorTag: "dash_then_attack" },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "charge_t2_a",
            label: "연쇄",
            description: "적 처치 시 쿨타임 즉시 초기화",
            archetype: W_A,
            modifier: { cooldownMultiplier: 0 },
          },
          {
            id: "charge_t2_b",
            label: "충격파",
            description: "착지점 AOE 폭발 추가",
            archetype: W_B,
            modifier: { behaviorTag: "aoe_360" },
          },
        ],
      },
    ],
  },
  {
    skillId: "taunt",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "taunt_t1_a",
            label: "분노",
            description: "도발 해제 후 ATK +50% 5초",
            archetype: W_A,
            modifier: { damageMultiplier: 1.5 },
          },
          {
            id: "taunt_t1_b",
            label: "역전",
            description: "도발 중 받은 피해 합계 ×1.5 주변 반사",
            archetype: W_B,
            modifier: { behaviorTag: "reflect_damage" },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "taunt_t2_a",
            label: "폭발적 분노",
            description: "도발 해제 직후 다음 돌진·파멸의 일격 데미지 +80% (1회 한정)",
            archetype: W_A,
            modifier: { damageMultiplier: 1.8 },
          },
          {
            id: "taunt_t2_b",
            label: "집결",
            description: "도발 범위 내 적 모두 내 발 아래로 순간 당김 (CC)",
            archetype: W_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "cataclysm",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "cataclysm_t1_a",
            label: "즉발",
            description: "선딜 제거, 데미지 ATK × 2.0",
            archetype: W_A,
            modifier: { damageMultiplier: 2.0 },
          },
          {
            id: "cataclysm_t1_b",
            label: "광역 전환",
            description: "단일 → 전방 AOE, 데미지 ATK × 2.0",
            archetype: W_B,
            modifier: { targetType: "aoe", damageMultiplier: 2.0 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "cataclysm_t2_a",
            label: "처형",
            description: "HP 40% 이하 적 데미지 2배",
            archetype: W_A,
            modifier: { behaviorTag: "execute_bonus", damageMultiplier: 2.0 },
          },
          {
            id: "cataclysm_t2_b",
            label: "연계",
            description: "사용 후 3초간 모든 쿨타임 50% 감소",
            archetype: W_B,
            modifier: { cooldownMultiplier: 0.5 },
          },
        ],
      },
    ],
  },
];

const ARCHER_TREES: SkillTreeDef[] = [
  {
    skillId: "arrow_shot",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "arrow_shot_t1_a",
            label: "연속",
            description: "1발 → 3발 연속 발사 (각 ATK × 0.6), 쿨타임 0.6s",
            archetype: AR_A,
            modifier: { damageMultiplier: 0.6 },
          },
          {
            id: "arrow_shot_t1_b",
            label: "집중사격",
            description: "1발, 데미지 ATK × 2.0, 쿨타임 0.8s",
            archetype: AR_B,
            modifier: { damageMultiplier: 2.0 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "arrow_shot_t2_a",
            label: "탄력",
            description: "동일 적 3타 연속 적중 시 다음 화살 ATK × 1.5",
            archetype: AR_A,
            modifier: { damageMultiplier: 1.5 },
          },
          {
            id: "arrow_shot_t2_b",
            label: "침투",
            description: "매 4발마다 방어력 무시 관통 타격",
            archetype: AR_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "piercing_arrow",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "piercing_t1_a",
            label: "즉발",
            description: "충전 없이 즉시 발사, ATK × 1.2",
            archetype: AR_A,
            modifier: { damageMultiplier: 1.2 },
          },
          {
            id: "piercing_t1_b",
            label: "강화 충전",
            description: "충전 완료 시 ATK × 2.5 + 착탄 폭발",
            archetype: AR_B,
            modifier: { damageMultiplier: 2.5 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "piercing_t2_a",
            label: "연동",
            description: "관통화살 적중 적 수만큼 백스텝 쿨타임 -1.5초",
            archetype: AR_A,
            modifier: { cooldownMultiplier: 0.8 },
          },
          {
            id: "piercing_t2_b",
            label: "약화",
            description: "피격 적 DEF -40% 5초",
            archetype: AR_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "backstep",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "backstep_t1_a",
            label: "원거리",
            description: "대시 거리 2배, 3초 내 재사용 가능",
            archetype: AR_A,
            modifier: { behaviorTag: "speed_boost" },
          },
          {
            id: "backstep_t1_b",
            label: "거점 사격",
            description: "백스텝 후 2초간 이동 불가 대신 다음 화살 데미지 ATK × 3.0",
            archetype: AR_B,
            modifier: { damageMultiplier: 3.0 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "backstep_t2_a",
            label: "연막",
            description: "착지점 연막 생성, 추적 적 이동속도 -50%",
            archetype: AR_A,
            modifier: {},
          },
          {
            id: "backstep_t2_b",
            label: "신중",
            description: "백스텝 이후 3초간 치명타율 +100%",
            archetype: AR_B,
            modifier: { damageMultiplier: 2.0 },
          },
        ],
      },
    ],
  },
  {
    skillId: "explosive_arrow",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "explosive_t1_a",
            label: "유도",
            description: "이동 중 발사해도 가장 가까운 적 추적",
            archetype: AR_A,
            modifier: {},
          },
          {
            id: "explosive_t1_b",
            label: "포격",
            description: "폭발 범위 2배, 데미지 ATK × 3.0",
            archetype: AR_B,
            modifier: { damageMultiplier: 3.0 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "explosive_t2_a",
            label: "다중",
            description: "소형 폭발 3개 추가, 넓은 범위 커버",
            archetype: AR_A,
            modifier: {},
          },
          {
            id: "explosive_t2_b",
            label: "관통 폭발",
            description: "폭발이 벽·지형 관통, 약화 적에게 데미지 +50%",
            archetype: AR_B,
            modifier: { damageMultiplier: 1.5 },
          },
        ],
      },
    ],
  },
];

const MAGE_TREES: SkillTreeDef[] = [
  {
    skillId: "fireball",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "fireball_t1_a",
            label: "폭발",
            description: "착탄 시 광역 폭발로 전환",
            archetype: M_A,
            modifier: { targetType: "aoe" },
          },
          {
            id: "fireball_t1_b",
            label: "관통",
            description: "직선 관통, 경로 위 모든 적 타격",
            archetype: M_B,
            modifier: {},
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "fireball_t2_a",
            label: "연소",
            description: "적중 적에게 화상 3초 DoT (ATK × 0.3)",
            archetype: M_A,
            modifier: { behaviorTag: "linger_flame", damageMultiplier: 0.3 },
          },
          {
            id: "fireball_t2_b",
            label: "냉기",
            description: "동일 적 3타 연속 적중 시 이동속도 -50% 2초",
            archetype: M_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "ice_spike",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "ice_t1_a",
            label: "파편",
            description: "착탄 시 빙결 파편 3개 주변 튀김 (광역)",
            archetype: M_A,
            modifier: { targetType: "aoe" },
          },
          {
            id: "ice_t1_b",
            label: "완전 빙결",
            description: "슬로우 → 1.5초 완전 빙결로 강화",
            archetype: M_B,
            modifier: { durationMultiplier: 1.5 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "ice_t2_a",
            label: "분쇄",
            description: "빙결 상태 적에게 다음 공격 데미지 2배",
            archetype: M_A,
            modifier: { damageMultiplier: 2.0 },
          },
          {
            id: "ice_t2_b",
            label: "연쇄",
            description: "빙결이 근처 적으로 연쇄 전파",
            archetype: M_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "blink",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "blink_t1_a",
            label: "폭발 이동",
            description: "착지점 AOE 폭발 (ATK × 1.2)",
            archetype: M_A,
            modifier: { targetType: "aoe", damageMultiplier: 1.2 },
          },
          {
            id: "blink_t1_b",
            label: "잔상",
            description: "출발 위치에 잔상 생성, 주변 적 0.5초 스턴",
            archetype: M_B,
            modifier: {},
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "blink_t2_a",
            label: "연쇄 화염",
            description: "이동 직후 다음 화염볼이 자동으로 2연쇄 폭발 (각 ATK × 0.8)",
            archetype: M_A,
            modifier: { damageMultiplier: 0.8 },
          },
          {
            id: "blink_t2_b",
            label: "연속",
            description: "3초 내 1회 추가 사용 가능",
            archetype: M_B,
            modifier: { cooldownMultiplier: 0 },
          },
        ],
      },
    ],
  },
  {
    skillId: "black_hole",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "blackhole_t1_a",
            label: "충돌",
            description: "흡입된 적들이 서로 충돌하며 접촉 데미지, 폭발 ATK × 2.5",
            archetype: M_A,
            modifier: { damageMultiplier: 2.5 },
          },
          {
            id: "blackhole_t1_b",
            label: "이중",
            description: "소형 블랙홀 2개 순차 생성, 더 넓은 제어 범위",
            archetype: M_B,
            modifier: {},
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "blackhole_t2_a",
            label: "중력 폭탄",
            description: "흡입 적 수 비례 폭발 데미지 (+20%/마리)",
            archetype: M_A,
            modifier: { damageMultiplier: 1.2 },
          },
          {
            id: "blackhole_t2_b",
            label: "빙결 폭발",
            description: "폭발 시 범위 내 전체 적 1.5초 빙결",
            archetype: M_B,
            modifier: { durationMultiplier: 1.5 },
          },
        ],
      },
    ],
  },
];

const ROGUE_TREES: SkillTreeDef[] = [
  {
    skillId: "dagger_slash",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "dagger_t1_a",
            label: "표창 전환",
            description: "평타가 표창 투척으로 바뀜. 사거리 소폭 증가, 데미지 동일",
            archetype: R_A,
            modifier: { behaviorTag: "dash_then_attack" },
          },
          {
            id: "dagger_t1_b",
            label: "쾌속",
            description: "공격속도 +30%, 데미지 +15%",
            archetype: R_B,
            modifier: { damageMultiplier: 1.15, cooldownMultiplier: 0.7 },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "dagger_t2_a",
            label: "독침",
            description: "매 4타마다 피격 적에게 독 DoT 3초 (ATK × 0.2)",
            archetype: R_A,
            modifier: { behaviorTag: "linger_flame", damageMultiplier: 0.2 },
          },
          {
            id: "dagger_t2_b",
            label: "급소",
            description: "연속 5타 후 다음 타격 치명타 확정",
            archetype: R_B,
            modifier: { damageMultiplier: 2.0 },
          },
        ],
      },
    ],
  },
  {
    skillId: "shadow_slash",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "shadow_t1_a",
            label: "연계",
            description: "표창 적중 2초 이내 사용 시 쿨타임 50% 감소",
            archetype: R_A,
            modifier: { cooldownMultiplier: 0.5 },
          },
          {
            id: "shadow_t1_b",
            label: "기절",
            description: "피격 적 0.8초 스턴",
            archetype: R_B,
            modifier: {},
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "shadow_t2_a",
            label: "잔상",
            description: "공격과 동시에 잔상이 추가 1타 (ATK × 0.8)",
            archetype: R_A,
            modifier: { damageMultiplier: 0.8 },
          },
          {
            id: "shadow_t2_b",
            label: "흡혈",
            description: "가한 피해의 30% HP 회복",
            archetype: R_B,
            modifier: {},
          },
        ],
      },
    ],
  },
  {
    skillId: "smoke_bomb",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "smoke_t1_a",
            label: "독무",
            description: "연막이 독 구름으로 변환, 내부 적 DoT",
            archetype: R_A,
            modifier: { behaviorTag: "linger_flame" },
          },
          {
            id: "smoke_t1_b",
            label: "폭발",
            description: "연막 해제 시 범위 AOE 폭발",
            archetype: R_B,
            modifier: { targetType: "aoe" },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "smoke_t2_a",
            label: "독 농축",
            description: "독 스택 비례 해제 시 폭발 (1스택당 +20%)",
            archetype: R_A,
            modifier: { damageMultiplier: 1.2 },
          },
          {
            id: "smoke_t2_b",
            label: "잔혹",
            description: "HP 50% 이하 적에게 연막 내 피해 2배",
            archetype: R_B,
            modifier: { behaviorTag: "execute_bonus", damageMultiplier: 2.0 },
          },
        ],
      },
    ],
  },
  {
    skillId: "death_dance",
    tiers: [
      {
        tier: 1,
        requiredLevel: 3,
        choices: [
          {
            id: "dance_t1_a",
            label: "표창 무도",
            description: "타격마다 표창 1발 동시 투척 (총 12베기 + 12투척)",
            archetype: R_A,
            modifier: {},
          },
          {
            id: "dance_t1_b",
            label: "집중",
            description: "가장 낮은 HP 적 집중 타격",
            archetype: R_B,
            modifier: { behaviorTag: "execute_bonus" },
          },
        ],
      },
      {
        tier: 2,
        requiredLevel: 5,
        choices: [
          {
            id: "dance_t2_a",
            label: "독 폭발",
            description: "독 상태 적 타격 시 데미지 +50%",
            archetype: R_A,
            modifier: { damageMultiplier: 1.5 },
          },
          {
            id: "dance_t2_b",
            label: "처형",
            description: "HP 30% 이하 적 타격 시 데미지 3배",
            archetype: R_B,
            modifier: { behaviorTag: "execute_bonus", damageMultiplier: 3.0 },
          },
        ],
      },
    ],
  },
];

export const SKILL_TREES: Record<JobClass, SkillTreeDef[]> = {
  warrior: WARRIOR_TREES,
  archer: ARCHER_TREES,
  mage: MAGE_TREES,
  rogue: ROGUE_TREES,
};

export function getSkillTree(jobClass: JobClass, skillId: string): SkillTreeDef | undefined {
  return SKILL_TREES[jobClass].find((t) => t.skillId === skillId);
}

export const ARCHETYPE_COLORS: Record<string, string> = {
  "🔴 광전사": "#ff4757",
  "🔵 지배자": "#74b9e8",
  "🟢 기동형": "#2ed573",
  "🟣 포격형": "#a29bfe",
  "🔥 파괴형": "#ff6348",
  "❄️ 통제형": "#74d7e8",
  "🗡️ 표창형": "#ffa502",
  "⚔️ 단검형": "#7f8fa6",
};
