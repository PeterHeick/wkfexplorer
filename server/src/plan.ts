import * as fs from 'fs';
import * as readline from 'readline';
import { WorkflowNode } from './interfaces';

interface WorkflowResult {
  workflowItems: WorkflowNode[];
  count: number;
  ok: boolean;
}


export default async function readFileAndParseWorkflow(filePath: string): Promise<WorkflowResult> {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  console.log('readFileAndParseWorkflow ', filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let count = 0;
  const workflowItems: WorkflowNode[] = [];
  let currentWorkflowItem: WorkflowNode | null = null;

  for await (const line of rl) {

    lineNumber++;
    if (line.trim().startsWith('#')) {
      continue;
    }
    // console.log(line);

    const lineWithoutComment = line.split('#')[0].trim();

    if (lineWithoutComment.trim().length === 0) {
      continue;
    }

    const groupName = lineWithoutComment.match(/^(.+):$/);

    // skal måske bruges senere hvis der er tid
    const trigger = lineWithoutComment.match(/^(\w+): start (\d{4}\.\d{2}\.\d{2}\.\d{2}\.\d{2})/);
    if (trigger) {
      const timestamp = trigger[2]
    }
    const groupMember = lineWithoutComment.match(/^([a-zA-Z0-9-_]+)$/);

    const test = groupName || groupMember;
    if (!test) {
      return ({ workflowItems: {} as WorkflowNode[], count: lineNumber, ok: false })
    }

    count++;
    if (groupName) {
      // console.log(wkfName);
      if (currentWorkflowItem) {
        workflowItems.push(currentWorkflowItem);
      }
      // console.log("groupName: ", groupName[1]);
      currentWorkflowItem = {
        name: groupName[1],
        type: "taskWorkflow",
        workflowVertices: [],
      };
    } else if (currentWorkflowItem) {
      const item = {
        task: {
          value: lineWithoutComment.trim(),
        }
      };
      // console.log("item: ",item);
      if (item && currentWorkflowItem.workflowVertices) {
        currentWorkflowItem.workflowVertices.push(item);
      }
    }
  }

  if (currentWorkflowItem) {
    workflowItems.push(currentWorkflowItem);
  }

  return { workflowItems, count, ok: true };
}