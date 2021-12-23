const AqiConverter = require('../helpers/AqiConverter');
const expect = require('chai').expect;

describe('AqiConverter', () => {
  describe('getCategory', () => {
    it('should return Good', async () => {
      expect(AqiConverter.getCategory(49)).to.equal("Good");
    })

    it('should return Moderate', async () => {
      expect(AqiConverter.getCategory(99)).to.equal("Moderate");
    })

    it('should return Unhealthy for Sensative Groups', async () => {
      expect(AqiConverter.getCategory(149)).to.equal("Unhealthy for Sensative Groups");
    })

    it('should return Unhealthy', async () => {
      expect(AqiConverter.getCategory(199)).to.equal("Unhealthy");
    })

    it('should return Very Unhealthy', async () => {
      expect(AqiConverter.getCategory(299)).to.equal("Very Unhealthy");
    })

    it('should return Hazardous', async () => {
      expect(AqiConverter.getCategory(301)).to.equal("Hazardous");
    })

  })

})