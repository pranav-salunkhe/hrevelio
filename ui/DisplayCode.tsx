import { Code, Mark, Tooltip } from '@mantine/core';

interface CriticalSection {
  fromLine: number,
  toLine: number,
  reason: string,
}

interface Props {
  code: string,
  critical: CriticalSection[]
}

export default function DisplayCode({ code, critical }: Props) {
  const codeBlocks = code.split("\n");
  const indices: { [key: number]: string } = {};

  critical.forEach((section) => {
    for (let i = section.fromLine; i <= section.toLine; i++) {
      indices[i] = section.reason;  // Associate line number with the reason
    }
  });

  return (
    <Code block={true} className='flex flex-col rounded-2xl shadow-md'>
      {codeBlocks.map((block, index) => (
        indices.hasOwnProperty(index + 1) ? (
          <Mark
            key={index}
            className={`w-full border-[1px] border-blue-400 ${index + 1 === critical[0].fromLine ? 'border-t' : ''} ${index + 1 === critical[critical.length - 1].toLine ? 'border-b' : ''}`}
            bg={'blue.1'}
            fw={"bold"}
          >
            <Tooltip multiline w={500} label={indices[index + 1]}>
              <span>{block}</span>
            </Tooltip>
          </Mark>
        ) : (
          <p key={index}>{block}</p>
        )
      ))}
    </Code>
  );
}
