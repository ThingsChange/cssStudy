!!!!!!!以最新更新为准。
1.目前开发过程中依赖的较大的类库已经分离出去做成库依赖，并加入版本号引入了对应的页面中
  为了更大程度利用缓存，建议稳定在当前库版本，不要对这些框架、库进行版本更新；
  如有使用新功能必须更新版本，请@JS工程师，谢谢。
2.当前提取出来的，'jquery'，'vue','vue-router','axios','vuex','element-ui','mint-ui'
    jquery 包还需整理具体插件以及部分JS修改稳定版
3.                          开发环境                                                   生产环境
   第一次编译：npm run watch1 或者 npm run dll && npm run watch     npm run prod 或者npm run dll && npm run production
   库版本不更新的情况：npm run watch或者npm run dev                  npm run production
   库版本更新:npm run watch1 或者 npm run dll && npm run watch      npm run prod 或者npm run dll && npm run production



#########################################  变更   ##############################
1.回复以前的正常使用即可，会自动进行判断dll引入库是否进行变更而进一步的操作，是否打包。
npm run prod  生产模式
npm run watch 开发监听模式
npm run dev   开发模式
npm run hot   热部署模式