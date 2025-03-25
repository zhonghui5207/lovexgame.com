// Games Data
let featuredGames = [];
let popularGames = [];
let newGames = [];
let allGames = []; // 全局变量存储所有游戏

// 从本地存储加载游戏数据
function loadGamesFromStorage() {
  // 尝试从localStorage获取游戏数据
  const storedGames = localStorage.getItem('lovexgames_games');
  
  if (storedGames) {
    allGames = JSON.parse(storedGames); // 保存所有游戏到全局变量
    
    // 根据状态分类游戏
    featuredGames = allGames.filter(game => game.status === '推荐' || game.isFeatured);
    newGames = allGames.filter(game => game.status === '新游戏' || game.isNew);
    
    // 其他游戏作为热门游戏
    popularGames = allGames.filter(game => 
      (!game.status || (game.status !== '推荐' && game.status !== '新游戏')) && 
      !game.isFeatured && !game.isNew
    );
  } else {
    // 如果localStorage中没有游戏数据，尝试从games_for_import.json加载
    loadGamesFromImportFile();
  }
}

// 从games_for_import.json加载游戏数据
function loadGamesFromImportFile() {
  console.log('尝试从games_for_import.json加载游戏数据');
  
  // 使用fetch API加载游戏数据
  fetch('scripts/games_for_import.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('无法加载游戏数据文件');
      }
      return response.json();
    })
    .then(importGames => {
      console.log('成功加载游戏数据:', importGames);
      
      // 为每个游戏添加ID（如果没有）
      allGames = importGames.map(game => {
        // 如果游戏没有ID，生成一个
        if (!game.id) {
          // 使用title和时间戳生成ID
          const timestamp = Date.now();
          const randomNum = Math.floor(Math.random() * 1000);
          game.id = `game-${timestamp}-${randomNum}`;
        }
        return game;
      });
      
      // 保存到localStorage
      localStorage.setItem('lovexgames_games', JSON.stringify(allGames));
      
      // 根据状态分类游戏
      featuredGames = allGames.slice(0, 3); // 前3个作为推荐游戏
      newGames = allGames.slice(3, 8); // 接下来5个作为新游戏
      popularGames = allGames.slice(8); // 剩余的作为热门游戏
      
      // 重新加载页面上的游戏
      if (document.getElementById('featured-games') || 
          document.getElementById('popular-games') || 
          document.getElementById('new-games')) {
        loadHomePageGames();
      }
    })
    .catch(error => {
      console.error('加载游戏数据失败:', error);
      featuredGames = [];
      popularGames = [];
      newGames = [];
    });
}

// Load games for the home page
function loadHomePageGames() {
  // 首先从存储中加载游戏
  loadGamesFromStorage();
  
  // Load featured games
  const featuredGamesContainer = document.getElementById('featured-games');
  if (featuredGamesContainer) {
    featuredGamesContainer.innerHTML = ''; // 清空容器
    featuredGames.forEach(game => {
      featuredGamesContainer.appendChild(createGameCard(game));
    });
  }
  
  // Load popular games
  const popularGamesContainer = document.getElementById('popular-games');
  if (popularGamesContainer) {
    popularGamesContainer.innerHTML = ''; // 清空容器
    popularGames.forEach(game => {
      popularGamesContainer.appendChild(createGameCard(game));
    });
  }
  
  // Load new games
  const newGamesContainer = document.getElementById('new-games');
  if (newGamesContainer) {
    newGamesContainer.innerHTML = ''; // 清空容器
    newGames.forEach(game => {
      newGamesContainer.appendChild(createGameCard(game));
    });
  }
}

// 加载分类游戏
function loadCategoryGames(categoryId) {
  // 获取分类名称
  const category = gameCategories.find(cat => cat.id === categoryId);
  
  if (category) {
    // 更新页面标题
    document.title = `${category.name} 游戏 - LovexGames`;
    document.getElementById('category-title').textContent = `${category.name} 游戏`;
    
    // 获取该分类的游戏
    const categoryGames = allGames.filter(game => 
      game.category && game.category.toLowerCase() === category.name.toLowerCase()
    );
    
    // 显示游戏
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
    // 始终打开游戏详情页，无论游戏来源
    window.location.href = `game.html?id=${game.id}`;
  });
  
  return card;
}

// Load game details for the game page
function loadGameDetails(gameId) {
  if (!gameId) {
    console.error('No game ID provided');
    document.getElementById('game-title').textContent = 'Game Not Found';
    document.getElementById('game-desc').textContent = 'No game ID was provided. Please try another game.';
    return;
  }

  // 如果allGames为空，先尝试加载游戏数据
  if (allGames.length === 0) {
    console.log('游戏数据为空，尝试加载数据');
    loadGamesFromStorage();
    
    // 如果仍然为空，尝试从导入文件加载
    if (allGames.length === 0) {
      console.log('从localStorage加载失败，尝试从导入文件加载');
      
      // 使用Promise来处理异步加载
      fetch('scripts/games_for_import.json')
        .then(response => response.json())
        .then(importGames => {
          console.log('成功加载游戏数据:', importGames);
          
          // 为每个游戏添加ID（如果没有）
          allGames = importGames.map(game => {
            if (!game.id) {
              const timestamp = Date.now();
              const randomNum = Math.floor(Math.random() * 1000);
              game.id = `game-${timestamp}-${randomNum}`;
            }
            return game;
          });
          
          // 保存到localStorage
          localStorage.setItem('lovexgames_games', JSON.stringify(allGames));
          
          // 加载完成后，继续处理游戏详情
          processGameDetails(gameId);
        })
        .catch(error => {
          console.error('加载游戏数据失败:', error);
          document.getElementById('game-title').textContent = 'Error Loading Games';
          document.getElementById('game-desc').textContent = 'Failed to load game data. Please try again later.';
        });
      return;
    }
  }
  
  // 如果已经有游戏数据，直接处理
  processGameDetails(gameId);
}

// 处理游戏详情（从loadGameDetails分离出来的逻辑）
function processGameDetails(gameId) {
  console.log('处理游戏详情，ID:', gameId);
  
  // 尝试直接匹配ID
  let game = allGames.find(g => g.id === gameId);
  
  // 如果没有找到，尝试将URL中的下划线(_)替换为连字符(-)后匹配
  if (!game && gameId.includes('_')) {
    const convertedId = gameId.replace(/_/g, '-');
    game = allGames.find(g => g.id === convertedId);
  }
  
  // 如果仍然没有找到，尝试提取时间戳部分进行匹配
  if (!game && gameId.includes('_')) {
    const parts = gameId.split('_');
    if (parts.length >= 2) {
      const timestamp = parts[1];
      game = allGames.find(g => g.id && g.id.includes(timestamp));
    }
  }
  
  // 如果是首次加载游戏且没有指定ID，使用第一个游戏
  if (!game && allGames.length > 0) {
    game = allGames[0];
  }
  
  // 如果仍然没有找到游戏，记录错误并返回
  if (!game) {
    document.getElementById('game-title').textContent = 'Game Not Found';
    document.getElementById('game-desc').textContent = 'The requested game could not be found. Please try another game.';
    return;
  }
  
  console.log('匹配到游戏:', game);
  
  // 设置页面标题
  document.title = `${game.title} - LovexGames`;
  
  // 更新游戏详情UI
  updateGameDetails(game);
  
  // 加载游戏框架
  loadGameFrame(game);
  
  // 加载相关游戏
  loadRelatedGames(game);
}

// 更新游戏详情UI
function updateGameDetails(game) {
  document.getElementById('game-title').textContent = game.title;
  document.getElementById('game-category').textContent = game.category || 'Unknown';
  document.getElementById('game-rating').textContent = `Rating: ${game.rating || '4.5'}/5`;
  document.getElementById('game-date').textContent = `Added: ${game.dateAdded || 'March 2025'}`;
  document.getElementById('game-desc').textContent = game.description || 'No description available.';
  document.getElementById('game-instructions').textContent = game.instructions || 'No instructions available.';
}

// 加载游戏框架
function loadGameFrame(game) {
  console.log('加载游戏框架:', game.title, game.embedUrl);
  
  const gameContainer = document.querySelector('.game-frame-container');
  if (!gameContainer) {
    console.error('游戏容器不存在');
    return;
  }
  
  // 清空容器
  gameContainer.innerHTML = '';
  
  // 检查游戏嵌入URL是否存在
  if (!game.embedUrl) {
    gameContainer.innerHTML = '<div class="game-error"><p>No game URL provided.</p></div>';
    return;
  }
  
  // 判断是外部游戏还是内部游戏
  const isExternal = game.embedUrl.includes('crazygames.com') || (
    (game.embedUrl.includes('http://') || game.embedUrl.includes('https://')) &&
    !game.embedUrl.includes(window.location.hostname)
  );
  
  console.log('游戏类型:', isExternal ? '外部游戏' : '内部游戏');
  
  // 创建iframe元素
  const iframe = document.createElement('iframe');
  iframe.className = 'game-frame';
  
  // 确保使用HTTPS
  let gameUrl = game.embedUrl;
  if (gameUrl.startsWith('http:')) {
    gameUrl = gameUrl.replace('http:', 'https:');
  }
  
  // 设置iframe属性
  iframe.src = gameUrl;
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad *;');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  
  if (isExternal) {
    iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts');
  }
  
  // 添加加载指示器
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'game-loading-indicator';
  loadingIndicator.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading game...</p>
  `;
  gameContainer.appendChild(loadingIndicator);
  
  // iframe加载完成后移除加载指示器
  iframe.onload = function() {
    console.log('游戏iframe加载完成');
    loadingIndicator.remove();
  };
  
  // 处理加载错误
  iframe.onerror = function(error) {
    console.error('游戏iframe加载失败:', error);
    loadingIndicator.remove();
    showConnectionError(iframe, game);
  };
  
  // 添加iframe到容器
  gameContainer.appendChild(iframe);
  
  // 设置超时检测(5秒)，如果游戏还未加载完成，可能存在问题
  setTimeout(function() {
    if (document.body.contains(loadingIndicator)) {
      console.log('游戏加载超时，显示错误对话框');
      loadingIndicator.remove();
      showConnectionError(iframe, game);
    }
  }, 5000);
}

// 显示连接错误对话框
function showConnectionError(gameFrame, game) {
  // 创建错误对话框元素
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
  
  // 获取游戏框架容器
  const frameContainer = gameFrame.parentNode;
  
  // 添加错误对话框到容器
  frameContainer.appendChild(errorDialog);
  
  // 添加按钮事件监听器
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

// 加载游戏离线模式
function loadOfflineMode(gameFrame, game) {
  console.log('加载离线模式:', game.title);
  
  // 确保游戏对象有所有必要的属性
  const gameTitle = game.title || 'Unknown Game';
  const gameDesc = game.description || 'No description available.';
  const gameInstructions = game.instructions || 'No instructions available.';
  const gameThumbnail = game.thumbnailUrl || '';
  
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
      <h2>${gameTitle} <span class="offline-badge">Offline Mode</span></h2>
      ${gameThumbnail ? `<img src="${gameThumbnail}" alt="${gameTitle}" class="game-image">` : ''}
      <p>${gameDesc}</p>
      <div class="instructions">
        <h3>How to Play</h3>
        <p>${gameInstructions}</p>
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

// 以下函数为了保持向后兼容
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
  // 直接调用新函数
  loadGameFrame(game);
}

function createInternalGameInterface(container, game) {
  // 直接调用新函数
  loadGameFrame(game);
}

function launchGame(container, game) {
  // 直接调用新函数
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
