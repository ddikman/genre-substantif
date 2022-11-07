export default function handler(request, response) {
    const { name: word } = request.query;
    return response.end(`OK. Requesting ${word} to be added.`);
  }
  