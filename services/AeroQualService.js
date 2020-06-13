const AirNowModel = require("../models/AirNowModel");
const axios = require('axios');

const BASE_URL = "http://cloud.aeroqual.com";
const LOGIN_URL = `${BASE_URL}/api/account/login`;
const INTRUSTMENT_URL = `${BASE_URL}/api/instrument`;
const DATA_URL = `${BASE_URL}/api/data`;

let AUTH_TOKEN = null;
// TODO Do Not Commit This


const login = async () => {
    return await axios.post(`${LOGIN_URL}`, {UserName: USERNAME, Password: PASSWORD});
}

const setAuthToken = async () => {
    if (!AUTH_TOKEN) {
        res = await login();
    }
    AUTH_TOKEN = await res.headers['set-cookie'][0];
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

const toDate = (date) => { 
    const isoString = date.toISOString();
    return {isoString: isoString, date: isoString.split(".")[0]}
}
  
const getNow = () => {
    const date = new Date();
    return toDate(date);
}
  
const getAnHourBack = (isoStr) => {
    const date = new Date(isoStr);
    date.setHours(date.getHours() - 1);
    return toDate(date);
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

const poll = async () => {
    try {
        await setAuthToken();
        const res = await getInstruments();
        const instruments = res.data ? res.data : [];
        const to = getNow();
        const from = getAnHourBack(to.isoString);
        const averagingperiod = 1; // minutes
        const includejournal = false;

        asyncForEach(instruments, async (instrument) => {
            const a = await get(instrument, from.date, to.date, averagingperiod, includejournal);
            console.log(a.data);
            // AirNowModel.create(data);
        })
    } catch(err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}

module.exports = {
    poll,
}