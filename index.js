
const express = require('express');

const app = express();

app.get("/birdnest", (request, response) => {
    response.send("<h1>Hello world</h1>");
})


const PORT = 3001;
app.listen(PORT);