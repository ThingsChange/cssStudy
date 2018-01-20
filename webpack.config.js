let path = require('path');
let utils = require('./webpack-config/utils');
let env=process.env.NODE_ENV;
let production = env === 'production';
let publicPath='/dist/';
let watchPort='3000';//可以自己配置，但是请勿提交
if (env==='hot') publicPath = "http://"+utils.getIPAdress()+":"+watchPort+"/";
let entry = {
    'layout/web': './js/web/layout/web.js',
    'index/index': './js/web/index/new.index.js',
    'shangcheng/index': './js/web/shangcheng/index.js',
    'shangcheng/goodsDetail': './js/web/shangcheng/goodsDetail.js',
    'shangcheng/goodsInCart': './js/web/shangcheng/goodsInCart.js',
    'shangcheng/confirmOrder':'./js/web/shangcheng/confirmOrder.js',
    'download/index': './js/web/download/download.js',
    'staging/index': './js/web/staging/index.js',
    'serviceStore/detail':'./js/web/serviceShop/serviceStoreDetail.js',
    'calculator/index': './js/web/calculator/index.js',
    'aboutUs/index': './js/web/aboutUs/aboutUsCommon.js',
    'feedback/index': './js/web/static/shakeFeedback/index.js',  //摇一摇意见反馈

    'companyCenter/service/introduction': './js/web/companyPage/companyService/index.js',  //账号管理中心
    'companyCenter/index': './js/web/companyCenter/index/index.js',
    'companyCenter/company/info': './js/web/companyCenter/company/info.js',
    'companyCenter/company/shop': './js/web/companyCenter/company/shop.js',
    'companyCenter/company/security': './js/web/companyCenter/company/security.js',
    'companyCenter/company/message': './js/web/companyCenter/company/message.js',

    'companyCenter/carStag/noOpen': './js/web/companyCenter/carStag/noOpen.js',  //轿车普通分期
    'companyCenter/carStag/create': './js/web/companyCenter/carStag/create.js',
    'companyCenter/carStag/order': './js/web/companyCenter/carStag/order.js',

    'companyCenter/carStagAll/noOpen': './js/web/companyCenter/carStagAll/noOpen.js',  //轿车全额质押
    'companyCenter/carStagAll/create': './js/web/companyCenter/carStagAll/create.js',
    'companyCenter/carStagAll/order': './js/web/companyCenter/carStagAll/order.js',

    'companyCenter/byStag/noOpen': './js/web/companyCenter/byStag/noOpen.js',   //养车分期
    'companyCenter/byStag/create': './js/web/companyCenter/byStag/create.js',
    'companyCenter/byStag/order': './js/web/companyCenter/byStag/order.js',
    'companyCenter/byStag/upload': './js/web/companyCenter/byStag/upload.js',

    'companyCenter/childAccount/childAccount': './js/web/companyCenter/childAccount/childAccount.js',  //子账号
    'companyCenter/childAccount/department': './js/web/companyCenter/childAccount/department.js',

    'shareOrder/index': './js/web/active/shareOrder/shareOrder.js', //活动页开始
    'nationalDay/index': './js/web/active/nationalDay/index.js',  //2017双节活动页

    'mobile/mobile': './vue/mobile/mobile.js', //移动端

    'admin/admin': './vue/admin/admin.js' //运营后台


};
const commonConfig = {
    context: path.resolve('resources/assets'),
    entry: entry,
    output: {
        path: path.join(__dirname, 'public/dist'),
        filename: 'js/[name].js?v=[chunkhash]',
        publicPath: publicPath,
        chunkFilename: 'js/[name].js?v=[chunkhash]',
    },
    module: {
        rules: require('./webpack-config/fileLoader.config'),
    },
    resolve: {
        unsafeCache: true,
        extensions: ['*', '.js', '.jsx', '.vue'],
        alias: {
            'art-template': 'art-template/dist/template.js',
            'flexslider': path.resolve(__dirname, 'resources/assets/js/web/common/jquery.flexslider.js'),
            'ckk': path.resolve(__dirname, 'resources/assets/js/web/common/newCommonConfig.js'),
            'ckkValidate': path.resolve(__dirname, 'resources/assets/js/web/public/jquery.validate.method.js'),
            'ckk-jquery-dialog': path.resolve(__dirname, 'resources/assets/js/web/public/jquery.dialog.js'),
            'carSelectPanel':path.resolve(__dirname,'resources/assets/js/web/common/carSelectPanel.js'),
            'commonDir':path.resolve(__dirname,'resources/assets/js/web/common'),
            'imgWebDir':path.resolve(__dirname,'resources/assets/images/web'),
            'sassWebDir':path.resolve(__dirname,'resources/assets/sass/web')
        }
    },
    plugins:require('./webpack-config/plugins.config.js'),
    devtool: production ? '':'cheap-module-eval-source-map'
};
const productionConfig = () => commonConfig;
const developmentConfig = () => commonConfig;


const hotConfig = () => {
    const config = {
        output: {
            path: path.join(__dirname, 'public/dist'),
            filename: 'js/[name].js',
            publicPath: publicPath,
            chunkFilename: 'js/[name].js',
        },
        devServer:{
            hot:true,//这将启用热重载
            inline:true,//使用hmr
            overlay: false, // display errors as browser-overlay
            // hotOnly:true,
            quiet: false,
            host:utils.getIPAdress(),
            port:3000,
            compress:true,
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Method':'POST,GET'
            },
            contentBase:path.join(__dirname,"public"),// should指向laravel公用文件夹
            watchOptions:{
                poll:false //需要宅基地/流浪者设置
            }
        },
    };

    return Object.assign({}, commonConfig, config);
};
module.exports = type=>{
    type=env;
    if(env==='hot'){
        return hotConfig();
    }else{
        return commonConfig;
    }
}

