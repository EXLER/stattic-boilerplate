const path = require('path');
const glob = require('glob');

const webpack = require('webpack');
const cssnano = require('cssnano');

const WebpackBar = require('webpackbar');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');

const config = require('./site.config');

const hmr = new webpack.HotModuleReplacementPlugin();
const clean = new CleanWebpackPlugin();

const stylelint = new StylelintPlugin({
    fix: true
});

const webpackBar = new WebpackBar({
    color: '#FFA500'
});

const paths = [];
const generateHTMLPlugins = () => glob.sync(path.join(config.root, config.paths.src, 'views', 'pages', '*.hbs')).map((dir) => {
    const template = path.basename(dir);
    const templateName = path.parse(template).name;

    if (templateName !== '404') {
        paths.push(`${templateName}.html`);
    }

    return new HtmlPlugin({
        title: config.site_name,
        favicon: config.favicon,
        filename: path.join(config.root, config.paths.dist, `${templateName}.html`),
        template: path.join(config.root, config.paths.src, 'views', 'pages', `${templateName}.hbs`),
        meta: {
            'description': config.site_description
        }
    });
});

const robots = new RobotstxtPlugin({
    sitemap: `${config.site_url}/sitemap.xml`,
    host: config.site_url
});

const sitemap = new SitemapPlugin(
    config.site_url,
    paths,
    {
        priority: 1.0,
        lastmodrealtime: true
    }
);

const eslint = new ESLintPlugin({
    fix: true
});

const optimizeCss = new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    canPrint: true,
    cssProcessor: cssnano,
    cssProcessorPluginOptions: {
        preset: [
            'default',
            {
                discardComments: {
                    removeAll: true
                }
            }
        ]
    }
});

const extractCss = new MiniCssExtractPlugin();

const copy = new CopyPlugin({
    patterns: [
        { from: path.join(config.root, config.paths.src, "static"), to: path.join(config.root, config.paths.dist, "static") }
    ]
})

module.exports = [
    config.env === 'development' && hmr,
    clean,
    stylelint,
    webpackBar,
    eslint,
    ...generateHTMLPlugins(),
    config.env === 'production' && robots,
    config.env === 'production' && sitemap,
    config.env === 'production' && optimizeCss,
    config.env === 'production' && copy,
    extractCss
].filter(Boolean);