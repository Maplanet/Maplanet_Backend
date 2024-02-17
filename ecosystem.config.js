module.exports = {
    apps: [{
        script: 'dist/main.js',
        name: 'maplanet-nest-app',
        exec_mode: 'fork',
        //instances: 'max',
        error_file: 'logs/error.log',
        out_file: 'logs/out.log',
        autorestart: true,
    }]
};