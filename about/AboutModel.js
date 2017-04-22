/**
 * Arquivo: Usuario.Model.js
 * Descrição: Config do Modelo de Usuário
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

/**
 * Informações sobre a API
 *
 * TODO
 * - Mesclar com Postman
 */

var
  pjson = require('./../package.json'),
  postman = require('./../postman.json');

module.exports = {
  name: pjson.name,
  description: pjson.description,
  version: pjson.version,
  author: pjson.author,
  repository: pjson.repository,
  license: pjson.license,
  collection: postman
};