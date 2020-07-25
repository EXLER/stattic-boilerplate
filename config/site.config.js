const path = require('path');

let ROOT = process.env.PWD;

if (!ROOT) {
    ROOT = process.cwd();
}

const config = {
    site_name: "stattic-boilerplate",
    site_description: "Boilerplate for building modern static websites with linting, templating, optimization & more!",
    site_url: 'http://localhost',

    favicon: path.join(ROOT, "src", "images", "favicon.png"),

    // Host URL for local development server
    dev_host: 'localhost',

    // Port for local development server
    port: process.env.PORT || 8000,

    // Constants
    env: process.env.NODE_ENV,
    root: ROOT,
    paths: {
        config: 'config',
        src: 'src',
        dist: 'dist'
    },
}

module.exports = config;