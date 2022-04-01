const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' //установил cross-env для того чтобы NODE_ENV не ставить вручную и добавили в скрипты (dev,build..)
const isProd = !isDev
console.log('IS DEF', isDev)

const fileName = (extension) => {
    return isProd ? `[name].[chunkhash].${extension}` : `[name].${extension}`
} //hash нужен только в production mode, поэтому лучше создать функцию filename

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all' // позволяет в разные входные файлы не включать одно и то же (напр. импортить библиотеку), а просто вынести отдельным файлом в dist, если это нужно для этих неск. файлов
        }
    }
    if(isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
} // для production mode добавить минимизацию css

const cssLoaders = (extra) => {
    const loaders = [MiniCssExtractPlugin.loader, "css-loader"]
    if(extra) {
        loaders.push(extra)
    }
    return loaders
} // для минификации и не дублирования кода
 
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: fileName('js') //имя берется из entry + hash
    },
    resolve: {
        extensions: ['.js', '.json'], //можно в проекте import файлы не указывая .js .json...
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'), //в импорт можно использовать alias вместо ../../src
        }
    },
    optimization: optimization(),
    devServer: {
        port: 8080 //режим ~live server
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        ["@babel/plugin-transform-runtime"]
                    ]
                  }
                }
              }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: isProd,
        }), //создает html файл и добавляет главный скрипт в html(из dist) в dist по указанному template
        new CleanWebpackPlugin(), //чистит dist перед каждой сборкой
        new CopyWebPackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                }
            ]
        }), // для того чтобы постоянно не перекидывать файл в напр.dist можно указать, что скопировать и куда
        new MiniCssExtractPlugin({
            filename: fileName('css')
        }), //для создания отдельного файла css (вместо style-loader)
    ]
}