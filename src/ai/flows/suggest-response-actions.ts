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
  performedActions: z
    .array(z.string())
    .describe('An array of mitigation actions that have been automatically performed.'),
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
  prompt: `You are a cybersecurity automated response system. Based on the provided threat information, determine and perform the necessary mitigation actions.

  Your response should be a list of the specific actions you have taken. For example: "Blocked IP address 123.45.67.89 on the firewall." or "Isolated device 'dev-hostname' from the network."

  Threat Type: {{{threatType}}}
  Risk Score: {{{riskScore}}}
  Details:
  {{{details}}}

  Return the list of actions taken in the 'performedActions' field.`,
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
