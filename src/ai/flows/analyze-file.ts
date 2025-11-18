'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a file for potential malware.
 *
 * - analyzeFile - A function that analyzes file content.
 * - AnalyzeFileInput - The input type for the analyzeFile function.
 * - AnalyzeFileOutput - The return type for the analyzeFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFileInputSchema = z.object({
  fileName: z.string().describe('The name of the file.'),
  fileContent: z.string().describe('The content of the file to be analyzed.'),
});
export type AnalyzeFileInput = z.infer<typeof AnalyzeFileInputSchema>;

const AnalyzeFileOutputSchema = z.object({
  verdict: z.enum(['Malicious', 'Suspicious', 'Safe']).describe('The verdict of the analysis.'),
  analysis: z.string().describe('A summary of the analysis findings.'),
});
export type AnalyzeFileOutput = z.infer<typeof AnalyzeFileOutputSchema>;

export async function analyzeFile(input: AnalyzeFileInput): Promise<AnalyzeFileOutput> {
  return analyzeFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFilePrompt',
  input: {schema: AnalyzeFileInputSchema},
  output: {schema: AnalyzeFileOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in malware detection. Analyze the following file content and provide a verdict (Malicious, Suspicious, or Safe) and a brief analysis.

File Name: {{{fileName}}}

File Content:
{{{fileContent}}}`,
});

const analyzeFileFlow = ai.defineFlow(
  {
    name: 'analyzeFileFlow',
    inputSchema: AnalyzeFileInputSchema,
    outputSchema: AnalyzeFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
