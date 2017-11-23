module.exports = {
    entry: "./app/js/main.js",
    output: {
        path: __dirname,
        filename: "build/main.bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"}
        ]
    }
};
