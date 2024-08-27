import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

export const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export const AiResponse = z.object({
    vocabulary: z.object({
        value: z.number(),
        impact: z.string(),
    }),
    length: z.object({
        value: z.number(),
        impact: z.string(),
    }),
    bugs: z.object({
        value: z.number(),
        impact: z.string(),
    }),
    volume: z.object({
        value: z.number(),
        impact: z.string(),
    }),
    difficulty: z.object({
        value: z.number(),
        impact: z.string(),
    }),
    effort: z.object({
        value: z.number(),
        impact: z.string(),
    }),
    critical: z.array(
        z.object({
            fromLine: z.number(),
            toLine: z.number(),
            reason: z.string(),
        })
    ),      
})

export const OptimizedCodeResponse = z.object({
    optimizedCode: z.string(),
    optimizedMetrics: AiResponse,
})

export const TestCaseResponse = z.object({
    cases: z.array(
    z.object({
        jestCode: z.string(),
        targetBusinessRequirement: z.string(),
    })
    )
})

export const messages: ChatCompletionMessageParam[] = [
    {
        role: "user",
        content: "You are a code analyser for Javascript. You will be given a JS code as an input and you'll have to perform some analysis on it as instructed in future prompts. Respond with the provided schema only."
    }
]

// export const formulae = {
//     vocabulary: `
    
//     `
// }
