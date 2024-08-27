import React, { useEffect, useState } from 'react';
import { RingProgress, Text } from '@mantine/core';
import { Metrics } from './Shell';

// Function to determine the color based on the value and its corresponding ranges
function getColor(value: number, thresholds: { green: { max: number; }; yellow: { max: number; }; red: { max: number; }; }) {
    if (value <= thresholds.green.max) {
        return "green";
    } else if (value <= thresholds.yellow.max) {
        return "yellow";
    } else {
        return "red.9";
    }
}

interface Props {
    label: string,
    value: number,
    thresholds: { green: { max: number; }; yellow: { max: number; }; red: { max: number; } },
    maxValue: number,
}
// Component to display each metric with a gradient visualization
function MetricRing({ label, value, thresholds, maxValue }: Props) {
    const percentage = (value / maxValue) * 100;
    const color = getColor(value, thresholds);

    return (
        <div>
            <Text className='text-center'>{label}</Text>
            <RingProgress
                sections={[{ value: percentage, color: color }]}
                label={<Text className='text-center'>{value}</Text>}
            />
        </div>
    );
}
function AnimatedMetricRing({ label, value, thresholds, maxValue }: Props) {
    const [animatedValue, setAnimatedValue] = useState(0);

    // Calculate percentage and color
    const percentage = (value / maxValue) * 100;
    const color = getColor(value, thresholds);

    useEffect(() => {
        let startValue = 0;
        const duration = 1000; // Duration of the animation in ms
        const increment = (percentage / duration) * 10; // Calculate increment per step

        const interval = setInterval(() => {
            startValue += increment;
            if (startValue >= percentage) {
                startValue = percentage;
                clearInterval(interval);
            }
            setAnimatedValue(startValue);
        }, 10); // Update every 10ms

        return () => clearInterval(interval);
    }, [percentage]);

    return (
        <div className='rounded-xl pt-2 shadow-md' style={{ backgroundColor: "rgb(241, 243, 245)" }}>
            <Text className="text-center">{label}</Text>
            <RingProgress
                sections={[{ value: animatedValue, color: color, tooltip: `Your code's ${label}: ${value}` }, { value: (animatedValue > 100 ? 0 : 100 - animatedValue), color: "gray", tooltip: `Critical Threshold: ${maxValue}` }]}
                label={<Text className="text-center">{Math.round(animatedValue)}%</Text>}
            />
        </div>
    );
}

// Example thresholds for each metric
const thresholds = {
    vocabulary: { green: { max: 30 }, yellow: { max: 70 }, red: { max: 100 } },
    length: { green: { max: 2000 }, yellow: { max: 5000 }, red: { max: 10000 } },
    bugs: { green: { max: 0.2 }, yellow: { max: 0.5 }, red: { max: 1 } },
    volume: { green: { max: 2000 }, yellow: { max: 10000 }, red: { max: 50000 } },
    difficulty: { green: { max: 10 }, yellow: { max: 50 }, red: { max: 100 } },
    effort: { green: { max: 50000 }, yellow: { max: 1000000 }, red: { max: 5000000 } },
};

export default function Visualize({ vocabulary, length, bugs, volume, difficulty, effort }: Metrics) {
    return (
        <div className='flex h-full justify-start items-center gap-x-6'>
            <div className='flex flex-col h-full justify-start items-center gap-y-6'>
                <AnimatedMetricRing label="Vocabulary" value={vocabulary.value} thresholds={thresholds.vocabulary} maxValue={100} />
                <AnimatedMetricRing label="Length" value={length.value} thresholds={thresholds.length} maxValue={10000} />
                <AnimatedMetricRing label="Bugs" value={bugs.value} thresholds={thresholds.bugs} maxValue={1} />
            </div>
            <div className='flex flex-col h-full justify-start items-center gap-y-6'>
                <AnimatedMetricRing label="Volume" value={volume.value} thresholds={thresholds.volume} maxValue={50000} />
                <AnimatedMetricRing label="Difficulty" value={difficulty.value} thresholds={thresholds.difficulty} maxValue={100} />
                <AnimatedMetricRing label="Effort" value={effort.value} thresholds={thresholds.effort} maxValue={5000000} />
            </div>
        </div>
    );
}
