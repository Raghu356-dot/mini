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
import {summarizeNetworkLogs} from '@/ai/flows/summarize-network-logs';
import {analyzeFile} from '@/ai/flows/analyze-file';
import {detectFraud} from '@/ai/flows/detect-fraud';
import {analyzeEmail} from '@/ai/flows/analyze-email';
import {scanUrl} from '@/ai/flows/scan-url';
import {correlateEvents} from '@/ai/flows/correlate-events';
import {suggestResponseActions} from '@/ai/flows/suggest-response-actions';
import {Loader2, Sparkles, ShieldCheck, AlertTriangle} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Checkbox} from '@/components/ui/checkbox';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {useToast} from '@/hooks/use-toast';

const emailSchema = z.object({
  content: z.string().min(10, 'Please enter email content.'),
});

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL.'),
});

const MAX_FILE_SIZE = 5000000; // 5MB
const fileSchema = z.object({
  file: z
    .any()
    .refine(files => files?.length == 1, 'File is required.')
    .refine(files => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`),
});

const networkSchema = z.object({
  logs: z.string().min(20, 'Please enter sufficient log data.'),
});

const fraudSchema = z.object({
  activityDetails: z.string().min(10, 'Please enter activity details.'),
});

const correlationSchema = z.object({
  selectedEvents: z.array(z.string()).min(2, 'Please select at least two events to correlate.'),
});

const incidentResponseSchema = z.object({
  threatType: z.string().min(1, 'Please select a threat type.'),
  riskScore: z.number().min(0).max(100),
  details: z.string().min(10, 'Please provide threat details.'),
});

type AnalysisResult = {
  title: string;
  content: React.ReactNode;
};

type LoggedEvent = {
  id: string;
  timestamp: string;
  description: string;
  agent: string;
};

const Verdict = ({verdict}: {verdict: 'Malicious' | 'Suspicious' | 'Safe' | string}) => {
  const verdictColor =
    verdict === 'Malicious'
      ? 'text-destructive'
      : verdict === 'Suspicious'
      ? 'text-yellow-500'
      : verdict === 'Safe'
      ? 'text-green-500'
      : '';
  return <span className={cn('font-bold', verdictColor)}>{verdict}</span>;
};

export function AnalysisClient() {
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const {toast} = useToast();

  const addEvent = (agent: string, description: string) => {
    const newEvent: LoggedEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agent,
      description,
    };
    setLoggedEvents(prev => [newEvent, ...prev]);
  };

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      content:
        'Urgent! Verify your bank account or your service will be suspended. Click: http://fake-bank-login.com/secure',
    },
  });

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: 'http://fake-bank-login.com/secure',
    },
  });

  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
  });

  const networkForm = useForm<z.infer<typeof networkSchema>>({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      logs: 'IP 192.168.1.20 attempted 150 login requests in 30 seconds.\nUnusual port scanning from IP 45.88.23.1',
    },
  });

  const fraudForm = useForm<z.infer<typeof fraudSchema>>({
    resolver: zodResolver(fraudSchema),
    defaultValues: {
      activityDetails: 'User 1058 logged in from Russia with an unknown device at 3 AM.',
    },
  });

  const correlationForm = useForm<{selectedEvents: string[]}>({
    resolver: zodResolver(correlationSchema),
    defaultValues: {
      selectedEvents: [],
    },
  });

  const incidentResponseForm = useForm<z.infer<typeof incidentResponseSchema>>({
    resolver: zodResolver(incidentResponseSchema),
    defaultValues: {
      threatType: 'Phishing',
      riskScore: 90,
      details: 'Malicious link detected in an email from suspicious domain.',
    },
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await analyzeEmail({emailContent: values.content});
      const eventDescription = `Email Analysis: Verdict - ${response.verdict}. Details: ${response.analysis}`;
      addEvent('Email Analyzer', eventDescription);

      if (response.verdict === 'Malicious') {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-white" />
              <span className="font-bold">Malicious Email Detected</span>
            </div>
          ),
          description: response.analysis,
        });
      } else if (response.verdict === 'Suspicious') {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              <span className="font-bold">Suspicious Email</span>
            </div>
          ),
          description: response.analysis,
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" />
              <span className="font-bold">Email is Safe</span>
            </div>
          ),
          description: 'No threats found in the email.',
        });
      }

      setResult({
        title: 'Email Analyzer Agent Response',
        content: (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Verdict:</span> <Verdict verdict={response.verdict} />
            </p>
            <p>
              <span className="font-semibold">Analysis:</span> {response.analysis}
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
      setResult({title: 'Error', content: <p>Failed to get analysis from the AI agent.</p>});
    }
    setLoading(false);
  };

  const handleUrlSubmit = async (values: z.infer<typeof urlSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await scanUrl({url: values.url});
      const eventDescription = `URL Scan: Verdict - ${response.verdict}. Details: ${response.analysis}`;
      addEvent('URL Scanner', eventDescription);

      if (response.verdict === 'Malicious') {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-white" />
              <span className="font-bold">Malicious URL Detected</span>
            </div>
          ),
          description: response.analysis,
        });
      } else if (response.verdict === 'Suspicious') {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              <span className="font-bold">Suspicious URL</span>
            </div>
          ),
          description: response.analysis,
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" />
              <span className="font-bold">URL is Safe</span>
            </div>
          ),
          description: 'No threats found for this URL.',
        });
      }

      setResult({
        title: 'URL Scanner Agent Response',
        content: (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Verdict:</span> <Verdict verdict={response.verdict} />
            </p>
            <p>
              <span className="font-semibold">Analysis:</span> {response.analysis}
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
      setResult({title: 'Error', content: <p>Failed to get analysis from the AI agent.</p>});
    }
    setLoading(false);
  };

  const handleFileSubmit = async (values: z.infer<typeof fileSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const file = values.file[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        const fileContent = reader.result as string;
        try {
          const response = await analyzeFile({
            fileName: file.name,
            fileContent: fileContent,
          });
          const eventDescription = `File Analysis: Verdict - ${response.verdict} for file ${file.name}. Details: ${response.analysis}`;
          addEvent('File Analyzer', eventDescription);

          if (response.verdict === 'Malicious') {
            toast({
              variant: 'destructive',
              title: (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-white" />
                  <span className="font-bold">Malicious File Detected</span>
                </div>
              ),
              description: response.analysis,
            });
          } else if (response.verdict === 'Suspicious') {
            toast({
              title: (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-yellow-500" />
                  <span className="font-bold">Suspicious File</span>
                </div>
              ),
              description: response.analysis,
            });
          } else {
            toast({
              title: (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-green-500" />
                  <span className="font-bold">File is Safe</span>
                </div>
              ),
              description: 'No threats found in the file.',
            });
          }

          setResult({
            title: 'Malware File Analyzer Response',
            content: (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Verdict:</span> <Verdict verdict={response.verdict} />
                </p>
                <p>
                  <span className="font-semibold">Analysis:</span> {response.analysis}
                </p>
              </div>
            ),
          });
        } catch (error) {
          console.error(error);
          setResult({title: 'Error', content: <p>Failed to get analysis from the AI agent.</p>});
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        setResult({title: 'Error', content: <p>Failed to read the uploaded file.</p>});
        setLoading(false);
      };
    } catch (e) {
      console.error(e);
      setResult({title: 'Error', content: <p>An error occurred during file processing.</p>});
      setLoading(false);
    }
  };

  const handleNetworkSubmit = async (values: z.infer<typeof networkSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await summarizeNetworkLogs({networkLogs: values.logs});
      const eventDescription = `Network Anomaly: ${response.summary}`;
      addEvent('Network Anomaly', eventDescription);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            <span className="font-bold">Network Log Summary</span>
          </div>
        ),
        description: response.summary,
      });
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

  const handleFraudSubmit = async (values: z.infer<typeof fraudSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await detectFraud({activityDetails: values.activityDetails});
      const eventDescription = `Fraud Detection: Verdict - ${
        response.isFraudulent ? 'Fraudulent' : 'Not Fraudulent'
      }, Risk - ${response.riskScore}%. Reason: ${response.reason}`;
      addEvent('Fraud Detection', eventDescription);

      if (response.isFraudulent) {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-white" />
              <span className="font-bold">Potential Fraud Detected</span>
            </div>
          ),
          description: `Activity with risk score ${response.riskScore}% was flagged. ${response.suggestedAction}`,
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" />
              <span className="font-bold">Activity Clear</span>
            </div>
          ),
          description: `The analyzed activity appears to be legitimate (Risk: ${response.riskScore}%).`,
        });
      }

      setResult({
        title: 'Fraud Detection Agent Response',
        content: (
          <div className="text-sm space-y-2">
            <p>
              <span className="font-semibold">Verdict:</span>{' '}
              <span
                className={cn(
                  'font-bold',
                  response.isFraudulent ? 'text-destructive' : 'text-green-500'
                )}
              >
                {response.isFraudulent ? 'Potential Fraud Detected' : 'No Fraud Detected'}
              </span>
            </p>
            <p>
              <span className="font-semibold">Risk Score:</span>{' '}
              <span
                className={cn(
                  'font-bold',
                  response.riskScore > 80
                    ? 'text-destructive'
                    : response.riskScore > 60
                    ? 'text-yellow-500'
                    : 'text-green-500'
                )}
              >
                {response.riskScore}%
              </span>
            </p>
            <p>
              <span className="font-semibold">Reason:</span> {response.reason}
            </p>
            <p>
              <span className="font-semibold">Suggested Action:</span> {response.suggestedAction}
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
      setResult({title: 'Error', content: <p>Failed to get fraud analysis from the AI agent.</p>});
    }
    setLoading(false);
  };

  const handleCorrelationSubmit = async () => {
    const values = correlationForm.getValues();
    if (values.selectedEvents.length < 2) {
      correlationForm.setError('selectedEvents', {
        type: 'manual',
        message: 'Please select at least two events to correlate.',
      });
      return;
    }
    correlationForm.clearErrors('selectedEvents');

    setLoading(true);
    setResult(null);
    try {
      const response = await correlateEvents({events: values.selectedEvents.join('\n')});
      if (response.areConnected) {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-white" />
              <span className="font-bold">Correlated Events Detected</span>
            </div>
          ),
          description: response.correlationAnalysis,
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" />
              <span className="font-bold">Events Not Correlated</span>
            </div>
          ),
          description: response.correlationAnalysis,
        });
      }
      setResult({
        title: 'Correlation Agent Response',
        content: (
          <div className="text-sm space-y-2">
            <p>
              <span className="font-semibold">Verdict:</span>{' '}
              <span
                className={cn(
                  'font-bold',
                  response.areConnected ? 'text-destructive' : 'text-green-500'
                )}
              >
                {response.areConnected ? 'Events are Connected' : 'Events are Not Connected'}
              </span>
            </p>
            <p>
              <span className="font-semibold">Analysis:</span> {response.correlationAnalysis}
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
      setResult({title: 'Error', content: <p>Failed to get correlation analysis from the AI agent.</p>});
    }
    setLoading(false);
  };

  const handleIncidentResponseSubmit = async (values: z.infer<typeof incidentResponseSchema>) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await suggestResponseActions(values);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-green-500" />
            <span className="font-bold">Threat Mitigated</span>
          </div>
        ),
        description: `Automated response for ${values.threatType} (Risk: ${values.riskScore}%) has been executed.`,
      });
      setResult({
        title: 'Incident Response Actions Performed',
        content: (
          <div className="text-sm space-y-2">
            <p className="font-semibold">
              The following automated mitigation actions have been performed:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {response.performedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from the AI agent.',
      });
      setResult({
        title: 'Error',
        content: <p>Failed to get automated response from the AI agent.</p>,
      });
    }
    setLoading(false);
  };

  const currentFormSubmit = () => {
    switch (activeTab) {
      case 'email':
        return emailForm.handleSubmit(handleEmailSubmit);
      case 'url':
        return urlForm.handleSubmit(handleUrlSubmit);
      case 'file':
        return fileForm.handleSubmit(handleFileSubmit);
      case 'network':
        return networkForm.handleSubmit(handleNetworkSubmit);
      case 'fraud':
        return fraudForm.handleSubmit(handleFraudSubmit);
      case 'correlation':
        return handleCorrelationSubmit;
      case 'incident-response':
        return incidentResponseForm.handleSubmit(handleIncidentResponseSubmit);
      default:
        return () => {};
    }
  };

  const handleEventSelectionChange = (eventId: string) => {
    const currentSelected = correlationForm.getValues('selectedEvents');
    const newSelected = currentSelected.includes(eventId)
      ? currentSelected.filter(id => id !== eventId)
      : [...currentSelected, eventId];
    correlationForm.setValue('selectedEvents', newSelected);
    setSelectedEvents(newSelected); // To trigger re-render
  };

  return (
    <Tabs
      defaultValue="email"
      orientation="vertical"
      className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start"
      onValueChange={id => {
        setActiveTab(id);
        setResult(null);
      }}
    >
      <div className="col-span-1">
        <TabsList className="flex flex-col h-full w-full bg-transparent p-0">
          <TabsTrigger value="email" className="w-full justify-start text-base p-3">
            Email Analyzer
          </TabsTrigger>
          <TabsTrigger value="url" className="w-full justify-start text-base p-3">
            URL Scanner
          </TabsTrigger>
          <TabsTrigger value="file" className="w-full justify-start text-base p-3">
            File Analyzer
          </TabsTrigger>
          <TabsTrigger value="network" className="w-full justify-start text-base p-3">
            Network Anomaly
          </TabsTrigger>
          <TabsTrigger value="fraud" className="w-full justify-start text-base p-3">
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="correlation" className="w-full justify-start text-base p-3">
            Correlation
          </TabsTrigger>
          <TabsTrigger value="incident-response" className="w-full justify-start text-base p-3">
            Incident Response
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="col-span-1 md:col-span-3">
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Analyzer Agent</CardTitle>
              <CardDescription>Analyze email content for phishing attempts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="content"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Email Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste email body here..." {...field} rows={6} />
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

        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>URL Scanner Agent</CardTitle>
              <CardDescription>Scan URLs for malicious links.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...urlForm}>
                <form onSubmit={urlForm.handleSubmit(handleUrlSubmit)} className="space-y-4">
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
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

        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Malware File Analyzer</CardTitle>
              <CardDescription>Upload a file to analyze its contents for malware.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...fileForm}>
                <form onSubmit={fileForm.handleSubmit(handleFileSubmit)} className="space-y-4">
                  <FormField
                    control={fileForm.control}
                    name="file"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={e => field.onChange(e.target.files)} />
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
                    name="activityDetails"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Activity Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the user activity..." {...field} rows={6} />
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

        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle>Correlation Agent</CardTitle>
              <CardDescription>Select events from other agents to find connections.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...correlationForm}>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleCorrelationSubmit();
                  }}
                  className="space-y-4"
                >
                  <FormField
                    control={correlationForm.control}
                    name="selectedEvents"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Logged Events</FormLabel>
                          <p className="text-sm text-muted-foreground">Select at least two events to correlate.</p>
                        </div>
                        <div className="space-y-2 h-64 overflow-y-auto border p-2 rounded-md">
                          {loggedEvents.length === 0 && (
                            <p className="text-muted-foreground text-sm text-center py-4">
                              No events logged yet. Run other agents to generate events.
                            </p>
                          )}
                          {loggedEvents.map(event => (
                            <FormField
                              key={event.id}
                              control={correlationForm.control}
                              name="selectedEvents"
                              render={() => {
                                return (
                                  <FormItem
                                    key={event.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={correlationForm.getValues('selectedEvents').includes(event.description)}
                                        onCheckedChange={() => handleEventSelectionChange(event.description)}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal">{event.description}</FormLabel>
                                      <p className="text-xs text-muted-foreground">
                                        {event.agent} - {new Date(event.timestamp).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incident-response">
          <Card>
            <CardHeader>
              <CardTitle>Automated Incident Response</CardTitle>
              <CardDescription>
                Perform automatic mitigation for a confirmed threat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...incidentResponseForm}>
                <form
                  onSubmit={incidentResponseForm.handleSubmit(handleIncidentResponseSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={incidentResponseForm.control}
                    name="threatType"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Threat Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a threat type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Phishing">Phishing</SelectItem>
                            <SelectItem value="Malware">Malware</SelectItem>
                            <SelectItem value="Intrusion">Intrusion</SelectItem>
                            <SelectItem value="Fraud">Fraud</SelectItem>
                            <SelectItem value="Port Scan">Port Scan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={incidentResponseForm.control}
                    name="riskScore"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          Risk Score: <span className="font-bold">{field.value}</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={value => field.onChange(value[0])}
                            defaultValue={[field.value]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={incidentResponseForm.control}
                    name="details"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Threat Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Provide details of the threat..." {...field} rows={4} />
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
    </Tabs>
  );
}
