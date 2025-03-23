// Games Data
const featuredGames = [
  {
    id: 'doors-online',
    title: "Doors Online",
    description: "A thrilling multiplayer horror game inspired by the popular Roblox experience.",
    embedUrl: "https://www.crazygames.com/embed/doors-online",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Doors+Online",
    category: "Horror",
    rating: 4.7,
    dateAdded: "March 2025",
    instructions: "Use WASD or arrow keys to move your character. Press E to interact with objects and doors. Work together with other players to solve puzzles and survive the horrors that lurk behind each door.",
    isFeatured: true,
    isNew: false
  }
];

const popularGames = [
  {
    id: 'ragdoll-archers',
    title: "Ragdoll Archers",
    description: "Compete in archery battles with hilarious ragdoll physics.",
    embedUrl: "https://www.crazygames.com/embed/ragdoll-archers",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Ragdoll+Archers",
    category: "Action",
    rating: 4.5,
    dateAdded: "March 2025",
    instructions: "Use your mouse to aim and shoot arrows. Try to hit your opponents while avoiding their shots.",
    isFeatured: false,
    isNew: false
  },
  {
    id: 'subway-surfers',
    title: "Subway Surfers",
    description: "Run as fast as you can through the subway in this endless runner game.",
    embedUrl: "https://www.crazygames.com/embed/subway-surfers",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Subway+Surfers",
    category: "Action",
    rating: 4.8,
    dateAdded: "February 2025",
    instructions: "Swipe up to jump, down to roll, and left or right to change lanes. Collect coins and power-ups while avoiding obstacles.",
    isFeatured: false,
    isNew: false
  },
  {
    id: 'farm-merge-valley',
    title: "Farm Merge Valley",
    description: "Build and expand your farm by merging similar items in this relaxing game.",
    embedUrl: "https://www.crazygames.com/embed/farm-merge-valley",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Farm+Merge+Valley",
    category: "Puzzle",
    rating: 4.4,
    dateAdded: "February 2025",
    instructions: "Click and drag similar items to merge them into higher-level items. Manage your resources efficiently to expand your farm.",
    isFeatured: false,
    isNew: false
  },
  {
    id: 'bloxd-io',
    title: "Bloxd.io",
    description: "A multiplayer block-building and survival game similar to Minecraft.",
    embedUrl: "https://www.crazygames.com/embed/bloxdio",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Bloxd.io",
    category: "Adventure",
    rating: 4.7,
    dateAdded: "December 2024",
    instructions: "Use WASD to move, Space to jump, and mouse to look around. Left-click to break blocks and right-click to place them.",
    isFeatured: false,
    isNew: false
  },
  {
    id: 'slice-master',
    title: "Slice Master",
    description: "Test your precision by slicing through stacked objects in this satisfying game.",
    embedUrl: "https://www.crazygames.com/embed/slice-master",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Slice+Master",
    category: "Puzzle",
    rating: 4.4,
    dateAdded: "February 2025",
    instructions: "Drag your finger or mouse to slice through the stacked objects. Try to get as close to the perfect cut as possible.",
    isFeatured: false,
    isNew: false
  }
];

const newGames = [
  {
    id: 'farm-merge-valley',
    title: "Farm Merge Valley",
    description: "Build and expand your farm by merging similar items in this relaxing game.",
    embedUrl: "https://www.crazygames.com/embed/farm-merge-valley",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Farm+Merge+Valley",
    category: "Puzzle",
    rating: 4.6,
    dateAdded: "March 2025",
    instructions: "Drag and drop similar items to merge them into upgraded versions. Build and expand your farm to unlock new items and areas.",
    isFeatured: false,
    isNew: true
  },
  {
    id: 'pirates-caribbean',
    title: "Pirates of the Caribbean",
    description: "Set sail on the high seas in this adventure game based on the popular movie franchise.",
    embedUrl: "https://www.crazygames.com/embed/pirates-of-the-caribbean",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Pirates+of+the+Caribbean",
    category: "Adventure",
    rating: 4.5,
    dateAdded: "March 2025",
    instructions: "Use WASD to navigate your ship. Press Space to fire cannons and E to interact with objects.",
    isFeatured: false,
    isNew: true
  },
  {
    id: 'tower-defense',
    title: "Tower Defense",
    description: "Strategically place towers to defend against waves of enemies in this classic game.",
    embedUrl: "https://www.crazygames.com/embed/tower-defense",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Tower+Defense",
    category: "Strategy",
    rating: 4.3,
    dateAdded: "March 2025",
    instructions: "Click on the map to place towers. Upgrade towers by clicking on them and selecting the upgrade option.",
    isFeatured: false,
    isNew: true
  },
  {
    id: 'word-finding',
    title: "Word Finding",
    description: "Test your vocabulary by finding words in a grid of letters.",
    embedUrl: "https://www.crazygames.com/embed/word-finding",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Word+Finding",
    category: "Puzzle",
    rating: 4.2,
    dateAdded: "February 2025",
    instructions: "Drag your finger or mouse to connect letters and form words. The longer the word, the more points you earn.",
    isFeatured: false,
    isNew: true
  },
  {
    id: 'docks-io',
    title: "Docks.io",
    description: "Build and manage your own shipping dock in this multiplayer simulation game.",
    embedUrl: "https://www.crazygames.com/embed/docks-io",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Docks.io",
    category: "Simulation",
    rating: 4.4,
    dateAdded: "February 2025",
    instructions: "Click to select buildings and ships. Drag to place buildings. Manage resources efficiently to expand your dock.",
    isFeatured: false,
    isNew: true
  },
  {
    id: 'survival-rush',
    title: "Survival Rush",
    description: "Survive as long as possible in this fast-paced action game.",
    embedUrl: "https://www.crazygames.com/embed/survival-rush",
    thumbnailUrl: "https://placehold.co/600x400/1a1b26/ffffff?text=Survival+Rush",
    category: "Action",
    rating: 4.5,
    dateAdded: "February 2025",
    instructions: "Use WASD to move and mouse to aim and shoot. Collect power-ups to enhance your abilities.",
    isFeatured: false,
    isNew: true
  }
];

// Game categories
const gameCategories = [
  { id: 'action', name: 'Action', color: '#FF5252' },
  { id: 'adventure', name: 'Adventure', color: '#FF9800' },
  { id: 'puzzle', name: 'Puzzle', color: '#2196F3' },
  { id: 'strategy', name: 'Strategy', color: '#4CAF50' },
  { id: 'sports', name: 'Sports', color: '#9C27B0' },
  { id: 'racing', name: 'Racing', color: '#F44336' },
  { id: 'simulation', name: 'Simulation', color: '#795548' },
  { id: 'horror', name: 'Horror', color: '#607D8B' }
];

// All games combined for search and reference
const allGames = [...featuredGames, ...popularGames, ...newGames].filter((game, index, self) => 
  index === self.findIndex((g) => g.id === game.id)
);

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page
  if (document.getElementById('featured-games')) {
    loadHomePageGames();
    loadGameCategories();
  }
  
  // Check if we're on the game detail page
  if (document.getElementById('game-frame')) {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    if (gameId) {
      loadGameDetails(gameId);
    }
  }
  
  // Add event listener for search
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        searchGames(this.value);
      }
    });
  }
});

// Load games for the home page
function loadHomePageGames() {
  // Load featured games
  const featuredGamesContainer = document.getElementById('featured-games');
  if (featuredGamesContainer) {
    featuredGames.forEach(game => {
      featuredGamesContainer.appendChild(createGameCard(game));
    });
  }
  
  // Load popular games
  const popularGamesContainer = document.getElementById('popular-games');
  if (popularGamesContainer) {
    popularGames.forEach(game => {
      popularGamesContainer.appendChild(createGameCard(game));
    });
  }
  
  // Load new games
  const newGamesContainer = document.getElementById('new-games');
  if (newGamesContainer) {
    newGames.forEach(game => {
      newGamesContainer.appendChild(createGameCard(game));
    });
  }
}

// Load game categories
function loadGameCategories() {
  const categoriesContainer = document.getElementById('game-categories');
  if (categoriesContainer) {
    gameCategories.forEach(category => {
      const categoryCard = document.createElement('div');
      categoryCard.className = 'game-card category-card';
      categoryCard.style.backgroundColor = category.color;
      
      categoryCard.innerHTML = `
        <div class="category-content">
          <h3>${category.name}</h3>
          <p>${getGameCountByCategory(category.name)} Games</p>
        </div>
      `;
      
      categoryCard.addEventListener('click', function() {
        window.location.href = `category.html?id=${category.id}`;
      });
      
      categoriesContainer.appendChild(categoryCard);
    });
  }
}

// Create a game card element
function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  
  // Default thumbnail if not provided
  const thumbnailUrl = game.thumbnailUrl || `https://placehold.co/300x200/1a1b26/ffffff?text=${encodeURIComponent(game.title)}`;
  
  card.innerHTML = `
    <div class="game-thumbnail">
      <img src="${thumbnailUrl}" alt="${game.title}">
      ${game.isNew ? '<span class="game-badge">NEW</span>' : ''}
      ${game.isFeatured ? '<span class="game-badge">FEATURED</span>' : ''}
    </div>
    <div class="game-info">
      <h3 class="game-title">${game.title}</h3>
      <p class="game-category">${game.category}</p>
    </div>
  `;
  
  card.addEventListener('click', function() {
    window.location.href = `game.html?id=${game.id}`;
  });
  
  return card;
}

// Load game details for the game page
function loadGameDetails(gameId) {
  const game = allGames.find(g => g.id === gameId);
  
  if (!game) {
    console.error('Game not found:', gameId);
    return;
  }
  
  // Set page title
  document.title = `${game.title} - LovexGames`;
  
  // Update game iframe
  const gameFrame = document.getElementById('game-frame');
  if (gameFrame) {
    // Set iframe source
    gameFrame.src = game.embedUrl;
    
    // Handle iframe load event
    gameFrame.onload = function() {
      console.log('Game frame loaded successfully');
    };
    
    // Handle iframe error event
    gameFrame.onerror = function() {
      console.error('Error loading game frame');
      showConnectionError(gameFrame, game);
    };
  }
  
  // Update game details
  document.getElementById('game-title').textContent = game.title;
  document.getElementById('game-category').textContent = game.category;
  document.getElementById('game-rating').textContent = `Rating: ${game.rating}/5`;
  document.getElementById('game-date').textContent = `Added: ${game.dateAdded}`;
  document.getElementById('game-desc').textContent = game.description;
  document.getElementById('game-instructions').textContent = game.instructions;
  
  // Load related games (games in the same category)
  loadRelatedGames(game);
}

// Show connection error dialog
function showConnectionError(gameFrame, game) {
  // Create error dialog element
  const errorDialog = document.createElement('div');
  errorDialog.className = 'connection-error-dialog';
  errorDialog.innerHTML = `
    <div class="error-icon">
      <svg viewBox="0 0 24 24" width="48" height="48">
        <path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    </div>
    <h3>Connection issues</h3>
    <p>Oops, we're having troubles connecting you. Any progress you make will be lost. Try reloading the game to solve the issue.</p>
    <div class="error-buttons">
      <button class="offline-button">Continue offline</button>
      <button class="reload-button">Reload game</button>
    </div>
  `;
  
  // Get the game frame container
  const frameContainer = gameFrame.parentNode;
  
  // Add the error dialog to the container
  frameContainer.appendChild(errorDialog);
  
  // Add event listeners to buttons
  const offlineButton = errorDialog.querySelector('.offline-button');
  const reloadButton = errorDialog.querySelector('.reload-button');
  
  offlineButton.addEventListener('click', function() {
    errorDialog.remove();
    loadOfflineMode(gameFrame, game);
  });
  
  reloadButton.addEventListener('click', function() {
    errorDialog.remove();
    gameFrame.src = game.embedUrl;
  });
}

// Load offline mode for the game
function loadOfflineMode(gameFrame, game) {
  gameFrame.srcdoc = `
    <html>
    <head>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #1a1b26;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        h2 {
          margin-bottom: 15px;
        }
        .game-image {
          max-width: 80%;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h2>${game.title} - Offline Mode</h2>
      <img src="${game.thumbnailUrl}" alt="${game.title}" class="game-image">
      <p>${game.description}</p>
      <p><strong>How to play:</strong> ${game.instructions}</p>
    </body>
    </html>
  `;
}

// Load related games for the game detail page
function loadRelatedGames(currentGame) {
  const relatedGamesContainer = document.getElementById('related-games-container');
  if (!relatedGamesContainer) return;
  
  // Clear container
  relatedGamesContainer.innerHTML = '';
  
  // Find games in the same category, excluding the current game
  const relatedGames = allGames
    .filter(game => game.category === currentGame.category && game.id !== currentGame.id)
    .slice(0, 5); // Limit to 5 related games
  
  if (relatedGames.length === 0) {
    relatedGamesContainer.innerHTML = '<p>No related games found.</p>';
    return;
  }
  
  // Add related games to container
  relatedGames.forEach(game => {
    const relatedGameCard = document.createElement('div');
    relatedGameCard.className = 'related-game-card';
    
    // Default thumbnail if not provided
    const thumbnailUrl = game.thumbnailUrl || `https://placehold.co/80x60/1a1b26/ffffff?text=${encodeURIComponent(game.title)}`;
    
    relatedGameCard.innerHTML = `
      <div class="related-game-thumb">
        <img src="${thumbnailUrl}" alt="${game.title}">
      </div>
      <div class="related-game-info">
        <h3 class="related-game-title">${game.title}</h3>
        <p class="related-game-category">${game.category}</p>
      </div>
    `;
    
    relatedGameCard.addEventListener('click', function() {
      window.location.href = `game.html?id=${game.id}`;
    });
    
    relatedGamesContainer.appendChild(relatedGameCard);
  });
}

// Search games
function searchGames(query) {
  if (!query.trim()) return;
  
  const searchResults = allGames.filter(game => 
    game.title.toLowerCase().includes(query.toLowerCase()) || 
    game.description.toLowerCase().includes(query.toLowerCase()) ||
    game.category.toLowerCase().includes(query.toLowerCase())
  );
  
  // Redirect to search results page (to be implemented)
  console.log('Search results:', searchResults);
  alert(`Found ${searchResults.length} games matching "${query}"`);
  
  // TODO: Implement search results page
}

// Helper function to get game count by category
function getGameCountByCategory(category) {
  return allGames.filter(game => game.category === category).length;
}

// Add a new game to the collection
function addGame(collection, gameData) {
  // Validate required fields
  if (!gameData.id || !gameData.title || !gameData.embedUrl || !gameData.category) {
    console.error('Missing required game data fields');
    return false;
  }
  
  // Add default values if not provided
  const newGame = {
    description: '',
    thumbnailUrl: '',
    rating: 4.0,
    dateAdded: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    instructions: '',
    isFeatured: false,
    isNew: true,
    ...gameData
  };
  
  // Add to the specified collection
  switch (collection) {
    case 'featured':
      featuredGames.push(newGame);
      break;
    case 'popular':
      popularGames.push(newGame);
      break;
    case 'new':
      newGames.push(newGame);
      break;
    default:
      console.error('Invalid collection:', collection);
      return false;
  }
  
  // Add to allGames if not already present
  if (!allGames.some(game => game.id === newGame.id)) {
    allGames.push(newGame);
  }
  
  // Refresh the UI if the page is loaded
  if (document.readyState === 'complete') {
    const container = document.getElementById(`${collection}-games`);
    if (container) {
      container.appendChild(createGameCard(newGame));
    }
  }
  
  return true;
}
