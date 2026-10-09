import { test, expect } from 'claude-code/testing'

test('le prompt passe intact quand le juge ne répond pas', async ($, on) => {
  on('prompt.submit', (_$, e) => ({ text: e.text }))
  on('model.complete', () => ({ isAnswered: false, reason: 'api-error', usage: {} }) as never)
  const r = await $.prompt.submit({ text: 'bonjour' } as never)
  expect(r.text).toBe('bonjour')
})
