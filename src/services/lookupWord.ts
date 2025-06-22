import { dictionary } from './dictionary'
import { Word, FEMININE, MASCULINE } from '../models/word';

const genders: any = {
  'm': MASCULINE,
  'f': FEMININE,
  'n': 'unisex',
  'm/f': 'unisex'
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

export interface GenderGroup {
  gender: string;
  words: Word[];
  isPrimary: boolean;
}

export function groupWordsByGender(words: Word[]): GenderGroup[] {
  if (words.length === 0) {
    return []
  }

  // Group words by gender
  const genderMap = new Map<string, Word[]>()
  words.forEach(word => {
    if (!genderMap.has(word.gender)) {
      genderMap.set(word.gender, [])
    }
    genderMap.get(word.gender)!.push(word)
  })

  // If all words have the same gender, return as single primary group
  if (genderMap.size === 1) {
    const gender = genderMap.keys().next().value!
    return [{
      gender,
      words: genderMap.get(gender)!,
      isPrimary: true
    }]
  }

  // Find the gender with the most words (primary group)
  let primaryGender = ''
  let maxCount = 0
  genderMap.forEach((words, gender) => {
    if (words.length > maxCount) {
      maxCount = words.length
      primaryGender = gender
    }
  })

  // Create result array with primary group first, then secondary groups
  const result: GenderGroup[] = []
  
  // Add primary group
  result.push({
    gender: primaryGender,
    words: genderMap.get(primaryGender)!,
    isPrimary: true
  })

  // Add secondary groups
  genderMap.forEach((words, gender) => {
    if (gender !== primaryGender) {
      result.push({
        gender,
        words,
        isPrimary: false
      })
    }
  })

  return result
}