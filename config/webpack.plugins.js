const path = require('path');
const glob = require('glob');

const webpack = require('webpack');
const cssnano = require('cssnano');

const WebpackBar = require('webpackbar');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const FaviconsPlugin = require('favicons-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const config = require('./site.config');

const hmr = new webpack.HotModuleReplacementPlugin();
const clean = new CleanWebpackPlugin();

const stylelint = new StylelintPlugin({
    fix: true
});

const webpackBar = new WebpackBar({
    color: '#FFA500'
});

const generatePaths = () => glob.sync(path.join(config.root, config.paths.src, 'pages', '*.hbs')).map((dir) => {
    const paths = [];
    const filename = path.basename(dir);

    if (filename !== '404.hbs') {
        paths.push(`${path.parse(filename).name}.html`);
    }

    return paths;
});

const htmlPlugin = new HtmlPlugin({
    title: config.site_name,
    template: path.join(config.root, config.paths.src, "layout.hbs")
});


const robots = new RobotstxtPlugin({
    sitemap: `${config.site_url}/sitemap.xml`,
    host: config.site_url
});

const sitemap = new SitemapPlugin(
    config.site_url,
    generatePaths(),
    {
        priority: 1.0,
        lastmodrealtime: true
    }
);

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

const favicons = new FaviconsPlugin({
    logo: config.favicon,
    prefix: 'images/favicons/',
    favicons: {
        appName: config.site_name,
        appDescription: config.site_description,
        developerName: null,
        developerURL: null,
        icons: {
            favicons: true,
            android: true,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            firefox: false,
            windows: false,
            yandex: false,
        },
    },
});

module.exports = [
    config.env === 'development' && hmr,
    clean,
    stylelint,
    webpackBar,
    htmlPlugin,
    config.env === 'production' && robots,
    config.env === 'production' && sitemap,
    config.env === 'production' && optimizeCss,
    extractCss,
    favicons
].filter(Boolean);