/**
 * Arquivo: Usuario.Routes.js
 * Descrição: Funções do Modelo de Usuario
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

/**
 * Retorna todos os Usuários da Base
 * @param req
 * @param res
 */

var
  model = require('./UsuarioModel'),
  newUser = require('./UsuarioNew'),
  login = require('./UsuarioLogin');

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
 * Atualiza os Dados de Um usuário
 * @param req
 * @param res
 */
var updateUser = function(req, res) {

  //Primeiro: Para atualizarmos, precisamos primeiro achar o Usuario. Para isso, vamos selecionar por id:
  model.findById(req.params.usuario_id, function(error, usuario) {

    if (error) return res.status(400).json(error);

    if (!usuario) return res.status(404).json({message: 'usuario não encontrado'});

    //Segundo: Diferente do Selecionar Por Id... a resposta será a atribuição do que encontramos na classe modelo:
    usuario.username = req.body.username;
    usuario.password = req.body.password;
    usuario.email = req.body.email;
    usuario.updated = Date.now();

    //Terceiro: Agora que já atualizamos os campos, precisamos salvar essa alteração....
    // Utilizando 'save' para manter o funcionameto dos Hooks pre e post
    usuario.save(function(error) {
      if(error)
        return res.status(400).send(error);

      res.json({ message: 'Usuário ' + usuario.username + ' foi Atualizado!', data: usuario  });
    });
  });

};

/**
 * Remove um registro da base
 * @param req
 * @param res
 */
var delUser = function(req, res) {
  var conditions = {
    _id: req.params.usuario_id
  };

  var callback = function(error, doc, result) {

    if (error) res.status(400).json(error);

    var result = {
      message: (doc) ? 'Usuário excluído com Sucesso!' : 'Usuário não encontrado',
      data: doc,
      result: result
    };

    res.json(result);
  };

  model.findOneAndRemove(conditions, callback);
};

module.exports = {
  list: getAllUsers,
  login: login,
  new: newUser,
  remove: delUser,
  update: updateUser
};