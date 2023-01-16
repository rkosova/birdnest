const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connecting to MongoDB');
    })
    .catch(err => {
        console.log('error connecting to MongoDB:', err.message);
    })

const droneSchema = new mongoose.Schema({
    serialNumber: String,
    x: Number,
    y: Number,
    distance: Number,
    date: String,
    pilotId: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String
})

droneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
    }
});

module.exports = mongoose.model('Drone', droneSchema);