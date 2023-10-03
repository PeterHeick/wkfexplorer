import * as fs from 'fs';
import { readFileSync, writeFileSync } from 'fs';
import { INumberDictionary, Ivertice, WorkflowNode, TreeNode, Environment } from './interfaces';
import { homedir } from 'os';
import path from 'path';
import { findTopLevel } from './apiPlanUtil';

export function readToken(cfg: Environment[string]) {
  try {
    const homeDir = homedir();
    const filePath = cfg.token.replace(/^~(?=$|\/|\\)/, homeDir);
    return readFileSync(filePath, "utf-8");

  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw {
        message: "Token ikke fundet",
        detail: `For at ungå denne fejl skal der oprettes en token: ${cfg.token}`,
        status: 404
      };
    } else {
      throw {
        message: "Fejl ved læsning af token",
        detail: `e.message ${cfg.token}`,
        status: 500
      };

    }
  }
}


export function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  if (target === undefined) target = Array.isArray(source) ? [] : {};

  if (typeof target !== 'object' || target === null) {
    return source;
  }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}


export function deepMerge4(target: any, source: any) {
  const output = { ...target };

  if (typeof source === 'object' && source !== null) {
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = key in target
          ? deepMerge(target[key], source[key])
          : source[key];
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}

export function deepMerge3(target: any, source: any) {
  const output: any = { ...target };

  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        output[key] = { ...source[key] };
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
export function deepMerge2(target: any, source: any) {
  const output: Environment = { ...target } as Environment;

  for (const key in source) {
    if (typeof source[key] === "object") {
      if (!(key in target)) {
        output[key] = { ...source[key] } as typeof target[string];
      } else {
        output[key] = deepMerge(target[key], source[key]) as typeof target[string];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

type WeekPlan = { [ugedag: number]: string };
const weekDays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'lørdag'];

/**
 * Fixes dates in a given file name by replacing variables with their corresponding values.
 * @param filename - The name of the file to fix dates in.
 * @throws {Object} - Throws an error object if the week number is invalid or if there is an error with variable substitution.
 */
export function fixDates(filename: string) {
  console.log("fixDates()");
  const yearMatch = filename.match(/(20[23][0-9])/);
  const weekMatch = filename.match(/Uge(\d+)/);

  if (!yearMatch || !weekMatch) {
    return;
  }

  const year = yearMatch[1]
  const week = weekMatch[1];
  const weekInfo = findWeekDays(year, week);
  if (!weekInfo.ok) {
    console.log("Ugyldigt ugenummer");
    throw {
      message: weekInfo.error,
      detail: weekInfo.error,
    }
  }
  if (weekInfo.weekPlan) {
    const varObj: { [key: string]: string } = {
      ÅR: year,
      UGE: week,
      FRA: weekInfo.weekPlan[1],
      TIL: weekInfo.weekPlan[0],
    }
    for (let day = 0; day < 7; day++) {
      varObj[weekDays[day]] = weekInfo.weekPlan[day]
    }
    console.log(`var obj: ${JSON.stringify(varObj)}`);

    replaceVariablesInContent(filename, varObj);
  }
}

const mdr = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

function numberOfWeeks(year: number): number {
  if (year === 2020 || year === 2026) {
    return 53;
  } else {
    return 52;
  }
}

type WeekPlanResult = { ok: boolean; weekPlan?: WeekPlan; error?: string };
function findWeekDays(year: string, weekNumber: string): WeekPlanResult {
  console.log("findWeekDays()");
  const weekPlan: WeekPlan = [];
  const wk = parseInt(weekNumber, 10);
  const yy = parseInt(year, 10);

  if (wk > numberOfWeeks(yy)) {
    return { ok: false, error: `Ugyldigt ugenummer ${weekNumber}` };
  }

  const initialDate = getInitialDate(yy, wk);
  populateWeekPlan(initialDate, weekPlan);

  return { ok: true, weekPlan };
}

function populateWeekPlan(initialDate: Date, weekPlan: WeekPlan) {
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(initialDate.getTime());
    nextDay.setDate(initialDate.getDate() + i);

    let dd, mm, yy: string = "";
    const dateRegex = /(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4})/;
    const match = nextDay.toLocaleDateString().match(dateRegex);

    if (match) {
      dd = match[1];
      mm = match[2];
      yy = match[3];
    }

    if (mm) {
      const mdrnr = parseInt(mm, 10);
      weekPlan[nextDay.getDay()] = `${dd} ${mdr[mdrnr - 1]}`;
    }
  }
}

function getInitialDate(year: number, week: number): Date {
  const date = new Date(year, 0, 4);
  const dayOffset = date.getDay() === 0 ? 6 : date.getDay() - 1;
  date.setDate(4 - dayOffset + (week - 1) * 7);
  return date;
}

export function getFiles(dirPath: string): any {
  let items = [];
  const dirents = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const dirent of dirents) {
    const fullPath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      items.push({ name: dirent.name, path: fullPath, type: 'folder', children: getFiles(fullPath) });
    } else {
      if (dirent.name.endsWith('.txt')) {
        items.push({ name: dirent.name, path: fullPath, type: 'file' });
      }
    }
  }

  return items;

}

function replaceVariablesInContent(filename: string, varObj: { [key: string]: string; }) {
  const encoding = "latin1";
  let tekstfilIndhold = fs.readFileSync(filename, encoding);

  for (const attr in varObj) {
    if (varObj.hasOwnProperty(attr)) {
      // Gennemgå arrayet og erstat variablerne i tekstfilen
      const value = varObj[attr];
      const variabelErstatning = new RegExp(`\\$\\{${attr}\\}`, 'gi');
      tekstfilIndhold = tekstfilIndhold.replace(variabelErstatning, value);
    }
  }
  // Skriv det ændrede indhold tilbage i tekstfilen
  fs.writeFileSync(filename, tekstfilIndhold, encoding);
}
