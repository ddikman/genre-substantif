import { describe, it, expect } from 'vitest'
import { FEMININE, MASCULINE } from '../models/word'
import { lookupWord } from './lookupWord'

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