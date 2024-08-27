import { ConductorWorker, Task } from "@io-orkes/conductor-javascript";

export const fetchSuggestionsWorker: ConductorWorker = {
    taskDefName: "get-suggestion",
    execute: async (task: Task) => {
      // Sample output
      const response = await fetch("http://localhost:3000/api/suggestions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task.inputData?.code),
    })
    const data = await response.json();
      return {
        outputData: {
            data
        },
        status: "IN_PROGRESS",
        callbackAfterSeconds: 60,
      };
    },
    pollInterval: 100, // optional
    concurrency: 2, // optional
  };