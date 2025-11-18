'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a threat report based on threat data.
 *
 * - generateThreatReport - A function that generates a threat report.
 * - GenerateThreatReportInput - The input type for the generateThreatReport function.
 * - GenerateThreatReportOutput - The return type for the generateThreatReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThreatReportInputSchema = z.object({
  threatData: z.string().describe('Threat data in JSON format.'),
});
export type GenerateThreatReportInput = z.infer<typeof GenerateThreatReportInputSchema>;

const GenerateThreatReportOutputSchema = z.object({
  report: z.string().describe('The generated threat report.'),
});
export type GenerateThreatReportOutput = z.infer<typeof GenerateThreatReportOutputSchema>;

export async function generateThreatReport(input: GenerateThreatReportInput): Promise<GenerateThreatReportOutput> {
  return generateThreatReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThreatReportPrompt',
  input: {schema: GenerateThreatReportInputSchema},
  output: {schema: GenerateThreatReportOutputSchema},
  prompt: `You are an expert cybersecurity analyst. Based on the provided threat data, generate a comprehensive threat report.

Threat Data: {{{threatData}}}`,
});

const generateThreatReportFlow = ai.defineFlow(
  {
    name: 'generateThreatReportFlow',
    inputSchema: GenerateThreatReportInputSchema,
    outputSchema: GenerateThreatReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
