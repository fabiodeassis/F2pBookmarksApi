/**
 * Arquivo: Usuario.Login.js
 * Descrição: Config do Modelo de Login
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var Usuario = require('./UsuarioModel');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./../utils/Config');
var segredo = config._SECRET_;

module.exports = function(req, res) {

  var username = req.body.username || '';
  var password = req.body.password || '';

  if (username == '' || password == '') {
    return res.status(401).json({
      username: (username == '') ? 'Informe o nome de Usuário' : null,
      password: (password == '') ? 'Informe a senha' : null
    });
  }

  Usuario.findOne({username: username}, function (err, user) {

  	if (err) {
      return res.status(500).json(err);
    }

    if (!user) {
      return res.status(404).json({message:'Nenhum usuário encontrado'})
    }

    /** Verifica se o Password é igual ao do DB */
    user.verificaSenha(password, function(isMatch) {

      if (!isMatch) {
        return res.status(401).json("Senha inválida para o usuário " + user.username);
      }

      /** Cria um novo token */
      var expires = moment().add(1,'days').valueOf();
      var token = jwt.encode({
        iss: user.id,
        ils: user.level,
        exp: expires
      }, segredo);

      /** Retorna os dados */
      return res.json({
        token : token,
        expires: expires,
        user: user.toJSON()
      });

    });
  });
};