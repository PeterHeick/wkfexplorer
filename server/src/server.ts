import express from "express";
import api from "./api";

const app = express();
api(app);

// start serveren
app.listen(8080, () => {
  console.log(process.cwd());
  console.log("Server kører på http://localhost:8080/");
});


