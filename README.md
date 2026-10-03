# 💰 Finora

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0A0D14,50:2E8BFF,100:7C5CFF&height=200&section=header&text=Finora&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Seu%20dinheiro.%20Seu%20controle.%20Sua%20vis%C3%A3o.&descAlignY=55&descSize=18" width="100%">
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=3000&pause=800&color=2E8BFF&center=true&vCenter=true&width=620&lines=Controle+financeiro+pessoal+moderno;Receitas%2C+despesas%2C+metas+e+projetos;Next.js+%2B+Prisma+%2B+PostgreSQL" alt="Typing SVG" />
</p>

<p align="center">

![Status](https://img.shields.io/badge/Status-🚧%20Em%20Desenvolvimento-orange)
![Version](https://img.shields.io/badge/Version-v0.1-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-2E8BFF?logo=auth0&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-Serverless_Postgres-7C5CFF?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

</p>

<p align="center">
  <strong>Seu dinheiro. Seu controle. Sua visão.</strong>
</p>

---

# 📖 Sobre o Projeto

O **Finora** é uma plataforma de **controle financeiro pessoal** que permite registrar tudo o que entra e sai da sua vida financeira e acompanhar isso por meses, contas, categorias, projetos e metas, com gráficos e relatórios que mostram para onde o dinheiro está indo.

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

# 📊 Dashboard

Resumo do mês, comparação com o mês anterior, gráficos de evolução, despesas por categoria e histórico mensal em uma única tela.

<p align="center">
  <img src="docs/assets/dashboard.svg" alt="Dashboard do Finora" width="100%">
</p>

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

<table>
<tr>
<td width="50%" valign="top">

### 📅 Controle mensal
Navegue entre meses e veja receitas, despesas e saldo de cada período, com comparação percentual em relação ao mês anterior.

</td>
<td width="50%" valign="top">

### 💸 Transações
Lista moderna com filtros por mês, categoria, conta, tipo, projeto e forma de pagamento, além de busca e paginação.

</td>
</tr>
<tr>
<td valign="top">

### 🏦 Contas
Cada conta mostra saldo, entradas, saídas e histórico, com o saldo total consolidado.

</td>
<td valign="top">

### 🏷️ Categorias
Categorias de receita e despesa com cor e ícone próprios. Categorias com transações são protegidas contra exclusão acidental.

</td>
</tr>
<tr>
<td valign="top">

### 🧳 Projetos
Agrupe gastos de uma viagem, compra ou evento e acompanhe orçamento, total gasto e distribuição por categoria.

</td>
<td valign="top">

### 🎯 Metas
Objetivos financeiros com progresso, valor restante, prazo e histórico de contribuições.

</td>
</tr>
<tr>
<td valign="top">

### 📐 Orçamentos
Limites mensais por categoria, com avisos visuais discretos aos 70%, 90% e 100%.

</td>
<td valign="top">

### 📑 Relatórios
Resumo mensal com maiores categorias, principais gastos, projetos que mais consumiram dinheiro e evolução diária.

</td>
</tr>
</table>

---

# 🎯 Metas, Projetos e Orçamentos

<p align="center">
  <img src="docs/assets/progress.svg" alt="Barras de progresso de metas, projetos e orçamentos" width="100%">
</p>

---

# 🧳 Projetos e Viagens

Uma das funcionalidades centrais: agrupar transações em um projeto e ver o custo total de algo, como uma viagem.

```text
VIAGEM PARA SÃO PAULO
R$ 1.300 gastos  ·  Orçamento R$ 1.500  ·  86% utilizado

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

# 🔄 Do Gasto ao Panorama Completo

Cada transação alimenta automaticamente categorias, projetos, meses e relatórios.

<p align="center">
  <img src="docs/assets/flow.svg" alt="Fluxo: Transação, Categoria, Projeto, Mês, Relatório" width="100%">
</p>

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
* Zod (validação server-side)
* Auth.js (NextAuth) para autenticação
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
* Slogan: **"Seu dinheiro. Seu controle. Sua visão."**

---

# 🔑 Autenticação e Segurança

* Páginas de **login** (`/login`), **cadastro** (`/register`) e **recuperação de senha** (`/forgot-password`).
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

# 🏗️ Arquitetura Atual

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
* [x] Proteção de rotas e isolamento por usuário
* [x] Dashboard financeiro com seletor de mês
* [x] Landing page
* [ ] Login social (Google, GitHub)

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
* [x] Dashboard e gráficos
* [x] Transações, contas e categorias
* [x] Projetos, metas e orçamentos
* [x] Relatórios
* [x] Landing page

## Back-end
* [x] PostgreSQL + Neon
* [x] Prisma ORM
* [x] Autenticação (Auth.js)
* [x] API com validação e autorização
* [ ] Login social (OAuth)

## Deploy
* [ ] Deploy na Vercel
* [ ] Lançamento da versão 1.0

---

## 📂 Estrutura de Pastas

```text
Finora/
├── docs/
│   └── assets/              # imagens e SVGs do README
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/                 # rotas e route handlers (App Router)
│   ├── components/          # componentes reutilizáveis
│   ├── hooks/
│   ├── lib/                 # prisma, auth, configurações
│   ├── repositories/        # acesso a dados
│   ├── schemas/             # schemas Zod
│   ├── services/            # regras de negócio e cálculos
│   ├── types/
│   └── utils/               # formatadores (moeda, datas)
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

<p align="center">
  <strong>💰 Seu dinheiro. Seu controle. Sua visão.</strong>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:7C5CFF,50:2E8BFF,100:0A0D14&height=120&section=footer" width="100%">
</p>