'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting fraud based on user activity details.
 *
 * - detectFraud - A function that analyzes user activity for potential fraud.
 * - DetectFraudInput - The input type for the detectFraud function.
 * - DetectFraudOutput - The return type for the detectFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFraudInputSchema = z.object({
  activityDetails: z.string().describe('A description of the user activity to analyze for fraud.'),
});
export type DetectFraudInput = z.infer<typeof DetectFraudInputSchema>;

const DetectFraudOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the activity is deemed fraudulent.'),
  riskScore: z.number().describe('A risk score from 0 to 100.'),
  reason: z.string().describe('The reasoning behind the fraud verdict.'),
  suggestedAction: z.string().describe('A suggested action to take.'),
});
export type DetectFraudOutput = z.infer<typeof DetectFraudOutputSchema>;

export async function detectFraud(input: DetectFraudInput): Promise<DetectFraudOutput> {
  return detectFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFraudPrompt',
  input: {schema: DetectFraudInputSchema},
  output: {schema: DetectFraudOutputSchema},
  prompt: `You are an expert fraud detection analyst. Analyze the following user activity details and determine if it is fraudulent. Provide a risk score, your reasoning, and a suggested action.

Activity Details:
{{{activityDetails}}}`,
});

const detectFraudFlow = ai.defineFlow(
  {
    name: 'detectFraudFlow',
    inputSchema: DetectFraudInputSchema,
    outputSchema: DetectFraudOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
