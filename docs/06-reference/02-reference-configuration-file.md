## Reference configuration

```js
const wildcatConfig = {
    generalSettings: {
        // Grab the config file from package.json
        jspmConfigFile: "config.js",

        // Project name
        name: undefined,

        // Project version
        version: undefined,

        // Instrument your code with Istanbul.
        coverage: true,

        // Only applicable when coverage is true
        coverageSettings: {
            env: undefined,

            e2e: {
                instrumentation: {
                    excludes: []
                },

                reporting: {
                    dir: "coverage/e2e",
                    reports: ["lcov", "html"]
                }
            },

            unit: {
                instrumentation: {
                    excludes: []
                },

                reporting: {
                    dir: "coverage/unit",
                    reports: ["lcov", "html"]
                }
            }
        },

        // level of logging
        // 0 = disable
        // 1 = error
        // 2 = warn
        // 3 = info
        // 4 = debug
        logLevel: 4
    },

    clientSettings: {
        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        hotReload: !__PROD__,
        hotReloader: "react-wildcat-hot-reloader",

        // Path to the client renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/client",

        // The target element id where React will be injected
        reactRootElementID: "content",

        // Enable / disable client-side IndexedDB module caching
        indexedDBModuleCache: __DEV__
    },

    serverSettings: {
        // Path to the entry config file relative to the project root
        entry: "public/main.js",

        // Path to the server renderer. This can be a jspm package or a relative path
        renderHandler: "react-wildcat-handoff/server",

        // Directory to save raw binaries (jpg, gif, fonts, etc)
        binDir: "bin",

        // Enable the Blue Box of Death to display server errors
        displayBlueBoxOfDeath: !__PROD__,

        hotReload: !__PROD__,
        hotReloader: "react-wildcat-hot-reloader",
        hotReloadReporter: undefined,

        localPackageCache: !__PROD__ || __TEST__,

        // BYO-HTML template
        // htmlTemplate: require("./customHTMLTemplate.js"),

        // Graylog config options for the node server
        // https://www.npmjs.com/package/gelf-pro#configuration
        // graylog: {},

        // Directory to output compiled JavaScript modules
        publicDir: "public",

        // Path to your source JavaScript files
        sourceDir: "src",

        // config options for the app server
        appServer: {
            // One of "http2" | "https" | "http"
            protocol: "http2",

            // App server hostname
            // Note: this should be a public facing domain
            hostname: "localhost",

            // App server port
            port: 3000,

            // number to limit the max number of CPU's
            // to spin up on a cluster
            maxClusterCpuCount: Infinity, // Infinity === as many CPU's as the machine has

            middleware: [
                // EXAMPLE: sample server-only api route.
                //
                // function(app, wildcatConfig) {
                //     app.use(route.get("/react-wildcat-server-only-example", function* () {
                //         this.body = "Hello from the server world!";
                //     }));
                // }
            ],

            // A key/value of urls to proxy
            // e.g. /static -> http://example.com/static
            proxies: {},

            // Only applicable when protocol is one of http2 / https
            // https://github.com/indutny/node-spdy#options
            secureSettings: {
                // Provide your own key / cert / ca
                key: defaultServerKey,
                cert: defaultServerCert,
                ca: defaultServerCA,

                // If using http2, use the following protocols
                protocols: [
                    "h2",
                    "spdy/3.1",
                    "spdy/3",
                    "spdy/2",
                    "http/1.1",
                    "http/1.0"
                ]
            }
        },

        // config options for the static server
        staticServer: {
            // An array of domains to allow for cross-origin requests
            corsOrigins: [
                "localhost"
            ],

            // One of "http2" | "https" | "http"
            protocol: "http2",

            // Static server hostname
            // Note: this should be a public facing domain
            hostname: "localhost",

            // Static server port
            port: 4000,

            // number to limit the max number of CPU's
            // to spin up on a cluster
            maxClusterCpuCount: Infinity, // Infinity === as many CPU's as the machine has

            // Only applicable when protocol is one of http2 / https
            // https://github.com/indutny/node-spdy#options
            secureSettings: {
                // Provide your own key / cert / ca
                key: defaultServerKey,
                cert: defaultServerCert,
                ca: defaultServerCA,

                // If using http2, use the following protocols
                protocols: [
                    "h2",
                    "spdy/3.1",
                    "spdy/3",
                    "spdy/2",
                    "http/1.1",
                    "http/1.0"
                ]
            }
        }
    }
};
```
