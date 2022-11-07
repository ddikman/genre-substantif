export default function handler(request: any, response: any) {
    const { word: word } = request.query;
    const message = `OK. Requesting '${word}' to be added.`
    console.log(message)
    return response.end(message);
  }
  