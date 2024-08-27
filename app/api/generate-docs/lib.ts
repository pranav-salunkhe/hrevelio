import { promises as fs } from 'fs';
import path from 'path';

export async function createJsdocConfig(cloneDirectory: string) {
  const jsdocConfig = {
    source: {
      include: ["src"], // Adjust this path according to the structure of the cloned repo
      includePattern: ".+\\.js(doc|x)?$",
      excludePattern: "(^|\\/|\\\\)_"
    },
    opts: {
      destination: path.join(cloneDirectory, "docs"),
      recurse: true
    },
    templates: {
      default: {
        includeDate: false
      }
    }
  };

  const jsdocConfigPath = path.join(cloneDirectory, 'jsdoc.json');
  await fs.writeFile(jsdocConfigPath, JSON.stringify(jsdocConfig, null, 2));
}
