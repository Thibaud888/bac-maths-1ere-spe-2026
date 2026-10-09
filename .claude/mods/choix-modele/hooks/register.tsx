import type { Register } from 'claude-code'

type Level = 'low' | 'medium' | 'high' | 'xhigh' | 'max'

const LEVELS: readonly Level[] = ['low', 'medium', 'high', 'xhigh', 'max']

const MODELS = {
  haiku: 'claude-haiku-5-5',
  sonnet: 'claude-sonnet-5-5',
  opus: 'claude-opus-5-5',
  fable: 'claude-fable-5-1',
} as const

type Alias = keyof typeof MODELS

type Verdict = { model: Alias; effort: Level; reason: string }

const family = (id: string): Alias | undefined =>
  (Object.keys(MODELS) as Alias[]).find(a => id.toLowerCase().includes(a))

const JUDGE = `Tu évalues si le modèle et l'effort de réflexion choisis par l'utilisateur conviennent à sa première demande dans une session Claude Code.
Modèles (du moins au plus capable/coûteux) : haiku (tâches triviales : renommer, lire, petite question), sonnet (code et contenu courants, la plupart des tâches), opus (raisonnement difficile, architecture, gros refactor, relecture critique), fable (le plus capable : très long travail autonome, recherche complexe).
Effort : low (trivial), medium (courant), high (multi-étapes, plusieurs fichiers), xhigh (conception ou débogage difficiles), max (cas extrêmes seulement).
Règle : recommande le plus petit couple suffisant ; ne propose un changement que s'il est net (un cran d'écart sur une demande ambiguë = garder le choix actuel). Les questions simples et les petites retouches n'ont pas besoin d'opus ni d'un effort élevé.
Réponds UNIQUEMENT par un JSON : {"model":"haiku|sonnet|opus|fable","effort":"low|medium|high|xhigh|max","reason":"une phrase courte en français"}.`

const parse = (text: string): Verdict | undefined => {
  const raw = text.match(/\{[\s\S]*\}/)?.[0]
  if (raw === undefined) return undefined
  try {
    const v = JSON.parse(raw) as Partial<Verdict>
    const model = v.model
    const effort = v.effort
    if (model === undefined || !(model in MODELS)) return undefined
    if (effort === undefined || !LEVELS.includes(effort)) return undefined
    return { model, effort, reason: String(v.reason ?? '') }
  } catch {
    return undefined
  }
}

export const register: Register = on => {
  let isChecked = false
  // Choix accepté : appliqué à chaque requête de la boucle principale.
  let override: { model: string; effort: Level } | undefined

  on('prompt.submit', async ($, e, next) => {
    if (isChecked || e.origin.kind !== 'user') return next(e)
    isChecked = true

    try {
      const current = await $.session.model()
      const rows = await $.config.list()
      const effortRow = rows.find(r => /effort/i.test(r.key))
      const modelRow = rows.find(r => r.key === 'model')
      const effort = typeof effortRow?.value === 'string' ? effortRow.value : 'inconnu'

      const res = await $.model.complete({
        model: 'haiku',
        effort: 'low',
        system: JUDGE,
        prompt: `Modèle actuel : ${current}\nEffort actuel : ${effort}\nPremière demande :\n${e.text.slice(0, 4000)}`,
      })
      if (!res.isAnswered) return next(e)
      const v = parse(res.text)
      if (v === undefined) return next(e)

      const sameModel = family(current) === v.model
      const sameEffort = effort === 'inconnu' || effort === v.effort
      if (sameModel && sameEffort) return next(e)

      const target = `${v.model}, effort ${v.effort}`
      const keep = `Garder (${family(current) ?? current}, effort ${effort})`
      const change = `Passer à ${target}`
      const answer = await $.ui.ask(
        `${v.reason} Changer le modèle/l'effort pour cette session ?`,
        { header: 'Modèle', options: [change, keep] },
      )
      if (answer !== change) return next(e)

      override = { model: MODELS[v.model], effort: v.effort }
      if (modelRow !== undefined && modelRow.options?.includes(v.model)) {
        await $.config.set({ key: modelRow.key, value: v.model })
      }
      if (effortRow !== undefined && effortRow.options?.includes(v.effort)) {
        await $.config.set({ key: effortRow.key, value: v.effort })
      }
      $.ui.toast(`Session : ${target}`)
    } catch {
      // question refusée, fermée ou impossible (mode -p) : on ne bloque jamais le prompt
    }

    return next(e)
  }).catch(($, e, next) => (next.called ? next(e) : next(e)))

  on('turn.step', async function* ($, e, next) {
    const isMain = override !== undefined && e.agentId === undefined

    return yield* next(isMain ? { ...e, model: override!.model, effort: override!.effort } : e)
  })
}
