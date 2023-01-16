
const axios = require('axios');
const express = require('express');
const convert = require('xml-js');


const app = express();

const drones = [];

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
            distance: distance(Number(droneO.positionX._text), Number(droneO.positionY._text)),
            date: new Date()
        }
    ));

    return drones;
}

const inNDZ = (drones) => {
    return drones.filter(drone => drone.distance < 100000);
}


const getOffenders = () => {
    axios
    .get('https://assignments.reaktor.com/birdnest/drones')
    .then(res => 
        {
            const d = convert.xml2js(res.data, 
            {
                compact: true,
                spaces: 4
            });

            inNDZ(droneConstructor(d.report.capture.drone)).map(drone => 
                {
                    axios
                        .get(`https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`)
                        .then(res => {
                            drone.pilot = res.data;
                            drones.push(drone);
                            console.log(drone);
                        });
                })
        }
    );
}


setInterval(getOffenders, 2000);


// TODO:
// SAVE EACH DRONE IN DATABASE
// FRONT END -> BACK END (GETS RELEVANT 10 MIN DATA FROM DATABASE SERVER) -> RETURNS TO FRONT END
//


app.get("/birdnest", (request, response) => {
    response.json(drones);
})


const PORT = 3001;
app.listen(PORT);