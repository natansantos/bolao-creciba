# 🚀 Configuração do GitHub

Siga os passos abaixo para criar um repositório público no GitHub e fazer push do código.

## Passo 1: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Preencha os campos:
   - **Repository name**: `palpiteiros-2026`
   - **Description**: "Sistema interativo de palpites para a Copa do Mundo 2026"
   - **Visibility**: Selecione **Public**
   - **Initialize with**: NÃO MARQUE nada (já temos arquivos locais)
3. Clique em **Create repository**

## Passo 2: Fazer Push do Código

Após criar o repositório, o GitHub vai mostrar os comandos. Execute no terminal:

```bash
cd d:\Projetos\palpiteiros\palpiteiros-2026
git remote add origin https://github.com/SEU_USUARIO/palpiteiros-2026.git
git branch -M main
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

## Passo 3: Adicionar Tópicos ao Repositório

1. Vá para **Settings** do repositório
2. Scrolle até "Topics"
3. Adicione os seguintes tópicos:
   - `next.js`
   - `typescript`
   - `supabase`
   - `football`
   - `world-cup`
   - `tailwindcss`
   - `prediction-system`

## Passo 4: Configurar GitHub Pages (Opcional)

Se deseja hospedar documentação:

1. Vá para **Settings** > **Pages**
2. Source: `main`
3. Folder: `/root` ou `/docs`

## Verificar Push

```bash
git log --oneline
# Deve mostrar 2 commits:
# ca62913 docs: add environment variables template
# 7ce2e6e 🚀 Initial commit: Palpiteiros - Copa do Mundo 2026 prediction system
```

## Proteger a Branch Main (Recomendado)

1. Settings > Branches
2. Add rule para `main`
3. Ative "Require pull request reviews"

## Issues e Discussões

Seu repositório agora está pronto para:
- 📝 Gerenciar issues
- 🔀 Receber pull requests
- 💬 Discussões da comunidade
- 🎯 Gerenciar projetos

---

**URL do seu repositório**: `https://github.com/SEU_USUARIO/palpiteiros-2026`

Compartilhe este link com outros devs que desejam contribuir!
