// pages/api/generate-docs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createJsdocConfig } from './lib';

const execPromise = promisify(exec);

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const data = await req.json();
    // const data = JSON.parse(req.body.toString());
    console.log(data)
    const {repoName} = data;
    const cloneDirectory = process.cwd().split("app")[0]+`/tmp/cloned-repos/${repoName}`;
    if (!cloneDirectory) {
      return Response.json({ error: 'Clone directory is required' });
    }

    try {
      // Generate documentation using TypeDoc
      const docOutputDir = `${cloneDirectory}/docs`;
      await createJsdocConfig(cloneDirectory);
      const command = `jsdoc -c jsdoc.json -d ${docOutputDir} ${cloneDirectory}`;

      await execPromise(command);

      return Response.json({ message: 'Documentation generated', docUrl: docOutputDir });
    } catch (error: any) {
      return Response.json({ error: 'Error generating documentation', details: error.message });
    }
  } else {
    return Response.json({ message: 'Method not allowed' });
  }
}
