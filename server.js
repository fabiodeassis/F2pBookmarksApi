/**
 * Arquivo: server.js
 * Descrição: Config da Aplicacao
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

var
  express     = require('express'),
  app         = express(),
  router      = express.Router(),
  bodyParser  = require('body-parser'),
  mongoose    = require('mongoose'),
  jwt         = require('jwt-simple'),

  Users       = require('./usuario/UsuarioRotas'),
  About       = require('./about/AboutModel'),
  Bookmark    = require('./bookmarks/BookmarkRotas'),

  isLogged    = require('./utils/JwtValidator'),
  config      = require('./utils/Config');


/** Definindo um Middleware para interceptar todas as chamadas para a api */
router.use(function(req, res, next) {
  // TODO Interceptar e logar dados das chamadas para analise posterior
  // Utilizar no futuro para verificar chaves de acesso
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
  res.json(About);
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
router.route('/usuarios/:usuario_id')
  .get(isLogged, Users.user)
  .put(isLogged, Users.update)
  .delete(isLogged, Users.remove);


/**
 * Login
 */
router.route('/login')
  .post(Users.login);

/**
 * Bookmarks
 */
router.route('/bookmark')
  .get(isLogged,Bookmark.getFromUser)
  .post(isLogged,Bookmark.new);

/**
 * Gerenciar Bookmarks existentes
 */
router.route('/bookmark/:bookmarkid')
  .get(isLogged,Bookmark.get)
  .put(isLogged,Bookmark.update)
  .delete(isLogged,Bookmark.remove);

/** Configurando acesso ao MongoDB */
mongoose.connect(config._MONGODB_);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info('Banco de Dados conectado');
});

app.listen(config._PORT_);

console.info('Conectado pela porta ' + config._PORT_);
