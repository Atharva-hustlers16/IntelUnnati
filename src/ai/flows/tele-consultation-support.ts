// Tele-consultation support flow to summarize patient information for doctors.

'use server';

/**
 * @fileOverview A tele-consultation support AI agent for doctors.
 *
 * - teleConsultationSupport - A function that handles summarizing patient information for tele-consultations.
 * - TeleConsultationSupportInput - The input type for the teleConsultationSupport function.
 * - TeleConsultationSupportOutput - The return type for the teleConsultationSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TeleConsultationSupportInputSchema = z.object({
  medicalHistory: z.string().describe('The patient\'s medical history.'),
  vitals: z.string().describe('The patient\'s vital signs.'),
  labResults: z.string().describe('The patient\'s lab results.'),
  imagingResults: z.string().describe('The patient\'s imaging results.'),
  preferredLanguage: z.string().describe('The doctor\'s preferred language for the summary.'),
});
export type TeleConsultationSupportInput = z.infer<typeof TeleConsultationSupportInputSchema>;

const TeleConsultationSupportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient\'s medical information in the preferred language.'),
});
export type TeleConsultationSupportOutput = z.infer<typeof TeleConsultationSupportOutputSchema>;

export async function teleConsultationSupport(input: TeleConsultationSupportInput): Promise<TeleConsultationSupportOutput> {
  return teleConsultationSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'teleConsultationSupportPrompt',
  input: {schema: TeleConsultationSupportInputSchema},
  output: {schema: TeleConsultationSupportOutputSchema},
  prompt: `You are an AI assistant that summarizes patient information for doctors during tele-consultations.

  Please provide a concise summary of the patient's medical history, vitals, lab results, and imaging results in the doctor's preferred language.

  Medical History: {{{medicalHistory}}}
  Vitals: {{{vitals}}}
  Lab Results: {{{labResults}}}
  Imaging Results: {{{imagingResults}}}
  Preferred Language: {{{preferredLanguage}}}

  Summary:`, 
});

const teleConsultationSupportFlow = ai.defineFlow(
  {
    name: 'teleConsultationSupportFlow',
    inputSchema: TeleConsultationSupportInputSchema,
    outputSchema: TeleConsultationSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
