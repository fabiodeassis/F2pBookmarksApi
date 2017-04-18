/**
 * Arquivo: server.js
 * Descrição: Config da Aplicacao
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var
  express     = require('express'),
  app         = express(),
  bodyParser  = require('body-parser'),
  mongoose    = require('mongoose'),
  jwt         = require('jwt-simple'),
  dbUrl       = 'mongodb://f2pbookmarks:123qwe@ds011705.mlab.com:11705/f2pbookmarks',
  port        = process.env.PORT || 8080,
  router      = express.Router(),
  Users       = require('./usuario/UsuarioRotas'),
  about       = require('./about/AboutModel'),
  isLogged    = require('./utils/JwtValidator');


/** Definindo um Middleware para interceptar todas as chamadas para a api */
router.use(function(req, res, next) {
  // TODO Interceptar e logar dados das chamadas para analise posterior
  // console.log("Request: ", req);
  // console.log("Response: ", res);
  next(); // Seguindo para a próxima rota
});


/**
 * Configuração da variável 'app' para usar o 'bodyParser()'.
 * Permitirá retornar os dados a partir de um POST
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Definindo a Base da Url */
app.use('/api', router);

/* Dados sobre a Api */
router.get('/', function(req, res) {
  res.json(about);
});

/**
 * Inserir e Listar Usuários
 */
router.route('/usuarios')
  .get(isLogged, Users.list)
  .post(Users.new);

/**
 * Gerenciar Usuários específicos
 */
// Rotas que irão terminar em '/usuarios/:usuario_id' - (servem tanto para GET by Id, PUT, & DELETE)
router.route('/usuarios/:usuario_id')

/* 3) Método: Selecionar Por Id (acessar em: GET http://localhost:8080/api/usuarios/:usuario_id) */
  .get(isLogged, Users.user)

  /* 4) Método: Atualizar (acessar em: PUT http://localhost:8080/api/usuarios/:usuario_id) */
  .put(isLogged, Users.update)

  /* 5) Método: Excluir (acessar em: http://localhost:8080/api/usuarios/:usuario_id) */
  .delete(isLogged, Users.remove);


router.route('/login')
  .post(Users.login);
/** Configurando acesso ao MongDB */
mongoose.connect(dbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info('Banco de Dados conectado');
});
app.listen(port);
console.log('conectado a porta ' + port);
