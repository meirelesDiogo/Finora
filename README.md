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

O Finora oferece cadastro e login, painel mensal, registro e exclusão de receitas e despesas, categorias e projetos financeiros.

### Funcionalidades planejadas

- 💵 **Receitas e despesas:** cadastro, edição e exclusão de movimentações.
- 🗂️ **Categorias personalizadas:** organização de receitas e despesas.
- 🏦 **Contas financeiras:** gerenciamento de diferentes contas e carteiras.
- 📊 **Dashboard:** visão geral do saldo, receitas e despesas.
- 🎯 **Metas financeiras:** criação e acompanhamento de objetivos.
- 🧾 **Orçamentos:** definição de limites de gastos.
- 🔁 **Transações recorrentes:** gerenciamento de despesas e receitas periódicas.
- 📅 **Parcelamentos:** acompanhamento de compras parceladas.
- 📈 **Relatórios:** gráficos e análises financeiras por período.
- 📤 **Importação e exportação:** gerenciamento de dados financeiros.
- 🔐 **Autenticação:** cadastro, login e proteção das informações.
- 🌙 **Tema claro e escuro:** personalização da aparência da plataforma.

Os recursos de contas bancárias, metas, orçamentos, recorrências, parcelamentos e importação/exportação permanecem no roadmap.

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
| Validação | Zod | Validação de informações |
| Autenticação | Auth.js | Gerenciamento de autenticação |
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

Crie um arquivo `.env` na raiz do projeto, seguindo as instruções da seção [Configuração](#-configuração).

### 5. Inicie a aplicação

```bash
npm run dev
```

### 6. Acesse no navegador

```text
http://localhost:3000
```

Antes do primeiro acesso, crie um banco PostgreSQL e execute o script `prisma/schema.sql` nele. O cadastro e as telas financeiras usam essa estrutura.

---

## ⚙️ Configuração

O projeto utiliza variáveis de ambiente para armazenar configurações sensíveis e informações de conexão.

Exemplo de configuração:

```env
DATABASE_URL="sua_connection_string_do_postgresql"
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão com o PostgreSQL |
| `SESSION_SECRET` | Chave aleatória com pelo menos 32 caracteres para assinar as sessões |

> 🔒 Nunca compartilhe seu arquivo `.env` ou envie informações sensíveis para o GitHub. Utilize o `.gitignore` para impedir que esses arquivos sejam versionados.

---

## 📂 Estrutura do projeto

A estrutura planejada segue a arquitetura do Next.js com App Router:

```text
finora/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── cadastro/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── transacoes/
│   │   │   ├── categorias/
│   │   │   ├── contas/
│   │   │   ├── projetos/
│   │   │   └── relatorios/
│   │   │
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── dashboard/
│   │
│   ├── lib/
│   │
│   ├── services/
│   │
│   └── validations/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

> A estrutura apresentada representa a organização planejada. Diretórios e arquivos serão adicionados conforme o desenvolvimento.

---

## 🗺️ Roadmap

O desenvolvimento do Finora será dividido em etapas para facilitar a implementação e evolução do sistema.

- [x] Definição da proposta e do escopo inicial.
- [x] Definição da stack tecnológica.
- [ ] Configuração inicial do Next.js.
- [ ] Configuração do PostgreSQL e Prisma.
- [ ] Modelagem do banco de dados.
- [ ] Cadastro e autenticação de usuários.
- [ ] Gerenciamento de receitas e despesas.
- [ ] Gerenciamento de categorias.
- [ ] Gerenciamento de contas financeiras.
- [ ] Dashboard financeiro.
- [ ] Gráficos e indicadores.
- [ ] Gerenciamento de projetos financeiros.
- [ ] Orçamentos e limites de gastos.
- [ ] Metas financeiras.
- [ ] Transações recorrentes e parcelamentos.
- [ ] Relatórios financeiros.
- [ ] Importação e exportação de dados.
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
