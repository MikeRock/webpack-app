import webpack, { ProvidePlugin } from 'webpack'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ChunkManifestPlugin from '@codemotion/chunk-manifest-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
    entry: {
        bundle: "./src/index.js",
        vendor: ['react','redux','redux-saga','babel-polyfill']
    },
    output: {
        path: path.resolve(__dirname,'build'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['*','.js','.jsx']
    },
    module: {
        rules: [
            { test: /\.jsx?$/,
              use: 'babel-loader',
              exclude: /node_modules/
            },
            { test: /\.s?css$/,
              use: ExtractTextPlugin.extract({
                  use: 'css-loader',
                  fallback: 'style-loader'
              }),
              exclude: /node_modules/  
            }
        ]
    },
    target: 'web',
    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        new ProvidePlugin({
            React: 'react'
        }),
        new webpack.NamedChunksPlugin((chunk) => {
            if(chunk.name)
            return chunk.name
            return chunk.mapModules(module => {
                if(/html-webpack-plugin/.test(module.userRequest)) return 'html-webpack-plugin'
                return path.relative(module.context,module.userRequest).replace('.js','')
            }).reduce((acc,item) => acc.length <= 3 ? (() =>{acc.push(item); return acc})() : acc,[]).join('-')
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['manifest'],
            minChunks: Infinity,
            filename: '[name].js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: '[name].[chunkhash].js'
        }),
        new HtmlWebpackPlugin({
            title: 'Webpack',
            filename: 'index_no.html',
            injectManifest: false 
        }), 
        new ChunkManifestPlugin({
            filename: 'manifest.json',
            manifestVariable: 'webpackManifest',
            inlineManifest: true
        })


    ]
}