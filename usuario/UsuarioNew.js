/**
 * Arquivo: Usuario.New.js
 * Descrição: Config para Gravar um novo usuário
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var Model = require('./UsuarioModel');

module.exports = function(req, res){
	var data = new Model({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	});

	data.save(function(err) {
		if (err) {
			res.status(400).json(err);
		}
		else {
			res.json({message: 'Novo Usuário', data: data});
		}
	});
};