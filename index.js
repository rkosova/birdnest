require('dotenv').config();
const cors = require('cors');
const express = require('express');
const droneService = require('./services/drone');
const Drone = require('./models/drone');


const app = express();
app.use(cors());


setInterval(() => {
    droneService.deleteTenMin();
    droneService.getOffenders();
    }, 2000);


app.get("/birdnest", (request, response) => {
    let data = [];
    Drone.find().then(res => {
            data = res;
            data.sort((a, b) => a.distance - b.distance);
            const sortedDrones = [];
            const uniquePID = [];
            data.map(drone => {
            if (!uniquePID.includes(drone.pilotId)) {
                uniquePID.push(drone.pilotId);
                sortedDrones.push(drone);
            }
        });

        response.json(sortedDrones);
    }); 
})


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});