import { Tabs, rem } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings, IconVocabulary, IconScale, IconBug, IconDimensions, IconAccessible, IconKeyboard, IconMath, IconFunction } from '@tabler/icons-react';
import { Metrics } from './Shell';

export default function Impact({ vocabulary, length, bugs, volume, difficulty, effort }: Metrics) {
    const iconStyle = { width: rem(16), height: rem(16) };

    return (
        <Tabs defaultValue="vocabulary" className=''>
            <Tabs.List>
                <Tabs.Tab value="vocabulary" leftSection={<IconFunction style={iconStyle} />}>
                    Vocabulary
                </Tabs.Tab>
                <Tabs.Tab value="length" leftSection={<IconScale style={iconStyle} />}>
                    Length
                </Tabs.Tab>
                <Tabs.Tab value="bugs" leftSection={<IconBug style={iconStyle} />}>
                    Bugs
                </Tabs.Tab>
                <Tabs.Tab value="volume" leftSection={<IconDimensions style={iconStyle} />}>
                    Volume
                </Tabs.Tab>
                <Tabs.Tab value="difficulty" leftSection={<IconAccessible style={iconStyle} />}>
                    Difficulty
                </Tabs.Tab>
                <Tabs.Tab value="effort" leftSection={<IconKeyboard style={iconStyle} />}>
                    Effort
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel className="text-black opacity-60 font-light text-sm" value="vocabulary">
                {vocabulary.impact}
            </Tabs.Panel>

            <Tabs.Panel className="text-black opacity-60 font-light text-sm" value="length">
                {length.impact}
            </Tabs.Panel>

            <Tabs.Panel className="text-black opacity-60 font-light text-sm" value="bugs">
                {bugs.impact}
            </Tabs.Panel>

            <Tabs.Panel className="text-black opacity-60 font-light text-sm" value="volume">
                {volume.impact}
            </Tabs.Panel>

            <Tabs.Panel className="text-black opacity-60 font-light text-sm" value="difficulty">
                {difficulty.impact}
            </Tabs.Panel>

            <Tabs.Panel className="text-black opacity-60 font-light text-sm" value="effort">
                {effort.impact}
            </Tabs.Panel>
        </Tabs>
    );
}