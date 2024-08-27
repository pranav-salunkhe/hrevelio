// import { openai } from '@ai-sdk/openai';
import { AiResponse, messages, openai, OptimizedCodeResponse } from '@/lib/config/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextApiRequest, NextApiResponse } from 'next';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const data = await req.json();
  const completions = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [...messages, {
      role: "user",
      content: `Considering the halstead metrics, optimize the below given code such that it has optimal halstead metrics:
      ${data}
      NOTE: 
      1. Note that code must modular and should still achieve the original desired goal.
      2. Calculate and return the new halstead metrics for this optimized code. 
      `
    }
  ],
    response_format: zodResponseFormat(OptimizedCodeResponse, "optimal")
  })
  const optimal = completions.choices[0].message.parsed;
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
  return Response.json({optimal});
}

export async function GET(req: NextApiRequest) {
  return Response.json({message: "success"});
}