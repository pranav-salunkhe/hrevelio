// import { openai } from '@ai-sdk/openai';
import { AiResponse, messages, openai } from '@/lib/config/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextApiRequest, NextApiResponse } from 'next';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const data = await req.json();
  const completions = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [...messages, {
      role: "user",
      content: `For calculating the halstead metrics use the formulas given below:
      n1 = the number of distinct operators
      n2 = the number of distinct operands
      N1 = the total number of operators
      N2 = the total number of operands

      vocabulary = n1+n2,
      length = N1+N2,
      volume = (N1+N2)*(log(n1+n2)base2),
      bugs = volumne/3000,
      difficulty = (n1/2)*(N2/n2),
      effort = difficulty*volume,

      NOTE: 
      1. For every metric there's one more field called 'impact' in the schema. You need to specify how that particular calculated value of the metric affects the given javascript code.
      2. The 'critical' property in the schema is an array to store the range of lines which is potentially bad code (thus 'critical'). Every object in this array has a fromLine and toLine indicating the portion of critical code. Mention the explanation why it is a critical portion in the 'reason' property. 
      `
    },
    {
      role: "user",
      content: `Calculate the halstead metrics for the given javascript code below:\n
      ${data}
      `
    }
  ],
    response_format: zodResponseFormat(AiResponse, "metrics")
  })
  const metrics = completions.choices[0].message.parsed;
  // const result = await streamText({
  //   model: openai('gpt-4-turbo'),
  //   messages: convertToCoreMessages(messages),
  // });
  // const thread = await openai.beta.threads.create({
  //   messages: [
  //     {
  //       "role": "user",
  //       "content": `Calculate halstead metrics as told in the get_halstead_metrics function, for the below code: ${data}`,
  //     }
  //   ]
  // });
  // const run = await openai.beta.threads.runs.create(
  //   thread.id,
  //   { assistant_id: "asst_7I2dm10qZ8zBEc60wEwsKxBR", tools: [{type: "function", function: {name: "get_halstead_metrics"}}] },
  // );
  // console.log(await openai.beta.threads.retrieve())
  // console.log("running")
  // console.log(run)
  // while(true){
      // console.log((await openai.beta.threads.messages.list(thread.id)));
      // if(run.status == "completed"){
        // console.log("ong:", (await openai.beta.threads.messages.list(thread.id)).data[0].content);
        // break;
      // }
    //   if(run.status== "queued"){
    //   console.log("msgs: ", await openai.beta.threads.messages.list(thread.id));
    // }
  // }
  // console.log("done")

  // console.log(run.);
  return Response.json({metrics});
}
