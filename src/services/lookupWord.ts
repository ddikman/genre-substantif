import { dictionary } from './dictionary'
import { Word, FEMININE, MASCULINE } from '../models/word';
import { DictionaryWord } from '../models/dictionaryWord';

const genders: any = {
  'm': MASCULINE,
  'f': FEMININE,
  'n': 'unisex'
}

export function toNormalForm(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function lookupWord(value: string): Word[] {
  if (!value || value.length === 0) {
    return []
  }
  const frenchWords = dictionary.filter((item) => item.fr === value.toLowerCase() || toNormalForm(item.fr) === value.toLowerCase())
  if (frenchWords.length > 0) {
    return frenchWords.map((frenchWord) => new Word(frenchWord.fr, genders[frenchWord.gen]))
  }
  const englishWord = dictionary.find((item) => item.en === value.toLowerCase())
  if (englishWord) {
    return [ new Word(englishWord.fr, genders[englishWord.gen]) ]
  }
  return []
}