module.exports = {
    apps: [{
        script: 'dist/main.js',
        name: 'maplanet-nest-app',
        exec_mode: 'fork',
        //instances: 'max',
        autorestart: true,
    }]
};