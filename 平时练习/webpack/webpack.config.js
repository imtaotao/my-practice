//var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     webpack run
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = {   
    //页面入口文件配置
    entry: {
        supersale_details : './src/html/supersale_details.html',
           refund_suggest : './src/html/refund_suggest.html',
          refund_apply_v2 : './src/html/refund_apply_v2.html',
              refundApply : './src/css/refundApply.css',
                supersale : './src/css/supersale.css',
            refundSuggest : './src/css/refundSuggest.css' 
                    
    },
    //入口文件输出配置
    output: {
                path : path.join(__dirname,'./build'),
          publicPath : './',
            filename : './html/[name].html',
       chunkFilename : "./js/[id].chunk.js",
                hash : true    
    },
    module: {
        //加载器配置
        loaders: [            
            { test: /\.js/, loader: 'jsx-loader' },           
            { test: /\.png|jpe?g|ico|bmp|gif$/, loader: "file-loader?name=images/[name]-[hash].[ext]" },
            { test: /\.html$/, loader: "html" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?name=css/[name]-[hash].[ext]") },
            { test: /\.scss$/, loader: "style!css!sass" },
            { test: /\.less$/, loader: "style!css!less" }
        ]
    },
     //插件项
    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: 'jquery',
            jQuery : 'jquery'
        }),        
        new ExtractTextPlugin("./css/[name].css"),
        new webpack.optimize.UglifyJsPlugin({   //压缩代码
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']   //排除关键字
        }), 
       
        new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
           // favicon:'favicon.ico', //favicon路径
            filename:'./html/supersale_details.html',    //生成的html存放路径，相对于 path
            template:'./src/html/supersale_details.html',    //html模板路径
            chunks: ['supersale_details.js'],
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
             }
         }),
        new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
           // favicon:'favicon.ico', //favicon路径
            filename:'./html/refund_suggest.html',    //生成的html存放路径，相对于 path
            template:'./src/html/refund_suggest.html',    //html模板路径
            chunks: ['refund_suggest.js'],
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                 removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
             }
         }),
        new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
           // favicon:'favicon.ico', //favicon路径
            filename:'./html/refund_apply_v2.html',    //生成的html存放路径，相对于 path
            template:'./src/html/refund_apply_v2.html',    //html模板路径
            chunks: ['refund_apply_v2.js'],
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                 removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
             }
         })
    ],
    //其它解决方案配置
    resolve: {
        root: 'D:/workspace/uedprojects/h5page', //绝对路径
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            AppStore : 'js/stores/AppStores.js',
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
    },
    devServer:{
        historyApiFallback:true,   //无刷新更改地址栏, 可解决路由刷新  cannot GET 问题
        hot:true,
        inline:true,
        process:true
    }
};