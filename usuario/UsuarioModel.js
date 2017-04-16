/**
 * Arquivo: Usuario.Model.js
 * Descrição: Config do Modelo de Usuário
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validators = require('./../utils/validators');

/**
 * Modelo de Usuário
 */
var UsuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validators.isEmail, 'Please fill a valid email address'],
    },
    level: {
      type: Number,
      required: true
    },
    updated: {
      type: Date,
      default: Date.now
    }
  }
);

/**
 * Verifica se houve alteração no password e encrypt em caso positivo.
 */
UsuarioSchema.pre('save', function(next) {

  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(5, function(err, salt) {

    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {

      if (err) return next(err);

      user.password = hash;
      next();

    });

  });
});

/**
 * Verifica a Senha com bcrypt
 * @param password<string>
 * @param next<any>
 */
UsuarioSchema.methods.verificaSenha = function(password, next) {

  bcrypt.compare(password, this.password, function(err, isMatch) {

    if (err) return next(err);

    next(isMatch);
  });

};

module.exports = mongoose.model('Usuario', UsuarioSchema);