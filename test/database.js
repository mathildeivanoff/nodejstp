/**
 * Require module dependencies.
 * We just need the Sequelize constructor.
 */

const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize');

/**
 * Get environment config.
 */

const environment = process.env.NODE_ENV || 'development';
const config = require('./config')[environment];

/**
 * Connect to the database.
 */

const database = new Sequelize(config);

/**
 * Add models.
 */

let model;
const models = {};
const paths = {
  User: './apis/users/model.js',
  Tweet: './apis/tweets/model.js'
};

/**
 * Import every models for the ORM.
 */

_.forEach(paths, (modelFile, modelName) => {
  model = database['import'](path.join(modelFile));
  models[model.name] = model;
});

/**
 * Make associations if any.
 */

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

/**
 * Sync the database or
 * export the models.
 */

if (process.env.DB_SYNC) {
  database.sync({force: true})
    .then(() => {
      console.log('Syncing the database ...');
    })
    .catch(err => {
      throw new Error(err);
    });
} else {
  module.exports = models;
}
