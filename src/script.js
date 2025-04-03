// script.js

function createMoveList(moves) {
    const moveListContainer = document.createElement('div');
    moveListContainer.className = 'move-list';

    moves.forEach(move => {
        const moveItem = document.createElement('div');
        moveItem.className = `move-item ${move.evaluation}`; // e.g., 'good', 'bad', 'neutral'
        moveItem.innerText = `${move.notation} - ${move.evaluation}`;
        moveListContainer.appendChild(moveItem);
    });

    document.getElementById('root').appendChild(moveListContainer);
}

/*function populateMoveFeedback(moves) {
    const moveListContainer = document.getElementById("moveList");
    moveListContainer.innerHTML = ''; // Clear previous content
  
    moves.forEach(move => {
      const moveItem = document.createElement("div");
      moveItem.classList.add("move-item");
  
      // Display move details
      moveItem.innerHTML = `
        <span class="move">${move.notation} - <strong>${move.evaluation}</strong></span>
        ${move.alternative ? `<span class="suggestion">Suggested Move: ${move.alternative}</span>` : ''}
        ${move.technique ? `<span class="technique">Technique: ${move.technique}</span>` : ''}
      `;
  
      // Apply styles based on evaluation
      if (move.evaluation === "good") {
        moveItem.style.color = "green";
      } else if (move.evaluation === "bad") {
        moveItem.style.color = "red";
      } else {
        moveItem.style.color = "orange";
      }
  
      moveListContainer.appendChild(moveItem);
    });
  }*/

function populateMoveFeedback(moveData) {
    if (!Array.isArray(moveData)) {
        console.error("Expected moveData to be an array, but got:", moveData);
        return;
    }
    const moveListElement = document.getElementById('move-list');

    moveData.forEach(move => {
        const moveElement = document.createElement('div');
        moveElement.className = 'move';
        moveElement.innerHTML = `
            <strong>${move.move}</strong> - ${move.evaluation}
            ${move.suggestion ? ` | Suggested: ${move.suggestion}` : ''}
            ${move.techniques.length > 0 ? ` | Techniques: ${move.techniques.join(', ')}` : ''}
        `;
        moveListElement.appendChild(moveElement);
    });
}
    
    
  

function populateTechniquesFeedback(techniques) {
    const techniquesSection = document.getElementById("techniques-section");
    techniquesSection.innerHTML = '';
 
    techniques.forEach(technique => {
       const techniqueDiv = document.createElement("div");
       techniqueDiv.classList.add("technique-feedback");
       techniqueDiv.innerHTML = `
          <p>Technique: ${technique.name}</p>
          <p>Status: ${technique.status}</p>
          <p>Improvement: ${technique.suggestion || 'N/A'}</p>
       `;
       techniquesSection.appendChild(techniqueDiv);
    });
 }

 function populateGameSummary(summary) {
    const gameSummary = document.getElementById("game-summary");
    gameSummary.innerHTML = `
       <p>Strengths: ${summary.strengths.join(', ')}</p>
       <p>Weaknesses: ${summary.weaknesses.join(', ')}</p>
    `;
 }

 /*async function fetchAndDisplayFeedback() {
    const response = await fetch('https://stockfish.online/api/s/v2.php');//('https://chess-api.com/v1'); // Replace with actual endpoint
    const feedbackData = await response.json();
 
    populateMoveFeedback(feedbackData.moves);
    populateTechniquesFeedback(feedbackData.techniques);
    populateGameSummary(feedbackData.summary);
 }*/

async function fetchAndDisplayFeedback() {
  //const fen = game.current.fen();
  try {
    const response = await fetch('https://chess-api.com/v1');
    /*const response = await fetch('https://chess-api.com/v1',{ //'http://localhost:5000/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fen, time: 1000 }), // Include depth if required
    });*/
    const data = await response.json();
    console.log("API Data:", data);  // Check if data is as expected
    populateMoveFeedback(data.moves);  // Make sure `data.moves` exists and is an array
  } catch (error) {
      console.error("Failed to fetch data:", error);
  }
}
 
 // Call this function on page load or after a game is completed
 fetchAndDisplayFeedback();
 
// Example usage for testing
/*createMoveList([
    { notation: 'e4', evaluation: 'good' },
    { notation: 'Nf3', evaluation: 'neutral' },
    { notation: 'd5', evaluation: 'bad' }
]);*/
