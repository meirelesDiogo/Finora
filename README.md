# Finora

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=230&section=header&text=Finora&fontSize=78&fontAlignY=36&animation=fadeIn&desc=Seu%20dinheiro.%20Seu%20controle.%20Sua%20vis%C3%A3o.&descSize=18&descAlignY=58" alt="Finora" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1200&color=00C897&center=true&vCenter=true&width=640&height=50&lines=Controle+suas+receitas+e+despesas;Organize+suas+finan%C3%A7as;Acompanhe+seus+objetivos;Finora%3A+suas+finan%C3%A7as+em+um+s%C3%B3+lugar" alt="Finora - Gerenciamento financeiro"/>

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge)
![Versão](https://img.shields.io/badge/versão-0.1.0-blue?style=for-the-badge)
![Licença](https://img.shields.io/badge/licença-MIT-green?style=for-the-badge)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Objetivos](#-objetivos)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 📖 Sobre o projeto

O **Finora** é um sistema de gerenciamento financeiro pessoal desenvolvido com o objetivo de proporcionar uma maneira simples, organizada e intuitiva de controlar as finanças.

A plataforma tem como proposta permitir que os usuários registrem receitas e despesas, organizem suas movimentações financeiras, acompanhem seus gastos e planejem seus objetivos por meio de dashboards, gráficos e relatórios.

Com uma interface moderna e uma estrutura preparada para evolução, o Finora busca transformar o controle financeiro em uma experiência mais acessível e eficiente.

<div align="center">

**Registrar → Organizar → Analisar → Planejar**

</div>

## 🎯 Objetivos

- Facilitar o controle diário de receitas e despesas.
- Proporcionar maior visibilidade sobre os gastos.
- Organizar movimentações por categorias e períodos.
- Auxiliar no planejamento financeiro pessoal.
- Permitir o acompanhamento de metas e objetivos.
- Oferecer uma experiência intuitiva, responsiva e segura.

---

## ✨ Funcionalidades

O Finora oferece cadastro e login, painel mensal, registro e consulta de receitas e despesas, categorias personalizadas, projetos, relatórios com gráficos e exportação mensal em CSV.

### Funcionalidades disponíveis

- 💵 **Receitas e despesas:** cadastro, consulta por mês, filtros, edição e exclusão de movimentações.
- 🗂️ **Categorias personalizadas:** organização de receitas e despesas.
- 📊 **Painel:** saldo, receitas, despesas e movimentações recentes.
- 🎯 **Projetos:** agrupamento de movimentações e totais por objetivo.
- 📈 **Relatórios:** comparação mensal, despesas por categoria e exportação CSV.
- 🔐 **Autenticação:** cadastro, login, senha protegida e sessão segura.

### Próximas funcionalidades

Contas bancárias, metas, orçamentos, recorrências, parcelamentos e importação de dados permanecem no roadmap.

---

## 🛠️ Tecnologias

O Finora utiliza tecnologias modernas para desenvolver uma aplicação Full Stack, com foco em organização, desempenho, segurança e escalabilidade.

### Linguagens

<div align="center">

<img src="https://skillicons.dev/icons?i=js,html,css" alt="JavaScript, HTML5 e CSS3"/>

</div>

### Stack tecnológica

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,react,nodejs,tailwind,postgres,prisma,docker,git,github" alt="Tecnologias do Finora"/>

</div>

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Linguagem principal | JavaScript | Desenvolvimento Full Stack |
| Estrutura | HTML5 | Estruturação das páginas |
| Estilização | CSS3 | Estilização das interfaces |
| Framework | Next.js | Estrutura principal da aplicação |
| Biblioteca frontend | React | Construção de interfaces |
| Backend | Node.js | Execução do JavaScript no servidor |
| CSS Framework | Tailwind CSS | Estilização e responsividade |
| Banco de dados | PostgreSQL | Armazenamento das informações |
| ORM | Prisma ORM | Comunicação com o banco |
| Hospedagem do banco | Neon | PostgreSQL na nuvem |
| Gráficos | Recharts | Visualização de dados financeiros |
| Autenticação | bcryptjs e cookies seguros | Proteção de senhas e sessões |
| Versionamento | Git e GitHub | Controle de versão |
| Containerização | Docker | Ambiente de desenvolvimento |
| Deploy | Vercel | Hospedagem da aplicação |

---

## ✅ Pré-requisitos

Antes de executar o projeto, será necessário ter instalado:

- [Node.js](https://nodejs.org/) — versão LTS.
- [Git](https://git-scm.com/).
- [Visual Studio Code](https://code.visualstudio.com/).
- Uma conta no [Neon](https://neon.com/) para o banco de dados PostgreSQL.

O Docker poderá ser utilizado posteriormente para configurar um ambiente local de desenvolvimento.

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MeirelesDiogo/finora.git
```

### 2. Entre na pasta do projeto

```bash
cd finora
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Copie `.env.example` para `.env` e configure a conexão PostgreSQL e uma chave de sessão própria.

### 5. Prepare o banco

```bash
npm run db:setup
```

O comando cria as tabelas, os índices e a view do schema Finora. Pode ser executado novamente com segurança.

### 6. Inicie a aplicação

```bash
npm run dev
```

### 7. Acesse no navegador

```text
http://localhost:3000
```


---

## ⚙️ Configuração

O projeto utiliza variáveis de ambiente para armazenar configurações sensíveis e informações de conexão.

Exemplo de configuração:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host:5432/banco?sslmode=require"
SESSION_SECRET="uma-chave-aleatoria-longa-e-secreta"
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão com o PostgreSQL |
| `SESSION_SECRET` | Chave aleatória com pelo menos 32 caracteres para assinar as sessões |

> 🔒 Nunca compartilhe seu arquivo `.env` ou envie informações sensíveis para o GitHub. Utilize o `.gitignore` para impedir que esses arquivos sejam versionados.

O Finora usa `DATABASE_URL` nas rotas e no Prisma. Em uma hospedagem, configure as variáveis no painel do serviço e publique novamente a aplicação.

---

## 📂 Estrutura do projeto

A estrutura atual segue a arquitetura do Next.js com App Router:

```text
finora/
│
├── prisma/
│   ├── schema.prisma
│   └── schema.sql
├── scripts/
│   └── setup-db.mjs
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── cadastro/
│   │   ├── categorias/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── projetos/
│   │   ├── relatorios/
│   │   ├── transacoes/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/
│   └── lib/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

---

## 🗺️ Roadmap

O desenvolvimento do Finora será dividido em etapas para facilitar a implementação e evolução do sistema.

- [x] Definição da proposta e do escopo inicial.
- [x] Definição da stack tecnológica.
- [x] Configuração inicial do Next.js.
- [x] Configuração do PostgreSQL e Prisma.
- [x] Modelagem do banco de dados.
- [x] Cadastro e autenticação de usuários.
- [x] Gerenciamento de receitas e despesas.
- [x] Gerenciamento de categorias.
- [ ] Gerenciamento de contas financeiras.
- [x] Painel financeiro.
- [x] Gráficos e indicadores.
- [x] Gerenciamento de projetos financeiros.
- [ ] Orçamentos e limites de gastos.
- [ ] Metas financeiras.
- [ ] Transações recorrentes e parcelamentos.
- [x] Relatórios financeiros e exportação CSV.
- [ ] Importação de dados.
- [ ] Tema claro e escuro.
- [ ] Testes e melhorias de segurança.
- [ ] Publicação da aplicação.

### Futuras possibilidades

- [ ] Aplicativo mobile.
- [ ] Integração bancária via Open Finance.
- [ ] Recursos de inteligência financeira.

---
## 🌐 Acesso e utilização

O Finora é um projeto desenvolvido de forma independente e disponibilizado publicamente no GitHub.

Qualquer pessoa interessada poderá acessar o código-fonte, conhecer sua implementação e utilizar o projeto conforme os termos da licença MIT.

O desenvolvimento e a evolução do sistema são conduzidos individualmente pelo autor.

### 📝 Padrão de commits

O projeto utiliza como referência o [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

| Prefixo | Finalidade |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de erros |
| `docs:` | Alterações na documentação |
| `refactor:` | Refatoração do código |
| `style:` | Alterações de formatação |
| `test:` | Testes |
| `chore:` | Manutenção do projeto |

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

---

## 👤 Autor

Desenvolvido por **Diogo Alexandre Meireles**.

- GitHub: [@MeirelesDiogo](https://github.com/MeirelesDiogo)
- LinkedIn: [Diogo Meireles](https://www.linkedin.com/in/meirelesdiogo)
- E-mail: meirelesdiogo.dev@gmail.com

---

<div align="center">

⭐ **Se o Finora despertou seu interesse, considere deixar uma estrela no repositório!**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=130&section=footer" alt="Finora"/>

</div>
