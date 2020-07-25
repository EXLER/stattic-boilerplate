const path = require('path');
const glob = require('glob');

const webpack = require('webpack');
const cssnano = require('cssnano');

const WebpackBar = require('webpackbar');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const config = require('./site.config');

const hmr = new webpack.HotModuleReplacementPlugin();
const clean = new CleanWebpackPlugin();
const stylelint = new StylelintPlugin();

const webpackBar = new WebpackBar({
    color: '#FFA500'
});

const paths = [];
const htmlPlugins = () => glob.sync(path.join(config.root, config.paths.src, '*.hbs')).map((dir) => {
    const filename = path.basename(dir);

    if (filename !== '404.hbs') {
        paths.push(`${path.parse(filename).name}.html`);
    }

    return new HandlebarsPlugin({
        entry: path.join(config.root, config.paths.src, "*.hbs"),
        output: path.join(config.root, config.paths.dist, "[name].html"),
        partials: [
            path.join(config.root, config.paths.src, "partials", "*.hbs")
        ],
        data: {
            site_name: config.site_name,
            site_description: config.site_description
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

/*
const favicons = new FaviconsWebpackPlugin({
    logo: config.favicon,
    prefix: 'images/favicons',
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
*/

module.exports = [
    config.env === 'development' && hmr,
    clean,
    stylelint,
    webpackBar,
    ...htmlPlugins(),
    config.env === 'production' && robots,
    config.env === 'production' && sitemap,
    config.env === 'production' && optimizeCss,
    extractCss,
    // favicons
].filter(Boolean);