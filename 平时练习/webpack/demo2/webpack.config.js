var path = require( 'path' ),
	ExtractTextPlugin = require( 'extract-text-webpack-plugin' ),
	webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main : './home.js',
		vendor : 'moment'
	},
	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, 'dist' )
	},
	devServer: {
		contentBase: "./public",			//本地服务器所加载的页面所在的目录
		colors: true,						//终端中输出结果为彩色
		historyApiFallback: true,			//不跳转
		inline: true						//实时刷新
	},
	// 通过样式的loader加载css文件
	module : {
		rules : [{
			test: /\.css$/,
			// use: [ 'style-loader', 'css-loader']
			use : ExtractTextPlugin.extract({
		        use: 'css-loader'
		    })
		}]
	},

	// 通过插件来引入css文件
	plugins: [
		new ExtractTextPlugin( 'styles.css' ),
		new HtmlWebpackPlugin({
			template: "index.html"
		}),
		new webpack.HotModuleReplacementPlugin()//热加载插件
	]
};