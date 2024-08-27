import { Stepper } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import About from './About';

interface Props {
    activeStep: number,
    setActiveStep: Dispatch<SetStateAction<number>>
}

export default function Steps({ activeStep, setActiveStep }: Props) {
    return (
        <Stepper active={activeStep} onStepClick={setActiveStep} orientation="vertical">
            <Stepper.Step label="Upload Code" description="Type or upload source code file.">
                <About></About>
            </Stepper.Step>
            <Stepper.Step label="Analysis" description="We'll anaylse your code with respect to standard halstead metrics.">
                <About></About>
            </Stepper.Step>
            <Stepper.Step label="Code Generation" description="We'll generate with previous step's context.">
                <About></About>
            </Stepper.Step>
            <Stepper.Step label="Testing" description="A code that is tested keeps the bugs away.">
                <About></About>
            </Stepper.Step>
            <Stepper.Step label="About" description="What's next?">
                <About></About>
            </Stepper.Step>
        </Stepper>
    );
}
