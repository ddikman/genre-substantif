import { Word, FEMININE, MASCULINE } from "../models/word";

const WORD_NOT_FOUND = 'word not found'

const getGender = (wordDescription: string) => {
  if (wordDescription.indexOf('féminin')) {
    return FEMININE
  }
  if (wordDescription.indexOf('masculin')) {
    return MASCULINE
  }
  return 'unisex'
}

const getFromApi = async (word: string): Promise<Word> => {
   const encodedWord = encodeURIComponent(word)
   let response = await fetch("https://api.pons.com/v1/dictionary?l=enfr&q=" + encodedWord, {
     method: "GET",
     headers: {
      "X-Secret": "829f8d9ca2deb2582413c45613368cc3c29fb35591a0ac60fa230641c247f4e0"
     }
   });

   // no match
   if (response.status === 204) {
    throw WORD_NOT_FOUND
   }

   const json = await response.json();
   const hits = json[0].hits
   const firstHit = hits[0].rooms[0]
   return new Word(firstHit.headword, getGender(firstHit.headword_full))
}

const lookup = async (word: string): Promise<Word> => {
  return await getFromApi(word)
}

export {
  lookup,
  WORD_NOT_FOUND
}