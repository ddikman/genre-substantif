import { WebClient } from '@slack/web-api'
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG_JSON as string));
const db = getFirestore(app);

async function saveRequest(word: string) {
  await setDoc(doc(db, 'genre-substantif/data/word-requests/' + word), {
    word: word,
    timestamp: Date.now()
  })
}

async function sendRequest(word: string) {
    const token = process.env.SLACK_TOKEN
    const conversationId = process.env.SLACK_CONVO_ID as string
    const web = new WebClient(token);
    console.log(`Posting to convo ${conversationId}`)
    await web.chat.postMessage({ channel: conversationId, text: `Request to add ${word}` });
}

export default async function handler(request: any, response: any) {
    const word = request.query.word.toLowerCase()
    await sendRequest(word)
    await saveRequest(word)
    const message = `OK. Requesting '${word}' to be added.`
    console.log(message)
    response.setHeader('Access-Control-Allow-Origin', '*')
    return response.end(message);
  }
