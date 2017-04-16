/**
 * Arquivo: Usuario.Login.js
 * Descrição: Config do Modelo de Login
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var Usuario = require('./UsuarioModel');
var jwt = require('jwt-simple');
var moment = require('moment');
var segredo = 'seusegredodetoken';

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

    //2
    console.log(36, user);
    user.verificaSenha(password, user.password, function(isMatch) {

      if (!isMatch) {
        return res.status(401).json("Senha inválida para o usuário" + user.username);
      }

      //3
      var expires = moment().add(7,'days').valueOf();
      var token = jwt.encode({
        iss: user.id,
        exp: expires
      }, segredo);

      //4
      return res.json({
        token : token,
        expires: expires,
        user: user.toJSON()
      });

    });
  });
};