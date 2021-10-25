const PurpleAirModel= require('../models/PurpleAirModel');
const axios = require('axios');
const PURPLEAIR_URL_BASE = "https://www.purpleair.com";


const get = async (query) => {
    return await axios.get(`${PURPLEAIR_URL_BASE}/json?show=${query}`);
};

const poll = async (sensors) => {
    const sensorIds = sensors.map(sensor => sensor.sensorID);
    const query = sensorIds.reduce((acc, id, i) => {
        return (i === 0) ? id : `${acc}|${id}`;
    }, "");
    try {
        const {data} = await get(query);
        const validData = data.results.filter(sensor => {
            return sensorIds.includes(String(sensor.ID));
        });

        await PurpleAirModel.create(validData);
    } catch(e) {
        console.log(e)
    };
};

module.exports = {
    get,
    poll
}