'use server';
/**
 * @fileOverview An AI-powered tool for initial blood donation eligibility assessment.
 *
 * - aiEligibilityChecker - A function that handles the eligibility assessment process.
 * - AiEligibilityCheckerInput - The input type for the aiEligibilityChecker function.
 * - AiEligibilityCheckerOutput - The return type for the aiEligibilityChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiEligibilityCheckerInputSchema = z.object({
  age: z.number().int().min(20).max(99).describe('Donor\'s age in years. Must be between 20 and 99.'),
  weightKg: z.number().min(60).max(200).describe('Donor\'s weight in kilograms. Must be between 60 kg and 200 kg.'),
  hasTattooOrPiercingInLast6Months: z.boolean().describe('True if the donor has received a tattoo or piercing in the last 6 months.'),
  traveledToMalariaRiskAreaInLastYear: z.boolean().describe('True if the donor has traveled to a malaria-risk area in the last 12 months.'),
  hasFeverOrFluSymptomsToday: z.boolean().describe('True if the donor has fever, flu-like symptoms, or any acute illness today.'),
  isPregnantOrBreastfeeding: z.boolean().describe('True if the donor is currently pregnant or breastfeeding.'),
  hasChronicDisease: z.boolean().describe('True if the donor has a chronic disease (e.g., heart disease, diabetes requiring insulin, autoimmune conditions).'),
  hasReceivedBloodTransfusionInLastYear: z.boolean().describe('True if the donor has received a blood transfusion in the last 12 months.'),
}).describe('Input for the AI blood donation eligibility checker, representing key health information.');

export type AiEligibilityCheckerInput = z.infer<typeof AiEligibilityCheckerInputSchema>;

// Output Schema
const AiEligibilityCheckerOutputSchema = z.object({
  isEligible: z.boolean().describe('An initial assessment of whether the donor appears eligible based on provided information and common guidelines. This is not a final medical determination.'),
  reasons: z.string().describe('A summary of the assessment, including reasons for eligibility or ineligibility/deferral, based on common blood donation guidelines. Emphasize that this is an informational assessment and not a substitute for professional medical advice or a complete medical examination.'),
}).describe('Output from the AI blood donation eligibility checker, providing an initial assessment and reasons.');

export type AiEligibilityCheckerOutput = z.infer<typeof AiEligibilityCheckerOutputSchema>;

// Wrapper function
export async function aiEligibilityChecker(input: AiEligibilityCheckerInput): Promise<AiEligibilityCheckerOutput> {
  return aiEligibilityCheckerFlow(input);
}

// Prompt Definition
const eligibilityPrompt = ai.definePrompt({
  name: 'bloodDonationEligibilityPrompt',
  input: { schema: AiEligibilityCheckerInputSchema },
  output: { schema: AiEligibilityCheckerOutputSchema },
  prompt: `You are an AI assistant providing an initial, informational assessment of blood donation eligibility based on the user-provided health information and common blood donation guidelines. This is NOT a medical diagnosis or a substitute for a full medical examination by a healthcare professional. Always advise the user to consult with medical staff at the donation center for a definitive assessment.

Evaluate the following health information for a potential blood donor:

Age: {{{age}}} years
Weight: {{{weightKg}}} kg
Received tattoo or piercing in the last 6 months: {{#if hasTattooOrPiercingInLast6Months}}Yes{{else}}No{{/if}}
Traveled to a malaria-risk area in the last 12 months: {{#if traveledToMalariaRiskAreaInLastYear}}Yes{{else}}No{{/if}}
Has fever, flu-like symptoms, or any acute illness today: {{#if hasFeverOrFluSymptomsToday}}Yes{{else}}No{{/if}}
Is currently pregnant or breastfeeding: {{#if isPregnantOrBreastfeeding}}Yes{{else}}No{{/if}}
Has a chronic disease (e.g., heart disease, diabetes requiring insulin, autoimmune conditions): {{#if hasChronicDisease}}Yes{{else}}No{{/if}}
Has received a blood transfusion in the last 12 months: {{#if hasReceivedBloodTransfusionInLastYear}}Yes{{else}}No{{/if}}

Based on general guidelines, an eligible donor typically:
- Is at least 20 years old.
- Weighs at least 60 kg (around 132 lbs).
- Has not received a tattoo or piercing in the last 6-12 months.
- Has not traveled to certain malaria-risk areas in the last 12 months.
- Is free from fever, flu, and acute illnesses.
- Is not pregnant or breastfeeding.
- Does not have serious chronic diseases.
- Has not received a blood transfusion in the last 12 months.

Provide an 'isEligible' boolean (true for likely eligible, false for likely ineligible/deferred) and a 'reasons' string explaining the assessment. The 'reasons' field should clearly state if the person appears eligible, or explain why they might be ineligible or deferred, always reminding them that this is an informational assessment and a medical professional will make the final decision.
Focus on identifying factors that would immediately make them ineligible or defer them. If multiple factors are present, list them all. If no obvious disqualifying factors are present, state they appear eligible but still need professional screening.
If age is less than 20, or weight is less than 60kg, they are generally ineligible.
`
});

// Flow Definition
const aiEligibilityCheckerFlow = ai.defineFlow(
  {
    name: 'aiEligibilityCheckerFlow',
    inputSchema: AiEligibilityCheckerInputSchema,
    outputSchema: AiEligibilityCheckerOutputSchema,
  },
  async (input) => {
    const { output } = await eligibilityPrompt(input);
    return output!;
  }
);
