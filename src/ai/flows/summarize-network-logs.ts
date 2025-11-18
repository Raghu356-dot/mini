'use server';

/**
 * @fileOverview Summarizes network logs using GenAI to help administrators quickly understand potential security incidents.
 *
 * - summarizeNetworkLogs - A function that summarizes network logs.
 * - SummarizeNetworkLogsInput - The input type for the summarizeNetworkLogs function.
 * - SummarizeNetworkLogsOutput - The return type for the summarizeNetworkLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNetworkLogsInputSchema = z.object({
  networkLogs: z
    .string()
    .describe('The network logs to summarize.'),
});
export type SummarizeNetworkLogsInput = z.infer<typeof SummarizeNetworkLogsInputSchema>;

const SummarizeNetworkLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the network logs.'),
});
export type SummarizeNetworkLogsOutput = z.infer<typeof SummarizeNetworkLogsOutputSchema>;

export async function summarizeNetworkLogs(input: SummarizeNetworkLogsInput): Promise<SummarizeNetworkLogsOutput> {
  return summarizeNetworkLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNetworkLogsPrompt',
  input: {schema: SummarizeNetworkLogsInputSchema},
  output: {schema: SummarizeNetworkLogsOutputSchema},
  prompt: `You are a cybersecurity expert. Summarize the following network logs, highlighting any potential security incidents. Be concise and clear.

Network Logs:
{{networkLogs}}`,
});

const summarizeNetworkLogsFlow = ai.defineFlow(
  {
    name: 'summarizeNetworkLogsFlow',
    inputSchema: SummarizeNetworkLogsInputSchema,
    outputSchema: SummarizeNetworkLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
