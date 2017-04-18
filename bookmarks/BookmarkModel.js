/**
 * Arquivo: Bookmark.Model.js
 * Descrição: Config do Modelo de Favorito
 * Author: Fabio de Assis
 * Data de Criação: 18/04/2017
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validators = require('./../utils/validators');

/**
 * Modelo de Usuário
 */
var BookmarkSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: true
    },
    updated: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('Bookmark', BookmarkSchema);