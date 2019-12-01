/*
    Class
    Controller - Endpoints
    Service - interacts with repositories
    Repository - models the database

    Adapter - transforms
*/

const firebase = require('./Firebase');
const AqiService = require('./AqiService');

function parse(data) {
    data.results[0].Stats = JSON.parse(data.results[0].Stats);
    data.results[1].Stats = JSON.parse(data.results[1].Stats);
    return data;
}

function toPurpleAirAqi(data) {
    const realTime = AqiService.calculateAqi(data.results[0].Stats.v);
    const tenMinutes = AqiService.calculateAqi(data.results[0].Stats.v1);
    const thirtyMinutes = AqiService.calculateAqi(data.results[0].Stats.v2);
    const oneHour = AqiService.calculateAqi(data.results[0].Stats.v3);
    const sixHours = AqiService.calculateAqi(data.results[0].Stats.v4);
    const twentyfourHours = AqiService.calculateAqi(data.results[0].Stats.v5);
    const oneWeek= AqiService.calculateAqi(data.results[0].Stats.v6);

    return {
        aqi: {
            realTime: realTime.aqi,
            tenMinutes: tenMinutes.aqi,
            thirtyMinutes: thirtyMinutes.aqi,
            oneHour: oneHour.aqi,
            sixHours: sixHours.aqi,
            twentyfourHours: twentyfourHours.aqi,
            oneWeek: oneWeek.aqi,
        },
        category: {
            realTime: realTime.category,
            tenMinutes: tenMinutes.category,
            thirtyMinutes: thirtyMinutes.category,
            oneHour: oneHour.category,
            sixHours: sixHours.category,
            twentyfourHours: twentyfourHours.category,
            oneWeek: oneWeek.category,
        },
        concentration: data.results[0].Stats.v5,
        timestamp: data.results[0].Stats.lastModified,
    };
}

function save(res) {
    const parsedData = parse(res.data);
    firebase.database.collection("readingss").add(parsedData);

    const purpleAirAqi = toPurpleAirAqi(parsedData);
    firebase.database.collection("aqiss").add(purpleAirAqi);
}

module.exports = {
    save
}