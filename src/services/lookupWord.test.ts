import { describe, it, expect } from 'vitest'
import { FEMININE, MASCULINE } from '../models/word'
import { lookupWord, toNormalForm, groupWordsByGender } from './lookupWord'
import { Word } from '../models/word'

describe('lookupWord', () => {
  it('returns exact matches', () => {
    const matches = lookupWord('avoir')
    expect(matches.length).toBeGreaterThan(0)
    expect(matches[0].french).toBe('avoir')
  })

  it('returns exact matches with accents removed', () => {
    const matches = lookupWord('depot')
    expect(matches.length).toBeGreaterThan(0)
    expect(matches[0].french).toBe('dépôt')
  })

  it('returns undefined for a missing word', () => {
    const matches = lookupWord('foobar')
    expect(matches).toEqual([])
  })

  it('returns multiple matches', () => {
    const matches = lookupWord('coupe')
    expect(matches.length).toBeGreaterThan(1)
    expect(matches[0].french).toBe('coupe')
  })

  it('returns matches for English terms if no French is found', () => {
    const matches = lookupWord('hour')
    expect(matches.length).toBe(1)
    expect(matches[0].french).toBe('heure')
  })

  it('handles words with different genders correctly', () => {
    const matches = lookupWord('chanteur')
    expect(matches.length).toBe(2)
    expect(matches.some(w => w.gender === MASCULINE)).toBe(true)
    expect(matches.some(w => w.gender === FEMININE)).toBe(true)
  })
})

describe('toNormalForm', () => {
  it('should return the input string when it contains no diacritics', () => {
    expect(toNormalForm('hello')).toBe('hello');
  });

  it('should return a string without diacritics when given a string with diacritics', () => {
    expect(toNormalForm('café')).toBe('cafe');
  });

  it('should return an empty string when the input is an empty string', () => {
    expect(toNormalForm('')).toBe('');
  });

  it('should return an empty string when the input is an empty string', () => {
    expect(toNormalForm('')).toBe('');
  });
});

describe('groupWordsByGender', () => {
  it('returns empty array for no words', () => {
    const result = groupWordsByGender([])
    expect(result).toEqual([])
  })

  it('returns single primary group when all words have same gender', () => {
    const words = [
      new Word('chat', MASCULINE),
      new Word('chien', MASCULINE),
    ]
    const result = groupWordsByGender(words)
    
    expect(result).toHaveLength(1)
    expect(result[0].isPrimary).toBe(true)
    expect(result[0].gender).toBe(MASCULINE)
    expect(result[0].words).toEqual(words)
  })

  it('returns primary and secondary groups when words have different genders', () => {
    const masculineWords = [
      new Word('chat', MASCULINE),
      new Word('chien', MASCULINE),
    ]
    const feminineWords = [
      new Word('chatte', FEMININE),
    ]
    const allWords = [...masculineWords, ...feminineWords]
    
    const result = groupWordsByGender(allWords)
    
    expect(result).toHaveLength(2)
    
    // Primary group should be masculine (more words)
    const primaryGroup = result.find(g => g.isPrimary)
    expect(primaryGroup?.gender).toBe(MASCULINE)
    expect(primaryGroup?.words).toEqual(masculineWords)
    
    // Secondary group should be feminine
    const secondaryGroup = result.find(g => !g.isPrimary)
    expect(secondaryGroup?.gender).toBe(FEMININE)
    expect(secondaryGroup?.words).toEqual(feminineWords)
  })

  it('chooses correct primary group when counts are equal', () => {
    const masculineWords = [new Word('chat', MASCULINE)]
    const feminineWords = [new Word('chatte', FEMININE)]
    const allWords = [...masculineWords, ...feminineWords]
    
    const result = groupWordsByGender(allWords)
    
    expect(result).toHaveLength(2)
    expect(result.filter(g => g.isPrimary)).toHaveLength(1)
    expect(result.filter(g => !g.isPrimary)).toHaveLength(1)
  })

  it('handles real dictionary data correctly', () => {
    // Test with real dictionary data - "chanteur" appears as both m and f
    const matches = lookupWord('chanteur')
    const result = groupWordsByGender(matches)
    
    expect(result.length).toBeGreaterThan(0)
    if (matches.length > 1) {
      // Should have both genders
      const genders = result.map(g => g.gender)
      expect(genders).toContain(MASCULINE)
      expect(genders).toContain(FEMININE)
      
      // One should be primary, others secondary
      expect(result.filter(g => g.isPrimary)).toHaveLength(1)
      expect(result.filter(g => !g.isPrimary)).toHaveLength(result.length - 1)
    }
  })

  it('removes duplicate words within the same gender', () => {
    const words = [
      new Word('chat', MASCULINE),
      new Word('chat', MASCULINE), // duplicate
      new Word('chien', MASCULINE),
      new Word('chatte', FEMININE),
    ]
    const result = groupWordsByGender(words)
    
    const masculineGroup = result.find(g => g.gender === MASCULINE)
    expect(masculineGroup?.words).toHaveLength(2) // Should have 2, not 3
    
    const wordNames = masculineGroup?.words.map(w => w.french) || []
    expect(wordNames).toContain('chat')
    expect(wordNames).toContain('chien')
    expect(wordNames.filter(name => name === 'chat')).toHaveLength(1) // Only one 'chat'
  })
})
