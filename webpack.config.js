var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    resolve: {
        extensions: ['*' , '.js' , '.jsx' , '.json']
    },
    entry: {
        app: './src/js/index.js',
        // table: './src/js/main.js'
        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                title: "login",
                template: path.resolve(__dirname, 'src', 'index.html'),
                // filename: './index.html',
                // chunks: ['app']
            }),
            // new HtmlWebpackPlugin({
            //     title: "table",
            //     template: path.resolve(__dirname, 'src','table.html'),
            //     filename: './table.html',
            //     chunks: ['table']
            // })
    ],
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules:  [
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'link:href']
                    }
                }
            },
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
                    'file-loader',
                    // 'url-loader'
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