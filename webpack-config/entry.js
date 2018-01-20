/**
 * Created by wlj at 2017/10/24.
 * dependent:
 * function:
 */
var path    = require('path');
var webpack = require('webpack');
var util=require('./utils');
var config= util.config;
module.exports={
    libEntry:{
        vueLib: ['vue','vue-router','axios','vuex','element-ui','mint-ui'],
        jqueryLib: ['jquery',
            'jquery-validation',
            'jquery-validation/dist/localization/messages_zh',
            'jquery-form',
            // './resources/assets/js/web/public/jquery.ba-resize.min.js',
            'jquery-mousewheel',
            'malihu-custom-scrollbar-plugin',
            'art-template/dist/template.js',
            'vanilla-lazyload',
            'js-cookie'
        ],
    },
    modules:{
        "index":{
            title:"CKK前台公共页面",
            path:"web/layouts",
            filename:'web.blade.php',
            dependent:['jqueryLib'],
        },
        "adminIndex":{
            title:'CKK后台管理公共页面',
            filename:'test.blade.php',
            path:"admin",
            dependent:['vueLib']
        }
    }
};