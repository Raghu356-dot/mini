'use server';

/**
 * @fileOverview This file defines a Genkit flow for scanning a URL for potential threats.
 *
 * - scanUrl - A function that analyzes a URL.
 * - ScanUrlInput - The input type for the scanUrl function.
 * - ScanUrlOutput - The return type for the scanUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to be scanned.'),
});
export type ScanUrlInput = z.infer<typeof ScanUrlInputSchema>;

const ScanUrlOutputSchema = z.object({
  verdict: z.enum(['Malicious', 'Suspicious', 'Safe']).describe('The verdict of the scan.'),
  analysis: z.string().describe('A summary of the scan findings and reasoning.'),
});
export type ScanUrlOutput = z.infer<typeof ScanUrlOutputSchema>;

export async function scanUrl(input: ScanUrlInput): Promise<ScanUrlOutput> {
  return scanUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanUrlPrompt',
  input: {schema: ScanUrlInputSchema},
  output: {schema: ScanUrlOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in identifying malicious URLs. Analyze the following URL and provide a verdict (Malicious, Suspicious, or Safe) and a brief analysis explaining your reasoning. Consider the domain, path, and any query parameters.

URL: {{{url}}}`,
});

const scanUrlFlow = ai.defineFlow(
  {
    name: 'scanUrlFlow',
    inputSchema: ScanUrlInputSchema,
    outputSchema: ScanUrlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
