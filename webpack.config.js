const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js',
        fragebogenauswertung: './src/fragebogenauswertung/index.js',
        nutzungsparameter: './src/nutzungsparameter/index.js',
        quizauswertung: './src/quizauswertung/index.js',
        uebungsauswertung: './src/uebungsauswertung/index.js',
        ariadne: './src/ariadne/index.js'
      },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './index.html',
          chunks: ['index']
        }),
        new HtmlWebpackPlugin({
          filename: 'fragebogenauswertung/index.html',
          template: './src/fragebogenauswertung/index.html',
          chunks: ['fragebogenauswertung']
        }),
        new HtmlWebpackPlugin({
          filename: 'nutzungsparameter/index.html',
          template: './src/nutzungsparameter/index.html',
          chunks: ['nutzungsparameter']
        }),
        new HtmlWebpackPlugin({
          filename: 'quizauswertung/index.html',
          template: './src/quizauswertung/index.html',
          chunks: ['quizauswertung']
        }),
        new HtmlWebpackPlugin({
          filename: 'uebungsauswertung/index.html',
          template: './src/uebungsauswertung/index.html',
          chunks: ['uebungsauswertung']
        }),
        new HtmlWebpackPlugin({
          filename: 'ariadne/index.html',
          template: './src/ariadne/index.html',
          chunks: ['ariadne']
        })
      ],
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};