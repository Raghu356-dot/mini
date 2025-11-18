import { config } from 'dotenv';
config();

import '@/ai/flows/generate-threat-report.ts';
import '@/ai/flows/summarize-network-logs.ts';
import '@/ai/flows/analyze-file.ts';
import '@/ai/flows/detect-fraud.ts';
import '@/ai/flows/analyze-email.ts';
import '@/ai/flows/scan-url.ts';
import '@/ai/flows/correlate-events.ts';
