const SensorService = require('./SensorService');
const PurpleAirService = require('./PurpleAirService');
const AirNowService = require('./AirNowService');
const AeroQualService = require('./AeroQualService');

const INTERVAL = 3600000; // 1 hour
// const INTERVAL = 60000; // 1 min

const purpleAirPoller = async () => {
    const sensors = await SensorService.getAll();
    PurpleAirService.poll(sensors);
};

const airNowPoller = async () => {
    const zipcodes = 48210; // should be array of zipcodes based on user provided values
    AirNowService.poll(zipcodes);
}

const aeroQualPoller = async () => {
    AeroQualService.poll();
}

const run = async () => {
    // setInterval(purpleAirPoller, INTERVAL);
    // setInterval(airNowPoller, INTERVAL);
    // setInterval(aeroQualPoller, INTERVAL);
};

module.exports = {
    run,
};