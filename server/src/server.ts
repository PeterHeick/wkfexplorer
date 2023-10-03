import express from "express";
import history from "connect-history-api-fallback";
import fs from "fs";
import cors from "cors";
import mime from "mime";
import apiTask from "./apiTask";
import { apiConfig, apiVersion } from "./apiConfig";
import { apiPlan } from "./apiPlan";
import { apiFile } from "./apiFile";
import { fixDates } from "./util";
import { version } from "../../version.json"
import WebSocket from 'ws';
import chokidar from 'chokidar';

import 'dotenv/config';

// Når versions nummeret skifter, skal der også rettes i HeaderComponent.vue linje 30.
// De to versions numre skal følges ad.

//const docRoot = "docRoot";
const docRoot = "DocRoot";
// const port = process.env.PORT || 54345;
// const ws_port = process.env.WS_PORT || 54445;
const host = "localhost";
const port = 8080;
const ws_port = 8081;
const app = express();

console.log(`Current directory: ${process.cwd()}`);

app.use(history());
app.use(cors());
app.use(express.json());
app.use(
  express.static(docRoot, {
    setHeaders: (res: any, path: any) => {
      const contentType = mime.getType(path);
      console.log(
        `Middleware Send index.html ${docRoot} ${contentType} ${path}`
      );
      res.setHeader("Content-Type", contentType);
    },
  })
);

apiVersion(app, version);
apiConfig(app);
apiTask(app);
apiPlan(app);
apiFile(app);

// start serveren
/**
 * Starts the server and listens on the specified port and host.
 * @param {number} port - The port number to listen on.
 * @param {string} host - The host name or IP address to bind to.
 * @returns {void}
 */
const server = app.listen(port, () => {
  console.log(`Server kører på http://${host}:${port}/`);
});

const wss = new WebSocket.Server({ port: ws_port });
console.log(`WebsocketServer kører på http://${host}:${ws_port}/`);
let watcher: chokidar.FSWatcher;

wss.on('connection', (ws) => {
  let initialized = false;
  ws.on('message', (message) => {
    const { action, path } = JSON.parse(message.toString());
    console.log(`action: ${action}  path: ${path}`);

    
    if (!fs.existsSync(path)) {
      ws.send(JSON.stringify({ error: {message: `${path} findes ikke`, detail: ""}, status: 404}));
      return;
    }
    if (action === 'watch') {
      if (watcher) {
        watcher.close();
      }
      watcher = chokidar.watch(path.toString(), { persistent: true });
      watcher.on('ready', () => {
        initialized = true;  // Flag for at indikere, at den indledende scanning er færdig
      })
      watcher.on('all', (event, path) => {
        if (initialized) {
          console.log("Watch all: ", JSON.stringify({ event, path }));
          if (event === 'add' || event === 'change') {
            console.log(`server: ${event} ${path}`);
            try {
              fixDates(path);
            } catch (err) {
              console.log("Fejl ved fixDates: ", err);
              ws.send(JSON.stringify({ error: err, status: 203 }));
            }
          }
          ws.send(JSON.stringify({ event, path }));
        }
      });
    }
  });

});
