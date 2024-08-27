import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface Props {
    width: number;
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
}

const workerPath = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs';


function CodeEditor({ width, code, setCode }: Props) {
    // const editorRef = useRef<any>(null);
    // const handleEditorDidMount = (editor: any, monaco: any) => {
    //     editorRef.current = editor;
    // }
    // const code = "var message = 'Monaco Editor!' \nconsole.log(message);";
    const handleEditorChange = (value: string | undefined, event: any) => {
        // if (editorRef.current) {
        console.log('here is the current model value:', value);
        setCode(value == undefined ? "" : value);
        // console.log('current model value:', editorRef.current.getValue());
        // }
    }
    // const monaco = useMonaco();
    // useEffect(() => {
    //     window.MonacoEnvironment = {
    //         getWorkerUrl: function (moduleId, label) {
    //             if (label === 'typescript' || label === 'javascript') {
    //                 return `${workerPath}/language/typescript/ts.worker.js`;
    //             }
    //             return `${workerPath}/editor/editor.worker.js`;
    //         }
    //     };
    //     // do conditional chaining
    //     monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    //     // or make sure that it exists by other ways
    //     if (monaco) {
    //         console.log('here is the monaco instance:', monaco);
    //     }
    // }, [monaco]);
    return (
        // <div className="border-2 border-black">
        <Editor
            height="50vh"
            width={width}
            // className="m-10"
            options={
                {
                    fontSize: 18,
                    inlineSuggest: {
                        showToolbar: "always",
                        suppressSuggestions: false,
                        enabled: true,
                    },
                    minimap: {
                        // autohide: true,
                        enabled: false,
                    },
                    scrollbar: {
                        vertical: "hidden",
                        verticalScrollbarSize: 0,

                    },
                    // padding: {
                    //     top: 4,
                    //     bottom: 4,
                    // },
                    smoothScrolling: true,

                }
            }
            language="javascript"
            theme="light"
            value={code}
            onChange={handleEditorChange}
        // onMount={handleEditorDidMount}
        //   options={{
        //     inlineSuggest: true,
        //     fontSize: "16px",
        //     formatOnType: true,
        //     autoClosingBrackets: ,
        //     minimap: { scale: 10 }
        //   }}
        />
        // </div>
    );
}
export default CodeEditor;