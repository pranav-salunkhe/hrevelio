import { Accordion, ActionIcon, AccordionControlProps, Center, Code, Paper } from '@mantine/core';
import { IconDots, IconPlayerPlay } from '@tabler/icons-react';
import { TestCase } from './Shell';
import { CodeHighlight } from '@mantine/code-highlight'
import { CopyButton, Tooltip, rem } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { Tabs } from '@mantine/core';

interface AccordionControlPropsExtended extends AccordionControlProps {
    testCase: TestCase;
}

function AccordionControl(props: AccordionControlPropsExtended) {
    const { testCase, ...rest } = props;

    return (
        <Center>
            <Accordion.Control {...rest} />
            <ActionIcon size="lg" variant="subtle" color="blue">
                {/* <IconPlayerPlay size="1rem" onClick={() => runTestCase(testCase.jestCode)} /> */}
                <CopyButton value={testCase.jestCode} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                {copied ? (
                                    <IconCheck style={{ width: rem(16) }} color='blue' />
                                ) : (
                                    <IconCopy style={{ width: rem(16) }} color='blue' />
                                )}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </ActionIcon>
        </Center>
    );
}

interface Props {
    testCases: TestCase[]
}

export default function TestCaseComp({ testCases }: Props) {
    return (
        // <Tabs defaultValue={testCases[0].targetBusinessRequirement} orientation="vertical">
        //     <Tabs.List>
        //         {testCases.map((tc, index) => (
        //             <Tabs.Tab key={index} value={"Test Case: " + (index)}>
        //                 <Accordion chevronPosition="left" maw={300} mx="auto">
        //                     <Accordion.Item key={index} value={`item-${index}`}>
        //                         <AccordionControl testCase={tc}>{"Test Case: " + (index)}</AccordionControl>
        //                         <Accordion.Panel className='h-full break-words' maw={300}>
        //                             <Paper maw={300}>
        //                                 {tc.targetBusinessRequirement}
        //                             </Paper>
        //                         </Accordion.Panel>
        //                     </Accordion.Item>
        //                 </Accordion>
        //             </Tabs.Tab>
        //         ))}
        //     </Tabs.List>
        //     {testCases.map((tc, index) => (
        //         <Tabs.Panel key={index} value={"Test Case: " + (index)}>{tc.jestCode}</Tabs.Panel>
        //     ))}
        // </Tabs>
        <Accordion chevronPosition="left" maw={1200} mx="auto">
            <div className='grid grid-cols-2 gap-x-2'>
                {testCases.map((tC, index) => (
                    <Accordion.Item key={index} value={`item-${index}`}>
                        <AccordionControl testCase={tC}>
                            <p className='text-blue-500 font-bold'>Test Case {index + 1}:</p>
                            <p>{tC.targetBusinessRequirement}</p>
                        </AccordionControl>
                        <Accordion.Panel className='h-full'>
                            {/* <CodeHighlight
                            code={tC.jestCode}
                            language="js"
                            copyLabel='Copy testcase'
                            copiedLabel='Copied!'
                            h={"20vh"}
                        /> */}
                            <Code className='flex flex-col rounded-2xl shadow-md'>
                                {tC.jestCode}
                            </Code>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </div>
        </Accordion>
    );
}