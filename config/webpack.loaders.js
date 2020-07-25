const config = require('./site.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SourceMap = config.env !== 'production';

const handlebars = {
    test: /\.(hbs)$/i,
    use: [
        {
            loader: 'handlebars-loader',
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

const js = {
    test: /\.js$/i,
    exclude: /node_modules/,
    use: [
        'eslint-loader'
    ]
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
            quality: '65-90',
            speed: 4,
        },
        mozjpeg: {
            progressive: true,
        },
    },
};

const images = {
    test: /\.(gif|png|jpe?g|svg)$/i,
    exclude: /fonts/,
    use: [
        'file-loader?name=images/[name].[hash].[ext]',
        config.env === 'production' ? imageLoader : null,
    ].filter(Boolean),
};

const fonts = {
    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
    exclude: /images/,
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
    handlebars,
    sass,
    js,
    images,
    fonts,
    videos
];