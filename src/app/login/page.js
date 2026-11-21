

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Finora.
          </h1>

          <h2 className="mt-5 text-2xl font-bold text-slate-800">
            Bem-vindo de volta!
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Entre na sua conta para continuar.
          </p>
        </div>

        {/* Formulário */}
        <form method="POST" className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              E-mail
            </label>

            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Senha
            </label>

            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>

        {/* Separador */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">ou</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Cadastro */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Ainda não tem uma conta?{" "}
          <a
            href="/cadastro"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Criar conta
          </a>
        </p>

      </div>
    </main>
  );
}
