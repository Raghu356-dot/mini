'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {suggestResponseActions} from '@/ai/flows/suggest-response-actions';
import {summarizeNetworkLogs} from '@/ai/flows/summarize-network-logs';
import {Loader2, Sparkles} from 'lucide-react';

const phishingSchema = z.object({
  content: z.string().min(10, 'Please enter email content or a URL.'),
  riskScore: z.coerce.number().min(0).max(100).default(92),
});

const networkSchema = z.object({
  logs: z.string().min(20, 'Please enter sufficient log data.'),
});

const fraudSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  location: z.string().min(1, 'Location is required.'),
  device: z.string().min(1, 'Device is required.'),
  time: z.string().min(1, 'Time is required.'),
});

type AnalysisResult = {
  title: string;
  content: React.ReactNode;
};

export function AnalysisClient() {
  const [activeTab, setActiveTab] = useState('phishing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const phishingForm = useForm<z.infer<typeof phishingSchema>>({
    resolver: zodResolver(phishingSchema),
    defaultValues: {
      content: 'Urgent! Verify your bank account or your service will be suspended. Click: http://fake-bank-login.com/secure',
      riskScore: 92,
    },
  });

  const networkForm = useForm<z.infer<typeof networkSchema>>({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      logs: 'IP 192.168.1.20 attempted 150 login requests in 30 seconds.\nUnusual port scanning from IP 45.88.23.1',
    },
  });

  const fraudForm = useForm<z.infer<typeof fraudSchema>>({
    resolver: zodResolver(fraudSchema),
    defaultValues: {userId: '1058', location: 'Russia', device: 'Unknown', time: '3 AM'},
  });

  const handlePhishingSubmit = async (values: z.infer<typeof phishingSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const isUrl = values.content.startsWith('http');
      const response = await suggestResponseActions({
        threatType: isUrl ? 'Suspicious URL' : 'Phishing Email',
        riskScore: values.riskScore,
        details: values.content,
      });
      setResult({
        title: 'Phishing/Malware Agent Response',
        content: (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {response.suggestedActions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        ),
      });
    } catch (error) {
      console.error(error);
      setResult({title: 'Error', content: <p>Failed to get suggestions from the AI agent.</p>});
    }
    setLoading(false);
  };

  const handleNetworkSubmit = async (values: z.infer<typeof networkSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await summarizeNetworkLogs({networkLogs: values.logs});
      setResult({
        title: 'Network Anomaly Agent Response',
        content: <p className="text-sm">{response.summary}</p>,
      });
    } catch (error) {
      console.error(error);
      setResult({title: 'Error', content: <p>Failed to get summary from the AI agent.</p>});
    }
    setLoading(false);
  };

  const handleFraudSubmit = (values: z.infer<typeof fraudSchema>) => {
    setLoading(true);
    setResult(null);
    // Simulate AI processing as there is no specific AI flow for fraud
    setTimeout(() => {
      setResult({
        title: 'Fraud Detection Agent Response',
        content: (
          <div className="text-sm space-y-1">
            <p className="font-semibold">Potential Fraud Detected</p>
            <p>
              <strong>Reason:</strong> Login from unusual country & device.
            </p>
            <p>
              <strong>Risk Score:</strong> 78%
            </p>
            <p>
              <strong>Action:</strong> Temporary account lock initiated.
            </p>
          </div>
        ),
      });
      setLoading(false);
    }, 1500);
  };

  const currentFormSubmit = () => {
    switch (activeTab) {
        case 'phishing': return phishingForm.handleSubmit(handlePhishingSubmit);
        case 'network': return networkForm.handleSubmit(handleNetworkSubmit);
        case 'fraud': return fraudForm.handleSubmit(handleFraudSubmit);
        default: return () => {};
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Tabs
        defaultValue="phishing"
        className="w-full"
        onValueChange={id => {
          setActiveTab(id);
          setResult(null);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phishing">Phishing & Malware</TabsTrigger>
          <TabsTrigger value="network">Network Anomaly</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>
        <TabsContent value="phishing">
          <Card>
            <CardHeader>
              <CardTitle>Phishing & Malware Agent</CardTitle>
              <CardDescription>Analyze emails, URLs, and file metadata.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...phishingForm}>
                <form onSubmit={phishingForm.handleSubmit(handlePhishingSubmit)} className="space-y-4">
                  <FormField
                    control={phishingForm.control}
                    name="content"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Email Content / URL</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste email body or URL..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={phishingForm.control}
                    name="riskScore"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Simulated Risk Score</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Anomaly Agent</CardTitle>
              <CardDescription>Analyze network logs for intrusions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...networkForm}>
                <form onSubmit={networkForm.handleSubmit(handleNetworkSubmit)} className="space-y-4">
                  <FormField
                    control={networkForm.control}
                    name="logs"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Network Logs</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste network logs here..." {...field} rows={8} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Agent</CardTitle>
              <CardDescription>Analyze user activity for potential fraud.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...fraudForm}>
                <form onSubmit={fraudForm.handleSubmit(handleFraudSubmit)} className="space-y-4">
                  <FormField
                    control={fraudForm.control}
                    name="userId"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fraudForm.control}
                    name="location"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fraudForm.control}
                    name="device"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Device</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fraudForm.control}
                    name="time"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <Button onClick={currentFormSubmit()} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze with AI Agent
        </Button>
        <Card className={`transition-opacity duration-300 ${result || loading ? 'opacity-100' : 'opacity-0'}`}>
          <CardHeader>
            <CardTitle>{loading ? 'Analyzing...' : result?.title || 'Agent Output'}</CardTitle>
            <CardDescription>The agent's findings will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] text-sm">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && <div>{result.content}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
