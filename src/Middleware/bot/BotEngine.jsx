const chessKeywords = [
  'chess', 'chessboard', 'chess piece', 'chess game', 'chess move',

  'checkmate', 'pawn', 'bishop', 'knight', 'rook', 'queen', 'king',

  'castling', 'en passant', 'stalemate', 'endgame', 'opening', 'middlegame',

  'check', 'mate', 'board', 'square', 'rank', 'file',

  'strategy', 'tactics', 'position', 'capture', 'fork', 'pin',

  'opening theory', 'pawn structure', 'blunder', 'combination', 'zugzwang',

  'chess notation', 'chess clock', 'chess set', 'chess club', 'chess tournament',

  'grandmaster', 'checkers', 'chessmaster', 'chess piece movement',

  'analyze position', 'chess strategy', 'chess tactics', 'chess rules',

  'chess book', 'chess lesson', 'chess match', 'chess puzzle', 'chess software',

  'chess app', 'online chess', 'bullet chess', 'blitz chess', 'rapid chess',

  'FIDE rating', 'chess opening', 'chess endgame', 'queen\'s gambit',

  'Italian game', 'Sicilian defense', 'French defense', 'Caro-Kann defense',

  'King\'s Indian defense', 'Ruy Lopez', 'Scandinavian defense',

  'Alekhine\'s defense', 'Philidor defense', 'Giuoco Piano', 'Nimzo-Indian defense',

  'Grünfeld defense', 'Dutch defense', 'Benoni defense', 'London System',

  'chess streaming', 'chess analysis', 'chess tactics training', 'chess strategy guide',
];

// Function to get the current time in hours
const getCurrentHour = () => new Date().getHours();

// Function to check if a greeting should be displayed
const shouldDisplayGreeting = () => {
  const lastGreetingTime = localStorage.getItem('lastGreetingTime');
  const currentHour = getCurrentHour();

  // If last greeting time is not stored or more than 4 hours have passed
  if (!lastGreetingTime || (currentHour - parseInt(lastGreetingTime) >= 4)) {
      localStorage.setItem('lastGreetingTime', currentHour.toString());
      return true;
  }

  return false;
};

export const Send_GPT_Request = async (input) => {
  var generatedText = '';

  try {
      const apiKey = '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';
      const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
      const isChessRelated = chessKeywords.some((keyword) => input.toLowerCase().includes(keyword));

      if (isChessRelated) {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                  prompt: `Chatbot response: ${input}`,
                  max_tokens: 50,
                  temperature: 0.7,
              }),
          });
          const data = await response.json();
          generatedText = data.choices[0]?.text || 'Sorry, I did not understand that.';
      } else {
          generatedText = 'Ask me anything about chess.';
      }
      // Check if a greeting should be displayed
      if (shouldDisplayGreeting()) {
          const currentTime = getCurrentHour();
          if (currentTime >= 5 && currentTime < 12) {
              generatedText = `Hi charm Good morning!  ${generatedText}`;
          } else if (currentTime >= 12 && currentTime < 18) {
              generatedText = `Hi charm Good afternoon! ${generatedText}`;
          } else {
              generatedText = `Hi charm Good evening! ${generatedText}`;
          }
      }

      return generatedText.replace(/\s\s+/g, ' ');

  } catch (error) {
      console.error('Error calling GPT-3 API:', error);
  }
};