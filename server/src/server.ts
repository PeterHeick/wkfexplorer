import express from "express";
import history from "connect-history-api-fallback";
import path from "path";
import cors from "cors";
import mime from "mime";
import apiTask from "./apiTask";
import { apiConfig, apiVersion } from "./apiConfig";
import { apiPlan } from "./apiPlan";
import { apiFile } from "./apiFile";
import { version } from "../../version.json";

// Når versions nummeret skifter, skal der også rettes i HeaderComponent.vue linje 30.
// De to versions numre skal følges ad.

//const docRoot = "docRoot";
const docRoot = "testDocRoot";
const app = express();

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

/*
app.get("/", (req, res) => {
  console.log('\n--- /');
  console.log(`Send index.html ${docRoot}`);
  res.sendFile(path.join(docRoot, "index.html"));
});
*/

apiVersion(app, version);
apiConfig(app);
apiTask(app);
apiPlan(app);
apiFile(app);

// start serveren
app.listen(8080, () => {
  console.log(process.cwd());
  console.log("Server kører på http://localhost:8080/");
});

