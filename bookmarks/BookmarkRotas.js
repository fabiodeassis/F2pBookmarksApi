/**
 * Arquivo: Bookmark.Routes.js
 * Descrição: Funções do Modelo de Usuario
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */


var
  model = require('./BookmarkModel'),
  utils = require('./../utils/Utils');


/**
 * Adiciona um novo Bookmark
 * @param req
 * @param res
 */
var newBookmark = function(req, res){

  var
    actualUser = utils.getActualUserId(req,res),

    data = new model({
      userid: actualUser,
      name: req.body.name,
      url: req.body.url
    });

  data.save(function(err) {
    if (err) {
      res.status(400).json(err);
    }
    else {
      res.json({message: 'Bookmark gravado com sucesso!', data: data});
    }
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
function getById(req, res) {

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

  if (utils.isAdmin(req, res) || utils.isOwner(req,res)) {

    //Primeiro: Para atualizarmos, precisamos primeiro achar o Usuario. Para isso, vamos selecionar por id:
    model.findById(req.params.usuario_id, function (error, usuario) {

      if (error) return res.status(400).json(error);

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
    return res.status(401).json({message: 'Acesso nagado!'});
  }

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
  new: newBookmark
};
