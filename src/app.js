const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function CheckRepoInArray(req, res, next) {
  const { id } = req.params;

  const validatedId = repositories.find(repo => repo.id == id);

  if(!validatedId){
      return res.status(400).json({ error: "Repository not found."});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", CheckRepoInArray, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({ message: "Repository not found."});
  }

  const repository = {  ...repositories[repoIndex], title, url, techs };

  repositories[repoIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", CheckRepoInArray, (request, response) => {
  const { id } = request.params;

  if(repositories.length < 1) return res.status(400).json({ error: "There are no repositories in the array." });

  const repoIndex= repositories.findIndex(repo => repo.id == id);

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});


app.post("/repositories/:id/like", CheckRepoInArray, (request, response) => {
  const { id } = request.params;

  const repoFilterById = repositories.find(repo => repo.id == id);

  repoFilterById.likes++

  return response.status(200).send(repoFilterById);
});

module.exports = app;
