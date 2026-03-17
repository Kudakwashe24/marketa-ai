export type PlanKey = "free" | "starter" | "growth" | "pro";

export type PlanConfig = {
  name: string;
  campaignLimit: number;
  posterLimit: number;
  personalizedDailyIdea: boolean;
  templatesEnabled: boolean;
  advancedHistoryEnabled: boolean;
};

export const PLAN_CONFIGS: Record<PlanKey, PlanConfig> = {
  free: {
    name: "Free",
    campaignLimit: 5,
    posterLimit: 0,
    personalizedDailyIdea: false,
    templatesEnabled: false,
    advancedHistoryEnabled: false,
  },
  starter: {
    name: "Starter",
    campaignLimit: 30,
    posterLimit: 10,
    personalizedDailyIdea: false,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
  growth: {
    name: "Growth",
    campaignLimit: 200,
    posterLimit: 100,
    personalizedDailyIdea: true,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
  pro: {
    name: "Pro",
    campaignLimit: -1,
    posterLimit: -1,
    personalizedDailyIdea: true,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
};