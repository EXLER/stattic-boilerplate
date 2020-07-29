const path = require('path');

const config = require('./site.config');
const webpackLoaders = require('./webpack.loaders');
const webpackPlugins = require('./webpack.plugins');

module.exports = {
    context: path.join(config.root, config.paths.src),
    entry: [
        path.join(config.root, config.paths.src, 'stylesheets/styles.scss'),
        path.join(config.root, config.paths.src, 'javascripts/scripts.js'),
    ],
    output: {
        path: path.join(config.root, config.paths.dist),
        filename: '[name].[hash].js'
    },
    mode: ['production', 'development'].includes(config.env) ? config.env : 'development',
    devtool: config.env === 'production' ? 'hidden-source-map' : 'eval-cheap-source-map',
    devServer: {
        contentBase: path.join(config.root, config.paths.src),
        watchContentBase: true,
        hot: true,
        open: true,
        port: config.port,
        host: config.dev_host,
    },
    module: {
        rules: webpackLoaders,
    },
    plugins: webpackPlugins,
}