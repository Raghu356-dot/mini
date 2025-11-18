'use server';

/**
 * @fileOverview This file defines a Genkit flow for correlating multiple security events.
 *
 * - correlateEvents - A function that analyzes multiple events to find correlations.
 * - CorrelateEventsInput - The input type for the correlateEvents function.
 * - CorrelateEventsOutput - The return type for the correlateEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrelateEventsInputSchema = z.object({
  events: z.string().describe('A description of multiple security events, separated by newlines.'),
});
export type CorrelateEventsInput = z.infer<typeof CorrelateEventsInputSchema>;

const CorrelateEventsOutputSchema = z.object({
  areConnected: z.boolean().describe('Whether the events are believed to be connected.'),
  correlationAnalysis: z
    .string()
    .describe('An analysis explaining why the events are or are not connected.'),
});
export type CorrelateEventsOutput = z.infer<typeof CorrelateEventsOutputSchema>;

export async function correlateEvents(input: CorrelateEventsInput): Promise<CorrelateEventsOutput> {
  return correlateEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correlateEventsPrompt',
  input: {schema: CorrelateEventsInputSchema},
  output: {schema: CorrelateEventsOutputSchema},
  prompt: `You are an expert cybersecurity analyst who specializes in correlating disparate security events to identify coordinated attacks.

Analyze the following events. Determine if they are connected as part of a single, larger attack or campaign. Provide your reasoning.

Events:
{{{events}}}`,
});

const correlateEventsFlow = ai.defineFlow(
  {
    name: 'correlateEventsFlow',
    inputSchema: CorrelateEventsInputSchema,
    outputSchema: CorrelateEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
