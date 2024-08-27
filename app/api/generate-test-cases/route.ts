// import { openai } from '@ai-sdk/openai';
import { AiResponse, messages, openai, OptimizedCodeResponse, TestCaseResponse } from '@/lib/config/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextApiRequest, NextApiResponse } from 'next';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const data = await req.json();
  console.log("inside gtc:", data)
  const completions = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [...messages, {
      role: "user",
      content: `Consider the below code:
      ${data}

      YOUR TASK:
      1. Generate 5 unit tests in 'jest' which will help test the given code against the business requirements shared to you.
      2. Along with the jest code, you all need to specify what business requirement does the generated test code target to test the current code against.
      `
    }
  ],
    response_format: zodResponseFormat(TestCaseResponse, "testCases")
  })
  const testCases = completions.choices[0].message.parsed?.cases;
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
  return Response.json({testCases});
}
