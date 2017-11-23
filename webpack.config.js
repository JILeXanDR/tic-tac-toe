module.exports = {
    entry: "./app/js/main.js",
    output: {
        path: __dirname,
        filename: "build/main.bundle.js"
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["es2015", "stage-2", "stage-0"],
                        plugins: [
                            [
                                "transform-decorators-legacy",
                                "transform-class-properties",
                                "transform-async-to-generator"
                            ],
                            ["transform-runtime", {
                                "polyfill": false,
                                "regenerator": true
                            }]
                        ]
                    },
                }
            }
        ]
    }
};
