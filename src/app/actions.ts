
"use server";

import { z } from "zod";
import {
  aiEligibilityChecker,
  AiEligibilityCheckerInput,
  AiEligibilityCheckerOutput,
} from "@/ai/flows/ai-eligibility-checker";

// --- Eligibility Checker Action ---

const AiEligibilityCheckerInputSchema = z.object({
  age: z.coerce.number().int().min(16).max(99),
  weightKg: z.coerce.number().min(45).max(200),
  hasTattooOrPiercingInLast6Months: z.boolean(),
  traveledToMalariaRiskAreaInLastYear: z.boolean(),
  hasFeverOrFluSymptomsToday: z.boolean(),
  isPregnantOrBreastfeeding: z.boolean(),
  hasChronicDisease: z.boolean(),
  hasReceivedBloodTransfusionInLastYear: z.boolean(),
});

type EligibilityFormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  result?: AiEligibilityCheckerOutput;
};

export async function checkEligibilityAction(
  prevState: EligibilityFormState,
  formData: FormData
): Promise<EligibilityFormState> {
  const validatedFields = AiEligibilityCheckerInputSchema.safeParse({
    age: formData.get("age"),
    weightKg: formData.get("weightKg"),
    hasTattooOrPiercingInLast6Months: formData.get("hasTattooOrPiercingInLast6Months") === "on",
    traveledToMalariaRiskAreaInLastYear: formData.get("traveledToMalariaRiskAreaInLastYear") === "on",
    hasFeverOrFluSymptomsToday: formData.get("hasFeverOrFluSymptomsToday") === "on",
    isPregnantOrBreastfeeding: formData.get("isPregnantOrBreastfeeding") === "on",
    hasChronicDisease: formData.get("hasChronicDisease") === "on",
    hasReceivedBloodTransfusionInLastYear: formData.get("hasReceivedBloodTransfusionInLastYear") === "on",
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid form data. Please check your inputs.",
    };
  }
  
  const inputData: AiEligibilityCheckerInput = validatedFields.data;

  try {
    const result = await aiEligibilityChecker(inputData);
    return {
      status: "success",
      message: "Assessment complete.",
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
