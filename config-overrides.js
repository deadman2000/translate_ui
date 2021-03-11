const path = require('path')

module.exports = function override(config, env) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    /*config.devServer.proxy['/api'] = {
        target: 'http://localhost:5000/',
        secure: false,
        changeOrigin: true
    }*/
    return config;
}