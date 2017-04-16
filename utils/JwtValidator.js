/**
 * Arquivo: JwtValidator.js
 * Descrição: Funcoes de Validação do JWT
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var
	model 	= require('./../usuario/UsuarioModel'),
	jwt 		= require('jwt-simple'),
	segredo = 'seusegredodetoken';

module.exports = function(req, res, next) {

	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

	if (token) {
		try {

			var decoded = jwt.decode(token, segredo);
			console.log('decodando ' + decoded);

			if (decoded.exp <= Date.now()) {
				res.status(400).json({error: 'Acesso Expirado, faça login novamente'});
			}

			model.findOne({ _id: decoded.iss }, function(err, user) {

				if (err) {
					return res.status(500).json({message: "erro ao procurar usuario do token.", details: err});
				}

				// if (!user) {
				// 	return res.status(404).json({message: "Usuário não encontrado", details: err});
				// }

				req.user = user;
				console.log('achei usuario ' + req.user);
				return next();
			});

		}
		catch (err) {
			return res.status(401).json({message: 'Erro: Seu token é inválido'});
		}

	}
	else {
		res.status(401).json({message: 'Token não encontrado ou não informado'});
	}
};