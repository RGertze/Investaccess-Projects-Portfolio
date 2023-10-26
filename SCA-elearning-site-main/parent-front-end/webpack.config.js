const path = require('path');
const webpack = require('webpack');



const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");




/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
    mode: 'production',
    entry: {
        main: './src/main.ts'
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({template: 'main.html'}),
        new CompressionPlugin({
            algorithm: "gzip",
        })
    ],

    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            include: [path.resolve(__dirname, 'src'),path.resolve(__dirname,'../staff-front-end/src/components')],
            exclude: [/node_modules/]
        },
            {
                test: /.css$/,

                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",

                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                use: {
                    loader: "url-loader",
                    options: { limit: 65536, esModule: false, }
                }
            }]
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    devServer: {
        open: true,
        contentBase: './dist',
        host: 'localhost',
        port: 8082
    }
}
