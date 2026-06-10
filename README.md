# 🏆 Palpiteiros - Sistema de Palpites Copa do Mundo 2026

Um sistema interativo de palpites para a Copa do Mundo 2026, desenvolvido com **Next.js 16**, **TypeScript**, **Supabase** e **Tailwind CSS**.

## 📋 Visão Geral

**Palpiteiros** é uma plataforma colaborativa onde múltiplos usuários podem fazer palpites em jogos da Copa do Mundo, ganhar pontos, ver suas estatísticas detalhadas e competir em tempo real em um ranking global.

### ✨ Principais Funcionalidades

- 🎯 **Sistema de Palpites**: Faça palpites em tempo real com previsões de placar e pênaltis
- 📊 **Dashboard Interativo**: Visualize seus palpites pendentes e resultados
- 🏅 **Ranking Dinâmico**: Acompanhe sua posição em relação aos outros participantes
- 📈 **Estatísticas Detalhadas**: Taxa de acerto, pontos por jogo, times favoritos
- 📉 **Gráfico de Evolução**: Veja como sua pontuação cresceu ao longo do torneio
- 🏆 **Sistema de Badges**: Desbloqueie conquistas especiais conforme progride
- 👥 **Leaderboard por Rodada**: Veja o top 5 da rodada atual
- 🔄 **Sincronização Automática**: Importe resultados diretamente da API Zafronix
- 📱 **Responsivo**: Funciona perfeitamente em mobile, tablet e desktop

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18.17+
- npm ou yarn
- Conta Supabase
- ZAFRONIX_API_KEY (para importar dados de jogos)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/palpiteiros-2026.git
cd palpiteiros-2026
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
ZAFRONIX_API_KEY=sua_chave_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Configure o banco de dados**

Execute o script SQL em `supabase-setup.sql` no seu Supabase Dashboard.

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/                  # Rotas Next.js
├── components/           # Componentes React
├── lib/                  # Funções utilitárias e types
└── public/               # Arquivos estáticos
```

## 🔑 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave admin |
| `ZAFRONIX_API_KEY` | Chave Zafronix |
| `NEXT_PUBLIC_BASE_URL` | URL base |

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth

## 🎮 Funcionalidades

### Palpites
- Previsão de placar (home × away)
- Seleção de vencedor em pênaltis
- Validação automática de prazo
- Salvamento em tempo real

### Pontuação
- 10 pontos: Placar exato
- 5 pontos: Resultado correto
- 0 pontos: Erro

### Badges
- 🎯 Perfeito: Placar exato
- 🔮 Profeta: 5 acertos seguidos
- 👑 Invencível: Primeiro em rodada
- 🏆 Colecionador: 10 placares exatos
- 📈 Consistente: Taxa > 80%
- 🍀 Sortudo: 100 pontos em rodada
- ⭐ Lenda: 500 pontos totais

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/Feature`)
3. Commit as mudanças (`git commit -m 'Add Feature'`)
4. Push (`git push origin feature/Feature`)
5. Abra um Pull Request

## 📄 Licença

Licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

<div align="center">

Feito com ❤️ para os fãs de futebol

</div>
