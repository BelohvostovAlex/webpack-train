const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
 
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js' //имя берется из entry + hash
    },
    resolve: {
        extensions: ['.js', '.json'], //можно import файлы не указывая .js .json...
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'), //в импорт можно использовать alias вместо ../../src
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all' // позволяет в разные входные файлы не включать одно и то же (напр. импортить библиотеку), а просто вынести отдельным файлом в dist, если это нужно для этих неск. файлов
        }
    },
    devServer: {
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html"
        }), //создает html файл и добавляет главный скрипт (dist) в dist по указанному template
        new CleanWebpackPlugin(), //чистит dist перед каждой сборкой
        new CopyWebPackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                }
            ]
        }) // для того чтобы постоянно не перекидывать файл в напр.dist можно указать, что скопировать и куда
    ]
}