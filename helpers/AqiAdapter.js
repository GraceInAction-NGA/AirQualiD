const getCategory = (I) => {
    if (I <= 50) return "Good";
    if (I <= 100) return "Moderate";
    if (I <= 150) return "Unhealthy for Sensative Groups";
    if (I <= 200) return "Unhealthy";
    if (I <= 300) return "Very Unhealthy";
    return "Hazardous";
}

const getConcentrationBreakpoints = (C) => {
    if (C <= 12.0) return {low: 0.0, high: 12.0};
    if (C <= 35.4) return {low: 12.1, high: 35.4};
    if (C <= 55.4) return {low: 35.5, high: 55.4};
    if (C <= 150.4) return {low: 55.5, high: 150.4};
    if (C <= 250.4) return {low: 150.5, high: 250.4};
    if (C <= 350.4) return {low: 250.5, high: 350.4};
    if (C <= 500.4) return {low: 350.5, high: 500.4};
    return {low: 500.5, high: 99999.9};
}

const getIndexBreakpoints = (C) => {
    if (C <= 12.0) return {low: 0, high: 50};
    if (C <= 35.4) return {low: 51, high: 100};
    if (C <= 55.4) return {low: 101, high: 150};
    if (C <= 150.4) return {low: 151, high: 200};
    if (C <= 250.4) return {low: 201, high: 300};
    if (C <= 350.4) return {low: 301, high: 400};
    if (C <= 500.4) return {low: 401, high: 500};
    return {low: 500, high: 900};
}

const calculateAqi = (concentration) => {
    const indexBreakpoints = getIndexBreakpoints(concentration);
    const concentrationBreakpoints = getConcentrationBreakpoints(concentration);

    const indexBPDiff = indexBreakpoints.high - indexBreakpoints.low;
    const concentrationBPDiff = concentrationBreakpoints.high - concentrationBreakpoints.low;
    const concentrationDiff = concentration - concentrationBreakpoints.low;
    const indexConcentrationRatio = indexBPDiff / concentrationBPDiff;

    return (indexConcentrationRatio * concentrationDiff) + indexBreakpoints.low;
}

const getAqi = (concentration) => {
    const aqi = calculateAqi(concentration);
    
    return {
        aqi: Math.round(aqi),
        category: getCategory(aqi)
    }
}

// Deprecated
const fromPurpleAirAqiDeprecated = (data) => {
    const realTime = getAqi(data.results[0].Stats.v);
    const tenMinutes = getAqi(data.results[0].Stats.v1);
    const thirtyMinutes = getAqi(data.results[0].Stats.v2);
    const oneHour = getAqi(data.results[0].Stats.v3);
    const sixHours = getAqi(data.results[0].Stats.v4);
    const twentyfourHours = getAqi(data.results[0].Stats.v5);
    const oneWeek= getAqi(data.results[0].Stats.v6);

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

    return {
        aqi: {
            o3: o3Data.AQI,
            pm25: pm25Data.AQI,
            pm10: pm10Data.AQI
        },
        category: {
            o3: getCategory(o3Data.AQI),
            pm25: getCategory(pm25Data.AQI),
            pm10: getCategory(pm10Data.AQI)
        },
        location: {
            latitude: pm25Data.Latitude,
            longitude: pm25Data.Longitude
        },
        timestamp: Date.parse(`${pm25Data.DateObserved.trim()}T${pm25Data.HourObserved}:00`),
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