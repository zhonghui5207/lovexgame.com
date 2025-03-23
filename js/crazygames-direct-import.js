/**
 * CrazyGames游戏直接导入工具
 * 使用CrazyGames API获取游戏数据并直接添加到游戏列表
 */

// CrazyGames API配置
const CRAZYGAMES_API = {
  BASE_URL: 'https://www.crazygames.com/api',
  GAME_ENDPOINT: '/game',
  GAMES_ENDPOINT: '/games',
  CATEGORIES_ENDPOINT: '/categories',
  // 如果需要API密钥，请在此处添加
  // API_KEY: 'your_api_key_here',
};

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态
  checkAuth();
  
  // 初始化UI元素
  initUI();
  
  // 加载分类列表
  loadCategories();
});

// 初始化UI元素
function initUI() {
  // 获取按钮元素
  const fetchGamesBtn = document.getElementById('fetch-games-btn');
  const importSelectedBtn = document.getElementById('import-selected-btn');
  const categorySelect = document.getElementById('category-select');
  const limitInput = document.getElementById('games-limit');
  
  // 添加事件监听器
  if (fetchGamesBtn) {
    fetchGamesBtn.addEventListener('click', function() {
      const category = categorySelect.value;
      const limit = parseInt(limitInput.value) || 10;
      fetchGames(category, limit);
    });
  }
  
  if (importSelectedBtn) {
    importSelectedBtn.addEventListener('click', importSelectedGames);
  }
  
  // 全选/取消全选
  const selectAllCheckbox = document.getElementById('select-all-games');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.game-select');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
  }
}

// 加载游戏分类
async function loadCategories() {
  const categorySelect = document.getElementById('category-select');
  const loadingElement = document.getElementById('categories-loading');
  
  if (!categorySelect) return;
  
  try {
    loadingElement.textContent = '正在加载分类...';
    
    // 调用API获取分类列表
    const response = await fetch(`${CRAZYGAMES_API.BASE_URL}${CRAZYGAMES_API.CATEGORIES_ENDPOINT}`);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const categories = await response.json();
    
    // 清空现有选项
    categorySelect.innerHTML = '<option value="">所有分类</option>';
    
    // 添加分类选项
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.slug;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
    
    loadingElement.textContent = '';
  } catch (error) {
    console.error('加载分类出错:', error);
    loadingElement.textContent = '加载分类失败，请重试';
  }
}

// 获取游戏列表
async function fetchGames(category = '', limit = 10) {
  const gamesContainer = document.getElementById('games-container');
  const loadingElement = document.getElementById('games-loading');
  const importSelectedBtn = document.getElementById('import-selected-btn');
  
  if (!gamesContainer) return;
  
  try {
    // 显示加载中
    loadingElement.textContent = '正在获取游戏数据...';
    gamesContainer.innerHTML = '';
    
    // 隐藏导入按钮
    if (importSelectedBtn) {
      importSelectedBtn.style.display = 'none';
    }
    
    // 构建API URL
    let apiUrl = `${CRAZYGAMES_API.BASE_URL}${CRAZYGAMES_API.GAMES_ENDPOINT}?limit=${limit}`;
    if (category) {
      apiUrl += `&category=${category}`;
    }
    
    // 调用API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const games = await response.json();
    
    // 存储游戏数据到会话存储
    sessionStorage.setItem('crazyGamesData', JSON.stringify(games));
    
    // 显示游戏列表
    renderGames(games);
    
    loadingElement.textContent = '';
    
    // 显示导入按钮
    if (importSelectedBtn && games.length > 0) {
      importSelectedBtn.style.display = 'inline-block';
    }
  } catch (error) {
    console.error('获取游戏数据出错:', error);
    loadingElement.textContent = '获取游戏数据失败，请重试';
  }
}

// 渲染游戏列表
function renderGames(games) {
  const gamesContainer = document.getElementById('games-container');
  const gamesCount = document.getElementById('games-count');
  
  if (!gamesContainer) return;
  
  // 清空容器
  gamesContainer.innerHTML = '';
  
  // 更新游戏计数
  if (gamesCount) {
    gamesCount.textContent = `找到 ${games.length} 个游戏`;
  }
  
  // 创建游戏卡片
  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    
    // 获取游戏缩略图
    const thumbnailUrl = game.thumbnailUrl || game.thumbnails?.normal || '';
    
    gameCard.innerHTML = `
      <div class="game-thumbnail">
        <img src="${thumbnailUrl}" alt="${game.name}" onerror="this.src='../images/placeholder.jpg'">
      </div>
      <div class="game-info">
        <h3>${game.name}</h3>
        <p class="game-description">${game.description || '暂无描述'}</p>
        <div class="game-meta">
          <span class="game-category">${game.category || '未分类'}</span>
          <span class="game-rating">${game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
        </div>
      </div>
      <div class="game-actions">
        <label class="checkbox-container">
          <input type="checkbox" class="game-select" data-game-id="${game.id}" checked>
          <span class="checkmark"></span>
        </label>
      </div>
    `;
    
    gamesContainer.appendChild(gameCard);
  });
}

// 导入选中的游戏
function importSelectedGames() {
  // 获取选中的游戏
  const selectedGames = [];
  const checkboxes = document.querySelectorAll('.game-select:checked');
  
  // 从会话存储获取游戏数据
  const allGames = JSON.parse(sessionStorage.getItem('crazyGamesData') || '[]');
  
  // 筛选选中的游戏
  checkboxes.forEach(checkbox => {
    const gameId = checkbox.getAttribute('data-game-id');
    const game = allGames.find(g => g.id === gameId);
    if (game) {
      selectedGames.push(game);
    }
  });
  
  if (selectedGames.length === 0) {
    alert('请至少选择一个游戏');
    return;
  }
  
  // 转换为我们网站的游戏格式
  const formattedGames = convertToSiteFormat(selectedGames);
  
  // 获取现有游戏数据
  let existingGames = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  // 添加新游戏到现有游戏列表
  const result = addGamesToLibrary(formattedGames, existingGames);
  
  // 显示导入结果
  showImportResult(result.added, result.updated, result.failed);
}

// 将CrazyGames数据转换为网站格式
function convertToSiteFormat(games) {
  return games.map((game, index) => {
    // 生成唯一ID
    const gameId = `game-${Date.now()}-${index}`;
    
    // 处理嵌入URL
    const embedUrl = game.url || `https://www.crazygames.com/game/${game.slug}`;
    
    // 处理缩略图URL
    const thumbnailUrl = game.thumbnailUrl || game.thumbnails?.normal || '';
    
    return {
      id: gameId,
      title: game.name || '',
      description: game.description || '',
      embedUrl: embedUrl,
      thumbnailUrl: thumbnailUrl,
      category: game.category || '未分类',
      rating: game.rating || 0,
      dateAdded: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
      instructions: game.instructions || '',
      isFeatured: false,
      isNew: true
    };
  });
}

// 添加游戏到库
function addGamesToLibrary(newGames, existingGames) {
  const result = {
    added: 0,
    updated: 0,
    failed: 0,
    failedGames: []
  };
  
  // 获取现有游戏ID列表
  const existingIds = existingGames.map(game => game.id);
  
  // 处理每个新游戏
  newGames.forEach(newGame => {
    try {
      // 验证必填字段
      if (!newGame.title) {
        result.failed++;
        result.failedGames.push({ title: newGame.title || '未命名游戏', error: '游戏标题不能为空' });
        return;
      }
      
      // 检查游戏是否已存在（通过标题和嵌入URL检查）
      const existingIndex = existingGames.findIndex(game => 
        game.title === newGame.title || game.embedUrl === newGame.embedUrl
      );
      
      if (existingIndex !== -1) {
        // 更新现有游戏
        existingGames[existingIndex] = {
          ...existingGames[existingIndex],
          ...newGame,
          id: existingGames[existingIndex].id // 保留原ID
        };
        result.updated++;
      } else {
        // 添加新游戏
        existingGames.push(newGame);
        result.added++;
      }
    } catch (error) {
      console.error('处理游戏数据出错:', error);
      result.failed++;
      result.failedGames.push({ title: newGame.title || '未命名游戏', error: error.message });
    }
  });
  
  // 保存更新后的游戏数据
  localStorage.setItem('lovexgames_games', JSON.stringify(existingGames));
  
  return result;
}

// 显示导入结果
function showImportResult(addedCount, updatedCount, errorCount) {
  const resultContainer = document.getElementById('import-result-container');
  const resultElement = document.getElementById('import-result');
  
  if (!resultContainer || !resultElement) return;
  
  // 隐藏游戏列表容器
  document.getElementById('games-list-container').style.display = 'none';
  
  // 构建结果HTML
  let resultHTML = `
    <div class="import-summary">
      <div class="import-stat">
        <i class="fas fa-plus-circle"></i>
        <span class="stat-count">${addedCount}</span>
        <span class="stat-label">新增游戏</span>
      </div>
      <div class="import-stat">
        <i class="fas fa-sync-alt"></i>
        <span class="stat-count">${updatedCount}</span>
        <span class="stat-label">更新游戏</span>
      </div>
      <div class="import-stat">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="stat-count">${errorCount}</span>
        <span class="stat-label">导入失败</span>
      </div>
    </div>
    
    <p class="import-success-message">
      <i class="fas fa-check-circle"></i> 游戏已成功导入到您的游戏库！
    </p>
  `;
  
  // 更新结果内容
  resultElement.innerHTML = resultHTML;
  
  // 显示结果容器
  resultContainer.style.display = 'block';
  
  // 滚动到结果区域
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 重置导入过程
function resetImport() {
  // 显示游戏列表容器
  document.getElementById('games-list-container').style.display = 'block';
  
  // 隐藏结果容器
  document.getElementById('import-result-container').style.display = 'none';
  
  // 清空游戏容器
  document.getElementById('games-container').innerHTML = '';
  document.getElementById('games-loading').textContent = '请选择分类并点击"获取游戏"按钮';
  
  // 隐藏导入按钮
  document.getElementById('import-selected-btn').style.display = 'none';
  
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
