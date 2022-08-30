
import { ref, computed } from 'vue'
import { Word, MASCULINE, FEMININE } from '../models/word'

const RECENT_KEY = 'recent_words'

const recentWords = ref<Word[]>([
  new Word('femme', FEMININE),
  new Word('musée', FEMININE),
  new Word('bouchée', FEMININE),
  new Word('fusée', FEMININE),
  new Word('chaussée', FEMININE),

  new Word('café', MASCULINE),
  new Word('canapé', MASCULINE),
  new Word('carré', MASCULINE),
  new Word('chapeau', MASCULINE),
  new Word('supermarché', MASCULINE),
])

const storedLocally = localStorage.getItem(RECENT_KEY)
if (storedLocally) {
  recentWords.value = JSON.parse(storedLocally).map(Word.fromJSON)
}

const addWord = (word: Word) => {
  const index = recentWords.value.findIndex((w) => w.french === word.french)
  if (index >= 0) {
    recentWords.value.splice(index, 1)
  }

  recentWords.value.unshift(word)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentWords.value))
}

const recentMasculine = computed(() => {
  return recentWords.value.filter((w) => w.isMasculine()).slice(0, 10)
})

const recentFeminine = computed(() => {
  return recentWords.value.filter((w) => w.isFeminine()).slice(0, 10)
})

export {
  recentWords,
  recentMasculine,
  recentFeminine,
  addWord
}