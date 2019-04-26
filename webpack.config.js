var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    resolve: {
        extensions: ['*' , '.js' , '.jsx' , '.json']
    },
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                title: "Environment",
                template: path.resolve(__dirname, 'src', 'index.html')
            })
    ],
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules:  [
            {
                test: /(\.js|\.jsx)$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                }
            },
            {
                test: /(\.scss|\.css|\.sass)$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    }
};