/**
 * Arquivo: validators.js
 * Descrição: Facilitadores de Acoes
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var
  jwt     = require('jwt-simple'),
  config  = require('./Config');
  segredo = config._SECRET_;


module.exports = {
  /**
   * Verifica se a String é um email válido
   * @param email<string>
   * @returns {boolean}
   */
  isEmail: function (email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  /**
   * Verifica se o Usuario é um Admin
   * @param req
   * @returns {*}
   */
  isAdmin: function(req,res){

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      try {

        var decoded = jwt.decode(token, segredo);

        return (decoded.ils === 0);
      }
      catch (err) {
        return res.status(401).json({message: 'Erro: Seu token é inválido', erro: err});
      }

    }
    else {
      res.status(401).json({message: 'Token não encontrado ou não informado'});
    }
  },

  /**
   * Verifica se o Usuario é dono do Conteudo
   * @param req
   * @returns {*}
   */
  isOwner: function(req,res,userid){

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      try {

        var decoded = jwt.decode(token, segredo);

        return (decoded.iss === (req.params.usuario_id || userid));
      }
      catch (err) {
        return res.status(401).json({message: 'Erro: Seu token é inválido', erro: err});
      }

    }
    else {
      return res.status(401).json({message: 'Token não encontrado ou não informado'});
    }
  },

  /**
   * Retorna o User_id do Usuario logado
   * @param req
   * @param res
   * @returns {*}
   */
  getActualUserId: function(req,res){

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      try {
        var decoded = jwt.decode(token, segredo);
        return decoded.iss;
      }
      catch (err) {
        return res.status(401).json({message: 'Erro: Seu token é inválido', erro: err});
      }

    }
    else {
      return res.status(401).json({message: 'Token não encontrado ou não informado'});
    }
  }
};