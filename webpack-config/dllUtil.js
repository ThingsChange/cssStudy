/**
 * Created by 210402 at 2017/10/24.
 * dependent:
 * function:
 */
var path = require('path'), fs = require('fs'), cheerio = require('cheerio'), webpack = require('webpack'),
    util = require('./utils'),
    entry = require('./entry'),
    config = util.config;

/**
 *  获取 key 和manifest映射集合
 * @returns {{}}
 */
function getKeyManifestMap() {
    var dllPath = config.dllPath;
    var entryMap = {};
    for (var key in entry.libEntry) {
        var obj = {
            manifset: path.join(dllPath.config, key + '-manifest.json')
        }
        obj.lib = require(obj.manifset).name + '.dll.js';
        entryMap[key] = obj;
    }
    console.log("entryMap:",entryMap);
    return entryMap;
}

/**
 * 获取 dllPlugins集合
 */
function getDLLPlugins() {
    var array = [];
    for (var key in entry.libEntry) {
        array.push(new webpack.DllReferencePlugin({
            context: path.join(__dirname,'..'),
            manifest: require(path.join(config.dllPath.config, key + '-manifest.json'))
        }));
    }
    return array;
}

/**
 * 向生成的html页面当中插入dll引用
 */
function insertDLL(oldFestMap) {
    console.log('第一次調用')
    var module, dep, scriptArray = [],
        manifestMap = getKeyManifestMap();
    for (var key in entry.modules) {

        module = entry.modules[key];
        deps = module.dependent;
        scriptArray = [];
        var isFrist=true;
        var fileName = path.join(config.pagePath.config, module.path,module.filename);
        var phpHtml=getHmtlContent(fileName);
        var $ = cheerio.load(phpHtml, {
            ignoreWhitespace: true,
            decodeEntities: false
        });
        // 生成需要插入的html//src="/dist/js/admin/vueLib.dll.js"
        console.log('+++++++++++++++++++++++++++++++++++++',$);
        console.log('------------------------------------',$.html());
        console.log("______________________",$('.loginFormButton_bak').html());
        deps.forEach(function (item, index) {
            isFrist=true;
            scriptArray.push('<script type="text/javascript" src="' + '/' + config.dllPath.dir + '/' + manifestMap[item].lib + '"></script>')
            Array.prototype.forEach.call($('script'),function (scriptTag,i) {
                if(scriptTag.attribs.src&&scriptTag.attribs.src.indexOf(item+'_')>-1){
                    $(scriptTag).replaceWith(scriptArray.join(''));
                    isFrist=false
                }
            });
            if(isFrist){
                $($('script')[0]).before(scriptArray.join(''));
            }
        });
        //更新html文件
        // console.log($.html());
        fs.writeFileSync(fileName, $.html());
    }
}

/**
 * 获取 html dom内容
 * @param path html地址
 */
function getHmtlContent(path) {
    var data = fs.readFileSync(path, 'UTF-8');
    return data;
}

module.exports = {
    getKeyManifestMap: getKeyManifestMap,
    getDLLPlugins: getDLLPlugins,
    insertDLL: insertDLL
};