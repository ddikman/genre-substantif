import { describe, it, expect } from 'vitest'
import { dictionary } from './dictionary'

describe('dictionary', () => {
  it('contains a list of words', () => {
    expect(dictionary.length).toBeGreaterThan(0)
    for (let word of dictionary) {
      expect(word.fr).to.not.toBeNull()
      expect(word.en).to.not.toBeNull()
      expect(['m', 'f', 'n']).toContain(word.gen)
    }
  })
})