// config/index.js
// Something to do with environments. Not sure yet.

module.exports = {
    secret: process.env.NODE_ENV === 'production'? process.env.SECRET: 'secret'
};