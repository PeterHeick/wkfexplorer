import * as fs from 'fs';
import * as readline from 'readline';
import { WorkflowNode } from './interfaces';

export default async function readFileAndParseWorkflow(filePath: string): Promise<WorkflowNode[]> {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const workflowItems: WorkflowNode[] = [];
  let currentWorkflowItem: WorkflowNode | null = null;

  for await (const line of rl) {
    if (line.trim().startsWith('#')) {
      continue;
    }

    const lineWithoutComment = line.split('#')[0];
    const groupNameMatch = lineWithoutComment.match(/^(.+):$/);

    if (groupNameMatch) {
      if (currentWorkflowItem) {
        workflowItems.push(currentWorkflowItem);
      }
      currentWorkflowItem = {
        name: groupNameMatch[1],
        type: "taskWorkflow",
        workflowVertices: [],
      };
    } else if (currentWorkflowItem) {
      const item = {
        task: {
          value: lineWithoutComment.trim(),
        }
      };
      if (item && currentWorkflowItem.workflowVertices) {
        currentWorkflowItem.workflowVertices.push(item);
      }
    }
  }

  if (currentWorkflowItem) {
    workflowItems.push(currentWorkflowItem);
  }

  return workflowItems;
}
