/**
 * Created by wlj at 2017/11/14.
 * dependent:
 * function:
 */
var path = require('path'),
    fs = require('fs'),
    util = require('./utils'),
    entry = require('./entry'),
    colors = require('colors'),
    config = util.config;
let production = process.env.NODE_ENV;
    var shell = require('shelljs');
    let isChanged=false;
    require('shelljs/global');
    function compareVersion(isExists) {
        let dllPath = config.dllPath;
        let entryMap = {};
        let lastChunksVersion;
        if(isExists){
            lastChunksVersion = JSON.parse(fs.readFileSync(path.join(dllPath.config, 'chunk-version.json'), 'UTF-8'));
        }else{
            console.log('在此前未曾生成过dll文件历史版本，请编译dll类库'.yellow);
            isChanged=true;
        }

        for (let key in entry.libEntry) {
            let chunksList=entry.libEntry[key];
            let chunkVersion={};
            for(let index=0;index<chunksList.length;index++){
                let chunkPath=path.join(__dirname,'../node_modules',chunksList[index])
                let Index=path.join(__dirname,'../node_modules',chunksList[index]).indexOf('/dist/');
                if(Index>-1){
                    chunkPath=path.join(__dirname,'../node_modules',chunksList[index]).slice(0,Index)
                }
                let result=JSON.parse(fs.readFileSync(path.join(chunkPath,'package.json')));
                chunkVersion[result['name']]=result['version'];
                if (isExists) {
                    let flag = lastChunksVersion[key]&&lastChunksVersion[key][result['name']] === result['version'];
                    if (!flag) {
                        isChanged = true
                    }
                }
            }
            entryMap[key]=chunkVersion;
        }
        return entryMap;
    }
 function getDllChunksVersion(){
    let dllPath = config.dllPath;
     let entryMap = {};
     fs.exists(path.join(dllPath.config, 'chunk-version.json'), function (exitsts) {
         entryMap=compareVersion(exitsts);
         if(isChanged){
             console.log('准备编译dll类库，waitting...'.green);
             shell.exec('npm run dll')
             console.log('编译dll类库完毕，现将各模块版本信息写入chunk-version.json中...'.green);
             fs.writeFileSync(path.join(dllPath.config, 'chunk-version.json'),JSON.stringify(entryMap));
         }else{
             console.log('引入的dll类库并未发生版本变更，飞过...'.green);
         }
         console.log('开始编译业务代码，waitting...'.green);
         shell.exec('npm run '+production)
    })
}
getDllChunksVersion();