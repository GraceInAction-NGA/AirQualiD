const AqiConverter = require('../helpers/AqiConverter');
const expect = require('chai').expect;

describe('AqiConverter', () => {
  describe('getCategory', () => {
    context('when aqi is less than or equal to 50', () => {
      it('should return Good', async () => {
        expect(AqiConverter.getCategory(49)).to.equal("Good");
        expect(AqiConverter.getCategory(50)).to.equal("Good");
      })
    })

    context('when aqi is less than or equal to 100', () => {
      it('should return Moderate', async () => {
        expect(AqiConverter.getCategory(50.1)).to.equal("Moderate");
        expect(AqiConverter.getCategory(99)).to.equal("Moderate");
        expect(AqiConverter.getCategory(100)).to.equal("Moderate");
      })
    })

    context('when aqi is less than or equal to 150', () => {
      it('should return Unhealthy for Sensative Groups', async () => {
        expect(AqiConverter.getCategory(100.1)).to.equal("Unhealthy for Sensative Groups");
        expect(AqiConverter.getCategory(149)).to.equal("Unhealthy for Sensative Groups");
        expect(AqiConverter.getCategory(150)).to.equal("Unhealthy for Sensative Groups");
      })
    })

    context('when aqi is less than or equal to 200', () => {
      it('should return Unhealthy', async () => {
        expect(AqiConverter.getCategory(150.1)).to.equal("Unhealthy");
        expect(AqiConverter.getCategory(199)).to.equal("Unhealthy");
        expect(AqiConverter.getCategory(200)).to.equal("Unhealthy");
      })
    })

    context('when aqi is less than or equal to 300', () => {
      it('should return Very Unhealthy', async () => {
        expect(AqiConverter.getCategory(200.1)).to.equal("Very Unhealthy");
        expect(AqiConverter.getCategory(299)).to.equal("Very Unhealthy");
        expect(AqiConverter.getCategory(300)).to.equal("Very Unhealthy");
      })
    })

    context('when aqi is over 300', () => {
      it('should return Hazardous', async () => {
        expect(AqiConverter.getCategory(300.1)).to.equal("Hazardous");
        expect(AqiConverter.getCategory(301)).to.equal("Hazardous");
      })
    })
  })

  describe('calculateAqi', () => {
    context('when concentration is less than or equal to 12.0', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(1)).to.be.approximately(4.1666, 0.0001);
        expect(AqiConverter.calculateAqi(12.0)).to.be.approximately(50, 0.0001);
      })
    })

    context('when concentration is between to 12.0 and 35.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(12.01)).to.be.approximately(50.8107, 0.0001);
        expect(AqiConverter.calculateAqi(14)).to.be.approximately(54.9957, 0.0001);
        expect(AqiConverter.calculateAqi(35.4)).to.be.approximately(100, 0.0001);
      })
    })

    context('when concentration is between to 35.4 and 55.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(35.41)).to.be.approximately(100.7783, 0.0001);
        expect(AqiConverter.calculateAqi(36)).to.be.approximately(102.2311, 0.0001);
        expect(AqiConverter.calculateAqi(55.4)).to.be.approximately(150, 0.0001);
      })
    })

    context('when concentration is between to 55.4 and 150.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(55.41)).to.be.approximately(150.9535, 0.0001);
        expect(AqiConverter.calculateAqi(56)).to.be.approximately(151.2581, 0.0001);
        expect(AqiConverter.calculateAqi(150.4)).to.be.approximately(200, 0.0001);
      })
    })

    context('when concentration is between to 150.4 and 250.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(150.41)).to.be.approximately(200.9108, 0.0001);
        expect(AqiConverter.calculateAqi(156)).to.be.approximately(206.4504, 0.0001);
        expect(AqiConverter.calculateAqi(250.4)).to.be.approximately(300, 0.0001);
      })
    })

    context('when concentration is between to 250.4 and 350.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(250.41)).to.be.approximately(300.9108, 0.0001);
        expect(AqiConverter.calculateAqi(256)).to.be.approximately(306.4504, 0.0001);
        expect(AqiConverter.calculateAqi(350.4)).to.be.approximately(400, 0.0001);
      })
    })

    context('when concentration is between to 350.4 and 500.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(350.41)).to.be.approximately(400.9405, 0.0001);
        expect(AqiConverter.calculateAqi(356)).to.be.approximately(404.6324, 0.0001);
        expect(AqiConverter.calculateAqi(500.4)).to.be.approximately(500, 0.0001);
      })
    })


    context('when concentration is over 500.4', () => {
      it('should return AQI', () => {
        expect(AqiConverter.calculateAqi(500.41)).to.be.approximately(499.9996, 0.0001);
        expect(AqiConverter.calculateAqi(600)).to.be.approximately(500.4000, 0.0001);
      })
    })
  })

})