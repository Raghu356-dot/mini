'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing an email for potential threats.
 *
 * - analyzeEmail - A function that analyzes email content.
 * - AnalyzeEmailInput - The input type for the analyzeEmail function.
 * - AnalyzeEmailOutput - The return type for the analyzeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmailInputSchema = z.object({
  emailContent: z.string().describe('The full content of the email to be analyzed.'),
});
export type AnalyzeEmailInput = z.infer<typeof AnalyzeEmailInputSchema>;

const AnalyzeEmailOutputSchema = z.object({
  verdict: z.enum(['Malicious', 'Suspicious', 'Safe']).describe('The verdict of the analysis.'),
  analysis: z.string().describe('A summary of the analysis findings and reasoning.'),
});
export type AnalyzeEmailOutput = z.infer<typeof AnalyzeEmailOutputSchema>;

export async function analyzeEmail(input: AnalyzeEmailInput): Promise<AnalyzeEmailOutput> {
  return analyzeEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailPrompt',
  input: {schema: AnalyzeEmailInputSchema},
  output: {schema: AnalyzeEmailOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in phishing and malware detection within emails. Analyze the following email content and provide a verdict (Malicious, Suspicious, or Safe) and a brief analysis explaining your reasoning.

Email Content:
{{{emailContent}}}`,
});

const analyzeEmailFlow = ai.defineFlow(
  {
    name: 'analyzeEmailFlow',
    inputSchema: AnalyzeEmailInputSchema,
    outputSchema: AnalyzeEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
