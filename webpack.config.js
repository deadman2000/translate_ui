const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PUBLIC_PATH = '/';

module.exports = (env, argv) => {
    return {
        entry: {
            app: "./src/index.js"
        },
        output: {
            filename: 'js/[name].[hash].js',
            path: path.resolve(__dirname, 'dist'), // base path where to send compiled assets
            publicPath: PUBLIC_PATH // base path where referenced files will be looked for
        },
        devServer: {
            host: '0.0.0.0',
            useLocalIp: true,
            port: 8082,
            contentBase: path.join(__dirname, './'), // where dev server will look for static files, not compiled
            publicPath: PUBLIC_PATH, //relative path to output path where devserver will look for compiled files
            historyApiFallback: true,
            hot: true,
            open: true,
            proxy: {
                '/api': {
                    target: argv['proxy_api'],
                    secure: false,
                    changeOrigin: true
                }
            },
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            alias: {
                '@': path.resolve(__dirname, 'src') // shortcut to reference src folder from anywhere
            }
        },
        module: {
            rules: [
                {
                    // compile es6 jsx into normal ES5
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.(css)$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                    ]
                },
                {
                    test: /\.(s[ac]ss)$/i,
                    use: [
                        'style-loader', // Creates `style` nodes from JS strings
                        'css-loader', // Translates CSS into CommonJS
                        'sass-loader', // Compiles Sass to CSS
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|ico)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
                {
                    test: /\.(ttf|eot|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[hash].[ext]',
                        },
                    },
                },
                {
                    test: /\.(woff|woff2)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            name: 'fonts/[hash].[ext]',
                            limit: 5000,
                            mimetype: 'application/font-woff',
                        },
                    },
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                favicon: "./public/favicon.ico",
                filename: "index.html"
            }),
        ]
    }
}