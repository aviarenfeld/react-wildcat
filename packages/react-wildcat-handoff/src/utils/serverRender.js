"use strict";

const ReactDOM = require("react-dom/server");
const Helmet = require("react-helmet");
const Router = require("react-router");
const defaultTemplate = require("./defaultTemplate.js");

const serverContext = require("./serverContext.js");
const match = Router.match;

module.exports = function serverRender(cfg) {
    const cookies = cfg.cookies;
    const request = cfg.request;
    const wildcatConfig = cfg.wildcatConfig;

    return new Promise(function serverRenderPromise(resolve, reject) {
        match(cfg, function serverRenderMatch(error, redirectLocation, renderProps) {
            let result = {};

            if (error) {
                return reject(error);
            }

            if (redirectLocation) {
                result = {
                    redirect: true,
                    redirectLocation,
                    status: 301
                };
            } else if (!renderProps) {
                result = {
                    error: "Not found",
                    status: 404
                };
            } else {
                let initialData = null;

                return Promise.all(
                    renderProps.components
                        .filter(function renderPropsFilter(component) {
                            return component.prefetch;
                        })
                        .map(function renderPropsMap(component) {
                            const prefetch = component.prefetch;
                            const key = prefetch.getKey();

                            return prefetch.run(renderProps).then(
                                function renderPropsPrefetchResult(props) {
                                    initialData = initialData || {};
                                    initialData[key] = prefetch[key] = props;
                                }
                            );
                        })
                )
                    .then(function serverRenderPromiseResult() {
                        const renderType = wildcatConfig.serverSettings.renderType;

                        const getRenderType = (typeof renderType === "function") ?
                            renderType({
                                wildcatConfig,
                                request,
                                cookies,
                                renderProps
                            }) : renderType;

                        const reactMarkup = ReactDOM[getRenderType](
                            serverContext(request, cookies, renderProps)
                        );

                        const head = Object.assign({
                            link: "",
                            meta: "",
                            title: ""
                        }, Helmet.rewind());

                        const htmlTemplate = wildcatConfig.serverSettings.htmlTemplate || defaultTemplate;

                        const html = htmlTemplate({
                            data: initialData,
                            head: head,
                            html: reactMarkup,
                            wildcatConfig,
                            request,
                            cookies,
                            renderProps
                        });

                        result = Object.assign({}, result, {
                            html: html,
                            status: 200
                        });

                        return resolve(result);
                    })
                    .catch(
                        /* istanbul ignore next */
                        function serverRenderError(err) {
                            return reject(err);
                        }
                    );
            }

            return resolve(result);
        });
    });
};
