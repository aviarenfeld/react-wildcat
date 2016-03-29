const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const proxyquire = require("proxyquire").noPreserveCache();

module.exports = (stubs) => {
    "use strict";

    describe("getWildcatConfig", () => {
        it("returns a Wildcat configuration object", () => {
            const getWildcatConfig = require("../../src/utils/getWildcatConfig");
            const wildcatConfig = getWildcatConfig(stubs.exampleDir);

            expect(wildcatConfig)
                .to.exist;

            expect(wildcatConfig)
                .to.be.an("object");
        });

        context("with specified config values", () => {
            let wildcatConfig;

            before(() => {
                var originalConfig = require(stubs.projectConfigFile);
                originalConfig.generalSettings.originUrl = "http://mytestorigin.com";
                originalConfig.generalSettings.staticUrl = "http://myteststatic.com";

                wildcatConfig = proxyquire("../../src/utils/getWildcatConfig.js", {
                    [`${stubs.exampleDir}/wildcat.config.js`]: () => originalConfig
                })();
            });

            after(() => {
                delete wildcatConfig.generalSettings.originUrl;
                delete wildcatConfig.generalSettings.staticUrl;
            });

            it(`uses specified originUrl`, () => {
                expect(wildcatConfig.generalSettings.originUrl)
                    .to.equal("http://mytestorigin.com");
            });

            it(`uses specified staticUrl`, () => {
                expect(wildcatConfig.generalSettings.staticUrl)
                    .to.equal("http://myteststatic.com");
            });
        });

        context("without specified config values", () => {
            let wildcatConfig;

            before(() => {
                var originalConfig = require(stubs.projectConfigFile);
                delete originalConfig.generalSettings.originUrl;
                delete originalConfig.generalSettings.staticUrl;

                wildcatConfig = proxyquire("../../src/utils/getWildcatConfig.js", {
                    [`${stubs.exampleDir}/wildcat.config.js`]: () => originalConfig
                })();
            });

            it(`uses calculated originUrl`, () => {
                expect(wildcatConfig.generalSettings.originUrl)
                    .to.equal("https://localhost:3000");
            });

            it(`uses calculated staticUrl`, () => {
                expect(wildcatConfig.generalSettings.staticUrl)
                    .to.equal("https://localhost:4000");
            });
        });
    });
};
