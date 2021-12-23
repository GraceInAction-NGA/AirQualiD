const AeroQualService = require('../services/AeroQualService');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const moxios = require('moxios');
const sinon = require('sinon');

describe('AeroQualService', function () {

    beforeEach(() => moxios.install())
    afterEach(() => moxios.uninstall())

    context('when unable to authenticate', () => {
        it('should throw an error', async () => {
            moxios.stubRequest(/.*\/api\/account\/login/g, {
                status: 401
            });

            await expect(AeroQualService.poll()).to.eventually.be.rejected
                .and.be.an.instanceOf(Error);
                // .and.have.property('message', '');
        })
    })

    context('when authenticated', () => {

        context('when no instruments exist', () => {
            it('should return AQI from PurpleAir', function () {
                expect(0).to.equal(0);
            })
        })

        context('when instruments exist', () => {
            it('should return AQI from PurpleAir', function () {
                expect(0).to.equal(0);
            })


            context('when instruments have no data', () => {
                it('should return AQI from PurpleAir', function () {
                    expect(0).to.equal(0);
                })
            })

            context('when instruments have data', () => {
                it('should return AQI from PurpleAir', function () {
                    expect(0).to.equal(0);
                })
            })

        })
    })
})