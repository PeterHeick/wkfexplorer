import express from "express";
import path from "path";
import mime from "mime";
import cors from "cors";
import { handleData } from './util';
import { Idata } from "./interfaces";
import { writeFileSync } from "fs";

const docRoot = "docRoot";

// var sys: 'prod' | 'test' = 'test';
var baseUrl: string;

export default function api(app: express.Application, data: Idata) {
  app.use(cors());
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

  app.get("/", (req, res) => {
    console.log('\n--- /');
    console.log(`Send index.html ${docRoot}`);
    res.sendFile(path.join(docRoot, "index.html"));
  });

  app.get("/api/environments", (req: any, res: any) => {
    console.log('\n--- /api/environments');
    console.log('Send: ', JSON.stringify(data.globalUacConfig));
    res.status(200).json(Object.keys(data.globalUacConfig));
  });

  app.get("/api/uacenv", (req: any, res: any) => {
    console.log('\n--- /uacenv');
    console.log('Send: ', JSON.stringify(data.uacenv));
    res.status(200).json(data.uacenv);
  });

  app.get("/api/config", (req: any, res: any) => {
    console.log('\n--- /api/config');
    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = data.uacenv;
    }
    const cfg = data.globalUacConfig[env];
    console.log(JSON.stringify(cfg));
    res.status(200).json(cfg);
  });

  app.get("/api/task", (req: any, res: any) => {
    console.log('\n--- /api/task');

    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = "Uknown";
    }

    let task = "";
    try {
      task = req.query.taskname;
    } catch (e) {
      task = "Uknown";
    }

    const cfg = data.globalUacConfig[env];
    console.log("cfg: ", JSON.stringify(cfg));

    const uacHost = cfg.uachost;
    const uacPort = cfg.uacport;
    const url = `uc/resources/task/?taskname=${task}`;
    let token = "ucp_tfYrHFx4DCp7E0B1TMHgIvZllyEILRcwOCkcxH5v";

    const headers = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Host: `${uacHost}:${uacPort}`,
        "Sec-Fetch-Site": "cross-site",
      },
    };

    fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        writeFileSync('../task.json', JSON.stringify(data));
        res.status(200).json(data);
      })
      .catch((error: any) => console.error(error));
  });

  app.get("/api/listadv", (req: any, res: any) => {
    console.log('\n--- /api/listadv');

    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = data.uacenv;
    }
    console.log(env);
    console.log(`${JSON.stringify(data.globalUacConfig[env])}`);

    const cfg = data.globalUacConfig[env];
    console.log("cfg: ", JSON.stringify(cfg));

    if (data.uac.length > 0) {
      /*
      console.log('data.uac.length ', data.uac.length)
      const wkf = data.uac.filter((n) => n.credentials === cfg.credentials);
      console.log('data length ', wkf.length)
      */
      const sorted = handleData(data.uac, cfg.credentials);
      console.log("sorted ", Object.keys(sorted));
      res.status(200).json(sorted);
      return;
    }

    const uacHost = cfg.uachost;
    const uacPort = cfg.uacport;
    const url = "uc/resources/task/listadv?type=Workflow";
    let token = "ucp_tfYrHFx4DCp7E0B1TMHgIvZllyEILRcwOCkcxH5v";

    let baseUrl = `https://${cfg.uachost}:${cfg.uacport}/`;
    token = data.userUacConfig.token[cfg.token];

    //writeFileSync('xx.json', JSON.stringify(sorted));
    const headers = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Host: `${uacHost}:${uacPort}`,
        "Sec-Fetch-Site": "cross-site",
      },
    };

    fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        console.log("getting ", JSON.stringify(headers));
        console.log("Got ", data.length);
        writeFileSync('../workflow.json', JSON.stringify(data));
        const sorted = handleData(data, cfg.credentials);
        console.log("sorted ", sorted.length);
        res.status(200).json(sorted);
      })
      .catch((error: any) => console.error(error));
  });

}