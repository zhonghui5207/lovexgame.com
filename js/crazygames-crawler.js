/**
 * CrazyGames 网页爬虫工具
 * 用于从CrazyGames网站获取游戏数据
 * 
 * 注意：此脚本仅用于教育和个人使用目的
 * 请遵守CrazyGames的服务条款和robots.txt规则
 * 控制爬取频率，避免对其服务器造成负担
 */

// 爬虫配置
const CRAWLER_CONFIG = {
  // 基础URL
  BASE_URL: 'https://www.crazygames.com',
  
  // 游戏列表页URL
  GAMES_LIST_URL: 'https://www.crazygames.com/t/html5',
  
  // 分类页URL模板
  CATEGORY_URL_TEMPLATE: 'https://www.crazygames.com/c/:category',
  
  // 请求间隔(毫秒)，避免过于频繁的请求
  REQUEST_DELAY: 1000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 重试延迟(毫秒)
  RETRY_DELAY: 2000,
  
  // 用户代理，模拟浏览器请求
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
  
  // 是否启用调试模式
  DEBUG: false
};

// 存储已知分类
let knownCategories = [];

// DOM解析器
let parser = new DOMParser();

/**
 * 初始化爬虫
 */
function initCrawler() {
  console.log('初始化CrazyGames爬虫...');
  
  // 加载已知分类
  loadCategories()
    .then(categories => {
      knownCategories = categories;
      console.log(`已加载 ${categories.length} 个分类`);
    })
    .catch(error => {
      console.error('加载分类失败:', error);
    });
}

/**
 * 加载游戏分类
 * @returns {Promise<Array>} 分类列表
 */
async function loadCategories() {
  try {
    console.log('正在获取游戏分类...');
    
    // 获取首页HTML
    const html = await fetchUrl(CRAWLER_CONFIG.BASE_URL);
    
    // 解析HTML
    const doc = parser.parseFromString(html, 'text/html');
    
    // 查找分类元素
    const categoryElements = doc.querySelectorAll('.menu-categories a');
    
    // 提取分类信息
    const categories = Array.from(categoryElements).map(element => {
      const href = element.getAttribute('href') || '';
      const match = href.match(/\/c\/([a-z0-9-]+)/i);
      const slug = match ? match[1] : '';
      const name = element.textContent.trim();
      
      return {
        name,
        slug,
        url: `${CRAWLER_CONFIG.BASE_URL}${href}`
      };
    }).filter(category => category.slug);
    
    return categories;
  } catch (error) {
    console.error('获取分类失败:', error);
    return [];
  }
}

/**
 * 获取指定分类的游戏列表
 * @param {string} category 分类名称或slug
 * @param {number} limit 获取游戏数量限制
 * @returns {Promise<Array>} 游戏列表
 */
async function getGamesByCategory(category = '', limit = 10) {
  try {
    // 显示加载中状态
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '<div class="loading-spinner"></div><p class="text-center">正在获取游戏数据...</p>';
    
    // 首先尝试从本地JSON文件获取数据
    try {
      const response = await fetch('../scripts/games_for_import.json');
      if (response.ok) {
        const games = await response.json();
        console.log(`从本地文件成功加载了 ${games.length} 个游戏`);
        
        // 如果有分类过滤，应用过滤
        let filteredGames = games;
        if (category && category !== 'all') {
          filteredGames = games.filter(game => 
            game.category && game.category.toLowerCase().includes(category.toLowerCase())
          );
        }
        
        // 限制数量
        const limitedGames = filteredGames.slice(0, limit);
        
        // 记录日志
        logger.success(`从本地文件加载游戏数据成功: 分类: ${category || '所有'}, 数量: ${limitedGames.length}`);
        
        return limitedGames;
      }
    } catch (localError) {
      console.log('无法从本地文件加载游戏数据，将尝试在线爬取:', localError);
    }
    
    // 构建URL
    let url = CRAWLER_CONFIG.GAMES_LIST_URL;
    
    if (category) {
      // 查找匹配的分类
      const matchedCategory = knownCategories.find(cat => 
        cat.slug === category || cat.name.toLowerCase() === category.toLowerCase()
      );
      
      if (matchedCategory) {
        url = matchedCategory.url;
      } else {
        // 尝试使用提供的分类名构建URL
        url = CRAWLER_CONFIG.CATEGORY_URL_TEMPLATE.replace(':category', category);
      }
    }
    
    console.log(`正在从 ${url} 获取游戏列表...`);
    
    // 获取分类页HTML
    const html = await fetchUrl(url);
    
    // 解析HTML
    const doc = parser.parseFromString(html, 'text/html');
    
    // 查找游戏卡片元素
    const gameCards = doc.querySelectorAll('.game-grid-item');
    
    // 限制游戏数量
    const limitedCards = Array.from(gameCards).slice(0, limit);
    
    // 存储游戏数据
    const games = [];
    
    // 处理每个游戏卡片
    for (const card of limitedCards) {
      try {
        // 提取基本信息
        const titleElement = card.querySelector('.game-grid-item-title');
        const linkElement = card.querySelector('a.game-grid-item-link');
        const imageElement = card.querySelector('img.game-grid-item-thumbnail');
        
        if (!titleElement || !linkElement) continue;
        
        const title = titleElement.textContent.trim();
        const href = linkElement.getAttribute('href') || '';
        const thumbnailUrl = imageElement ? (imageElement.getAttribute('src') || imageElement.getAttribute('data-src') || '') : '';
        
        // 构建游戏详情页URL
        const gameUrl = href.startsWith('http') ? href : `${CRAWLER_CONFIG.BASE_URL}${href}`;
        
        // 获取游戏详情
        const gameDetails = await getGameDetails(gameUrl);
        
        // 合并数据
        games.push({
          title,
          url: gameUrl,
          thumbnailUrl,
          ...gameDetails
        });
        
        // 添加延迟，避免请求过于频繁
        await delay(CRAWLER_CONFIG.REQUEST_DELAY);
      } catch (error) {
        console.error(`处理游戏卡片时出错:`, error);
      }
    }
    
    return games;
  } catch (error) {
    console.error('获取游戏列表失败:', error);
    return [];
  }
}

/**
 * 获取游戏详情
 * @param {string} url 游戏详情页URL
 * @returns {Promise<Object>} 游戏详情
 */
async function getGameDetails(url) {
  try {
    console.log(`正在获取游戏详情: ${url}`);
    
    // 获取游戏详情页HTML
    const html = await fetchUrl(url);
    
    // 解析HTML
    const doc = parser.parseFromString(html, 'text/html');
    
    // 提取游戏详情
    const description = getTextContent(doc, '.game-description');
    const instructions = getTextContent(doc, '.game-instructions');
    const category = getTextContent(doc, '.game-info-category a');
    
    // 提取评分
    const ratingElement = doc.querySelector('.game-rating-value');
    const rating = ratingElement ? parseFloat(ratingElement.textContent.trim()) : 0;
    
    // 提取嵌入URL
    const embedUrl = getEmbedUrl(doc, url);
    
    // 提取游戏ID
    const gameId = url.split('/').pop();
    
    return {
      id: gameId,
      description,
      instructions,
      category,
      rating,
      embedUrl
    };
  } catch (error) {
    console.error(`获取游戏详情失败: ${url}`, error);
    return {
      description: '',
      instructions: '',
      category: '',
      rating: 0,
      embedUrl: url
    };
  }
}

/**
 * 获取游戏嵌入URL
 * @param {Document} doc 游戏详情页文档
 * @param {string} fallbackUrl 备用URL
 * @returns {string} 嵌入URL
 */
function getEmbedUrl(doc, fallbackUrl) {
  try {
    // 尝试从页面脚本中提取游戏数据
    const scripts = Array.from(doc.querySelectorAll('script'));
    
    for (const script of scripts) {
      const content = script.textContent || '';
      
      // 查找包含游戏数据的脚本
      if (content.includes('window.game = ') || content.includes('window.crazygames.game')) {
        // 尝试提取游戏数据
        const gameDataMatch = content.match(/window\.game\s*=\s*({.*?});/s) || 
                             content.match(/window\.crazygames\.game\s*=\s*({.*?});/s);
        
        if (gameDataMatch && gameDataMatch[1]) {
          try {
            // 解析游戏数据
            const gameData = JSON.parse(gameDataMatch[1].replace(/'/g, '"'));
            
            // 提取嵌入URL
            if (gameData.url) {
              return gameData.url;
            }
          } catch (e) {
            console.warn('解析游戏数据失败:', e);
          }
        }
      }
    }
    
    // 如果无法从脚本提取，尝试从iframe中提取
    const iframe = doc.querySelector('iframe.game-iframe');
    if (iframe) {
      const src = iframe.getAttribute('src');
      if (src) {
        return src;
      }
    }
    
    // 如果都失败了，返回原始URL
    return fallbackUrl;
  } catch (error) {
    console.error('获取嵌入URL失败:', error);
    return fallbackUrl;
  }
}

/**
 * 从指定选择器获取文本内容
 * @param {Document} doc 文档
 * @param {string} selector CSS选择器
 * @returns {string} 文本内容
 */
function getTextContent(doc, selector) {
  const element = doc.querySelector(selector);
  return element ? element.textContent.trim() : '';
}

/**
 * 获取URL内容
 * @param {string} url 要获取的URL
 * @param {number} retryCount 当前重试次数
 * @returns {Promise<string>} HTML内容
 */
async function fetchUrl(url, retryCount = 0) {
  try {
    // 创建请求头
    const headers = new Headers({
      'User-Agent': CRAWLER_CONFIG.USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // 发送请求
    const response = await fetch(url, { headers });
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    // 获取HTML内容
    return await response.text();
  } catch (error) {
    // 如果未超过最大重试次数，则重试
    if (retryCount < CRAWLER_CONFIG.MAX_RETRIES) {
      console.warn(`获取URL失败，正在重试(${retryCount + 1}/${CRAWLER_CONFIG.MAX_RETRIES}): ${url}`);
      
      // 等待重试延迟
      await delay(CRAWLER_CONFIG.RETRY_DELAY);
      
      // 重试
      return fetchUrl(url, retryCount + 1);
    }
    
    // 超过最大重试次数，抛出错误
    throw new Error(`获取URL失败: ${url}, 错误: ${error.message}`);
  }
}

/**
 * 延迟指定时间
 * @param {number} ms 延迟毫秒数
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 将爬取的游戏数据转换为网站格式
 * @param {Array} games 爬取的游戏数据
 * @returns {Array} 转换后的游戏数据
 */
function convertToSiteFormat(games) {
  return games.map((game, index) => {
    // 生成唯一ID
    const gameId = `game-${Date.now()}-${index}`;
    
    return {
      id: gameId,
      title: game.title || '',
      description: game.description || '',
      embedUrl: game.embedUrl || game.url || '',
      thumbnailUrl: game.thumbnailUrl || '',
      category: game.category || '未分类',
      rating: game.rating || 0,
      dateAdded: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
      instructions: game.instructions || '',
      isFeatured: false,
      isNew: true
    };
  });
}

/**
 * 添加游戏到库
 * @param {Array} newGames 新游戏数据
 * @param {Array} existingGames 现有游戏数据
 * @returns {Object} 导入结果
 */
function addGamesToLibrary(newGames, existingGames) {
  const result = {
    added: 0,
    updated: 0,
    failed: 0,
    failedGames: []
  };
  
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

/**
 * 显示导入结果
 * @param {number} addedCount 添加的游戏数量
 * @param {number} updatedCount 更新的游戏数量
 * @param {number} errorCount 失败的游戏数量
 */
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

// 导出函数
window.CrazyGamesCrawler = {
  init: initCrawler,
  getCategories: loadCategories,
  getGamesByCategory: getGamesByCategory,
  convertToSiteFormat: convertToSiteFormat,
  addGamesToLibrary: addGamesToLibrary,
  showImportResult: showImportResult
};
