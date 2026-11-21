# Finora

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=230&section=header&text=Finora&fontSize=78&fontAlignY=36&animation=fadeIn&desc=Seu%20dinheiro.%20Seu%20controle.%20Sua%20vis%C3%A3o.&descSize=18&descAlignY=58" alt="Finora" width="100%"/>

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-00C897?style=for-the-badge)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue?style=for-the-badge)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=for-the-badge)

**Seu dinheiro. Seu controle. Sua visão.**

[Abrir o Finora](https://finora-ten-eta.vercel.app/) · [Repositório no GitHub](https://github.com/MeirelesDiogo/Finora)

</div>

---

## Sobre o projeto

O **Finora** é um sistema de planejamento financeiro pessoal. Reúne o controle de receitas e despesas, o acompanhamento de projetos e uma carteira de investimentos em um só lugar. O painel e os relatórios ajudam a entender a movimentação do mês e do ano.

## Funcionalidades

### Conta e segurança

- Cadastro, login e encerramento de sessão.
- Senhas protegidas e sessões assinadas por chave configurável.
- Dados financeiros associados à conta do usuário.

### Planejamento financeiro

- Registro, edição, filtros e exclusão de receitas e despesas.
- Categorias personalizadas para organizar as movimentações.
- Resumo mensal de receitas, despesas e saldo.
- Projetos com valor-meta, total acumulado, receitas, despesas e barra de progresso.
- Categoria **Investimento**: lançamentos como despesa são refletidos no saldo mensal e vinculados à aplicação correspondente no Modo Banco.

### Modo Banco e investimentos

- Carteira para renda fixa, Tesouro Prefixado, ações, dólar e outros ativos disponíveis no formulário.
- Registro de aplicações/aportes, compras, resgates e vendas, com datas, quantidades, preços, câmbio e custos quando aplicável.
- Atualização e exclusão de ativos e operações.
- Acompanhamento de posição, valores aplicados e atuais, além de rendimentos bruto e líquido para ativos de renda fixa.
- Valor investido também aparece no painel financeiro principal.

### Gráficos, relatórios e exportação

- Gráficos no painel, no Modo Banco e nos relatórios.
- Relatório mensal por categoria e revisão anual com totais de receitas, despesas e saldo.
- Visão mês a mês e distribuição anual de despesas por categoria.
- Exportação em CSV e planilha Excel formatada com cores e seções organizadas.

### Experiência de uso

- Interface responsiva para diferentes tamanhos de tela.
- Modo claro e escuro, com preferência salva no navegador.

## Tecnologias

- **Aplicação:** Next.js, React e JavaScript.
- **Interface e gráficos:** Tailwind CSS, Lucide React e Recharts.
- **Dados:** PostgreSQL, Neon e Prisma ORM.
- **Segurança:** bcryptjs e cookies de sessão assinados.
- **Exportação:** ExcelJS.
- **Hospedagem:** Vercel.

## Executar localmente

### Pré-requisitos

- Node.js LTS e npm.
- Um banco PostgreSQL, por exemplo, uma instância Neon.

### Instalação

```bash
git clone https://github.com/MeirelesDiogo/Finora.git
cd Finora
npm install
```

Crie um arquivo `.env` a partir de `.env.example` e informe os dados da sua própria instância PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host:5432/banco?sslmode=require"
SESSION_SECRET="uma-chave-aleatoria-longa-e-secreta-com-pelo-menos-32-caracteres"
```

Configure o banco e inicie o servidor de desenvolvimento:

```bash
npm run db:setup
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. Para gerar a versão de produção localmente, use `npm run build` e depois `npm start`.

> Mantenha as credenciais reais apenas no `.env` local ou nas variáveis protegidas da hospedagem. Nunca publique senhas, URLs privadas do banco ou chaves de sessão.

## Estrutura principal

```text
finora/
├── prisma/
│   ├── schema.prisma
│   └── schema.sql
├── scripts/
│   └── setup-db.mjs
├── public/
└── src/
    ├── app/
    │   ├── api/             # Cadastro, sessão, lançamentos, investimentos e relatórios
    │   ├── cadastro/
    │   ├── dashboard/
    │   ├── investimentos/   # Modo Banco
    │   ├── login/
    │   ├── projetos/
    │   ├── relatorios/
    │   └── transacoes/
    ├── components/
    └── lib/
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run build` | Compila a aplicação para produção. |
| `npm start` | Inicia a aplicação compilada. |
| `npm run lint` | Analisa o código com ESLint. |
| `npm run db:setup` | Cria ou atualiza as tabelas e a view do banco Finora. |

## Conclusão

O escopo atual do Finora está concluído e disponível no site publicado. O repositório permanece aberto a futuras melhorias e contribuições.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte [LICENSE](LICENSE) para os termos completos.

## Autor

Desenvolvido por **Diogo Alexandre Meireles**.

- GitHub: [@MeirelesDiogo](https://github.com/MeirelesDiogo)
- LinkedIn: [Diogo Meireles](https://www.linkedin.com/in/meirelesdiogo)
- E-mail: meirelesdiogo.dev@gmail.com
