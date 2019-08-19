module.exports = {
    globPatterns: [
        'build/static/css/**.css',
        'build/static/js/**.js',
        'build/static/fonts/*',
        'build/interpreter.js',
        'build/webworker.js',
        'build/index.html'
    ],
    swDest: './build/service-worker.js',
    globDirectory: '.',
    modifyURLPrefix: {
        'build/': ''
    },
    importWorkboxFrom: 'local',
    navigateFallback: 'index.html'
}
