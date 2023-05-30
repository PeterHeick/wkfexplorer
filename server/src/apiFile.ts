import express from 'express';
import fs from 'fs';
import path from 'path';
import { getParm } from './util';


export function apiFile(app: express.Application) {
  app.get('/api/plandir', (req, res) => {
    // Join the provided directory path with the 'public' directory
    const planDir = getParm(req, 'file');
    console.log("-- /api/plandir ", planDir);
    console.log(__dirname);

    fs.readdir(planDir, { withFileTypes: true }, (err, dirents) => {
      console.log("readdir ", planDir);
      if (err) {
        res.status(500).send('An error occurred while reading the directory.');
        return;
      }

      try {
        const items = getFiles(planDir);
        console.log(items);
        res.json(items);
      } catch (err) {
        res.status(500).send('An error occurred while reading the directory.');
      }
    });
  });
}

function getFiles(dirPath: string): any {
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