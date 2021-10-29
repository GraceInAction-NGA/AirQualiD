const AqiAdapter = require(process.cwd() + '/helpers/AqiAdapter');
const expect = require('chai').expect;

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

const mockAirNowData = [
  {AQI: 20},
  {AQI: 190, Latitude: 123, Longitude: 123, DateObserved: "2012-02-01", HourObserved: 12},
  {AQI: 900}
];

const mockAeroQualData = {
  Time: '2020-06-04T18:00:00',
  NO2: 18.7,
  O3: 0,
  'PM2.5': 2.2,
  TEMP: 25.56,
  RH: 39.7,
  DP: 10.8,
  id: "AQY BB-844"
} ;

describe('AqiAdapter', function() {
    it('should return AQI from PurpleAir', function() {
      const mockPurpleAirAqi = AqiAdapter.fromPurpleAirAqi(mockPurpleAirData);
      const expectedAqi = { aqi:
        { realTime: 0,
          tenMinutes: 89,
          thirtyMinutes: 137,
          oneHour: 174,
          sixHours: 250,
          twentyfourHours: 300,
          oneWeek: 350 },
        category:
        { realTime: 'Good',
          tenMinutes: 'Moderate',
          thirtyMinutes: 'Unhealthy for Sensative Groups',
          oneHour: 'Unhealthy',
          sixHours: 'Very Unhealthy',
          twentyfourHours: 'Very Unhealthy',
          oneWeek: 'Hazardous' },
        concentration: 250,
        timestamp: 123,
        source: 'Purple Air',
        id: 'asf' }

      expect(JSON.stringify(mockPurpleAirAqi)).to.equal(JSON.stringify(expectedAqi));
    })
    it('should return AQI from AirNow', function() {
      const mockAirNowAqi = AqiAdapter.fromAirNow(mockAirNowData);
      const expectedAirNowAqi = {
        aqi: { o3: 20, pm25: 190, pm10: 900 },
        category: { o3: 'Good', pm25: 'Unhealthy', pm10: 'Hazardous' },
        location: { latitude: 123, longitude: 123 },
        timestamp: 1328115600000,
        source: 'AirNow'
      }

      expect(JSON.stringify(mockAirNowAqi)).to.equal(JSON.stringify(expectedAirNowAqi));
    })
    it('should return AQI from Aeroqual', function() {
      const mockAeroQualAqi = AqiAdapter.fromAeroQual(mockAeroQualData);
      const expectedAeroQualAqi = {
        aqi: { n02: 65, o3: 0, pm25: 9 },
        category: { n02: 'Moderate', o3: 'Good', pm25: 'Good' },
        timestamp: 1591308000000,
        id: "AQY BB-844",
        source: 'AeroQual'
      }

      expect(JSON.stringify(mockAeroQualAqi)).to.equal(JSON.stringify(expectedAeroQualAqi));
    })
})