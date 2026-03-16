export type Plan = "free" | "starter" | "growth" | "pro";

export const PLANS = {
  free: {
    name: "Free",
    campaignLimit: 5,
    posterLimit: 0,
    templatesEnabled: false,
    advancedHistoryEnabled: false,
  },

  starter: {
    name: "Starter",
    campaignLimit: 30,
    posterLimit: 10,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },

  growth: {
    name: "Growth",
    campaignLimit: 200,
    posterLimit: 100,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },

  pro: {
    name: "Pro",
    campaignLimit: -1, // unlimited
    posterLimit: -1, // unlimited
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
} as const;

export function getPlan(plan: string) {
  const normalized = plan?.toLowerCase() as Plan;

  if (normalized in PLANS) {
    return PLANS[normalized];
  }

  return PLANS.free;
}

export function canGeneratePoster(plan: string) {
  const config = getPlan(plan);
  return config.posterLimit !== 0;
}

export function hasTemplates(plan: string) {
  const config = getPlan(plan);
  return config.templatesEnabled;
}

export function hasAdvancedHistory(plan: string) {
  const config = getPlan(plan);
  return config.advancedHistoryEnabled;
}

export function campaignLimit(plan: string) {
  const config = getPlan(plan);
  return config.campaignLimit;
}

export function posterLimit(plan: string) {
  const config = getPlan(plan);
  return config.posterLimit;
}