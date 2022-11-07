import { WebClient } from '@slack/web-api'

async function sendRequest(word: string) {
    const token = process.env.SLACK_TOKEN
    const conversationId = process.env.SLACK_CONVO_ID as string
    const web = new WebClient(token);
    console.log(`Posting to convo ${conversationId}`)
    await web.chat.postMessage({ channel: conversationId, text: `Request to add ${word}` });
}

export default async function handler(request: any, response: any) {
    const { word: word } = request.query;
    await sendRequest(word)
    const message = `OK. Requesting '${word}' to be added.`
    console.log(message)
    response.setHeader('Access-Control-Allow-Origin', '*')
    return response.end(message);
  }
  