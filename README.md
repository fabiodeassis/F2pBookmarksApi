#Bookmarks API

###Baixe as dependências:
`> npm install`

###Rode o server com Node.js
`> node server.js`

Utilize o Postman para verificar as chamadas para: `http://localhost:8080/api`

As chamadas que requerem autenticação precisam do header `x-access-token` com a chave de acesso que é fornecida no login

## TODOS
* Verificar Level do Usuario e:
  - Permitir listagem completa apenas para admins
  - Permitir update de dados apenas para o próprio usuário
  - Apenas admins podem remover usuários
  - Usuários só podem remover bookmarks próprios
* CRUD de Bookmarks
* CRUD de Diretórios
* CRUD de Categorias
* Associar Bookmark ao diretório (n2one)
* Associar categoria ao bookmark (n2n)
* Centralizar texto das mensagens de validação
* Pensar Sobre:
  - Refresh Token;
  - Expirar Token;
  - Organizar arquivos por Funcionalidade ou Módulos?