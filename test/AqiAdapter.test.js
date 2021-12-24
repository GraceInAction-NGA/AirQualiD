const AqiAdapter = require('../helpers/AqiAdapter');
const expect = require('chai').expect;
const sinon = require('sinon');

const AqiConverter = require('../helpers/AqiConverter');

const mockPurpleAirData = {
  ID: "asf",
  Stats: {
    v: 0,
    v1: 30,
    v2: 50,
    v3: 100,
    v4: 200,
    v5: 250,
    v6: 300,
    lastModified: 123
  }
};

const buildAirNowData = (hour) => ([{
    AQI: 20
  },
  {
    AQI: 190,
    Latitude: 123,
    Longitude: 123,
    DateObserved: "2012-02-01",
    HourObserved: hour
  },
  {
    AQI: 900
  }
]);

const mockAeroQualData = {
  Time: '2020-06-04T18:00:00',
  NO2: 18.7,
  O3: 0,
  'PM2.5': 2.2,
  TEMP: 25.56,
  RH: 39.7,
  DP: 10.8,
  id: "AQY BB-844"
};

describe('AqiAdapter', function () {

  let calculateAqi, getCategory;
  let concentration, category;

  beforeEach(() => {
    calculateAqi = sinon.stub(AqiConverter, "calculateAqi");
    getCategory = sinon.stub(AqiConverter, "getCategory");

    concentration = Math.random();
    category = "Category " + Math.random();

    calculateAqi.returns(concentration);
    getCategory.returns(category);
  })

  afterEach(() => {
    calculateAqi.restore();
    getCategory.restore();
  })

  it('should return AQI from PurpleAir', () => {
    const expectedAqi = buildPurpleAirAqi(concentration, category)

    const aqi = AqiAdapter.fromPurpleAirAqi(mockPurpleAirData);

    expect(JSON.stringify(aqi)).to.equal(JSON.stringify(expectedAqi));
  })

  it('should return AQI from AirNow without padded timestamp', function () {
    const expectedAirNowAqi = buildAirNowAqi(category, 1328086800000);

    const aqi = AqiAdapter.fromAirNow(buildAirNowData(4));

    expect(JSON.stringify(aqi)).to.equal(JSON.stringify(expectedAirNowAqi));
  })


  it('should return AQI from AirNow with padded timestamp', function () {
    const expectedAirNowAqi = buildAirNowAqi(category, 1328115600000);

    const aqi = AqiAdapter.fromAirNow(buildAirNowData(12));

    expect(JSON.stringify(aqi)).to.equal(JSON.stringify(expectedAirNowAqi));
  })

  it('should return AQI from Aeroqual', function () {
    const expectedAqi = buildAeroQualAqi(concentration, category)

    const aqi = AqiAdapter.fromAeroQual(mockAeroQualData);

    expect(JSON.stringify(aqi)).to.equal(JSON.stringify(expectedAqi));
  })
})

function buildAeroQualAqi(expectedConcentration, expectedCategory) {
  const roundedExpectedConcentration = Math.round(expectedConcentration);

  return {
    aqi: {
      n02: roundedExpectedConcentration,
      o3: roundedExpectedConcentration,
      pm25: roundedExpectedConcentration
    },
    category: {
      n02: expectedCategory,
      o3: expectedCategory,
      pm25: expectedCategory
    },
    timestamp: 1591308000000,
    id: "AQY BB-844",
    source: 'AeroQual'
  };
}

function buildAirNowAqi(expectedCategory, expectedTimeStamp) {

  return {
    aqi: {
      o3: 20,
      pm25: 190,
      pm10: 900
    },
    category: {
      o3: expectedCategory,
      pm25: expectedCategory,
      pm10: expectedCategory
    },
    location: {
      latitude: 123,
      longitude: 123
    },
    timestamp: expectedTimeStamp,
    source: 'AirNow'
  };
}

function buildPurpleAirAqi(expectedConcentration, expectedCategory) {
  const roundedExpectedConcentration = Math.round(expectedConcentration);
  return {
    aqi: {
      realTime: roundedExpectedConcentration,
      tenMinutes: roundedExpectedConcentration,
      thirtyMinutes: roundedExpectedConcentration,
      oneHour: roundedExpectedConcentration,
      sixHours: roundedExpectedConcentration,
      twentyfourHours: roundedExpectedConcentration,
      oneWeek: roundedExpectedConcentration
    },
    category: {
      realTime: expectedCategory,
      tenMinutes: expectedCategory,
      thirtyMinutes: expectedCategory,
      oneHour: expectedCategory,
      sixHours: expectedCategory,
      twentyfourHours: expectedCategory,
      oneWeek: expectedCategory
    },
    concentration: 250,
    timestamp: 123,
    source: 'Purple Air',
    id: 'asf'
  };
}