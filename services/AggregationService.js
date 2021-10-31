var AqiConverter = require('../helpers/AqiConverter');

const aggregatedData = (data) => {
    const groupedData = groupByDate(data);
    const dates = Object.keys(groupedData)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return dates.map((date) => {
        const averagedAQI = averageSet(groupedData[date]);
        const roundedAverageAqi = roundSet(averagedAQI);
        roundedAverageAqi.id = 0;
        roundedAverageAqi.source = 0;
        roundedAverageAqi.timestamp = new Date(date).getTime();
        roundedAverageAqi.category = {
            ...getCaterogies(roundedAverageAqi.aqi)
        };

        return roundedAverageAqi;
    });
}

const groupByDate = (data) => {
    return data.reduce((acc, aqi) => {
        const date = new Date(aqi.timestamp);
        const dateString = date.toDateString();

        if (!acc[dateString]) {
            acc[dateString] = [aqi]
        } else {
            acc[dateString] = [...acc[dateString], aqi]
        }
        return acc;
    }, {});
}

const averageSet = (data) => {
    return data.reduce((acc, aqi) => {
        const averageAqi = getAverageAqi(aqi.aqi, acc.aqi);
        return {
            aqi: averageAqi,
            concentration: average(aqi.concentration, acc.concentration)
        }
    }, {
        aqi: {
            oneHour: 0,
            twentyfourHours: 0,
            thirtyMinutes: 0,
            realTime: 0,
            sixHours: 0,
            tenMinutes: 0,
            oneWeek: 0
        },
        concentration: 0
    });
}

const getAverageAqi = (aqi, acc) => {
    return Object.keys(acc).reduce((averageAqi, aqiKey) => {
        averageAqi[aqiKey] = average(aqi[aqiKey], acc[aqiKey]);
        return averageAqi;
    }, {});
}

const getCaterogies = (aqi) => {
    return Object.keys(aqi).reduce((acc, aqiKey) => {
        acc[aqiKey] = AqiConverter.getCategory(aqi[aqiKey]);
        return acc;
    }, {});
}

const roundSet = (aqi) => {
    const roundedAqi = Object.keys(aqi.aqi).reduce((roundedAqi, aqiKey) => {
        return {
            ...roundedAqi,
            [aqiKey]: round(aqi.aqi[aqiKey])
        };
    }, {});
    const roundedConcentration = aqi.concentration.toFixed(2);

    return {
        aqi: roundedAqi,
        concentration: Number(roundedConcentration)
    }
}

const round = (value) => {
    const shouldRoundUp = ((value * 10) % 10) >= 5;
    return shouldRoundUp ? Math.ceil(value) : Math.floor(value);
}

const average = (a, b) => (a + b) / 2;

module.exports = {
    aggregatedData
}