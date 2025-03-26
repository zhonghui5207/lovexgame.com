// Games Data
let featuredGames = [];
let popularGames = [];
let newGames = [];
let allGames = []; // Global variable to store all games

// Load games data from local storage
function loadGamesFromStorage() {
  // Try to get games data from localStorage
  const storedGames = localStorage.getItem('lovexgames_games');
  
  if (storedGames) {
    allGames = JSON.parse(storedGames); // Save all games to global variable
    
    // Categorize games based on status
    featuredGames = allGames.filter(game => game.status === 'Featured' || game.isFeatured);
    newGames = allGames.filter(game => game.status === 'New' || game.isNew);
    
    // Other games as popular games
    popularGames = allGames.filter(game => 
      (!game.status || (game.status !== 'Featured' && game.status !== 'New')) && 
      !game.isFeatured && !game.isNew
    );
  } else {
    // If no games data in localStorage, try to load from games_for_import.json
    loadGamesFromImportFile();
  }
}

// Load games data from games_for_import.json
function loadGamesFromImportFile() {
  // 使用正确的路径加载游戏数据
  fetch('/scripts/games_for_import.json')
    .then(response => {
      if (!response.ok) {
        // 尝试使用相对路径
        return fetch('scripts/games_for_import.json');
      }
      return response.json();
    })
    .then(response => {
      if (response.ok === false) {
        // 如果第二次尝试也失败，则返回空数组
        return [];
      }
      // 如果是正常的JSON响应，直接返回
      if (Array.isArray(response)) {
        return response;
      }
      // 否则尝试解析JSON
      return response.json();
    })
    .then(importGames => {
      if (!importGames || importGames.length === 0) {
        // 使用硬编码的示例游戏数据
        importGames = [
          {
            id: "voxiom-io",
            title: "Voxiom.io",
            category: "Action",
            thumbnailUrl: "https://imgs.crazygames.com/voxiom-io_16x9/20250325203708/voxiom-io_16x9-cover?metadata=none&quality=40&width=1200&height=630&fit=crop",
            description: "Voxiom.io is a 3D real-time multiplayer first-person voxel shooter featuring destructible maps.",
            rating: 4.4,
            embedUrl: "https://www.crazygames.com/embed/voxiom-io"
          },
          {
            id: "bullet-force-multiplayer",
            title: "Bullet Force",
            category: "Action",
            thumbnailUrl: "https://imgs.crazygames.com/bullet-force-multiplayer_16x9/20250323203709/bullet-force-multiplayer_16x9-cover?metadata=none&quality=40&width=1200&height=630&fit=crop",
            description: "Bullet Force is a modern 3D first-person shooter with great graphics and addictive gameplay.",
            rating: 4.2,
            embedUrl: "https://www.crazygames.com/embed/bullet-force-multiplayer"
          },
          {
            id: "forward-assault",
            title: "Forward Assault",
            category: "Action",
            thumbnailUrl: "https://imgs.crazygames.com/forward-assault_16x9/20250325203708/forward-assault_16x9-cover?metadata=none&quality=40&width=1200&height=630&fit=crop",
            description: "Forward Assault is a first-person shooter game inspired by Counter-Strike.",
            rating: 4.3,
            embedUrl: "https://www.crazygames.com/embed/forward-assault"
          }
        ];
      }
      
      // Add ID for each game (if not exists)
      allGames = importGames.map(game => {
        // Generate ID if game doesn't have one
        if (!game.id) {
          // Generate ID using title and timestamp
          const timestamp = Date.now();
          const randomNum = Math.floor(Math.random() * 1000);
          game.id = `game-${timestamp}-${randomNum}`;
        }
        return game;
      });
      
      // Save to localStorage
      localStorage.setItem('lovexgames_games', JSON.stringify(allGames));
      
      // Categorize games based on status
      featuredGames = allGames.slice(0, 3); // First 3 as featured games
      newGames = allGames.slice(3, 8); // Next 5 as new games
      popularGames = allGames.slice(8); // Remaining as popular games
      
      // Reload games on the page
      if (document.getElementById('featured-games') || 
          document.getElementById('popular-games') || 
          document.getElementById('new-games')) {
        loadHomePageGames();
      }
      
      // 如果在分类页面，重新加载分类游戏
      if (document.getElementById('category-games')) {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('id');
        if (categoryId) {
          loadCategoryGames(categoryId);
        }
      }
    })
    .catch(error => {
      featuredGames = [];
      popularGames = [];
      newGames = [];
    });
}

// Load games for the home page
function loadHomePageGames() {
  // First load games from storage
  loadGamesFromStorage();
  
  // Load featured games
  const featuredGamesContainer = document.getElementById('featured-games');
  if (featuredGamesContainer) {
    featuredGamesContainer.innerHTML = ''; // Clear container
    featuredGames.forEach(game => {
      featuredGamesContainer.appendChild(createGameCard(game));
    });
  }
  
  // Load popular games
  const popularGamesContainer = document.getElementById('popular-games');
  if (popularGamesContainer) {
    popularGamesContainer.innerHTML = ''; // Clear container
    popularGames.forEach(game => {
      popularGamesContainer.appendChild(createGameCard(game));
    });
  }
  
  // Load new games
  const newGamesContainer = document.getElementById('new-games');
  if (newGamesContainer) {
    newGamesContainer.innerHTML = ''; // Clear container
    newGames.forEach(game => {
      newGamesContainer.appendChild(createGameCard(game));
    });
  }
}

// Load category games
function loadCategoryGames(categoryId) {
  // 确保先从localStorage加载游戏数据
  if (allGames.length === 0) {
    loadGamesFromStorage();
  }
  
  // Get category name
  const category = gameCategories.find(cat => cat.id === categoryId);
  
  if (category) {
    // 打印当前选择的分类信息
    console.log('当前分类:', category);
    
    // 打印所有游戏的分类信息
    console.log('所有游戏的分类:');
    allGames.forEach(game => {
      console.log(`游戏: ${game.title}, 分类: ${game.category}`);
    });
    
    // 打印所有系统定义的分类
    console.log('系统定义的所有分类:');
    gameCategories.forEach(cat => {
      console.log(`分类ID: ${cat.id}, 分类名称: ${cat.name}`);
    });
    
    // Update page title
    document.title = `${category.name} Games - LovexGames`;
    document.getElementById('category-title').textContent = `${category.name} Games`;
    
    // 使用精确匹配筛选游戏
    let categoryGames = allGames.filter(game => {
      // 检查game.category是否存在
      if (!game.category) return false;
      
      // 直接比较category和分类名称，不转换大小写
      const match = game.category === category.name;
      console.log(`游戏: ${game.title}, 游戏分类: ${game.category}, 当前分类: ${category.name}, 匹配: ${match}`);
      return match;
    });
    
    // Display games
    const gamesContainer = document.getElementById('category-games');
    if (!gamesContainer) return;
    
    gamesContainer.innerHTML = '';
    
    if (categoryGames.length > 0) {
      categoryGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
      });
    } else {
      gamesContainer.innerHTML = '<p class="no-games">该分类下暂无游戏。</p>';
    }
  }
}

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
allGames = [...featuredGames, ...popularGames, ...newGames].filter((game, index, self) => 
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
  const gameFrameContainer = document.querySelector('.game-frame-container');
  if (gameFrameContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    if (gameId) {
      loadGameDetails(gameId);
    }
  }
  
  // Check if we're on the category page
  if (document.getElementById('category-games')) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    if (categoryId) {
      loadCategoryGames(categoryId);
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
    // Always open game details page, regardless of game source
    window.location.href = `game.html?id=${game.id}`;
  });
  
  return card;
}

// Load game details for the game page
function loadGameDetails(gameId) {
  if (!gameId) {
    document.getElementById('game-title').textContent = 'Game Not Found';
    document.getElementById('game-desc').textContent = 'No game ID was provided. Please try another game.';
    return;
  }

  // If allGames is empty, try to load games data first
  if (allGames.length === 0) {
    loadGamesFromStorage();
    
    // If still empty, try to load from import file
    if (allGames.length === 0) {
      fetch('scripts/games_for_import.json')
        .then(response => response.json())
        .then(importGames => {
          allGames = importGames.map(game => {
            if (!game.id) {
              const timestamp = Date.now();
              const randomNum = Math.floor(Math.random() * 1000);
              game.id = `game-${timestamp}-${randomNum}`;
            }
            return game;
          });
          
          // Save to localStorage
          localStorage.setItem('lovexgames_games', JSON.stringify(allGames));
          
          processGameDetails(gameId);
        })
        .catch(error => {
          document.getElementById('game-title').textContent = 'Error Loading Games';
          document.getElementById('game-desc').textContent = 'Failed to load game data. Please try again later.';
        });
      return;
    }
  }
  
  processGameDetails(gameId);
}

// Process game details (separated logic from loadGameDetails)
function processGameDetails(gameId) {
  let game = allGames.find(g => g.id === gameId);
  
  // If not found, try to replace underscores (_) with hyphens (-) and match
  if (!game && gameId.includes('_')) {
    const convertedId = gameId.replace(/_/g, '-');
    game = allGames.find(g => g.id === convertedId);
  }
  
  // If still not found, try to extract timestamp part and match
  if (!game && gameId.includes('_')) {
    const parts = gameId.split('_');
    if (parts.length >= 2) {
      const timestamp = parts[1];
      game = allGames.find(g => g.id && g.id.includes(timestamp));
    }
  }
  
  // If first load and no ID specified, use the first game
  if (!game && allGames.length > 0) {
    game = allGames[0];
  }
  
  // If still not found, log error and return
  if (!game) {
    document.getElementById('game-title').textContent = 'Game Not Found';
    document.getElementById('game-desc').textContent = 'The requested game could not be found. Please try another game.';
    return;
  }
  
  document.title = `${game.title} - LovexGames`;
  
  updateGameDetails(game);
  
  loadGameFrame(game);
  
  loadRelatedGames(game);
}

// Update game details UI
function updateGameDetails(game) {
  // 更新主标题和元数据
  const titleElements = document.querySelectorAll('#game-title');
  titleElements.forEach(el => {
    el.textContent = game.title;
  });
  
  // 更新分类和评分
  const categoryElement = document.getElementById('game-category');
  if (categoryElement) {
    categoryElement.textContent = game.category || 'Unknown';
  }
  
  const ratingElement = document.getElementById('game-rating');
  if (ratingElement) {
    ratingElement.textContent = `Rating: ${game.rating || '4.5'}/5`;
  }
  
  // 更新描述和说明
  const descElement = document.getElementById('game-desc');
  if (descElement) {
    descElement.textContent = game.description || 'No description available.';
  }
  
  const instructionsElement = document.getElementById('game-instructions');
  if (instructionsElement) {
    instructionsElement.textContent = game.instructions || 'No instructions available.';
  }
}

// Load game frame
function loadGameFrame(game) {
  const gameContainer = document.querySelector('.game-frame-container');
  if (!gameContainer) {
    return;
  }
  
  gameContainer.innerHTML = '';
  
  const iframe = document.createElement('iframe');
  iframe.className = 'game-frame';
  
  let gameUrl = game.embedUrl;
  if (gameUrl.startsWith('http:')) {
    gameUrl = gameUrl.replace('http:', 'https:');
  }
  
  iframe.src = gameUrl;
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad *;');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  
  if (game.embedUrl.includes('crazygames.com') || 
    (game.embedUrl.includes('http://') || game.embedUrl.includes('https://')) && 
    !game.embedUrl.includes(window.location.hostname)) {
    iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts');
  }
  
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'game-loading-indicator';
  loadingIndicator.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading game...</p>
  `;
  gameContainer.appendChild(loadingIndicator);
  
  iframe.onload = function() {
    loadingIndicator.remove();
  };
  
  iframe.onerror = function(error) {
    loadingIndicator.remove();
    showConnectionError(iframe, game);
  };
  
  gameContainer.appendChild(iframe);
  
  setTimeout(function() {
    if (document.body.contains(loadingIndicator)) {
      loadingIndicator.remove();
      showConnectionError(iframe, game);
    }
  }, 5000);
}

// Show connection error dialog
function showConnectionError(gameFrame, game) {
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
  
  const frameContainer = gameFrame.parentNode;
  
  frameContainer.appendChild(errorDialog);
  
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

// Load game offline mode
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
          justify-content: flex-start;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
          overflow-y: auto;
        }
        h2 {
          margin: 20px 0;
          font-size: 24px;
        }
        .game-image {
          max-width: 80%;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        p {
          max-width: 80%;
          line-height: 1.6;
          margin: 10px 0;
        }
        .instructions {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          width: 80%;
        }
        .offline-badge {
          background-color: #6c5ce7;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          margin-left: 10px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <h2>${game.title} <span class="offline-badge">Offline Mode</span></h2>
      ${game.thumbnailUrl ? `<img src="${game.thumbnailUrl}" alt="${game.title}" class="game-image">` : ''}
      <p>${game.description}</p>
      <div class="instructions">
        <h3>How to Play</h3>
        <p>${game.instructions}</p>
      </div>
      <p>Game cannot be loaded at this time. Please try again later or refresh the page.</p>
    </body>
    </html>
  `;
}

// Load related games for the game detail page
function loadRelatedGames(currentGame) {
  const relatedGamesContainer = document.getElementById('related-games-container');
  if (!relatedGamesContainer) return;
  
  const relatedGames = allGames
    .filter(game => game.category === currentGame.category && game.id !== currentGame.id)
    .slice(0, 5); // Limit to 5 related games
  
  if (relatedGames.length === 0) {
    relatedGamesContainer.innerHTML = '<p>No related games found.</p>';
    return;
  }
  
  relatedGames.forEach(game => {
    const relatedGameCard = document.createElement('div');
    relatedGameCard.className = 'related-game-card';
    
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
  
  alert(`Found ${searchResults.length} games matching "${query}"`);
}

// Helper function to get game count by category
function getGameCountByCategory(category) {
  return allGames.filter(game => 
    game.category && game.category.toLowerCase() === category.toLowerCase()
  ).length;
}

// Add a new game to the collection
function addGame(collection, gameData) {
  if (!gameData.id || !gameData.title || !gameData.embedUrl || !gameData.category) {
    return false;
  }
  
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
      return false;
  }
  
  if (!allGames.some(game => game.id === newGame.id)) {
    allGames.push(newGame);
  }
  
  if (document.readyState === 'complete') {
    const container = document.getElementById(`${collection}-games`);
    if (container) {
      container.appendChild(createGameCard(newGame));
    }
  }
  
  return true;
}

// The following functions are for backward compatibility
function createPlayableGameInterface(game) {
  loadGameFrame(game);
}

function isExternalGame(game) {
  if (!game.embedUrl) return false;
  
  return game.embedUrl.includes('crazygames.com') || 
    (game.embedUrl.includes('http://') || game.embedUrl.includes('https://')) && 
    !game.embedUrl.includes(window.location.hostname);
}

function createExternalGameInterface(container, game) {
  loadGameFrame(game);
}

function createInternalGameInterface(container, game) {
  loadGameFrame(game);
}

function launchGame(container, game) {
  loadGameFrame(game);
}

function createErrorMessage(container, game) {
  container.innerHTML = `
    <div class="game-error">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <h3>Unable to load the game</h3>
      <p>We couldn't load the game due to security restrictions. You can still play it by opening it in a new tab.</p>
      <button class="open-new-tab-btn" onclick="window.open('${game.embedUrl}', '_blank')">Open in New Tab</button>
    </div>
  `;
}
