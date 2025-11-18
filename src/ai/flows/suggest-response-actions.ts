'use server';

/**
 * @fileOverview A flow to suggest response actions based on the type of threat detected.
 *
 * - suggestResponseActions - A function that suggests response actions.
 * - SuggestResponseActionsInput - The input type for the suggestResponseActions function.
 * - SuggestResponseActionsOutput - The return type for the suggestResponseActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResponseActionsInputSchema = z.object({
  threatType: z
    .string()
    .describe('The type of threat detected (e.g., Phishing Email, Port Scan, etc.).'),
  riskScore: z
    .number()
    .describe('The risk score associated with the threat (0-100).'),
  details: z
    .string()
    .optional()
    .describe('Additional details about the threat.'),
});
export type SuggestResponseActionsInput = z.infer<typeof SuggestResponseActionsInputSchema>;

const SuggestResponseActionsOutputSchema = z.object({
  suggestedActions: z
    .array(z.string())
    .describe('An array of suggested response actions based on the threat type and risk score.'),
});
export type SuggestResponseActionsOutput = z.infer<typeof SuggestResponseActionsOutputSchema>;

export async function suggestResponseActions(
  input: SuggestResponseActionsInput
): Promise<SuggestResponseActionsOutput> {
  return suggestResponseActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResponseActionsPrompt',
  input: {schema: SuggestResponseActionsInputSchema},
  output: {schema: SuggestResponseActionsOutputSchema},
  prompt: `You are a cybersecurity expert tasked with suggesting response actions based on the type of threat detected and its risk score.

  Based on the following threat information, suggest appropriate response actions. Provide the response as a list of actions.

  Threat Type: {{{threatType}}}
  Risk Score: {{{riskScore}}}
  Details: {{{details}}}

  Suggested Response Actions:`,
});

const suggestResponseActionsFlow = ai.defineFlow(
  {
    name: 'suggestResponseActionsFlow',
    inputSchema: SuggestResponseActionsInputSchema,
    outputSchema: SuggestResponseActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
