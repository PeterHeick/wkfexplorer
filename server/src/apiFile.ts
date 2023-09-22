import express from 'express';
import fs from 'fs';
import { getFiles, getParm } from './util';


export function apiFile(app: express.Application) {
  app.get('/api/plandir', (req, res) => {
    // Join the provided directory path with the 'public' directory
    const planDir = getParm(req, 'directory');
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
        res.json(items);
      } catch (err) {
        res.status(500).send('An error occurred while reading the directory.');
      }
    });
  });
}
