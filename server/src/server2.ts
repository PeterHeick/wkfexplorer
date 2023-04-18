import express from 'express';
import path from 'path';
import mime from 'mime';
import cors from "cors";
import uac from '../wkf.json';

import { createProxyMiddleware } from 'http-proxy-middleware';

const UACHost = "s0299035.su.dk";
const UACPort = "8443";
const baseUrl = `https://${UACHost}:${UACPort}/`;
const docRoot = "docRoot";
const port = 8090;

const app = express();

const token = "ucp_tfYrHFx4DCp7E0B1TMHgIvZllyEILRcwOCkcxH5v";
const config = {
  method: 'GET',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "Host": "s0299035.su.dk:8443",
    "Sec-Fetch-Site": "cross-site"
  }
};

// konfigurer en proxy-rute
app.use(cors());

app.use(express.static(docRoot, {
  setHeaders: (res: any, path: any) => {
    const contentType = mime.getType(path);
    res.setHeader('Content-Type', contentType);
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, docRoot, 'index.html'))
});

app.get('/uac', (req: any, res: any) => {
      res.status(200).json( uac);
});

app.get('/test', (req: any, res: any) => {
  console.log("/test found");
  const url = "uc/resources/task/listadv";
  console.log(baseUrl + url + JSON.stringify(config));
  fetch(baseUrl + url, config)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      // console.log(JSON.stringify(data));
      // res.send("Done");
      res.status(200).json(data);
    })
    .catch((error: any) => console.error(error));
})

/*
app.use('/api', createProxyMiddleware({
  target: baseUrl, // ændre dette til din ønskede serveradresse
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // fjern '/api' fra slutningen af URL'en
  },
}));
*/

// start serveren
app.listen(port, () => {
  console.log(`Proxy server kører på http://localhost:${port}/`);
})
