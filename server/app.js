const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const SqltoCamelCase = require("./utils/helper.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/taskGroups/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await pool.query("SELECT * FROM taskgroup WHERE userid=$1", [
      userId,
    ]);

    res.status(200).json(SqltoCamelCase(data.rows));
  } catch (err) {
    console.log(err);
    res.status(400).json("something went wrong");
  }
});

app.put("/api/taskGroups/:taskGroupId", async (req, res) => {
  const { taskGroupId } = req.params;
  const newTask = req.body.currentTaskState.taskGroup.tasks;
  const totalTimer = req.body.currentTaskState.totalTimer;
  console.log(newTask, totalTimer);
  try {
    const data = await pool.query(
      " UPDATE taskgroup SET tasks = $1, totaltime = $2 WHERE id = $3",
      [JSON.stringify(newTask), totalTimer, taskGroupId]
    );
    console.log(data.rows);
    res.status(200).json(data.rows);
  } catch (err) {
    console.log(err);
    res.status(400).json("something went wrong");
  }
});

app.post("/api/taskGroups", async (req, res) => {
  const { userId, title, desc, breakTime, tasks } = req.body.allTasks;
  try {
    const data = await pool.query(
      "INSERT into taskgroup (breaktime,description,tasks,title,userid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [Number(breakTime), desc, JSON.stringify(tasks), title, userId]
    );
    res.status(200).json(SqltoCamelCase(data.rows)[0]);
  } catch (err) {
    console.log(err);
    res.status(400).json("something went wrong");
  }
});

// app.put("/api/taskGroups", (req, res) => {
//   console.log("request in put");
//   const newTaskGroup = taskGroups.filter((taskGroup) => {
//     return taskGroup.id !== req.body.currentTaskState.taskGroup.id;
//   });
//   newTaskGroup.push(req.body.currentTaskState.taskGroup);
//   taskGroups = [...newTaskGroup];
//   res.status(200).json(taskGroups);
// });

app.post("/api/login", async (req, res) => {
  const reqUser = req.body.user;
  const reqPass = req.body.password;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username=$1", [
      reqUser,
    ]);

    if (!user.rows.length) return res.status(400).json("Invalid Credentials");

    if (user.rows[0].password === reqPass)
      res.status(200).json({ success: true, user: user.rows[0] });
    else return res.status(400).json("Invalid Credentials");
  } catch (err) {
    console.log(err);
    res.status(200).json("something went wrong");
  }
});

app.post("/api/signup", async (req, res) => {
  if (
    !(
      req.body.user &&
      req.body.password &&
      req.body.image &&
      req.body.profession
    )
  )
    return res.json("provide all data");

  try {
    await pool.query(
      "INSERT into users (username, password, image, profession) VALUES ($1, $2, $3, $4)",
      [req.body.user, req.body.password, req.body.image, req.body.profession]
    );
    res.status(200).json("user created");
  } catch (err) {
    console.log(err);
    res.status(400).json("something went wrong");
  }
});

app.get("/users", async (req, res) => {
  const data = await pool.query("SELECT * FROM users");
  res.status(200).json(data.rows);
});

app.listen(5000, () => {
  console.log("server is running on", 5000);
});
