import express from 'express';
import fs, { existsSync, unlinkSync, writeFileSync } from 'fs';
import { fixDates, getFiles } from './util';
import { spawn } from 'child_process';
import { config } from './apiConfig';
import { getParm } from './apiPlanUtil';


/**
 * Registers API endpoints related to file operations.
 * @param app - The express application instance.
 */

export function apiFile(app: express.Application) {
  app.get('/api/plandir', (req, res) => {
    // Join the provided directory path with the 'public' directory
    const planDir = getParm(req, 'directory');
    console.log("-- /api/plandir ", planDir);

    fs.readdir(planDir, { withFileTypes: true }, (err, dirents) => {
      console.log("  readdir ", planDir);
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

    console.log(`  apiFile: editor ${fileName}`);
    /*
    if (!existsSync(fileName)) {
      console.log(`apiFile: create ${fileName}`);
      writeFileSync(fileName, '', 'latin1');
    }
    */
    spawn(config.editor, [fileName]);
    const match = fileName.match(/Uge(\d+)/);
    if (match) {
      try {
        console.log(`  apiFile: fixDates ${fileName}`);
        fixDates(fileName);
        res.status(200).json({});
      } catch (err) {
        console.log(`  apiFile: fixDates ${fileName} error ${err}`);
        res.status(203).json(err);
      }
      return;
    }
    // res.setHeader('Connection', 'close');
    res.status(200).json({});
  })

  app.get("/api/explorer", (req: any, res: any) => {
    console.log('\n--- /api/explorer');
    const dirName = getParm(req, 'dirName');

    const child = spawn('explorer', [dirName]);
    res.json({})
  })

  // Er ikke implementeret færdig, driften ønsker ikke flere rettelser
  app.get("/api/delete", (req: any, res: any) => {
    console.log('\n--- /api/delete');
    const fileName = getParm(req, 'fileName');

    try {
      unlinkSync('path_to_your_file');
      console.log('  File deleted successfully');
      res.status(200).json({});
      return;
    } catch (err) {
      console.error('There was an error:', err);
      res.status(403).json({ "message": "Fejl ved sletning", "details": err });
      return;
    }
  })

}
