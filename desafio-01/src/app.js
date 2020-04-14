const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id))
    return res.status(400).json({ error: "Invalid repository id." });

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (req, res) => {
  res.status(200).json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  res.status(201).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repIndex = repositories.findIndex((r) => r.id === id);

  if (repIndex < 0) res.status(400).json({ error: "Repository not found." });

  const likes = repositories[repIndex].likes;
  const repository = { id, title, url, techs, likes };
  repositories[repIndex] = repository;

  res.status(200).json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repIndex = repositories.findIndex((r) => r.id === id);

  if (repIndex < 0) res.status(400).json({ error: "Repository not found." });

  repositories.splice(repIndex, 1);

  res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repIndex = repositories.findIndex((r) => r.id === id);

  if (repIndex < 0) res.status(400).json({ error: "Repository not found." });

  const likes = repositories[repIndex].likes + 1;
  const repository = { ...repositories[repIndex], likes };
  repositories[repIndex] = repository;

  res.status(200).json(repository);
});

module.exports = app;
