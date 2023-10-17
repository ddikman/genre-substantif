import { describe, it, expect } from 'vitest'
import { FEMININE, MASCULINE } from '../models/word'
import { lookupWord, toNormalForm } from './lookupWord'

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
