'use server';

/**
 * @fileOverview Defines a Genkit flow for generating simulated incident response actions.
 *
 * - generateIncidentResponse - A function that suggests a simulated response action based on a threat.
 * - IncidentResponseInput - The input type for the generateIncidentResponse function.
 * - IncidentResponseOutput - The return type for the generateIncidentResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const IncidentResponseInputSchema = z.object({
  threatType: z.string().describe('The type of threat detected (e.g., "Port Scan", "Phishing").'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the threat.'),
  details: z.string().optional().describe('Any additional details about the threat.'),
});
export type IncidentResponseInput = z.infer<typeof IncidentResponseInputSchema>;

export const IncidentResponseOutputSchema = z.object({
  recommendedAction: z
    .enum(['Block IP', 'Disable user session', 'Quarantine device', 'Flag for manual review', 'Record in threat log'])
    .describe('The recommended action to take.'),
  simulatedResult: z.string().describe('A description of the simulated outcome of the action.'),
});
export type IncidentResponseOutput = z.infer<typeof IncidentResponseOutputSchema>;

export async function generateIncidentResponse(input: IncidentResponseInput): Promise<IncidentResponseOutput> {
  return generateIncidentResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIncidentResponsePrompt',
  input: {schema: IncidentResponseInputSchema},
  output: {schema: IncidentResponseOutputSchema},
  prompt: `You are an automated cybersecurity incident response system. Your job is to recommend a single, appropriate, simulated action for a given threat and describe the simulated result.

  Threat Information:
  - Type: {{{threatType}}}
  - Severity: {{{severity}}}
  - Details: {{{details}}}

  Based on the threat, select the best "recommendedAction" from the available enum choices.
  Then, provide a "simulatedResult" that describes what happened when you performed the action in a simulation.

  For example:
  - If the action is "Block IP", the simulated result could be "IP address 123.45.67.89 has been added to the simulated blocklist."
  - If the action is "Quarantine device", the simulated result could be "Device 'dev-hostname' has been moved to the simulated quarantine network."
  `,
});

const generateIncidentResponseFlow = ai.defineFlow(
  {
    name: 'generateIncidentResponseFlow',
    inputSchema: IncidentResponseInputSchema,
    outputSchema: IncidentResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
