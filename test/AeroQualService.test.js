const AeroQualService = require(process.cwd() + '/services/AeroQualService');
const expect = require('chai').expect;
const sinon = require("sinon");

describe('AeroQualService', function() {
    context('when unable to authenticate', () => {
        it('should return null', function() {

            expect(AeroQualService.poll()).to.throw();
        })
    })

    context('when authenticated', () => {

        context('when no instruments exist', () => {
            it('should return AQI from PurpleAir', function() {
                expect(0).to.equal(0);
            })
        })

        context('when instruments exist', () => {
            it('should return AQI from PurpleAir', function() {
                expect(0).to.equal(0);
            })


            context('when instruments have no data', () => {
                it('should return AQI from PurpleAir', function() {
                    expect(0).to.equal(0);
                })
            })

            context('when instruments have data', () => {
                it('should return AQI from PurpleAir', function() {
                    expect(0).to.equal(0);
                })
            })

        })
    })
})