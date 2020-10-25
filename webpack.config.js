const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const CURRENT_NODE_ENV = (() => {
    if (['development', 'production'].includes(process.env.NODE_ENV)) {
        return process.env.NODE_ENV;
    } else {
        return 'development';
    }
})();

module.exports = {
    mode: CURRENT_NODE_ENV,
    devtool: 'inline-source-map',
    target: 'node',
    entry: './src/service.ts',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'index.bundle.js',
        library: 'h-apis',   // Important
        libraryTarget: 'umd',   // Important
        umdNamedDefine: true   // Important
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: CURRENT_NODE_ENV === 'development',
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}
