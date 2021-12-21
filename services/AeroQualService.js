const AeroQualModel = require("../models/AeroQualModel");
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = process.env.AEROQUAL_BASE_API;
const LOGIN_URL = `${BASE_URL}/api/account/login`;
const INTRUSTMENT_URL = `${BASE_URL}/api/instrument`;
const DATA_URL = `${BASE_URL}/api/data`;

const AVERAGING_PERIOD = 1; // minutes
const INCLUDE_JOURNAL = false;

let AUTH_TOKEN = null;

const USERNAME = process.env.AEROQUAL_USERNAME;
const PASSWORD = process.env.AEROQUAL_PASSWORD;


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
    console.log(AUTH_TOKEN);
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

        console.log(instruments);
        const a = [instruments[0]];

        asyncForEach(a, async (instrument) => {
            try {
                const {data} = await get(instrument, from.date, to.date, AVERAGING_PERIOD, INCLUDE_JOURNAL);
                console.log(data);
                const reading =  (data.data.length === 0) ? {} : data.data[data.data.length - 1];
                
                // reading['id'] = data.name;

                console.log(reading)

                // await AeroQualModel.create(reading);
            } catch (err) {
                console.log("> Error")
                // console.log(err)
            }
        })
    } catch(err) {
        if (err.response.status === 401 && err.config.url.includes(LOGIN_URL)) {
            console.log('Failed to authenticate');
            throw(new Error('Failed to authenticate'));
        } else {
            console.log('Failed to retrieve data', err);
        }
        
        return null;
    }
}

module.exports = {
    poll,
}