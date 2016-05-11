"use strict";

const fs = require("fs-extra");
const co = require("co");

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const path = require("path");
const pathExists = require("path-exists");

module.exports = (stubs) => {
    "use strict";

    describe("babelDevTranspiler", () => {
        before(() => {
            sinon.stub(stubs.logger, "meta").returns();
            fs.removeSync(path.join(stubs.exampleDir, "public"));
        });

        after(() => {
            stubs.logger.meta.restore();
        });

        const babelDevTranspiler = require("../../src/middleware/babelDevTranspiler");

        expect(babelDevTranspiler)
            .to.be.a("function")
            .that.has.property("name")
            .that.equals("babelDevTranspiler");

        const babelOptions = {
            "plugins": [
                "add-module-exports",
                "transform-decorators-legacy",
                "transform-inline-environment-variables",
                "transform-runtime"
            ],
            "presets": [
                "es2015",
                "react",
                "stage-0"
            ],
            "sourceMaps": true
        };

        const exampleApplicationPath = `/${stubs.publicDir}/components/Application/Application.js`;
        const exampleApplicationSrcPath = `${stubs.sourceDir}/components/Application/Application.js`;
        const exampleIndexPath = `/${stubs.publicDir}/routes/IndexExample/IndexExample.js`;
        const exampleBinaryPath = `/${stubs.publicDir}/assets/images/primary-background.jpg`;
        const exampleNonExistentPath = `/${stubs.publicDir}/foo.js`;
        const exampleUnaffectedPath = "/foo.js";

        const babelDevTranspilerOptions = {
            babelOptions,
            binDir: stubs.binDir,
            extensions: [".es6", ".js", ".es", ".jsx"],
            logger: stubs.logger,
            logLevel: 2,
            origin: stubs.generalSettings.staticUrl,
            outDir: stubs.publicDir,
            sourceDir: stubs.sourceDir
        };

        const babelDevTranspilerInstance = babelDevTranspiler(stubs.exampleDir, babelDevTranspilerOptions);

        it("transpiles a source file", (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, "public")))
                .to.be.false;

            co(function* () {
                const result = yield babelDevTranspilerInstance.call({
                    request: {
                        path: exampleApplicationPath
                    },
                    response: {}
                }, (next) => next());

                return result;
            })
                .then(() => setTimeout(() => {
                    expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                        .to.be.true;

                    done();
                }, stubs.writeDelay))
                .catch(e => done(e));
        });

        it("waits for transpilation on simultaneous requests", (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, "public")))
                .to.be.true;

            co(function* () {
                const result = yield* [
                    babelDevTranspilerInstance.call({
                        request: {
                            path: exampleIndexPath
                        },
                        response: {}
                    }, (next) => next()),

                    babelDevTranspilerInstance.call({
                        request: {
                            path: exampleIndexPath
                        },
                        response: {}
                    }, (next) => next())
                ];

                return result;
            })
                .then(() => setTimeout(() => {
                    expect(pathExists.sync(path.join(stubs.exampleDir, exampleIndexPath)))
                        .to.be.true;

                    done();
                }, stubs.writeDelay))
                .catch(e => done(e));
        });

        it("converts a binary file to an importable module", (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, "public")))
                .to.be.true;

            co(function* () {
                const result = yield babelDevTranspilerInstance.call({
                    request: {
                        path: exampleBinaryPath
                    },
                    response: {}
                }, (next) => next());

                return result;
            })
                .then(() => setTimeout(() => {
                    expect(pathExists.sync(path.join(stubs.exampleDir, exampleBinaryPath)))
                        .to.be.true;

                    const origin = stubs.generalSettings.staticUrl;
                    const binaryFileContents = fs.readFileSync(path.join(stubs.exampleDir, exampleBinaryPath), "utf8");

                    expect(binaryFileContents)
                        .to.be.a("string")
                        .that.equals(`module.exports = "${origin}${stubs.getBinPath(exampleBinaryPath)}";`);

                    done();
                }, stubs.writeDelay))
                .catch(e => done(e));
        });

        it("skips transpilation if file exists", (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                .to.be.true;

            co(function* () {
                const result = yield babelDevTranspilerInstance.call({
                    request: {
                        path: exampleApplicationPath
                    },
                    response: {}
                }, (next) => next());

                return result;
            })
                .then(() => {
                    expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                        .to.be.true;

                    done();
                })
                .catch(e => done(e));
        });

        it("transpiles an existing file on file change", (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                .to.be.true;

            expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationSrcPath)))
                .to.be.true;

            fs.createReadStream(exampleApplicationSrcPath)
                .pipe(
                    fs.createOutputStream(exampleApplicationSrcPath)
                        .on("finish", function streamFinish() {
                            setTimeout(() => {
                                expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                                    .to.be.true;

                                done();
                            }, stubs.writeDelay);
                        })
                );
        });

        it("ignores a request for a non-existent source", (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                .to.be.true;

            co(function* () {
                const result = yield babelDevTranspilerInstance.call({
                    request: {
                        path: exampleNonExistentPath
                    },
                    response: {}
                }, (next) => next());

                return result;
            })
                .then(() => {
                    done();
                })
                .catch(e => done(e));
        });

        it(`ignores a request that does not begin with /${stubs.publicDir}`, (done) => {
            expect(pathExists.sync(path.join(stubs.exampleDir, exampleApplicationPath)))
                .to.be.true;

            co(function* () {
                const result = yield babelDevTranspilerInstance.call({
                    request: {
                        path: exampleUnaffectedPath
                    },
                    response: {}
                }, (next) => next());

                return result;
            })
                .then(() => {
                    done();
                })
                .catch(e => done(e));
        });
    });
};
