import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8 flex items-center justify-between">
          <h1 className="font-bebas text-4xl lg:text-5xl" style={{ color: 'var(--accent-green)' }}>
            PALPITEIROS
          </h1>
          <Link
            href="/"
            className="text-sm lg:text-base px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        {/* Introdução */}
        <section className="mb-16">
          <h2 className="font-bebas text-3xl lg:text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Como Funciona
          </h2>
          <p className="text-sm lg:text-base mb-4" style={{ color: 'var(--text-muted)' }}>
            Bem-vindo ao Palpiteiros! Aqui você pode fazer palpites em jogos da Copa do Mundo 2026, competir com outros participantes e desbloquear badges especiais. Veja abaixo como tudo funciona.
          </p>
        </section>

        {/* Seção 1: Sistema de Palpites */}
        <section className="mb-16">
          <div className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <h3 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-green)' }}>
              🎯 Sistema de Palpites
            </h3>
            <div className="space-y-3 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
              <p>
                <strong>O que é um palpite?</strong> Você tenta adivinhar o resultado de um jogo antes dele acontecer.
              </p>
              <p>
                <strong>Como fazer um palpite:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Vá para o Dashboard e veja os jogos da rodada aberta</li>
                <li>Digite o placar que você acredita que vai acontecer (ex: 2 × 1)</li>
                <li>Se for um jogo eliminatório com empate, escolha quem ganha nos pênaltis</li>
                <li>Clique em "Salvar palpite"</li>
              </ul>
              <p>
                <strong>Prazo:</strong> Você tem até 1 hora antes do jogo começar para fazer seu palpite. Após isso, o palpite é bloqueado.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2: Sistema de Pontuação */}
        <section className="mb-16">
          <div className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <h3 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-yellow)' }}>
              ⭐ Sistema de Pontuação
            </h3>
            <div className="space-y-4">
              <p className="text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
                A pontuação é baseada em quão acerto seu palpite está:
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
                  <div className="font-bebas text-2xl mb-2" style={{ color: 'var(--accent-green)' }}>
                    10 pts
                  </div>
                  <p className="text-xs lg:text-sm" style={{ color: 'var(--text-primary)' }}>
                    <strong>Placar Exato</strong>
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Você acertou o placar final perfeitamente
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
                  <div className="font-bebas text-2xl mb-2" style={{ color: 'var(--accent-yellow)' }}>
                    5 pts
                  </div>
                  <p className="text-xs lg:text-sm" style={{ color: 'var(--text-primary)' }}>
                    <strong>Resultado Correto</strong>
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Você acertou quem venceu, mas errou o placar
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
                  <div className="font-bebas text-2xl mb-2" style={{ color: '#ff6464' }}>
                    0 pts
                  </div>
                  <p className="text-xs lg:text-sm" style={{ color: 'var(--text-primary)' }}>
                    <strong>Errou</strong>
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    O palpite não correspondeu ao resultado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 3: Ranking */}
        <section className="mb-16">
          <div className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <h3 className="font-bebas text-2xl mb-4" style={{ color: '#FFD700' }}>
              🏆 Ranking Global
            </h3>
            <div className="space-y-3 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
              <p>
                <strong>O que é o ranking?</strong> É uma lista de todos os participantes ordenados pelo total de pontos.
              </p>
              <p>
                <strong>Como funciona:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Seus pontos são somados ao longo de todas as rodadas</li>
                <li>Quanto mais palpites você acertar, mais pontos ganha</li>
                <li>Veja seu ranking em tempo real na página de Ranking</li>
                <li>Compare sua evolução com a de outros participantes</li>
              </ul>
              <p>
                <strong>Extra:</strong> Você também pode ver o TOP 5 da rodada atual para comparar desempenho na rodada específica.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 4: Badges */}
        <section className="mb-16">
          <div className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <h3 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-green)' }}>
              🏅 Badges e Conquistas
            </h3>
            <p className="text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
              Desbloqueie badges especiais ao atingir objetivos no sistema:
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Perfeito</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Placar exato</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">🔮</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Profeta</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>5 acertos seguidos</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">👑</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Invencível</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>1º lugar em rodada</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">🏆</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Colecionador</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>10 placares exatos</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">📈</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Consistente</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Taxa {`>`} 80%</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">🍀</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Sortudo</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>100 pts em rodada</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-2xl mb-2">⭐</div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Lenda</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>500 pontos totais</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 5: Estatísticas */}
        <section className="mb-16">
          <div className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <h3 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-yellow)' }}>
              📊 Suas Estatísticas
            </h3>
            <p className="text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
              Acompanhe seu desempenho detalhadamente:
            </p>
            <ul className="space-y-2 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
              <li>
                <strong>Taxa de Acerto:</strong> Porcentagem de palpites que você acertou (resultado ou placar)
              </li>
              <li>
                <strong>Pontos por Jogo:</strong> Média de pontos que você ganha por palpite
              </li>
              <li>
                <strong>Placar Exato:</strong> Quantas vezes você acertou o placar perfeito
              </li>
              <li>
                <strong>Resultado Certo:</strong> Quantas vezes você acertou quem ganhou
              </li>
              <li>
                <strong>Times Favoritos:</strong> Os times em que você mais acerta (com porcentagem de acerto)
              </li>
              <li>
                <strong>Evolução de Pontos:</strong> Gráfico mostrando como sua pontuação cresceu ao longo do torneio
              </li>
            </ul>
          </div>
        </section>

        {/* Seção 6: Dicas */}
        <section className="mb-16">
          <div className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <h3 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-green)' }}>
              💡 Dicas e Boas Práticas
            </h3>
            <ul className="space-y-3 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
              <li>
                <strong>Estude os times:</strong> Conheça as formações, jogadores importantes e histórico recente
              </li>
              <li>
                <strong>Não deixe para a última hora:</strong> Faça seu palpite com antecedência para não correr riscos
              </li>
              <li>
                <strong>Acompanhe o ranking:</strong> Veja quem está na liderança e como você está se saindo
              </li>
              <li>
                <strong>Analise padrões:</strong> Veja seus times favoritos e tente acertar seus palpites neles
              </li>
              <li>
                <strong>Não desista:</strong> Mesmo que começar devagar, você sempre pode subir no ranking
              </li>
              <li>
                <strong>Diversifique:</strong> Não coloque tudo em um único tipo de palpite
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h3 className="font-bebas text-2xl lg:text-3xl mb-6" style={{ color: 'var(--text-primary)' }}>
            Pronto para começar?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-semibold text-sm lg:text-base"
              style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
            >
              Criar Conta
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-semibold text-sm lg:text-base border"
              style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
            >
              Entrar
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
