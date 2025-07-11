'use server';

/**
 * @fileOverview A federated learning AI agent for healthcare kiosks.
 *
 * - federatedLearningModel - A function that handles the federated learning process.
 * - FederatedLearningModelInput - The input type for the federatedLearningModel function.
 * - FederatedLearningModelOutput - The return type for the federatedLearningModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FederatedLearningModelInputSchema = z.object({
  kioskId: z.string().describe('The unique identifier for the kiosk.'),
  modelName: z.string().describe('The name of the machine learning model to be trained.'),
  trainingData: z.string().describe('The training data for the model, as a JSON string.'),
});
export type FederatedLearningModelInput = z.infer<typeof FederatedLearningModelInputSchema>;

const FederatedLearningModelOutputSchema = z.object({
  modelUpdate: z
    .string()
    .describe(
      'The updated model parameters after federated learning, as a JSON string.'
    ),
  metrics: z.string().describe('The evaluation metrics of the updated model, as a JSON string.'),
});
export type FederatedLearningModelOutput = z.infer<typeof FederatedLearningModelOutputSchema>;

export async function federatedLearningModel(
  input: FederatedLearningModelInput
): Promise<FederatedLearningModelOutput> {
  return federatedLearningModelFlow(input);
}

const federatedLearningModelPrompt = ai.definePrompt({
  name: 'federatedLearningModelPrompt',
  input: {schema: FederatedLearningModelInputSchema},
  output: {schema: FederatedLearningModelOutputSchema},
  prompt: `You are a federated learning agent participating in a collaborative model training.

You will receive training data from a healthcare kiosk and update the model parameters accordingly.

Kiosk ID: {{{kioskId}}}
Model Name: {{{modelName}}}
Training Data: {{{trainingData}}}

Based on the training data, update the model parameters and provide the evaluation metrics.
Ensure patient data privacy during the federated learning process.

Output the updated model parameters and evaluation metrics as JSON strings.
`,
});

const federatedLearningModelFlow = ai.defineFlow(
  {
    name: 'federatedLearningModelFlow',
    inputSchema: FederatedLearningModelInputSchema,
    outputSchema: FederatedLearningModelOutputSchema,
  },
  async input => {
    const {output} = await federatedLearningModelPrompt(input);
    return output!;
  }
);
