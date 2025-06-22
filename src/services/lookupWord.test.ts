import { describe, it, expect } from 'vitest'
import { FEMININE, MASCULINE } from '../models/word'
import { lookupWord, toNormalForm, groupWordsByGender } from './lookupWord'
import { Word } from '../models/word'

describe('lookupWord', () => {
  it('returns exact matches', () => {
    expect(lookupWord('bonjour')).toEqual([{
      'french': 'bonjour',
      'gender': MASCULINE
    }])
  })

  it('returns exact matches with accents removed', () => {
    expect(lookupWord('tele')).toEqual([{
      'french': 'télé',
      'gender': FEMININE
    }])
  })

  it('returns undefined for a missing word', () => {
    expect(lookupWord('notcorrect')).toEqual([])
  })

  it('returns multiple matches', () => {
    expect(lookupWord('route')).toEqual([
      {
        'french': 'route',
        'gender': FEMININE
      },
      {
        'french': 'route',
        'gender': FEMININE
      },
      {
        'french': 'route',
        'gender': FEMININE
      }
    ])
  })

  it('returns matches for English terms if no French is found', () => {
    expect(lookupWord('moon')).toEqual([{
      'french': 'lune',
      'gender': FEMININE
    }])
  })
})

describe('toNormalForm', () => {
    it('should return the input string when it contains no diacritics', () => {
      expect(toNormalForm("hello")).toBe("hello");
    });

    it('should return a string without diacritics when given a string with diacritics', () => {
      const input = "éàôí";
      const expectedOutput = "eaoi";
      const actualOutput = toNormalForm(input);
      expect(actualOutput).toEqual(expectedOutput);
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
})
