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
 * Retorna todos os Bookmarks do Usuario atual
 * @param req
 * @param res
 */
var getFromUser = function(req, res) {

  var actualUser = utils.getActualUserId(req,res);

  model.find({userid:actualUser},function(err, bookmarks) {
    if (err) return res.status(500).json(error);

    res.json(bookmarks);
  });
};

var getBookmark = function(req, res){

};

/**
 * Atualiza um Bookmark
 * @param req
 * @param res
 */
var updateBookmark = function(req, res){

  model.findById(req.params.bookmarkid, function (error, bookmark) {

    if (error) return res.status(500).json(error);

    if (!bookmark) return res.status(404).json({message: 'Bookmark não encontrado'});

    if (utils.isOwner(req,res,bookmark.userid)) {
      bookmark.name = req.body.name;
      bookmark.url = req.body.url;
      bookmark.updated = Date.now();

      bookmark.save(function (error) {

        if (error) return res.status(500).send(error);

        res.json({message: 'o Bookmark ' + bookmark.name + ' foi Atualizado!', data: bookmark});

      });
    }
    else {
      return res.status(401).json({message: 'Acesso negado! Você não pode editar este Bookmark'});
    }
  });

};

/**
 * Remove um Bookmark
 * @param req
 * @param res
 */
var removeBookmark = function(req,res){

  var conditions = {
    _id: req.params.bookmarkid,
    userid: utils.getActualUserId(req,res)
  };

  var callback = function (error, doc, result) {

    if (error) res.status(400).json(error);

    var result = {
      message: (doc) ? 'Bookmark excluído com Sucesso!' : 'Bookmark não existe ou você não pode removê-lo',
      data: doc,
      result: result
    };

    res.json(result);
  };

  model.findOneAndRemove(conditions, callback);

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
  new: newBookmark,
  getFromUser: getFromUser,
  get: getBookmark,
  update: updateBookmark,
  remove: removeBookmark
};
