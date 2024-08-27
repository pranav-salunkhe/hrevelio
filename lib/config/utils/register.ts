import fs from 'fs';
import path from 'path';
import axios from 'axios';

const CONDUCTOR_SERVER_URL = 'https://play.orkes.io/api';
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtqbVlNWThEV2VOU1lKZmZSSjFXNSJ9.eyJnaXZlbl9uYW1lIjoiUHJhbmF2IiwiZmFtaWx5X25hbWUiOiJTYWx1bmtoZSIsIm5pY2tuYW1lIjoicHZzYWx1bmtoZTIwMDMiLCJuYW1lIjoiUHJhbmF2IFNhbHVua2hlIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xvZVlWRElxblpHb1BoS0dVMVJZZ2V3Qzh3NWNGLVgyMFkzTkdzb2dpU1QtY1RxdGNNQ3c9czk2LWMiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wOC0yM1QxMzo0ODoyOS44MzFaIiwiZW1haWwiOiJwdnNhbHVua2hlMjAwM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hdXRoLm9ya2VzLmlvLyIsImF1ZCI6Ilc2bnowREtQVnJOYUh5YkNsVmNjSEM3RzhCeU1NWkQ0IiwiaWF0IjoxNzI0NDIwOTEwLCJleHAiOjE3MjQ0NTY5MTAsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTEzMTc3MTMyMDI0MjY0ODMxMzAwIiwic2lkIjoiOFBpamZVeExwZW51WTUyQVRWYU1GMHROT0pTaFNLQ3AiLCJub25jZSI6ImZtTmFVWE5XZFVSMVMwVm5makpsVmtReU4ySnJRMEo2UVRsbWVtMWhOMEZpUWs1MGVIQXlRVk10VUE9PSJ9.UJNmc09IF7rGj_M-3iIBmTurjK9IEA7sTsInMEppCWcqQNSfY5gw42oSx9LS0z7TfwJLvl9m4-zInv0Jn66D-tTwAoXk4kAScfvyHrQ1X7juWqriu1LKm7at0bYMpHaDkZ4Z13l_BtTV5Kgtj70AazHv_jCf2X_WmG6xLg9_WgDWQ5C9pNlC-1f65BOy1FiGsVREmrX6sLFKZ5zQDWzCzC-aZlF1kHXFJ7H2ymt9XRe4CW-byqrfNkYHSwhGA4mMIZHbfwzcl0Ni9WpcFucxwpGEMHxJs1PXmFPBgx5XKzdlpkln8hy-qJKnXzoss3CjqCfDq72CXTCI31rfpKgu9A';
// Function to register tasks
const registerTask = async (taskFile: fs.PathOrFileDescriptor) => {
  const taskDef = JSON.parse(fs.readFileSync(taskFile, 'utf8'));
  try {
    await axios.post(`${CONDUCTOR_SERVER_URL}/metadata/taskdefs`, [taskDef], {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`  // Include the token in the headers
        }
      });
    console.log(`Registered task: ${taskDef.name}`);
  } catch (error: any) {
    console.error(`Failed to register task ${taskDef.name}:`, error.message);
  }
};

// Function to register workflow
const registerWorkflow = async (workflowFile: fs.PathOrFileDescriptor) => {
  const workflowDef = JSON.parse(fs.readFileSync(workflowFile, 'utf8'));
  try {
    await axios.post(`${CONDUCTOR_SERVER_URL}/metadata/workflow`, workflowDef, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`  // Include the token in the headers
        }
      });
    console.log(`Registered workflow: ${workflowDef.name}`);
  } catch (error: any) {
    console.error(`Failed to register workflow ${workflowDef.name}:`, error.message);
  }
};

// Register all tasks
fs.readdirSync(path.join(__dirname, 'tasks')).forEach((file) => {
  registerTask(path.join(__dirname, 'tasks', file));
});

// Register all workflows
fs.readdirSync(path.join(__dirname, 'workflows')).forEach((file) => {
  registerWorkflow(path.join(__dirname, 'workflows', file));
});
