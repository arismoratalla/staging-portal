<!-- App.vue -->
<template>
  <div class="outer-container">
    <div class="tries-container">
      Remaining Tries:
      <br/>
      <h1>{{ remainingTries }}</h1>
      <button @click="resetGame" class="reset-button">Reset</button>
    </div>
    <div class="game-container">
      <Flashcard 
        v-for="(card, index) in flashcards" 
        :key="index"
        @cardClicked="decrementTries(card.status)"
        :headerFront="card.headerFront" 
        :front="card.front" 
        :back="card.back"
        :footerFront="card.footerFront"
        :status="card.status"
        :isGameActive="isGameActive">
      </Flashcard>
    </div>
    
    <div class="game-over-container">
      <div v-if="gameOver && remainingTries === 0" class="game-over-message">
        Game Over! <br/> You have no more tries.
      </div>
      <div v-if="gameOver && remainingTries > 0" class="game-over-message">
        Congratulations! <br/> You win!
      </div>
    </div>

    <div class="stats-container">
      <h3>Statistics</h3>
      <div>Wins on 1st try: {{ stats.firstTryWins }}</div>
      <div>Wins on 2nd try: {{ stats.secondTryWins }}</div>
      <div>Wins on 3rd try: {{ stats.thirdTryWins }}</div>
      <div>Total fails: {{ stats.totalFails }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// const isGameActive = ref(true);
const gameOver = ref(false);  // Add this line

const stats = ref({
  firstTryWins: 0,
  secondTryWins: 0,
  thirdTryWins: 0,
  totalFails: 0,
});

const loadStats = () => {
  const loadedStats = localStorage.getItem('gameStats');
  if (loadedStats) {
    stats.value = JSON.parse(loadedStats);
  }
};

const saveStats = () => {
  localStorage.setItem('gameStats', JSON.stringify(stats.value));
};

const updateStats = (status, tries) => {
  if (status === 'win') {
    if (tries === 1) {
      stats.value.firstTryWins++;
    } else if (tries === 2) {
      stats.value.secondTryWins++;
    } else if (tries === 3) {
      stats.value.thirdTryWins++;
    }
  } else {
    stats.value.totalFails++;
  }
  saveStats();
};

loadStats();

const generateFlashcards = (totalCards, maxWinCards) => {
  const cards = [];
  let winCount = 0; // keep track of the number of win cards
  for (let i = 0; i < totalCards; i++) {
    let winOrLose = 'tryAgain';
    if (winCount < maxWinCards && Math.random() > 0.5) {
      winOrLose = 'win';
      winCount++;
    }
    cards.push({ 
      status: winOrLose, 
      back: winOrLose === 'win' ? 'You Win' : 'Please Try Again',
    });
  }
  return cards;
};

const resetGame = () => {
  flashcards.value = generateFlashcards(20); // regenerate flashcards
  remainingTries.value = 3; // reset the number of tries
  // Reset other game statistics here, if needed
};

const flashcards = ref(generateFlashcards(20, 4)); // 20 cards, 5 maximum win cards

const remainingTries = ref(3);

const decrementTries = (status) => {
  if (gameOver.value) return;  // Game is over, so return early

  if (status === 'win') {
    // if (remainingTries.value === 2) stats.value.firstTryWins++;
    // if (remainingTries.value === 1) stats.value.secondTryWins++;
    // if (remainingTries.value === 0) stats.value.thirdTryWins++;
    gameOver.value = true;
    return;  // No need to decrement tries when user wins
  }

  if (remainingTries.value > 0) {
    remainingTries.value--;
  }

  if (remainingTries.value === 0) {
    // stats.value.totalFails++;
    gameOver.value = true;
  }
};

// Update statistics
const triesUsed = 3 - remainingTries.value;
  updateStats(status, triesUsed);
</script>

<style scoped>
.outer-container {
  display: flex;
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
  height: 100vh; /* Take up the full viewport height */
}
.game-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 0px;  /* Reduced gap between grid items */
  margin: auto;  /* Center the grid horizontally */
  width: 65%;  
}

.flashcard {
  margin: 0px;  /* Reduced margin around each flashcard */
}
.tries-container {
  position: absolute; /* Absolute positioning */
  left: 0;  /* Positioned at the left */
  top: 30%; /* Centered vertically */
  transform: translateY(-50%); /* Further centering adjustment */
  background: rgba(255,255,255,0.8); /* Background color with some opacity */
  padding: 50px; /* Padding around text */
  border-radius: 0 10px 10px 0; /* Rounded corners on right side */
  font-size: 24px;
  text-align: center;
}

.tries-container h3 {
  font-size: 48px;
  text-align: center;  /* Centers the text */
}

.game-over-container {
  position: absolute; /* Absolute positioning */
  right: 0;  /* Positioned at the left */
  top: 50%; /* Centered vertically */
  transform: translateY(-50%); /* Further centering adjustment */
  background: rgba(255,255,255,0.8); /* Background color with some opacity */
  padding: 10px; /* Padding around text */
  border-radius: 0 10px 10px 0; /* Rounded corners on right side */
  text-align: center;
}
.game-over-message {
  font-size: 3em;
  /* font-size: 48x; */
  text-align: center;
  color: red; /* or whatever color you prefer */
}

.stats-container {
  position: absolute; /* Absolute positioning */
  left: 0;  /* Positioned at the left */
  top: 60%; /* Centered vertically */
  transform: translateY(-50%); /* Further centering adjustment */
  background: rgba(255,255,255,0.8); /* Background color with some opacity */
  padding: 60px; /* Padding around text */
  border-radius: 0 10px 10px 0; /* Rounded corners on right side */
  text-align: center;
}

/* Add this to your existing <style scoped> section in App.vue */

.reset-button {
  background-color: #4CAF50; /* Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 15px 32px; /* Padding */
  text-align: center; /* Center text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Display as inline-block */
  font-size: 16px; /* Font size */
  margin: 4px 2px; /* Margin */
  cursor: pointer; /* Pointer cursor on hover */
  border-radius: 6px; /* Rounded corners */
}

.reset-button:hover {
  background-color: #45a049; /* Darker green on hover */
}

</style>