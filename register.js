const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

router.post("/", async (req, res, next) => {
  let grade = req.body;
  try {
    let data = await fs.readFile(global.grades, "utf8");
    let dataGrades = JSON.parse(data);
    grade = { id: dataGrades.nextId++, ...grade, timestamp: new Date() };
    dataGrades.grades.push(grade);

    await fs.writeFile(global.grades, JSON.stringify(dataGrades));
    res.end();
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.get("/", async (_, res, next) => {
  try {
    let data = await fs.readFile(global.grades, "utf8");
    let dataGrades = JSON.parse(data);
    delete dataGrades.nextId;
    res.send(dataGrades);
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let data = await fs.readFile(global.grades, "utf8");
    let dataGrades = JSON.parse(data);
    const actuallyGrade = dataGrades.grades.find(
      (actuallyGrade) => actuallyGrade.id === parseInt(req.params.id, 10)
    );
    if (actuallyGrade) {
      res.send(actuallyGrade);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.get("/totalGrade/:student/:subject", async (req, res) => {
  try {
    let { student, subject } = req.params;
    let gradesData = JSON.parse(await fs.readFile(global.grades, "utf8"));
    let studentGrades = gradesData.grades.filter((grade) => {
      if (student === grade.student && subject === grade.subject) {
        return true;
      }
    });

    let gradesSum = studentGrades.reduce((acc, grade) => {
      return acc + grade.value;
    }, 0);

    res.status(200).json(gradesSum);
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.get("/calculatorAverage/:type/:subject", async (req, res) => {
  try {
    let { type, subject } = req.params;
    let dataGrades = JSON.parse(await fs.readFile(global.grades, "utf8"));
    let typeGrades = dataGrades.grades.filter((grade) => {
      if (type === grade.type && subject === grade.subject) {
        return true;
      }
    });

    let gradesAverage =
      typeGrades.reduce((acc, grade) => {
        return acc + grade.value;
      }, 0) / typeGrades.length;

    res.status(200).json(gradesAverage);
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.get("/bestGrades/:type/:subject", async (req, res) => {
  try {
    let { type, subject } = req.params;
    let dataGrades = JSON.parse(await fs.readFile(global.grades, "utf8"));
    let bestGrades = dataGrades.grades
      .filter((grade) => {
        if (type === grade.type && subject === grade.subject) {
          return true;
        }
      })
      .sort((a, b) => {
        return b.value - a.value;
      })
      .splice(0, 3);

    res.status(200).json(bestGrades);
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let data = await fs.readFile(global.grades, "utf8");
    let dataGrades = JSON.parse(data);
    let removeGrade = dataGrades.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );
    dataGrades.grades = removeGrade;

    await fs.writeFile(global.grades, JSON.stringify(dataGrades));
    res.end();
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

router.put("/", async (req, res, next) => {
  let newGrade = req.body;
  try {
    let data = await fs.readFile(global.grades, "utf-8");
    let dataGrades = JSON.parse(data);

    const myGrade = (element) => {
      return element.id === newGrade.id;
    };
    let oldIndex = dataGrades.grades.find(myGrade);
    let element = dataGrades.grades.indexOf(oldIndex);
    dataGrades.grades.splice(element, 1, newGrade);
    await fs.writeFile(global.grades, JSON.stringify(dataGrades));
    res.end();
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

module.exports = router;
