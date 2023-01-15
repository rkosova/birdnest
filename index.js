
const axios = require('axios');
const express = require('express');
const convert = require('xml-js');


const app = express();

const droneObjects = [];

const distance = (x, y) => {
    const origin = {
        x: 250000,
        y: 250000,
    };

    const deltaX = x - origin.x;
    const deltaY = y - origin.y;

    return Math.sqrt( (deltaX ** 2) + (deltaY ** 2) );
}

const droneConstructor = (dronesJSO) => {
    const drones = [];

    dronesJSO.map(droneO => drones.push(
        {
            serialNumber: droneO.serialNumber._text,
            x: Number(droneO.positionX._text),
            y: Number(droneO.positionY._text),
            distance: distance(Number(droneO.positionX._text), Number(droneO.positionY._text))
        }
    ));

    return drones;
}

const inNDZ = (drones) => {
    return drones.filter(drone => drone.distance < 100000);
}


axios
    .get('https://assignments.reaktor.com/birdnest/drones')
    .then(res => {
        const drones = convert.xml2js(res.data, {
        compact: true,
        spaces: 4
    });

    console.log(inNDZ(droneConstructor(drones.report.capture.drone)));
    inNDZ(droneConstructor(drones.report.capture.drone)).map(drone => droneObjects.push(drone));
    });

app.get("/birdnest", (request, response) => {
    response.send("Hello World!");
})


const PORT = 3001;
app.listen(PORT);