'use strict'
const merge = require('webpack-merge')
// const prodEnv = require('./prod.env')
const sitEnv = require('./sit.env')

module.exports = merge(sitEnv, {
  NODE_ENV: '"development"'
})
