const AqiConverter = require('./AqiConverter');

const getAqi = (concentration) => {
    const aqi = AqiConverter.calculateAqi(concentration);
    
    return {
        aqi: Math.round(aqi),
        category: AqiConverter.getCategory(aqi)
    }
}

const fromPurpleAirAqi = (data) => {
    const realTime = getAqi(data.Stats.v);
    const tenMinutes = getAqi(data.Stats.v1);
    const thirtyMinutes = getAqi(data.Stats.v2);
    const oneHour = getAqi(data.Stats.v3);
    const sixHours = getAqi(data.Stats.v4);
    const twentyfourHours = getAqi(data.Stats.v5);
    const oneWeek= getAqi(data.Stats.v6);

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
        concentration: data.Stats.v5,
        timestamp: data.Stats.lastModified,
        source: "Purple Air",
        id: data.ID
    };
}

const fromAirNow = (data) => {
    const o3Data = data[0];
    const pm25Data = data[1];
    const pm10Data = data[2];

    const hour = String(pm25Data.HourObserved);
    const paddedHour = hour.length === 2 ? hour : `0${hour}`;

    return {
        aqi: {
            o3: o3Data.AQI,
            pm25: pm25Data.AQI,
            pm10: pm10Data.AQI
        },
        category: {
            o3: AqiConverter.getCategory(o3Data.AQI),
            pm25: AqiConverter.getCategory(pm25Data.AQI),
            pm10: AqiConverter.getCategory(pm10Data.AQI)
        },
        location: {
            latitude: pm25Data.Latitude,
            longitude: pm25Data.Longitude
        },
        timestamp: Date.parse(`${pm25Data.DateObserved.trim()}T${paddedHour}:00`),
        source: "AirNow"
    };
}

const fromAeroQual = (data) => {
    const n02 = getAqi(data.NO2);
    const o3 = getAqi(data.O3);
    const pm25 = getAqi(data['PM2.5']);

    return {
        aqi: {
            n02: n02.aqi,
            o3: o3.aqi,
            pm25: pm25.aqi,
        },
        category: {
            n02: n02.category,
            o3: o3.category,
            pm25: pm25.category,
        },
        timestamp: Date.parse(data.Time),
        id: data.id,
        source: "AeroQual"
    };
}

module.exports = {
    fromPurpleAirAqi,
    fromAirNow,
    fromAeroQual
}