'use server';

/**
 * @fileOverview Provides a preliminary diagnosis and suggests a treatment plan based on patient symptoms and vitals.
 *
 * - aiDiagnosisAssistant - A function that handles the AI diagnosis process.
 * - AIDiagnosisAssistantInput - The input type for the aiDiagnosisAssistant function.
 * - AIDiagnosisAssistantOutput - The return type for the aiDiagnosisAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDiagnosisAssistantInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the patient\'s symptoms.'),
  vitals: z
    .string()
    .describe('The patient\'s vital signs, such as temperature, blood pressure, and heart rate.'),
  medicalHistory: z
    .string()
    .optional()
    .describe('The patient\'s medical history.'),
});
export type AIDiagnosisAssistantInput = z.infer<typeof AIDiagnosisAssistantInputSchema>;

const AIDiagnosisAssistantOutputSchema = z.object({
  preliminaryDiagnosis: z.string().describe('The preliminary diagnosis of the patient.'),
  suggestedTreatmentPlan: z.string().describe('The suggested treatment plan for the patient.'),
  confidenceLevel: z.number().describe('The confidence level of the diagnosis and treatment plan (0-1).'),
});
export type AIDiagnosisAssistantOutput = z.infer<typeof AIDiagnosisAssistantOutputSchema>;

export async function aiDiagnosisAssistant(input: AIDiagnosisAssistantInput): Promise<AIDiagnosisAssistantOutput> {
  return aiDiagnosisAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDiagnosisAssistantPrompt',
  input: {schema: AIDiagnosisAssistantInputSchema},
  output: {schema: AIDiagnosisAssistantOutputSchema},
  prompt: `You are an AI assistant that provides preliminary diagnoses and suggests treatment plans based on patient symptoms and vitals.

  Based on the following information, provide a preliminary diagnosis and suggest a treatment plan. Also, provide a confidence level for your diagnosis and treatment plan.

  Symptoms: {{{symptoms}}}
  Vitals: {{{vitals}}}
  Medical History: {{{medicalHistory}}}
  `,
});

const aiDiagnosisAssistantFlow = ai.defineFlow(
  {
    name: 'aiDiagnosisAssistantFlow',
    inputSchema: AIDiagnosisAssistantInputSchema,
    outputSchema: AIDiagnosisAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
