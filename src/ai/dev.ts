import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-response-actions.ts';
import '@/ai/flows/generate-threat-report.ts';
import '@/ai/flows/summarize-network-logs.ts';