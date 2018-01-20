/**
 * Created by wlj on 2017/10/19 15:44.
 * dependent:
 * function:
 */
var path = require('path');
var distPath='./public/dist';
var resoursePath="resources/views";
module.exports={
    config:{
        dllPath:{
            config:path.join(__dirname, '..',distPath,'js/admin'),
            dir:'dist/js/admin'
        },
        pagePath:{
            config:path.join(__dirname,'..',resoursePath)
        },
        context:__dirname
    },
    getIPAdress(){
    let interfaces = require('os').networkInterfaces();
    for(let devName in interfaces){
        let iface = interfaces[devName];
        for(let i=0;i<iface.length;i++){
            let alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}
};