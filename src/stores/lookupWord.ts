import { dictionary } from '../data/dictionary'
import { DictionaryWord } from '../models/dictionaryWord';
import { Word, FEMININE, MASCULINE } from '../models/word';

const genders: any = {
  'm': MASCULINE,
  'f': FEMININE,
  'n': 'unisex'
}

export function toNormalForm(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function lookupWord(value: string): Word | undefined {
  if (!value || value.length === 0) {
    return undefined
  }
  const dictionaryWord = dictionary.find((item) => item.fr && (item.fr === value.toLowerCase() || toNormalForm(item.fr) === value.toLowerCase()))
  if (dictionaryWord) {
    return new Word(dictionaryWord.fr, genders[dictionaryWord.gen])
  }
  return undefined
}