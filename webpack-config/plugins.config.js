/**
 * Created by wlj on 2017/10/20 14:09.
 * dependent:
 * function:
 */
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let AssetsPlugin = require('assets-webpack-plugin');
let WebpackNotifierPlugin = require('webpack-notifier');
let StatsPlugin = require('stats-webpack-plugin');
let path = require('path');
let  dllUtil=require('./dllUtil');
let env=process.env.NODE_ENV;

let production = process.env.NODE_ENV === 'production';
let pluginsConfig=[];
/* 全局shimming */
pluginsConfig.push(new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery',
    Vue: 'vue',
    vue: 'vue',
}));

pluginsConfig.push(new webpack.HashedModuleIdsPlugin());
pluginsConfig.push(new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: '"production"'
    },
    IS_DEV: JSON.stringify(env),
}));
pluginsConfig.push(new AssetsPlugin({
    path: path.resolve('public/dist'),
    filename: 'manifest.json',
    prettyPrint: true
}));
pluginsConfig.push(new ExtractTextPlugin({
    filename:'css/[name].css?v=[chunkhash]',
}));
pluginsConfig.push(new WebpackNotifierPlugin({
    title: '车快快',
    alwaysNotify: true,
    contentImage: './../logo.png'
}));
if(env==="analyse")
    pluginsConfig.push( new StatsPlugin('stats.json', {
        chunkModules: true,
        exclude: [/node_modules[\\\/]vue/],
        profile: true
    }));
if(env==='hot'){
    pluginsConfig.push(new webpack.HotModuleReplacementPlugin());
}
if(production){
    pluginsConfig.push(new webpack.optimize.UglifyJsPlugin({
        parallel:true,
        uglifyOptions:{
            output:{
                beautify:false,
                comments:false,
            },
            mangle:{
                // 跳过这些
                except: ['$super', '$', 'exports', 'require']
            },
            compress: {
                warnings:true,//在UglifyJs删除没有用到的代码时不输出警告
                drop_console:true,
                drop_debugger: true,
            },
        }
    }));
    pluginsConfig.push(new webpack.optimize.AggressiveMergingPlugin());
}
pluginsConfig.push(new webpack.optimize.ModuleConcatenationPlugin());
pluginsConfig=pluginsConfig.concat(dllUtil.getDLLPlugins());
module.exports = pluginsConfig;