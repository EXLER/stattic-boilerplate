const path = require('path');

const config = require('./site.config');
const SourceMap = config.env !== 'production';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const handlebars = {
    test: /\.(hbs)$/i,
    use: [
        {
            loader: 'handlebars-loader',
            query: {
                extensions: '.hbs',
                partialDirs: [
                    path.join(config.root, config.paths.src, 'views', 'partials'),
                    path.join(config.root, config.paths.src, 'views', 'layouts')
                ],
                inlineRequires: '/images/'
            },
        },
    ],
};

const sass = {
    test: /\.s[ac]ss$/i,
    use: [
        config.env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        { loader: 'css-loader', options: { sourceMap: SourceMap } },
        { loader: 'postcss-loader', options: { sourceMap: SourceMap, plugins: [require('autoprefixer')] } },
        { loader: 'sass-loader', options: { sourceMap: SourceMap } },
    ],
}

const imageLoader = {
    loader: 'image-webpack-loader',
    options: {
        bypassOnDebug: true,
        gifsicle: {
            interlaced: false,
        },
        optipng: {
            optimizationLevel: 7,
        },
        pngquant: {
            quality: [0.65, 0.90],
            speed: 4,
        },
        mozjpeg: {
            progressive: true,
        },
    },
};

const images = {
    test: /\.(gif|png|jpe?g|svg)$/i,
    include: path.join(config.root, config.paths.src, "images"),
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
                outputPath: 'images/',
                esModule: false
            }
        },
        config.env === 'production' ? imageLoader : null,
    ].filter(Boolean),
};

const fonts = {
    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
    include: path.join(config.root, config.paths.src, "fonts"),
    use: [
        {
            loader: 'file-loader',
            query: {
                name: '[name].[hash].[ext]',
                outputPath: 'fonts/',
            },
        },
    ],
};

const videos = {
    test: /\.(mp4|webm)$/,
    use: [
        {
            loader: 'file-loader',
            query: {
                name: '[name].[hash].[ext]',
                outputPath: 'images/',
            },
        },
    ],
};

module.exports = [
    sass,
    images,
    fonts,
    videos,
    handlebars,
];