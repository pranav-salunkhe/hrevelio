import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';

export function Upload(props: Partial<DropzoneProps>) {
    return (
        <Dropzone
            onDrop={(files) => console.log('accepted files', files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            {...props}
            h={"50vh"}
        >
            <Group justify="center" gap="xl" mih={"50vh"} style={{ pointerEvents: 'none', display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />

                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div className='text-center'>
                    <Text size="xl" inline>
                        Drag your files here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        File size should not exceed 5MB
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
}