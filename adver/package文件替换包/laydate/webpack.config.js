var path = require('path');

module.exports = {
    entry: './laydate/laydate.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'laydate.js'
    },
    externals: {
        "jquery": true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(jpg|jpeg|gif|png)$/,
            use: ["url-loader?limit=12000"]
        }],
        /*
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(jpg|jpeg|gif|png)$/, loader: "url-loader?limit=12000" }
        ]
        */
    }
};
