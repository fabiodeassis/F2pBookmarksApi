/**
 * Arquivo: Usuario.Routes.js
 * Descrição: Funções do Modelo de Usuario
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var
  model = require('./UsuarioModel'),
  jwt = require('jwt-simple'),
  validators = require('./../utils/Utils'),
  moment = require('moment'),
  config = require('./../utils/Config'),
  segredo = config._SECRET_;

/**
 * Cadastra um novo usuário
 * @param req
 * @param res
 */
var newUser = function(req, res){
  var data = new model({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  data.save(function(err) {
    if (err) {
      res.status(500).json(err);
    }
    else {
      res.json({
        message: 'Novo Usuário',
        data: {
          username: data.username,
          email: data.email
        }
      });
    }
  });
};

/**
 * Efetua o Login de uM usuário
 * @param req
 * @param res
 * @returns {*}
 */
var login = function (req, res) {

  var username = req.body.username || '';
  var password = req.body.password || '';

  if (username == '' || password == '') {
    return res.status(400).json({ message: 'Informe o nome de Usuário ou Senha'});
  }

  model.findOne({username: username}, function (err, user) {

    if (err) {
      return res.status(500).json(err);
    }

    if (!user) {
      return res.status(404).json({message:'Nenhum usuário encontrado'})
    }

    /** Verifica se o Password é igual ao do DB */
    user.verificaSenha(password, function(isMatch) {

      if (!isMatch) {
        return res.status(401).json({message:"Senha inválida para o usuário " + user.username });
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

/**
 * Retorna todos os Usuarios da Base
 * @param req
 * @param res
 */
var getAllUsers = function(req, res) {
  model.find(function(err, usuarios) {
    if (err) res.send(err);

    res.json(usuarios);
  });
};

/**
 * Retorna um usuário
 * @param req
 * @param res
 */
function getUserById(req, res) {

  model.findById(req.params.usuario_id, function(error, usuario) {
    if(error)
      return res.status(500).json(error);

    if (!usuario)
      return res.status(404).json({message:'Usuário não encontrado'});

    res.json(usuario);
  });
}

/**
 * Atualiza os Dados de Um usuário
 * @param req
 * @param res
 */
var updateUser = function(req, res) {

  if (validators.isAdmin(req, res) || validators.isOwner(req,res)) {

    //Primeiro: Para atualizarmos, precisamos primeiro achar o Usuario. Para isso, vamos selecionar por id:
    model.findById(req.params.usuario_id, function (error, usuario) {

      if (error) return res.status(500).json(error);

      if (!usuario) return res.status(404).json({message: 'usuario não encontrado'});

      //Segundo: Diferente do Selecionar Por Id... a resposta será a atribuição do que encontramos na classe modelo:
      usuario.username = req.body.username;
      usuario.password = req.body.password;
      usuario.email = req.body.email;
      usuario.updated = Date.now();

      //Terceiro: Agora que já atualizamos os campos, precisamos salvar essa alteração....
      // Utilizando 'save' para manter o funcionameto dos Hooks pre e post
      usuario.save(function (error) {
        if (error)
          return res.status(400).send(error);

        res.json({message: 'Usuário ' + usuario.username + ' foi Atualizado!', data: usuario});
      });
    });
  }
  else {
    return res.status(401).json({message: 'Acesso negado!'});
  }

};

/**
 * Remove um registro da base
 * @param req
 * @param res
 */
var delUser = function(req, res) {

  if (validators.isAdmin(req, res) || validators.isOwner(req,res)) {

    var conditions = {
      _id: req.params.usuario_id
    };

    var callback = function (error, doc, result) {

      if (error) res.status(500).json(error);

      var result = {
        message: (doc) ? 'Usuário excluído com Sucesso!' : 'Usuário não encontrado',
        data: doc,
        result: result
      };

      res.json(result);
    };

    model.findOneAndRemove(conditions, callback);
  }
  else {
    return res.status(401).json({message: 'Acesso negado!'});
  }
};

module.exports = {
  list: getAllUsers,
  login: login,
  new: newUser,
  remove: delUser,
  update: updateUser,
  user: getUserById
};
