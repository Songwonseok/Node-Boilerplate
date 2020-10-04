const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        app: ['./client/src/scss/app.scss','./client/src/javascripts/app.js'],
    },
    output: {
        path: path.resolve(__dirname, 'server/public/dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ]
    },plugins: [
        new CleanWebpackPlugin(),
    ]
    
}