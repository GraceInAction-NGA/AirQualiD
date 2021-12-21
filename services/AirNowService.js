const AirNowModel = require("../models/AirNowModel");
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = process.env.AIRNOW_BASE_API;
const OBSERVATION_URL = `${BASE_URL}/aq/observation/zipCode/current`;

const API_KEY = process.env.AIRNOW_API_KEY;

const get = async (zipCode) => {
    return await axios.get(`${OBSERVATION_URL}?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${API_KEY}`);
}

const poll = async (zipCode) => {
    try {
        const {data} = await get(zipCode);
        await AirNowModel.create(data);
    } catch(err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}

module.exports = {
    poll
}