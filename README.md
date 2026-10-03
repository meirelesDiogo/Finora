<h1 align="center">💰 Finora</h1>

<p align="center"><strong>Seu dinheiro. Seu controle. Sua visão.</strong></p>

**Status:** 🚧 Em desenvolvimento · **Versão:** v0.1 · **Licença:** MIT

**Stack:** Next.js · React · TypeScript · Tailwind CSS · Prisma · PostgreSQL (Neon) · Auth.js

---

# 📖 Sobre o Projeto

O **Finora** é uma plataforma de **controle financeiro pessoal**. Ela permite registrar tudo o que entra e sai da sua vida financeira e acompanhar isso por meses, contas, categorias, projetos e metas, com gráficos e relatórios que mostram para onde o dinheiro está indo.

Cada mês funciona como um **período financeiro independente**, com seus próprios dados, e o sistema também compara meses entre si para mostrar sua evolução.

```text
Outubro de 2026
├── Receitas ........ R$ 3.500,00
├── Despesas ........ R$ 2.100,00
├── Saldo ........... R$ 1.400,00
└── Economizado ..... 40%
```

> **🚧 Este projeto está em desenvolvimento ativo e evolui continuamente.**
>
> O Finora não é apenas um projeto de portfólio. Ele também representa a evolução do autor como desenvolvedor: arquitetura em camadas, segurança, cálculos financeiros precisos e uma interface cuidada.

---

# ✨ Objetivos

* 📅 Tratar cada mês como um período financeiro independente.
* 💸 Registrar receitas e despesas de forma rápida e organizada.
* 🏦 Separar o dinheiro por contas (Nubank, Inter, carteira...).
* 🏷️ Classificar tudo por categorias personalizáveis.
* 🧳 Agrupar gastos de viagens, compras e eventos em projetos.
* 📐 Controlar gastos com orçamentos mensais por categoria.
* 🎯 Acompanhar metas financeiras com progresso visual.
* 📑 Gerar relatórios mensais claros e comparáveis.
* 🔒 Garantir que cada usuário acesse apenas os próprios dados.

---

# 🧩 Funcionalidades

| | Funcionalidade | O que faz |
|---|---|---|
| 📊 | **Dashboard** | Saldo, receitas, despesas e economia do mês, com comparação em relação ao mês anterior e gráficos de evolução. |
| 📅 | **Controle mensal** | Seletor de mês para navegar entre períodos, cada um com seus próprios números. |
| 💸 | **Transações** | Lista com filtros por mês, categoria, conta, tipo, projeto e forma de pagamento, busca e paginação. |
| 🏦 | **Contas** | Saldo, entradas, saídas e histórico de cada conta, com o saldo total consolidado. |
| 🏷️ | **Categorias** | Receitas e despesas com cor e ícone próprios. Categorias com transações são protegidas contra exclusão. |
| 🧳 | **Projetos** | Viagens, compras e eventos com orçamento, total gasto e gastos por categoria. |
| 📐 | **Orçamentos** | Limites mensais por categoria, com avisos visuais aos 70%, 90% e 100%. |
| 🎯 | **Metas** | Progresso, valor restante, prazo e histórico de contribuições. |
| 📑 | **Relatórios** | Resumo mensal, principais gastos, projetos que mais consumiram dinheiro e evolução diária. |
| 🔑 | **Login com Google** | Entrada rápida com a conta Google, além de e-mail e senha. |

---

# 📊 Dashboard

O painel principal reúne, em uma única tela:

```text
┌──────────────────────── Outubro 2026 ────────────────────────┐
│  Saldo atual     Receitas      Despesas     Economizado      │
│  R$ 1.400,00     R$ 3.500,00   R$ 2.100,00  40%              │
│  ▲ 8,2%          ▲ 4,0%        ▼ 12%        da receita       │
├───────────────────────────────────┬──────────────────────────┤
│  Receitas x Despesas (linha)      │  Despesas por categoria  │
│                                   │  Moradia ........ 30%    │
│                                   │  Alimentação .... 25%    │
│                                   │  Lazer .......... 20%    │
│                                   │  Transporte ..... 15%    │
│                                   │  Outros ......... 10%    │
├───────────────────────────────────┼──────────────────────────┤
│  Comparação mensal (Jul–Out)      │  Últimas transações      │
└───────────────────────────────────┴──────────────────────────┘
```

---

# 🧳 Projetos e Viagens

Uma das funcionalidades centrais: agrupar transações em um projeto e ver o custo total de algo, como uma viagem.

```text
VIAGEM PARA SÃO PAULO
R$ 1.300 gastos  ·  Orçamento R$ 1.500  ·  86% utilizado
████████████████████████████░░░░

Gastos por categoria
├── Hospedagem ...... R$ 500
├── Transporte ...... R$ 420
├── Lazer ........... R$ 200
└── Alimentação ..... R$ 180

Linha do tempo
12/10  Passagem ........ R$ 350
13/10  Hotel ........... R$ 500
14/10  Uber ............ R$  70
15/10  Restaurante ..... R$ 180
```

---

# 🎯 Metas e Orçamentos

```text
META · Comprar PC
R$ 2.500 de R$ 5.000
██████████████░░░░░░░░░░░░░░  50%

ORÇAMENTOS DO MÊS
Alimentação  ████████████████████░░░░░░░░  70%   no ritmo
Lazer        ██████████████████████████░░  90%   atenção
Transporte   ████████████████████████████  100%  atingido
```

---

# 🔄 Do Gasto ao Panorama Completo

Cada transação alimenta automaticamente categorias, projetos, meses e relatórios. Você registra uma vez e o Finora organiza o resto.

```text
Transação  →  Categoria  →  Projeto  →  Mês  →  Relatório
```

---

# 🛠️ Stack Tecnológica

## Front-end

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Motion / Framer Motion (animações)
* Recharts (gráficos)
* Lucide React (ícones)
* React Hook Form (formulários)

## Back-end

* Node.js
* Route Handlers do Next.js
* Zod (validação no servidor)
* Auth.js (NextAuth) com Google e e-mail/senha
* bcrypt para hash de senhas

## Banco de Dados

* PostgreSQL
* Neon (Postgres serverless)
* Prisma ORM
* Valores monetários com `Decimal` (sem ponto flutuante)

## Utilidades

* date-fns (locale `pt-BR`)
* clsx e tailwind-merge

## Identidade Visual

* Tema escuro: `#0A0D14` · `#10141D` · `#1E2430`
* Azul `#2E8BFF` e roxo `#7C5CFF`

---

# 🔑 Autenticação e Segurança

* Páginas de **login** (`/login`), **cadastro** (`/register`) e **recuperação de senha** (`/forgot-password`).
* **Login com Google** via Auth.js.
* Senhas armazenadas com **bcrypt**.
* Rotas protegidas no servidor: sem sessão, o usuário é redirecionado para `/login`.
* **Isolamento por usuário:** toda consulta é filtrada por `userId` no backend, então ninguém acessa transações de outra pessoa.
* Validação de todas as entradas com **Zod** no servidor.
* Prisma como camada de acesso, prevenindo SQL injection.

```ts
import { auth } from "@/auth";

const session = await auth();

if (!session?.user) {
  redirect("/login");
}
```

---

# 🗄️ Banco de Dados

Entidades principais:

* `User`
* `Account`
* `Category`
* `Transaction`
* `Project`
* `Budget`
* `Goal`

Relacionamentos:

```text
User
 ├── Accounts ──── Transactions
 ├── Categories ── Transactions
 ├── Projects ──── Transactions (opcional)
 ├── Budgets
 └── Goals
```

Os relatórios mensais **não são armazenados**: são calculados dinamicamente a partir das transações.

---

# 🏗️ Arquitetura

A lógica de negócio fica separada da interface:

```text
UI (components / pages)
        ↓
Services (regras de negócio e cálculos)
        ↓
Repositories (acesso a dados)
        ↓
Prisma
        ↓
PostgreSQL (Neon)
```

---

# 🔌 API

Todas as rotas exigem autenticação e retornam apenas dados do usuário logado.

| Recurso | Endpoints |
|---|---|
| Transações | `GET/POST /api/transactions` · `GET/PUT/DELETE /api/transactions/:id` |
| Contas | `GET/POST /api/accounts` |
| Categorias | `GET/POST /api/categories` |
| Projetos | `GET/POST /api/projects` · `GET /api/projects/:id` |
| Relatórios | `GET /api/reports/monthly` |
| Metas | `GET/POST /api/goals` |
| Orçamentos | `GET/POST /api/budgets` |

---

# ⚙️ Configuração do Ambiente

## Pré-requisitos

* Node.js 20+
* Git
* Uma instância PostgreSQL (local ou Neon)

## Instalação

```bash
git clone https://github.com/MeirelesDiogo/Finora.git
cd Finora
npm install
```

## Variáveis de Ambiente

Crie um `.env` na raiz do projeto (use o `.env.example` como base):

```env
DATABASE_URL="sua_connection_string_do_neon"
AUTH_SECRET=sua_chave_secreta
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=seu_client_id_do_google
AUTH_GOOGLE_SECRET=seu_client_secret_do_google
```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## Executar

```bash
npm run db:seed   # opcional: dados de demonstração
npm run dev
```

---

# 📌 Funcionalidades (Checklist)

### Plataforma

* [x] Cadastro e login de usuários
* [x] Login com Google
* [x] Proteção de rotas e isolamento por usuário
* [x] Dashboard financeiro com seletor de mês
* [x] Landing page

### Finanças

* [x] Controle de receitas e despesas
* [x] Categorias
* [x] Contas
* [x] Projetos e viagens
* [x] Orçamentos mensais
* [x] Metas
* [x] Relatórios mensais
* [x] Gráficos

### Futuras Funcionalidades

* [ ] Exportação PDF e Excel
* [ ] Notificações
* [ ] PWA
* [ ] Recorrência de transações
* [ ] Parcelamentos
* [ ] Multi-moeda
* [ ] Relatórios avançados e inteligência financeira
* [ ] Open Finance e integração bancária

---

# 🗺️ Roadmap de Desenvolvimento

## Planejamento
* [x] Definição da ideia, funcionalidades e stack
* [x] Modelagem do banco de dados

## Front-end
* [x] Design system e layout base
* [x] Landing page, login e cadastro
* [x] Dashboard e gráficos
* [x] Transações, contas e categorias
* [x] Projetos, metas e orçamentos
* [x] Relatórios

## Back-end
* [x] PostgreSQL + Neon
* [x] Prisma ORM
* [x] Autenticação (Auth.js) com Google
* [x] API com validação e autorização

## Deploy
* [ ] Deploy na Vercel
* [ ] Lançamento da versão 1.0

---

## 📂 Estrutura de Pastas

```text
Finora/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/                 # rotas e route handlers (App Router)
│   ├── components/          # componentes reutilizáveis
│   ├── hooks/
│   ├── lib/                 # prisma, configurações
│   ├── repositories/        # acesso a dados
│   ├── schemas/             # schemas Zod
│   ├── services/            # regras de negócio e cálculos
│   ├── types/
│   ├── utils/               # formatadores (moeda, datas)
│   └── auth.ts              # configuração do Auth.js
├── .env.example
└── README.md
```

### 📄 Páginas

| Página | Descrição |
|---|---|
| `/` | Landing page |
| `/login` · `/register` · `/forgot-password` | Autenticação |
| `/dashboard` | Resumo financeiro do mês |
| `/transactions` | Lista de transações com filtros |
| `/accounts` | Contas e saldos |
| `/categories` | Categorias de receita e despesa |
| `/projects` · `/projects/[id]` | Projetos e viagens |
| `/goals` | Metas financeiras |
| `/budgets` | Orçamentos mensais |
| `/reports` | Relatório mensal |
| `/settings` | Configurações da conta |

---

# 🤝 Como Contribuir

Contribuições são sempre bem-vindas.

1. Faça um Fork.
2. Crie uma Branch:
```bash
git checkout -b feature/minha-feature
```
3. Faça suas alterações e commit:
```bash
git commit -m "feat: adiciona nova funcionalidade"
```
4. Envie para o GitHub:
```bash
git push origin feature/minha-feature
```
5. Abra um Pull Request.

---

# 📄 Licença

Este projeto é distribuído sob a licença **MIT**.

---

# 👨‍💻 Autor

**Diogo Alexandre Meireles**

GitHub: [MeirelesDiogo](https://github.com/MeirelesDiogo)

---

# ⭐ Apoie o Projeto

Se este projeto chamou sua atenção ou te ajudou de alguma forma, deixe uma ⭐ no repositório.

---

# 💙 Nossa Missão

Acreditamos que ter clareza sobre o próprio dinheiro deve ser simples, bonito e acessível.

O Finora nasceu para transformar registros soltos em uma visão completa da sua vida financeira, ajudando qualquer pessoa a decidir melhor.

---

**💰 Seu dinheiro. Seu controle. Sua visão.**