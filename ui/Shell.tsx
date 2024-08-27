"use client";
import { AppShell, Burger, Button, ColorSwatch, createTheme, Divider, Group, Loader, MantineThemeProvider, ScrollArea, Space, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Steps from './Steps';
import { useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Upload } from './Upload';
import { AiResponse } from '@/lib/config/openai';
import Visualize from './Visualize';
import Impact from './Impact';
import DisplayCode from './DisplayCode';
import Link from 'next/link';
import { IconAi } from '@tabler/icons-react';
import { RiAiGenerate } from "react-icons/ri";
import { conductorClientPromise } from '@/lib/config/conductor';
import { httpTask, WorkflowExecutor } from '@io-orkes/conductor-javascript';
import { OptimizedCodeResponse } from '@/lib/config/openai';
import TestCaseComp from './TestCaseComp';
import { RingLoader } from './RingLoader';
export interface Metrics {
    vocabulary: {
        value: number,
        impact: string,
    },
    volume: {
        value: number,
        impact: string,
    },
    difficulty: {
        value: number,
        impact: string,
    },
    bugs: {
        value: number,
        impact: string,
    },
    effort: {
        value: number,
        impact: string,
    },
    length: {
        value: number,
        impact: string,
    },
    critical: [{
        fromLine: number,
        toLine: number,
        reason: string,
    }]
}

export interface OptimizedCode {
    optimizedCode: string,
    optimizedMetrics: Metrics,
}

export interface TestCase {
    jestCode: string,
    targetBusinessRequirement: string,
}

interface WorkflowOutput {
    suggestionsResult?: {
        metrics: Metrics;
    };
    optimizedCodeResult?: {
        optimal: OptimizedCode;
    };
    testCasesResult?: {
        testCases: TestCase[];
    };
}

const theme = createTheme({
    components: {
        Loader: Loader.extend({
            defaultProps: {
                loaders: { ...Loader.defaultLoaders, ring: RingLoader },
                type: 'ring',
            },
        }),
    },
});

export default function Shell() {
    const [opened, { toggle }] = useDisclosure();
    const [activeStep, setActiveStep] = useState(0); // Moved the active state here
    const [width, setWidth] = useState(0); // Moved the active state here
    const [code, setCode] = useState(""); // State to hold the code
    const [loading, setLoading] = useState(false);
    const [optimizedCode, setOptimizedCode] = useState<OptimizedCode>({
        optimizedCode: "",
        optimizedMetrics: {
            volume: {
                value: 0,
                impact: "",
            },
            vocabulary: {
                value: 0,
                impact: "",
            },
            length: {
                value: 0,
                impact: "",
            },
            difficulty: {
                value: 0,
                impact: "",
            },
            effort: {
                value: 0,
                impact: "",
            },
            bugs: {
                value: 0,
                impact: "",
            },
            critical: [
                {
                    fromLine: 0,
                    toLine: 0,
                    reason: "",
                }
            ]
        }
    }); // State to hold the code
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [metrics, setMetrics] = useState<Metrics>({
        volume: {
            value: 0,
            impact: "",
        },
        vocabulary: {
            value: 0,
            impact: "",
        },
        length: {
            value: 0,
            impact: "",
        },
        difficulty: {
            value: 0,
            impact: "",
        },
        effort: {
            value: 0,
            impact: "",
        },
        bugs: {
            value: 0,
            impact: "",
        },
        critical: [
            {
                fromLine: 0,
                toLine: 0,
                reason: "",
            }
        ]
    });
    const [workflowId, setWorkflowId] = useState<string | null>(null);

    useEffect(() => {
        setWidth((window.innerWidth - 300) / 2);
    }, []);
    const startWorkflow = async () => {
        try {
            const conductorClient = await conductorClientPromise;
            const executor = new WorkflowExecutor(conductorClient);
            setLoading(true);

            // Start the workflow with initial input
            const workflowInput = { code };
            const response = await executor.startWorkflow({
                name: "CodeOptimizationWorkflow",
                version: 1,
                input: workflowInput,
            });

            if (response) {
                setWorkflowId(response);
                monitorWorkflow(response);
            } else {
                console.error("Failed to start workflow: No workflowId returned");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error starting workflow:", error);
            setLoading(false);
        }
    };

    const monitorWorkflow = async (workflowId: string) => {
        try {
            const conductorClient = await conductorClientPromise;
            const executor = new WorkflowExecutor(conductorClient);

            // Polling for workflow status
            const interval = setInterval(async () => {
                try {
                    const workflowStatus = await executor.getWorkflow(workflowId, true);
                    const workflowOutput = workflowStatus.output as WorkflowOutput;

                    if (workflowStatus.status === "COMPLETED") {
                        clearInterval(interval);
                        if (workflowOutput.suggestionsResult && workflowOutput.optimizedCodeResult && workflowOutput.testCasesResult) {
                            setMetrics(workflowOutput.suggestionsResult.metrics);
                            setOptimizedCode(workflowOutput.optimizedCodeResult.optimal);
                            setTestCases(workflowOutput.testCasesResult.testCases);
                        }
                        setLoading(false);
                        setActiveStep(3); // Move to test case display step
                    } else if (workflowStatus.status === "FAILED" || workflowStatus.status === "TERMINATED") {
                        clearInterval(interval);
                        setLoading(false);
                        console.error("Workflow failed or terminated", workflowStatus);
                    }
                } catch (error) {
                    clearInterval(interval);
                    setLoading(false);
                    console.error("Error fetching workflow status:", error);
                }
            }, 2000); // Poll every 2 seconds
        } catch (error) {
            console.error("Error monitoring workflow:", error);
        }
    };

    const handleGetSuggestions = async () => {
        await startWorkflow();
    };
    // const hrevelioWorkflow = {
    //     name: "hrevelio",
    //     version: 1,
    //     ownerEmail: "pvsalunkhe2003@gmail.com",
    //     tasks: [
    //         httpTask("optimize_code", {
    //             uri: "http://localhost:3000/api/optimize",
    //             method: "POST",
    //             body: JSON.stringify(code),
    //         }),
    //         httpTask("generate_test_cases", {
    //             uri: "http://localhost:3000/api/generate-test-cases",
    //             method: "POST",
    //             body: JSON.stringify(optimizedCode),
    //         }),
    //         httpTask("run_test_cases", {
    //             uri: "http://localhost:3000/api/run-test-cases",
    //             method: "POST",
    //             body: JSON.stringify({
    //                 optimizedCode: optimizedCode,
    //                 testCases: testCases,
    //             }),
    //         }),
    //     ]
    // }

    // const handleGetSuggestions = async () => {
    //     const conductorClient = await conductorClientPromise;
    //     const executor = new WorkflowExecutor(conductorClient);
    //     setLoading(true);
    //     console.log("Code to be processed:", code);
    //     const response = await fetch("http://localhost:3000/api/suggestions", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(code),
    //     })
    //     const data = await response.json();
    //     console.log("RESPONSE:", data)
    //     setMetrics(data.metrics);
    //     setActiveStep(activeStep + 1);
    //     setLoading(false);
    // }
    // const handleOptimize = async () => {
    //     setLoading(true);
    //     const response = await fetch("http://localhost:3000/api/optimize", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(code),
    //     })
    //     const data = await response.json();
    //     console.log("optimal: ", data);
    //     setOptimizedCode(data?.optimal);
    //     setActiveStep(activeStep + 1);
    //     setLoading(false)
    // }
    // const handleGenerateTestCases = async () => {
    //     setLoading(true);
    //     const response = await fetch("http://localhost:3000/api/generate-test-cases", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(optimizedCode.optimizedCode),
    //     })
    //     const data = await response.json();
    //     console.log("testcases: ", data);
    //     setTestCases(data?.testCases);
    //     setActiveStep(activeStep + 1);
    //     setLoading(false)
    // }
    const renderContent = () => {
        switch (activeStep) {
            case 0:
                return <div className='w-full'>
                    <Text
                        // size="xl"
                        fz={'h1'}
                        fw={900}
                        p={16}
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    >
                        Upload your code here.
                    </Text>
                    {/* <p className='text-5xl font-bold p-4'>Upload your code here.</p> */}
                    <div className='rounded-xl flex w-full divide-y-2 gap-x-4 p-4 justify-center items-center'>
                        <div className='w-full border-2 p-1 rounded-xl shadow-lg'>
                            <CodeEditor width={width} code={code} setCode={setCode}></CodeEditor>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='flex bg-black bg-opacity-30' style={{ height: "24vh", width: "1px" }}></div>
                            <p>OR</p>
                            <div className='flex bg-black bg-opacity-30' style={{ height: "24vh", width: "1px" }}></div>
                        </div>
                        <div style={{ height: "50vh" }} className='border-2 w-full p-4 rounded-xl shadow-lg'>
                            <Upload></Upload>
                        </div>
                    </div>
                    <div className='p-4'>
                        <Button variant="light" disabled={loading} onClick={handleGetSuggestions} radius={7} className='px-4 py-2'>
                            {loading ? (
                                <>
                                    Analyzing... <Loader />
                                </>
                            ) : (
                                "Analyze!"
                            )}

                        </Button>
                    </div>

                </div>;
            // return <div>Welcome to Hrevelio</div>;
            case 1:
                return <div className='overflow-y-hidden'>
                    <div className='flex w-full overflow-y-hidden gap-x-6'>
                        <div className='flex flex-col w-fit h-full gap-y-2'>
                            <p className='text-blue-500 font-bold text-3xl'>Code Analysis Results</p>
                            <p className='text-black opacity-60 font-light text-sm'>Hrevelio determines how well your code is in terms of developer experiences and overall quality with the help of halstead complexity measures.</p>
                            <Impact vocabulary={metrics.vocabulary} volume={metrics.volume} difficulty={metrics.difficulty} bugs={metrics.bugs} effort={metrics.effort} length={metrics.length} critical={metrics.critical} />
                            <ScrollArea h={550} className='shadow-md'>
                                <DisplayCode code={code} critical={metrics.critical} />
                            </ScrollArea>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='flex bg-black bg-opacity-10' style={{ height: "85vh", width: "1px" }}></div>
                        </div>
                        <div className='flex flex-col w-full h-full justify-between gap-y-4'>
                            <Visualize vocabulary={metrics.vocabulary} volume={metrics.volume} difficulty={metrics.difficulty} bugs={metrics.bugs} effort={metrics.effort} length={metrics.length} critical={metrics.critical} />
                            <div className='flex flex-col gap-y-2 justify-center items-start'>
                                <p className='text-black opacity-60 font-bold text-sm'>Legend</p>
                                <div className='flex gap-x-4'>
                                    <ColorSwatch color="green" />
                                    <p className='text-black opacity-60 font-light text-sm'>Optimal</p>
                                </div>
                                <div className='flex gap-x-4'>
                                    <ColorSwatch color="yellow" />
                                    <p className='text-black opacity-60 font-light text-sm'>Within acceptable limit</p>
                                </div>
                                <div className='flex gap-x-4'>
                                    <ColorSwatch color="red" />
                                    <p className='text-black opacity-60 font-light text-sm'>Needs optimization</p>
                                </div>
                            </div>
                            {/* <Button variant='light' disabled={loading} onClick={handleOptimize}><RiAiGenerate /><Space w={4} />
                                {loading ? (
                                    <>
                                        Optimizing Code... <Loader />
                                    </>
                                ) : (
                                    "Optimize!"
                                )}
                            </Button> */}
                        </div>
                    </div>
                </div>;
            case 2:
                return <div className='overflow-y-hidden'>
                    <div className='flex w-full overflow-y-hidden gap-x-6'>
                        <div className='flex flex-col w-full h-full gap-y-2'>
                            <p className='text-blue-500 font-bold text-3xl'>Optimized Code!</p>
                            <p className='text-black opacity-60 font-light text-sm'>Here's a better way to write your code with improved developer experience and code quality!</p>
                            <Impact vocabulary={optimizedCode.optimizedMetrics.vocabulary} volume={optimizedCode.optimizedMetrics.volume} difficulty={optimizedCode.optimizedMetrics.difficulty} bugs={optimizedCode.optimizedMetrics.bugs} effort={optimizedCode.optimizedMetrics.effort} length={optimizedCode.optimizedMetrics.length} critical={optimizedCode.optimizedMetrics.critical} />
                            <ScrollArea h={550} className='shadow-md'>
                                <DisplayCode code={optimizedCode.optimizedCode} critical={optimizedCode.optimizedMetrics.critical} />
                            </ScrollArea>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='flex bg-black bg-opacity-10' style={{ height: "85vh", width: "1px" }}></div>
                        </div>
                        <div className='flex flex-col w-[30%] h-full justify-between gap-y-4'>
                            <Visualize vocabulary={optimizedCode.optimizedMetrics.vocabulary} volume={optimizedCode.optimizedMetrics.volume} difficulty={optimizedCode.optimizedMetrics.difficulty} bugs={optimizedCode.optimizedMetrics.bugs} effort={optimizedCode.optimizedMetrics.effort} length={optimizedCode.optimizedMetrics.length} critical={optimizedCode.optimizedMetrics.critical} />
                            <div className='flex flex-col gap-y-2 justify-center items-start'>
                                <p>Legend</p>
                                <div className='flex gap-x-4'>
                                    <ColorSwatch color="green" />
                                    <p>Optimal</p>
                                </div>
                                <div className='flex gap-x-4'>
                                    <ColorSwatch color="yellow" />
                                    <p>Within acceptable limit</p>
                                </div>
                                <div className='flex gap-x-4'>
                                    <ColorSwatch color="red" />
                                    <p>Needs optimization</p>
                                </div>
                            </div>
                            {/* <Button variant='light' disabled={loading} onClick={handleGenerateTestCases}><RiAiGenerate /><Space w={4} />
                                {loading ? (
                                    <>
                                        Generating Unit Tests... <Loader />
                                    </>
                                ) : (
                                    "Generate Unit Tests!"
                                )}
                            </Button> */}
                        </div>
                    </div>
                </div>;
            case 3:
                return <div className='flex flex-col w-full gap-y-4'>
                    <p className='text-blue-500 font-bold text-3xl'>Test Cases</p>
                    <p className='text-black opacity-60 font-light text-sm'>Below are some test cases which you can test your code against!</p>
                    <TestCaseComp testCases={testCases} />
                    {/* {testCases?.map((tC) => (
                        <div className='flex flex-col border-2 border-black text-red-500'>
                            <p>{tC.jestCode}</p>
                            <p>{tC.targetBusinessRequirement}</p>
                        </div>
                    ))} */}
                </div>;
            case 4:
                return <div className='flex flex-col gap-y-6'>
                    <p className='text-blue-500 font-bold text-3xl'>Future Work</p>
                    <div className='text-black opacity-60 font-light text-sm'>
                        <ul>
                            <li>Support for more languages</li>
                            <li>Support for workspace</li>
                            <li>Github Integration - Webhooks to notify bad quality code</li>
                            <li>In-browser testing</li>
                        </ul>
                    </div>
                    <div className='flex flex-col gap-y-6'>
                        <p className='text-blue-500 font-bold text-3xl'>Developer</p>
                        <div className='text-black opacity-60 font-light text-sm'>
                            <p>Pranav Salunkhe</p>
                            <ul>
                                <li>National Insitute of Technology Karnataka</li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-6'>
                        <p className='text-blue-500 font-bold text-3xl'>Built At</p>
                        <div className='text-black opacity-60 font-light text-sm'>
                            <p>BuildTheFlow</p>
                            <ul>
                                <li>Orkes Conductor hackathon</li>
                            </ul>
                        </div>
                    </div>
                </div>;
            default:
                return <div>Welcome to Hrevelio</div>;
            // return <div>Upload your code here.</div>;
        }
    };

    return (
        <MantineThemeProvider theme={theme}>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                <AppShell.Header>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <div className='text-center w-full h-full flex justify-center items-center'>
                        <p className='text-xl font-bold h-full flex justify-center items-center text-center'>Hrevelio</p>
                        {/* <div>Hrevelio</div> */}
                        {/* <div>
                        <Link href={"/about"}>About</Link>
                    </div> */}
                    </div>
                </AppShell.Header>

                <AppShell.Navbar p="md" className='flex flex-col justify-center items-center'>
                    <Steps activeStep={activeStep} setActiveStep={setActiveStep} />
                </AppShell.Navbar>

                <AppShell.Main>
                    {renderContent()}
                </AppShell.Main>
            </AppShell>
        </MantineThemeProvider>
    );
}
