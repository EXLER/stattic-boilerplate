const path = require('path');

const WebpackBar = require('webpackbar');
const HandlebarsPlugin = require('handlebars-webpack-plugin');

const config = require('./site.config');

const webpackbar = new WebpackBar({
    color: '#e55a5e'
});

const handlebarsPlugin = new HandlebarsPlugin({
    entry: path.join(config.root, config.paths.src, "*.hbs"),
    output: path.join(config.root, config.paths.dist, "[name].html"),

    partials: [
        path.join(config.root, config.paths.src, "components", "*.hbs")
    ],
});

module.exports = [
    webpackbar,
    handlebarsPlugin
].filter(Boolean);