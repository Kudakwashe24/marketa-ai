export const OTHER_BUSINESS_TYPE = "Other / Not listed";

export const BUSINESS_TYPES = [
  "Salon / Barber",
  "Restaurant / Food Business",
  "Clothing Store / Boutique",
  "Car Wash / Detailing",
  "Freelancer / Personal Brand",
  "Car Dealership",
  "Home Services (Electrician, Plumber, etc.)",
  "Health & Wellness (Massage, Spa, Fitness)",
  "Events / Entertainment",
  "Online Store / Ecommerce",
  "Property / Real Estate",
  "Local Service Business",
  OTHER_BUSINESS_TYPE,
] as const;

export function isListedBusinessType(value: string) {
  return BUSINESS_TYPES.some((businessType) => businessType === value);
}

export function getEffectiveBusinessType(
  businessType: string,
  customBusinessType: string
) {
  if (businessType === OTHER_BUSINESS_TYPE) {
    return customBusinessType.trim();
  }

  return businessType.trim();
}
