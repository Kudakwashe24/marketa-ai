export type PlanKey = "free" | "starter" | "growth" | "pro";

export type PlanConfig = {
  name: string;
  campaignLimit: number;
  posterLimit: number;
  personalizedDailyIdea: boolean;
};

export const PLAN_CONFIGS: Record<PlanKey, PlanConfig> = {
  free: {
    name: "Free",
    campaignLimit: 5,
    posterLimit: 0,
    personalizedDailyIdea: false,
  },

  starter: {
    name: "Starter",
    campaignLimit: 30,
    posterLimit: 5,
    personalizedDailyIdea: true,
  },

  growth: {
    name: "Growth",
    campaignLimit: 200,
    posterLimit: 20,
    personalizedDailyIdea: true,
  },

  pro: {
    name: "Pro",
    campaignLimit: -1,
    posterLimit: -1,
    personalizedDailyIdea: true,
  },
};