// This is a script to convert a dix file to a json file like
// https://github.com/apertium/apertium-fra-eng/blob/master/apertium-fra-eng.fra-eng.dix

// To run this script, you need to install xml2js with npm

import fs from 'fs'
import { parseString } from 'xml2js'


if (process.argv.length < 3) {
  console.log('Usage: node convert-dix.js <dix file>');
  process.exit(1)
}

const inputFilePath = process.argv[2];
console.log('Reading ' + inputFilePath);

const genderMapping = {
  'f': 'f', //feminine
  'm': 'm', // masculine
  'un': 'n' // neutral
}

const isNoun = (tags) => tags.filter((tag) => tag === 'n' || tag === 'np').length > 0;
const getGender = (tags) => {
  const gender = tags.map((tag) => genderMapping[tag]).filter((tag) => tag !== undefined);
  return gender.length > 0 ? gender[0] : null;
}

parseString(fs.readFileSync(inputFilePath), function (err, result) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  var xmlEntries = result['dictionary']['section'][0]['e'];

  const words = xmlEntries.map((e) => {
    const french = {
      word: e.p[0].l[0]._,
      tags: e.p[0].l[0].s.map((s) => s['$'].n),
    }
    const english = {
      word: e.p[0].r[0]._,
      tags: e.p[0].r[0].s.map((s) => s['$'].n),
    }

    return {
      french: french.word,
      english: english.word,
      gender: getGender(french.tags),
      isNoun: isNoun(french.tags)
    }
  })
  .filter((word) => word.isNoun || word.gender === null)
  .map((word) => {
    return {
      fr: word.french,
      en: word.english,
      gen: word.gender
    }
  });

  fs.writeFileSync('src/data/data.ts', "export const dictionary = \n" + JSON.stringify(words, null, 2));
  console.log(`Writing ${words.length} nouns..`)
  console.log('Done')
})