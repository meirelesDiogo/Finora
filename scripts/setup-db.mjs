import "dotenv/config";
import fs from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;
if (!process.env.DATABASE_URL) {
  console.error("Configure DATABASE_URL no arquivo .env antes de preparar o banco.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

try {
  const schema = await fs.readFile(new URL("../prisma/schema.sql", import.meta.url), "utf8");
  const statements = schema.split(";").map((statement) => statement.trim()).filter(Boolean);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const statement of statements) await client.query(statement);
    await client.query(`INSERT INTO categorias(cod_usuario,nome,tipo)
      SELECT u.cod_usuario, seed.nome, seed.tipo
      FROM usuarios u
      CROSS JOIN (VALUES
        ('Salário','RECEITA'),('Outras receitas','RECEITA'),
        ('Moradia','DESPESA'),('Alimentação','DESPESA'),('Transporte','DESPESA'),
        ('Saúde','DESPESA'),('Lazer','DESPESA'),('Outras despesas','DESPESA')
      ) AS seed(nome,tipo)
      WHERE NOT EXISTS (SELECT 1 FROM categorias c WHERE c.cod_usuario=u.cod_usuario)
      ON CONFLICT (cod_usuario,nome,tipo) DO NOTHING`);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  console.log("Banco do Finora preparado com sucesso.");
} catch (error) {
  console.error("Não foi possível preparar o banco:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
