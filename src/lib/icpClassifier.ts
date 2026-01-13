/**
 * Holistenics ICP Classification Engine (v1)
 * Deterministic, rules-based ICP classification.
 * No AI. No probabilistic logic.
 * Behavior-based scoring with explicit tie-break rules.
 */

export type Goal = "energy_clarity" | "sleep_recovery" | "longevity" | "stress_workload";
export type TrainingFrequency = "0_1" | "2_3" | "4_6" | "6_plus";
export type AgeBand = "18_29" | "30_39" | "40_49" | "50_65";
export type SleepBaseline = "consistent" | "inconsistent" | "trouble_falling" | "waking_night" | "short_sleep";
export type CaffeineUse = "low" | "moderate_before_noon" | "after_noon" | "stimulants";
export type Constraint = "minimal_pills" | "frequent_travel" | "avoid_stim" | "sensitive_stomach";
export type ICPKey = "ICP1_EXEC" | "ICP2_ATHLETE" | "ICP3_METABOLIC" | "ICP4_MIDLIFE" | "ICP5_KNOWLEDGE";

export interface ICPInput {
  goal: Goal;
  training_frequency: TrainingFrequency;
  age_band: AgeBand;
  sleep_baseline: SleepBaseline;
  caffeine_use: CaffeineUse;
  metabolic_context: boolean;
  constraints: Constraint[];
}

export interface ICPScores {
  ICP1_EXEC: number;
  ICP2_ATHLETE: number;
  ICP3_METABOLIC: number;
  ICP4_MIDLIFE: number;
  ICP5_KNOWLEDGE: number;
}

export interface ICPResult {
  primary_icp: ICPKey;
  scores: ICPScores;
  confidence: "high" | "medium" | "low";
}

// Scoring rules
const GOAL_SCORES: Record<Goal, Partial<ICPScores>> = {
  energy_clarity: { ICP1_EXEC: 3, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 2 },
  sleep_recovery: { ICP1_EXEC: 2, ICP2_ATHLETE: 1, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 2, ICP5_KNOWLEDGE: 1 },
  longevity: { ICP1_EXEC: 3, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 3 },
  stress_workload: { ICP1_EXEC: 2, ICP5_KNOWLEDGE: 3 },
};

const TRAINING_SCORES: Record<TrainingFrequency, Partial<ICPScores>> = {
  "0_1": { ICP1_EXEC: 2, ICP3_METABOLIC: 2, ICP4_MIDLIFE: 2, ICP5_KNOWLEDGE: 1 },
  "2_3": { ICP1_EXEC: 2, ICP2_ATHLETE: 1, ICP3_METABOLIC: 2, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 1 },
  "4_6": { ICP2_ATHLETE: 4 },
  "6_plus": { ICP2_ATHLETE: 5 },
};

const AGE_SCORES: Record<AgeBand, Partial<ICPScores>> = {
  "18_29": { ICP2_ATHLETE: 2, ICP5_KNOWLEDGE: 2 },
  "30_39": { ICP1_EXEC: 2, ICP2_ATHLETE: 2, ICP3_METABOLIC: 1, ICP5_KNOWLEDGE: 2 },
  "40_49": { ICP1_EXEC: 3, ICP2_ATHLETE: 1, ICP3_METABOLIC: 2, ICP4_MIDLIFE: 3, ICP5_KNOWLEDGE: 1 },
  "50_65": { ICP1_EXEC: 3, ICP3_METABOLIC: 3, ICP4_MIDLIFE: 4 },
};

const SLEEP_SCORES: Record<SleepBaseline, Partial<ICPScores>> = {
  consistent: { ICP1_EXEC: 2, ICP2_ATHLETE: 1, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 2 },
  inconsistent: { ICP1_EXEC: 1, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 2 },
  trouble_falling: { ICP1_EXEC: 1, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 3 },
  waking_night: { ICP1_EXEC: 1, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 2, ICP5_KNOWLEDGE: 2 },
  short_sleep: { ICP3_METABOLIC: 1, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 3 },
};

const CAFFEINE_SCORES: Record<CaffeineUse, Partial<ICPScores>> = {
  low: { ICP1_EXEC: 2, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 2 },
  moderate_before_noon: { ICP1_EXEC: 1, ICP2_ATHLETE: 1, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 1 },
  after_noon: { ICP5_KNOWLEDGE: 3 },
  stimulants: { ICP2_ATHLETE: 1, ICP5_KNOWLEDGE: 4 },
};

const METABOLIC_SCORES: Record<"true" | "false", Partial<ICPScores>> = {
  true: { ICP3_METABOLIC: 6, ICP4_MIDLIFE: 1 },
  false: { ICP1_EXEC: 1, ICP2_ATHLETE: 1, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 1 },
};

const CONSTRAINT_SCORES: Record<Constraint, Partial<ICPScores>> = {
  minimal_pills: { ICP1_EXEC: 2, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 1, ICP5_KNOWLEDGE: 1 },
  frequent_travel: { ICP1_EXEC: 1, ICP2_ATHLETE: 1, ICP3_METABOLIC: 1, ICP5_KNOWLEDGE: 1 },
  avoid_stim: { ICP1_EXEC: 2, ICP4_MIDLIFE: 1 },
  sensitive_stomach: { ICP1_EXEC: 1, ICP3_METABOLIC: 1, ICP4_MIDLIFE: 1 },
};

function applyScores(scores: ICPScores, additions: Partial<ICPScores>): void {
  for (const [key, value] of Object.entries(additions)) {
    if (value !== undefined) {
      scores[key as ICPKey] += value;
    }
  }
}

function resolveTie(scores: ICPScores, ageBand: AgeBand): ICPKey {
  const entries = Object.entries(scores) as [ICPKey, number][];
  const maxScore = Math.max(...entries.map(([, v]) => v));
  const tied = entries.filter(([, v]) => v === maxScore).map(([k]) => k);

  if (tied.length === 1) return tied[0];

  // Tie-break rules in order:
  // 1. ICP3_METABOLIC always wins ties
  if (tied.includes("ICP3_METABOLIC")) return "ICP3_METABOLIC";

  // 2. ICP2_ATHLETE beats ICP1_EXEC and ICP5_KNOWLEDGE
  if (tied.includes("ICP2_ATHLETE")) {
    const beats = tied.filter((k) => k !== "ICP1_EXEC" && k !== "ICP5_KNOWLEDGE");
    if (beats.length === 0 || (beats.length === 1 && beats[0] === "ICP2_ATHLETE")) {
      return "ICP2_ATHLETE";
    }
  }

  // 3. ICP4_MIDLIFE wins if age_band >= 40_49
  if (tied.includes("ICP4_MIDLIFE") && (ageBand === "40_49" || ageBand === "50_65")) {
    return "ICP4_MIDLIFE";
  }

  // 4. ICP1_EXEC beats ICP5_KNOWLEDGE
  if (tied.includes("ICP1_EXEC")) return "ICP1_EXEC";

  // 5. Default fallback
  return "ICP1_EXEC";
}

export function classifyICP(input: ICPInput): ICPResult {
  const scores: ICPScores = {
    ICP1_EXEC: 0,
    ICP2_ATHLETE: 0,
    ICP3_METABOLIC: 0,
    ICP4_MIDLIFE: 0,
    ICP5_KNOWLEDGE: 0,
  };

  // Apply all scoring rules
  applyScores(scores, GOAL_SCORES[input.goal]);
  applyScores(scores, TRAINING_SCORES[input.training_frequency]);
  applyScores(scores, AGE_SCORES[input.age_band]);
  applyScores(scores, SLEEP_SCORES[input.sleep_baseline]);
  applyScores(scores, CAFFEINE_SCORES[input.caffeine_use]);
  applyScores(scores, METABOLIC_SCORES[input.metabolic_context ? "true" : "false"]);

  // Apply constraint scores (accumulative)
  for (const constraint of input.constraints) {
    applyScores(scores, CONSTRAINT_SCORES[constraint]);
  }

  // Determine primary ICP
  const primary_icp = resolveTie(scores, input.age_band);
  const winningScore = scores[primary_icp];

  // Determine confidence
  let confidence: "high" | "medium" | "low";
  if (winningScore >= 10) {
    confidence = "high";
  } else if (winningScore >= 7) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    primary_icp,
    scores,
    confidence,
  };
}

// Helper functions to map UI values to ICP input types
export function mapGoal(uiValue: string): Goal {
  const mapping: Record<string, Goal> = {
    "Sustainable energy & mental clarity": "energy_clarity",
    "Sleep quality & recovery": "sleep_recovery",
    "Longevity baseline": "longevity",
    "Stress resilience during heavy workload": "stress_workload",
  };
  return mapping[uiValue] || "energy_clarity";
}

export function mapTrainingFrequency(uiValue: string): TrainingFrequency {
  const mapping: Record<string, TrainingFrequency> = {
    "0–1 days/week": "0_1",
    "2–3 days/week": "2_3",
    "4–6 days/week": "4_6",
    "6+ days/week": "6_plus",
  };
  return mapping[uiValue] || "2_3";
}

export function mapAgeBand(uiValue: string): AgeBand {
  const mapping: Record<string, AgeBand> = {
    "18–29": "18_29",
    "30–39": "30_39",
    "40–49": "40_49",
    "50–65": "50_65",
  };
  return mapping[uiValue] || "30_39";
}

export function mapSleepBaseline(uiValue: string): SleepBaseline {
  const mapping: Record<string, SleepBaseline> = {
    "Consistent (7+ hours)": "consistent",
    "Inconsistent schedule": "inconsistent",
    "Trouble falling asleep": "trouble_falling",
    "Waking during the night": "waking_night",
    "Short sleep (≤6h)": "short_sleep",
  };
  return mapping[uiValue] || "consistent";
}

export function mapCaffeineUse(uiValue: string): CaffeineUse {
  const mapping: Record<string, CaffeineUse> = {
    "0–1 per day": "low",
    "2–3 per day, before noon": "moderate_before_noon",
    "2–3 per day, sometimes after noon": "after_noon",
    "I sometimes use stimulants or pre-workouts": "stimulants",
  };
  return mapping[uiValue] || "low";
}

export function mapConstraints(uiValues: string[]): Constraint[] {
  const mapping: Record<string, Constraint> = {
    "Minimal pills": "minimal_pills",
    "Frequent travel": "frequent_travel",
    "Avoid anything stim-like": "avoid_stim",
    "Sensitive stomach": "sensitive_stomach",
  };
  return uiValues
    .map((v) => mapping[v])
    .filter((v): v is Constraint => v !== undefined);
}

export function deriveMetabolicContext(sensitivities: string[]): boolean {
  // Metabolic context is true if user has kidney issues or thyroid medication
  return sensitivities.includes("Kidney issues (past or present)") ||
    sensitivities.includes("Thyroid medication");
}

// ICP display names
export const ICP_DISPLAY_NAMES: Record<ICPKey, string> = {
  ICP1_EXEC: "Executive Optimizer",
  ICP2_ATHLETE: "Performance Athlete",
  ICP3_METABOLIC: "Metabolic Focus",
  ICP4_MIDLIFE: "Midlife Vitality",
  ICP5_KNOWLEDGE: "Knowledge Worker",
};

export const ICP_DESCRIPTIONS: Record<ICPKey, string> = {
  ICP1_EXEC: "System-driven approach for busy professionals prioritizing consistency and cognitive clarity.",
  ICP2_ATHLETE: "Performance-oriented protocol optimized for high training volume and recovery.",
  ICP3_METABOLIC: "Targeted support for metabolic health and body composition goals.",
  ICP4_MIDLIFE: "Longevity-focused system addressing age-related optimization priorities.",
  ICP5_KNOWLEDGE: "Cognitive enhancement focus for demanding intellectual work.",
};
