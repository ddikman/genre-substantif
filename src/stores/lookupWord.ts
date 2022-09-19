import { dictionary } from '../data/dictionary'
import { DictionaryWord } from '../models/dictionaryWord';

export function toNormalForm(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function lookupWord(value: string): DictionaryWord | undefined {
  return dictionary.find((item) => item.fr && (item.fr === value.toLowerCase() || toNormalForm(item.fr) === value.toLowerCase()))
}