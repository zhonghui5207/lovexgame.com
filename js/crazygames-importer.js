/**
 * CrazyGames游戏导入工具
 * 使用CrazyGames API获取游戏数据并转换为Excel格式
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
  // 初始化UI元素
  initUI();
  
  // 加载分类列表
  loadCategories();
});

// 初始化UI元素
function initUI() {
  // 获取按钮元素
  const fetchGamesBtn = document.getElementById('fetch-games-btn');
  const generateExcelBtn = document.getElementById('generate-excel-btn');
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
  
  if (generateExcelBtn) {
    generateExcelBtn.addEventListener('click', generateExcel);
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
  
  if (!gamesContainer) return;
  
  try {
    // 显示加载中
    loadingElement.textContent = '正在获取游戏数据...';
    gamesContainer.innerHTML = '';
    
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
  
  // 显示生成Excel按钮
  const generateExcelBtn = document.getElementById('generate-excel-btn');
  if (generateExcelBtn) {
    generateExcelBtn.style.display = 'inline-block';
  }
}

// 生成Excel文件
function generateExcel() {
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
  
  // 转换为Excel格式
  const excelData = convertToExcelFormat(selectedGames);
  
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, "Games");
  
  // 生成Excel文件并下载
  XLSX.writeFile(wb, "crazygames_import.xlsx");
}

// 将CrazyGames数据转换为我们的Excel模板格式
function convertToExcelFormat(games) {
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

// 备用方法：使用网页爬虫获取游戏数据
async function scrapeGames(category = '', limit = 10) {
  // 注意：网页爬虫可能违反网站使用条款，建议使用官方API
  alert('警告：网页爬虫可能违反CrazyGames的使用条款，建议使用官方API');
  
  // 这里是爬虫实现的占位符
  // 实际实现需要使用服务器端代码或浏览器扩展
  console.log('爬虫功能尚未实现');
}
