const AirNowModel = require("../models/AirNowModel");
const axios = require('axios');

const BASE_URL = "http://cloud.aeroqual.com";
const LOGIN_URL = `${BASE_URL}/api/account/login`;
const INTRUSTMENT_URL = `${BASE_URL}/api/instrument`;
const DATA_URL = `${BASE_URL}/api/data/`;

const OBSERVATION_URL = `${BASE_URL}/aq/observation/zipCode/current`;
let AUTH_TOKEN = null;
// TODO Do Not Commit This
const USERNAME = "sean@graceinactiondetroit.org";
const PASSWORD = ;

const login = async () => {
    return await axios.post(`${LOGIN_URL}`, {UserName: USERNAME, Password: PASSWORD});
}

const setAuthToken = async (data) => {
    AUTH_TOKEN = data.headers['set-cookie'][0];
}

const getInstruments = async () => {
    return await axios.get(INTRUSTMENT_URL, {
        headers: {
            Cookie: AUTH_TOKEN
        }
    });
}

const get = async (instrument, from, to, averagingperiod, includejournal) => {
    return await axios.get(`${DATA_URL}/${instrument}?from=${from}&to=${to}&averagingperiod=${averagingperiod}&includejournal=${includejournal}`, {
        headers: {
            Cookie: AUTH_TOKEN
        }
    });
}

const poll = async () => {
    try {
        const res = await login();
        setAuthToken(res);
        console.log(AUTH_TOKEN);
        const {data} = await getInstruments();
        console.log(data);
        const date = new Date();
        date.setHours(0);
        date.setMilliseconds(0);
        date.setMinutes(0);
        date.setSeconds(0);
        const d = new Date();
        d.setHours(0);
        d.setMilliseconds(0);
        d.setMinutes(0);
        d.setSeconds(0);
        date.setDate(date.getDate() -1);
        const from = date.toISOString();
        const to = d.toISOString();
        const averagingperiod = 60;
        const includejournal = false;
        const a = await get(data[0], from.substring(0, from.length-5), to.substring(0, to.length-5), averagingperiod, includejournal);
        console.log(a.data);
        // AirNowModel.create(data);
    } catch(err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}

module.exports = {
    poll
}