module.exports = [
    {
        script: 'dist/main.js',
        name: 'maplanet-nest-app',
        exec_mode: 'cluster',
        instances: 2,
    },
];