module.exports = {
    globPatterns: [
        'build/static/css/**.css',
        'build/static/js/**.js',
        'build/interpreter.js',
        'build/webworker.js'
    ],
    swDest: './build/service-worker.js',
    globDirectory: '.',
    modifyURLPrefix: {
        'build/': ''
    }
}
