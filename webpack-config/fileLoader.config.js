/**
 * Created by wlj at 2017/11/17.
 * dependent:
 * function:webpack 打包所需要的加载器，调整了SCSS  CSS 避免重复打包
 */
let plugins=require('./plugins.config');
const env= process.env.NODE_ENV;
let production = env === 'production';
let extract=plugins.find((n)=>{
    if(n instanceof require('extract-text-webpack-plugin')){
        return n
    }});

let createBabelOptions=(type)=>{
    let defaultOption={
        "presets": [
            "es2015",
            "stage-2"
        ],
        "plugins":[
            "transform-runtime",
            "transform-vue-jsx"
        ],
        "comments": false,
        "ignore":[
            "jquery.js",
            "jquery.min.js"
        ],
        "cacheDirectory": true
    };
    if(type==='$'){
        defaultOption["plugins"]=[];
        defaultOption["plugins"].push(["transform-runtime",{
            "helpers": false,
            "polyfill": false,
            "regenerator": true,
            "moduleName": "babel-runtime"
        }])
    }
    return defaultOption;
};

const styleLoader = (type) => {
    let cssLoader = {
        test: /\.css$/,
        use: extract.extract({
                // fallback: 'style-loader',
                use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: production,
                            sourceMap: !production,
                        }
                    },{
                        loader: "postcss-loader",
                        options: {
                            sourceMap: !production,
                            minimize: production,
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    },
                ]
            }
        )
    }
    let scssLoader={
            test: /\.scss$/,
            use: extract.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: production,
                            sourceMap: !production,
                        }
                    },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: !production,
                            }
                        }
                    ]
                }
            )
        };
    if (type==='hot'){
        cssLoader.use=['css-hot-loader'].concat(cssLoader.use);
        scssLoader.use=['css-hot-loader'].concat(scssLoader.use);
    }
    return [cssLoader,scssLoader]
};
let fileLoader=[
    /*{
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
    },*/
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders:(()=>{
            let jsLoader=[{
                loader: 'babel-loader',
                options: createBabelOptions('$'),
            }];
             if(env==='hot') jsLoader.push({loader:'webpack-module-hot-accept'});
            return jsLoader
        })()
    },
    {
        test: require.resolve('jquery'),
        loader:'exports-loader?window.jQuery!script-loader'
    },
    {
        test: /\.(png|jpe?g|gif)$/,
        loader:(()=>{
            let tempLoader=[{
                loader: 'url-loader',
                query: {
                    // 图片大小限制 单位b
                    limit: 4096,
                    // 生成的文件的存放目录
                    name: path => {
                        if (!/node_modules|bower_components/.test(path)) {
                            return 'images/[path][name].[ext]?v=[hash]';
                        }

                        return 'images/vendor/' + path
                            .replace(/\\/g, '/')
                            .replace(
                                /((.*(node_modules|bower_components))|images|image|img|assets)\//g, ''
                            ) + '?v=[hash]';
                    }
                }
            }];
            if(production){
                tempLoader=tempLoader.concat({
                    // loader: 'image-webpack-loader',//这个更狠
                    loader: 'img-loader',
                    options: {
                        gifsicle: {
                            interlaced: false,
                        },
                        mozjpeg: {
                            progressive: true,
                            quality: 90
                        },
                        optipng: false,
                        pngquant: {
                            quality: '65-90',
                            speed: 4 //约损耗2%
                        },
                        svgo: {
                            plugins: [
                                { removetitle: true },
                                { convertpathdata: false }
                            ]
                        },
                        webp: {
                            quality: 75
                        }
                    }
                })
            }
            return tempLoader;
        })()
    },
    {
        test: /\.(woff2?|ttf|eot|svg|otf)$/,
        loader: 'file-loader',
        options: {
            name: path => {
                if (!/node_modules|bower_components/.test(path)) {
                    return 'fonts/[path][name].[ext]?[hash]';
                }

                return 'fonts/vendor/' + path
                    .replace(/\\/g, '/')
                    .replace(
                        /((.*(node_modules|bower_components))|fonts|font|assets)\//g, ''
                    ) + '?[hash]';
            }
        }
    },
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /bower_components/,
        options: {
            loaders: {
                js: {
                    loader: 'babel-loader',
                    options: createBabelOptions()
                },

                scss: extract.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: production,
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                            }
                        }
                    ],
                    fallback: 'vue-style-loader'
                }),

                sass: extract.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: production,
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                indentedSyntax: true,
                            }
                        }
                    ],
                    fallback: 'vue-style-loader'
                }),

                css: extract.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: production,
                            }
                        }
                    ],
                    fallback: 'vue-style-loader'
                }),
            },
            postcss: [
                require('autoprefixer')()
            ],
            preLoaders: {},
            postLoaders: {}
        }
    }

].concat(styleLoader(env));
module.exports=fileLoader;