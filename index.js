// importar express
const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const jsonPath = path.resolve('./data.json'); //ruta del data.json

const app = express();

//middleware para abrir archivos json
app.use(express.json());

app.all('/', (req, res) => {

    console.log("Bienvenido a mi server")

    res.end();
});

app.get("/api/v1/tasks", async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    res.status(200);    
    res.send(jsonFile);
});

app.post("/api/v1/tasks", async (req, res) => {
    const newTask = req.body;
    // necesito el array que está dentro de data.json
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    tasksArray.push({ ...newTask, id: getLastId(tasksArray)});
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    res.sendStatus(201);
    res.end();
});

app.put("/api/v1/tasks", async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    // 
    console.log(req.body);
    const {id, status} = req.body;
    const taskIndex = tasksArray.findIndex((task) => task.id === id);
    tasksArray[taskIndex].status = status;
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    res.sendStatus(200);

});

app.delete("/api/v1/tasks", async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const {id} = req.body;
    const taskIndex = tasksArray.findIndex((task) => task.id === id);
    tasksArray.splice(taskIndex, 1);
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    res.sendStatus(200);
    
});

app.listen(8000, () => {
    console.log("servidor corriendo en el puerto 8000")

});

const getLastId = (dataArray) => {
    const lastElementIndex = dataArray.length - 1;
    return dataArray[lastElementIndex].id + 1;
}

