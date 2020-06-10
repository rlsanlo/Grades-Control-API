const express = require("express");
const fs = require("fs").promises;
const gradesRouter = require("./register.js");

const app = express();

global.grades = "grades.json";

app.use(express.json());
app.use("/grades", gradesRouter);

app.listen(3000, async () => {
  try {
    await fs.readFile(global.grades, "utf8");
    console.log("API Started");
    console.log(global.grades.length + " students register");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      grades: [],
    };
    fs.writeFile(global.grades, JSON.stringify(initialJson)).catch((err) => {
      console.log(err);
    });
  }
});
