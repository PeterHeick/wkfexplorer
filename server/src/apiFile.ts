import express from 'express';
import fs, { existsSync, unlinkSync, writeFileSync } from 'fs';
import { fixDates, getFiles, getParm } from './util';
import { spawn } from 'child_process';
import { config } from './apiConfig';


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

  app.get("/api/editor", (req: any, res: any) => {
    console.log('\n--- /api/editor');
    const fileName = getParm(req, 'fileName');

    if (!existsSync(fileName)) {
      writeFileSync(fileName, '', 'latin1');
    }
    const match = fileName.match(/Uge(\d+)/);
    if (match) {
      fixDates(fileName);
    }
    const child = spawn(config.editor, [fileName] );
    child.on('close', () => res.json({}))
    
  })

  app.get("/api/explorer", (req: any, res: any) => {
    console.log('\n--- /api/explorer');
    const dirName = getParm(req, 'dirName');

    const child = spawn('explorer', [dirName]);
    // Denne venter ikke på at windows explorer vinduet lukker,
    // Windows har en central Explorer-proces, der håndterer skrivebordet og proceslinjen, og som også kan åbne nye fil explorer-vinduer
    // spawn starter en proces der sender et signal til den centrale, og lukker umiddelbart derefter.
    child.on('close', () => res.json({}))
  })

  // Er ikke implementeret færdig, driften ønsker ikke flere rettelser
  app.get("/api/delete", (req: any, res: any) => {
    console.log('\n--- /api/delete');
    const fileName = getParm(req, 'fileName');

    try {
      unlinkSync('path_to_your_file');
      console.log('File deleted successfully');
      res.status(200).json({});
      return;
    } catch (err) {
      console.error('There was an error:', err);
      res.status(403).json({ "message": "Fejl ved sletning", "details": err });
      return;
    }
  })

}
