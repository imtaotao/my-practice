const path = require( 'path' );
const htmlPlugin = require( 'html-webpack-plugin' );

module.exports = {
	entry : {
		main : './app/js/main.js',
		a : './app/js/a.js'
	},
	output : {
		filename : 'js/[name].js',
		path :　path.resolve( __dirname, './dist' ),	// 相当于不断的cd进入目录，path.join是连接
		publicPath : './'
	},
	// 服务器配置
	devServer : {
		port: 80		// 端口是80
	},
	// 插件
	plugins : [
		new htmlPlugin({
			template : './app/index.html',
			filename : 'a.html',
			inject : false,	//指定存放位置
			title : '我是 a.html',
			data : Date.now(),
			minify : {
				removeComments : true,		//删除注释
				collapseWhitespace: true	//删除空格
			}
		}),
		new htmlPlugin({
			template : './app/index.html',
			filename : 'b.html',
			inject : false,	//指定存放位置
			title : '我是 b.html',
			data : Date.now(),
			minify : {
				removeComments : false,		//删除注释
				collapseWhitespace: false	//删除空格
			}
		})
	]

}