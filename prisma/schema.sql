-- Finora: estrutura do banco PostgreSQL
CREATE TABLE IF NOT EXISTS usuarios (
  cod_usuario BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS categorias (
  cod_categoria BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cod_usuario BIGINT NOT NULL REFERENCES usuarios(cod_usuario) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('RECEITA','DESPESA')),
  CONSTRAINT uq_categoria_usuario UNIQUE (cod_usuario,cod_categoria),
  CONSTRAINT uq_categoria_nome_tipo UNIQUE (cod_usuario,nome,tipo)
);
CREATE TABLE IF NOT EXISTS projetos (
  cod_projeto BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cod_usuario BIGINT NOT NULL REFERENCES usuarios(cod_usuario) ON DELETE CASCADE,
  nome VARCHAR(150) NOT NULL, descricao TEXT,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_projeto_usuario UNIQUE (cod_usuario,cod_projeto),
  CONSTRAINT uq_projeto_nome UNIQUE (cod_usuario,nome)
);
CREATE TABLE IF NOT EXISTS lancamentos (
  cod_lancamento BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cod_usuario BIGINT NOT NULL REFERENCES usuarios(cod_usuario) ON DELETE CASCADE,
  cod_categoria BIGINT NOT NULL,
  cod_projeto BIGINT,
  descricao VARCHAR(255) NOT NULL,
  valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('RECEITA','DESPESA')),
  data_lancamento DATE NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cod_usuario,cod_categoria) REFERENCES categorias(cod_usuario,cod_categoria),
  FOREIGN KEY (cod_usuario,cod_projeto) REFERENCES projetos(cod_usuario,cod_projeto)
);
CREATE INDEX IF NOT EXISTS idx_lancamentos_usuario_data ON lancamentos(cod_usuario,data_lancamento);
CREATE INDEX IF NOT EXISTS idx_lancamentos_projeto ON lancamentos(cod_usuario,cod_projeto);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria ON lancamentos(cod_usuario,cod_categoria);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON lancamentos(cod_usuario,tipo);
CREATE OR REPLACE VIEW resumo_mensal AS
SELECT cod_usuario, EXTRACT(YEAR FROM data_lancamento)::INT ano,
 EXTRACT(MONTH FROM data_lancamento)::INT mes,
 COALESCE(SUM(valor) FILTER (WHERE tipo='RECEITA'),0) total_receitas,
 COALESCE(SUM(valor) FILTER (WHERE tipo='DESPESA'),0) total_despesas,
 COALESCE(SUM(CASE WHEN tipo='RECEITA' THEN valor ELSE -valor END),0) saldo
FROM lancamentos GROUP BY cod_usuario, EXTRACT(YEAR FROM data_lancamento), EXTRACT(MONTH FROM data_lancamento);

-- Completa categorias de contas criadas antes da configuração inicial.
INSERT INTO categorias(cod_usuario,nome,tipo)
SELECT u.cod_usuario, padrao.nome, padrao.tipo
FROM usuarios u
CROSS JOIN (VALUES
  ('Salário','RECEITA'),('Outras receitas','RECEITA'),
  ('Moradia','DESPESA'),('Alimentação','DESPESA'),('Transporte','DESPESA'),
  ('Saúde','DESPESA'),('Lazer','DESPESA'),('Outras despesas','DESPESA')
) AS padrao(nome,tipo)
WHERE NOT EXISTS (SELECT 1 FROM categorias c WHERE c.cod_usuario=u.cod_usuario)
ON CONFLICT (cod_usuario,nome,tipo) DO NOTHING;
