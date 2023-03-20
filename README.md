# boti-github-test

Essa plicação é repensável por buscar repositórios no Github filtrando por linguagem de programação e ordenado pelos seus destaques (stargazers count), após encontrar, os dados são armazenados no banco de dados. Além de armazenar, disponibilizamos algumas rotas para consulta.

Link da documentação das rotas: http://localhost:1107/api-docs/



## Instalação

1. Clone o repositório:

```sh
git clone https://github.com/jamesgomes/boti-github-test/
```

2. Instale as dependências:

```sh
npm install
```


3. Configure as variáveis de ambiente no arquivo `.env`:

```sh
PORT=1107
MONGODB_URI=mongodb://localhost:27017/boti-github-test
GITHUB_URL=https://api.github.com/
SERVICE_URL=http://localhost:1107
API_DEFAULT_PASSWORD=senha
GITHUB_LANGUAGES=csharp, python, php, ruby, go
```
4. Testes:

```sh
npm run test
```

5. Inicie o servidor:
```sh
npm start
```
6. URL da aplicação e documentação:

```sh
http://localhost:1107/
http://localhost:1107/api-docs/
```


## Pacotes utilizados

- **axios**: Cliente HTTP baseado em promessas para fazer requisições para a API do GitHub.
- **cors**: Middleware para habilitar o Cross-Origin Resource Sharing (CORS) na API.
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.
- **express**: Framework web para Node.js.
- **helmet**: Conjunto de middleware para adicionar camadas extras de segurança à API.
- **mongodb**: Driver oficial do MongoDB para Node.js.
- **node-color-log**: Pacote para colorir logs no console.
- **passport**: Middleware de autenticação para Node.js.
- **passport-http-bearer**: Estratégia de autenticação do Passport para autenticar usuários através de tokens Bearer.
- **sha256**: Pacote para calcular o hash SHA-256 de uma string.
- **swagger-ui-express**: Pacote para gerar a documentação da API no formato Swagger UI.

### Pacotes de desenvolvimento

- **chai**: Framework de asserção para testes em JavaScript.
- **chance**: Biblioteca para gerar dados aleatórios em testes automatizados.
- **depcheck**: Ferramenta para verificar dependências não utilizadas em um projeto.
- **eslint**: Ferramenta para análise de código JavaScript.
- **eslint-config-airbnb-base**: Conjunto de regras do ESLint baseado nas práticas de desenvolvimento do Airbnb.
- **eslint-plugin-import**: Plugin do ESLint para verificar declarações de importação/exportação em arquivos JavaScript.
- **mocha**: Framework de testes para Node.js.
- **nock**: Biblioteca para simular respostas de requisições HTTP em testes automatizados.
- **nyc**: Ferramenta para gerar relatórios de cobertura de testes em JavaScript.
- **sinon**: Biblioteca para criar mocks e stubs em testes automatizados.
- **supertest**: Biblioteca para testar APIs HTTP em Node.js.