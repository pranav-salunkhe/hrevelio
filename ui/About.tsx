import { Blockquote, Flex, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export default function About() {
    const icon = <IconInfoCircle />;
    return (
        <Blockquote color="blue" bg={"teal"} cite="- Built by Pranav Salunkhe" icon={icon} mt="xl">
            <Text>Hrevelio, derived from "Homenum Revelio", is a tool to reveal underlying issues within your code and help you optimize it!</Text>
        </Blockquote>
    );
}