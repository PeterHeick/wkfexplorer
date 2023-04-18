import express from "express";
import path from "path";
import mime from "mime";
import cors from "cors";
import wkf from "../wkf.json";
import { handleData } from './util';
import { Iconfig, IuserConfig, IworkflowNode, Idata } from "./interfaces";
// import { docRoot, uacenv, globalUacConfig, userUacConfig, uac } from "./server";

const docRoot = "docRoot";

// var sys: 'prod' | 'test' = 'test';
var baseUrl: string;

export default function init_app(app: express.Application, data: Idata) {
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
    console.log(`Send index.html ${docRoot}`);
    res.sendFile(path.join(docRoot, "index.html"));
  });
  //res.sendFile(path.join(__dirname, docRoot, 'index.html'))
  app.get("/uacenv", (req: any, res: any) => {
    console.log('Send: ', JSON.stringify(data.uacenv));
    res.status(200).json(data.uacenv);
  });
  app.get("/uac", (req: any, res: any) => {
    res.status(200).json(wkf);
  });

  app.get("/api/config"), (req: any, res: any) => {
    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = data.uacenv;
    }
    const cfg = data.globalUacConfig[env];
    res.status(200).json(cfg);
  }

  app.get("/test/listadv", (req: any, res: any) => {
    console.log(`/uac found: ${JSON.stringify(req.query)}`);

    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = data.uacenv;
    }
    console.log(env);
    console.log(`${JSON.stringify(data.globalUacConfig[env])}`);

    const cfg = data.globalUacConfig[data.uacenv];
    const uacHost = cfg.uachost;
    const uacPort = cfg.uacport;
    let token = "ucp_tfYrHFx4DCp7E0B1TMHgIvZllyEILRcwOCkcxH5v";
    console.log(JSON.stringify(cfg));

    token = data.userUacConfig.token[cfg.token];
    console.log(token);

    const url = "uc/resources/task/listadv";
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

    const sorted = handleData(data.uac);
    res.status(200).json(sorted);
  });
  app.get("/uac/listadv", (req: any, res: any) => {
    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = data.uacenv;
    }
    console.log("query: ", JSON.stringify(req.query));
    console.log("env fra query: ", env);
    const cfg = data.globalUacConfig[env];
    const uacHost = cfg.uachost;
    const uacPort = cfg.uacport;
    const url = "uc/resources/task/listadv";
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
        handleData(data);
        res.status(200).json(data);
      })
      .catch((error: any) => console.error(error));
  });

}