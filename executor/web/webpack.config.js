const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'public', 'dist'),
        publicPath: path.join(__dirname, 'public'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.vue', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [new VueLoaderPlugin()]
}
