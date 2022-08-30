const MASCULINE = 'masculine';
const FEMININE = 'feminine';

class Word {
  constructor(public french: string, public gender: string) {}

  isMasculine() : boolean {
    return this.gender === MASCULINE
  }

  isFeminine() : boolean {
    return this.gender === FEMININE
  }

  static fromJSON(json: any) : Word {
    return new Word(json.french, json.gender)
  }
}

export { Word, MASCULINE, FEMININE }