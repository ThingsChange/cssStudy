/**
 * Created by wlj on 2017/8/7 11:58.
 * dependent:
 * function:
 */
const path    = require('path'),
    webpack = require('webpack'),
    shell=require('shelljs'),
    utils = require('./webpack-config/utils'),
    config = utils.config,
    entry = require('./webpack-config/entry'),
    dllUtil=require('./webpack-config/dllUtil');

varMainfisetMap={};
shell.rm('-rf', path.join(__dirname, 'public/dist/', 'js/admin'));
module.exports = {
    entry: entry.libEntry,
    output: {
        path: path.join(__dirname, 'public/dist/','js/admin'),
        filename: '[name]_[chunkhash].dll.js',
        library: '[name]_[chunkhash]',
        chunkFilename: '[name]_[chunkhash].js',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'public/dist/', 'js/admin/[name]-manifest.json'),
            name: '[name]_[chunkhash]',
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                "warnings": false,
                drop_console:true
            }}
        ),

    ],
    node:{
        fs:'empty'
    }
};