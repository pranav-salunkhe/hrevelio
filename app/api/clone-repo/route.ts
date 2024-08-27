// pages/api/clone-repo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = await req.json();
    // const data = JSON.parse(req.body.toString());
    console.log(data)
    const {repoUrl} = data;
    if (!repoUrl) {
      return Response.json({ error: 'Repository URL is required' });
    }
    const repoName = repoUrl?.split("/").at(-1);
    console.log(repoName)
    // const currentDirectory = __dirname;
    const cloneDirectory = process.cwd().split("app")[0]+`/tmp/cloned-repos/${repoName}`;
    console.log(cloneDirectory)
    try {
      await execPromise(`git clone ${repoUrl} ${cloneDirectory}`);
      return Response.json({ message: 'Repository cloned successfully', cloneDirectory });
    } catch (error: any) {
      return Response.json({ error: 'Error cloning repository', details: error.message });
    }
  } else {
    return Response.json({ message: 'Method not allowed' });
  }
}
