export default function HowItWorksPage() {
  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <h1 className="font-bebas text-4xl lg:text-5xl mb-6" style={{ color: 'var(--text-primary)' }}>
        Como Funciona
      </h1>

      {/* Sistema de Palpites */}
      <section className="rounded-2xl border p-6 lg:p-8 mb-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <h2 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-green)' }}>
          Palpites
        </h2>
        <div className="space-y-3 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
          <p><strong>O que eh um palpite?</strong> Voce tenta adivinhar o resultado de um jogo antes dele acontecer.</p>
          <p><strong>Como fazer:</strong> No menu Palpites, escolha o placar (ex: 2 x 1). Se for eliminatoria com empate, escolha o vencedor nos penaltis.</p>
          <p><strong>Prazo:</strong> Voce tem ate 1 hora antes do jogo comear para fazer seu palpite.</p>
        </div>
      </section>

      {/* Pontuacao */}
      <section className="rounded-2xl border p-6 lg:p-8 mb-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <h2 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-yellow)' }}>
          Pontuacao
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="font-bebas text-2xl mb-2" style={{ color: 'var(--accent-green)' }}>10 pts</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Placar Exato</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Acertou o placar perfeito</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="font-bebas text-2xl mb-2" style={{ color: 'var(--accent-yellow)' }}>5 pts</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Resultado Correto</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Acertou quem venceu</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="font-bebas text-2xl mb-2" style={{ color: '#ff6464' }}>0 pts</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Errou</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Nao acertou o resultado</p>
          </div>
        </div>
      </section>

      {/* Ranking */}
      <section className="rounded-2xl border p-6 lg:p-8 mb-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <h2 className="font-bebas text-2xl mb-4" style={{ color: '#FFD700' }}>
          Ranking
        </h2>
        <div className="space-y-3 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
          <p>Seus pontos sao somados ao longo de todas as rodadas. Veja seu ranking na pagina de Ranking e compete com outros.</p>
          <p>Voce tambem pode ver o TOP 5 da rodada atual para comparar desempenho na rodada especifica.</p>
        </div>
      </section>

      {/* Badges */}
      <section className="rounded-2xl border p-6 lg:p-8 mb-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <h2 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-green)' }}>
          Badges e Conquistas
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Perfeito</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">🔮</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Profeta</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">👑</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Invencivel</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Colecionador</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">📈</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Consistente</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">🍀</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Sortudo</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Comeback</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Lenda</p>
          </div>
        </div>
      </section>

      {/* Estatisticas */}
      <section className="rounded-2xl border p-6 lg:p-8 mb-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <h2 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-yellow)' }}>
          Suas Estatisticas
        </h2>
        <div className="space-y-2 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
          <p><strong>Taxa de Acerto:</strong> Porcentagem de palpites que voce acertou</p>
          <p><strong>Pontos por Jogo:</strong> Media de pontos que voce ganha por palpite</p>
          <p><strong>Placar Exato:</strong> Quantas vezes voce acertou o placar perfeito</p>
          <p><strong>Resultado Certo:</strong> Quantas vezes voce acertou quem ganhou</p>
          <p><strong>Times Favoritos:</strong> Os times em que voce mais acerta</p>
          <p><strong>Evolucao de Pontos:</strong> Grafico mostrando como sua pontuacao cresceu</p>
        </div>
      </section>

      {/* Dicas */}
      <section className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <h2 className="font-bebas text-2xl mb-4" style={{ color: 'var(--accent-green)' }}>
          Dicas
        </h2>
        <ul className="space-y-2 text-sm lg:text-base" style={{ color: 'var(--text-primary)' }}>
          <li>Estude os times e seus jogadores principais</li>
          <li>Nao deixe para a ultima hora - faca seu palpite com antecedencia</li>
          <li>Acompanhe o ranking para saber como voce esta se saindo</li>
          <li>Analise seus times favoritos e tente acertar neles</li>
          <li>Nao desista se comear devagar, voce sempre pode subir</li>
          <li>Diversifique seus palpites, nao coloque tudo em um tipo</li>
        </ul>
      </section>
    </div>
  )
}
