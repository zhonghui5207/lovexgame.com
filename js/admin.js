// 管理员账户信息（实际应用中应该使用后端验证）
const adminCredentials = {
  username: 'admin',
  password: 'lovexgames2025'
};

// 检查用户是否已登录
function checkAuth() {
  const isLoggedIn = localStorage.getItem('admin_logged_in');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!isLoggedIn && currentPage !== 'login.html') {
    // 未登录且不在登录页面，重定向到登录页
    window.location.href = 'login.html';
  } else if (isLoggedIn && currentPage === 'login.html') {
    // 已登录且在登录页面，重定向到管理首页
    window.location.href = 'index.html';
  }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态
  checkAuth();
  
  // 登录表单处理
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // 退出登录
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // 游戏管理页面初始化
  if (document.getElementById('games-table')) {
    initGamesPage();
  }
  
  // 分类管理页面初始化
  if (document.getElementById('categories-table')) {
    initCategoriesPage();
  }
});

// 处理登录
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('login-error');
  
  // 简单的前端验证（实际应用中应使用后端验证）
  if (username === adminCredentials.username && password === adminCredentials.password) {
    localStorage.setItem('admin_logged_in', 'true');
    window.location.href = 'index.html';
  } else {
    errorMsg.textContent = '用户名或密码错误';
    // 清空密码字段
    document.getElementById('password').value = '';
  }
}

// 处理退出登录
function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem('admin_logged_in');
  window.location.href = 'login.html';
}

// 初始化游戏管理页面
function initGamesPage() {
  // 加载游戏列表
  loadGames();
  
  // 添加游戏按钮事件
  const addGameBtn = document.getElementById('add-game-btn');
  addGameBtn.addEventListener('click', () => openGameModal());
  
  // 搜索功能
  const searchInput = document.getElementById('search-games');
  searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterGames(searchTerm);
  });
  
  // 游戏表单提交事件
  const gameForm = document.getElementById('game-form');
  gameForm.addEventListener('submit', handleGameSubmit);
  
  // 取消按钮事件
  document.getElementById('cancel-game').addEventListener('click', closeGameModal);
  
  // 关闭模态框事件
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('game-modal').style.display = 'none';
      document.getElementById('delete-modal').style.display = 'none';
    });
  });
  
  // 取消删除事件
  document.getElementById('cancel-delete').addEventListener('click', function() {
    document.getElementById('delete-modal').style.display = 'none';
  });
  
  // 确认删除事件
  document.getElementById('confirm-delete').addEventListener('click', confirmDeleteGame);
  
  // 加载分类到下拉菜单
  loadCategoriesForSelect();
}

// 初始化分类管理页面
function initCategoriesPage() {
  // 加载分类列表
  loadCategories();
  
  // 添加分类按钮事件
  const addCategoryBtn = document.getElementById('add-category-btn');
  addCategoryBtn.addEventListener('click', () => openCategoryModal());
  
  // 分类表单提交事件
  const categoryForm = document.getElementById('category-form');
  categoryForm.addEventListener('submit', handleCategorySubmit);
  
  // 取消按钮事件
  document.getElementById('cancel-category').addEventListener('click', closeCategoryModal);
  
  // 关闭模态框事件
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('category-modal').style.display = 'none';
      document.getElementById('delete-category-modal').style.display = 'none';
    });
  });
  
  // 取消删除事件
  document.getElementById('cancel-delete-category').addEventListener('click', function() {
    document.getElementById('delete-category-modal').style.display = 'none';
  });
  
  // 确认删除事件
  document.getElementById('confirm-delete-category').addEventListener('click', confirmDeleteCategory);
}

// 加载游戏列表
function loadGames() {
  // 从localStorage获取游戏数据，如果没有则使用默认数据
  let games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  // 如果没有游戏数据，使用默认数据
  if (games.length === 0) {
    // 从全局变量获取游戏数据（假设已在games.js中定义）
    try {
      // 尝试从主站获取游戏数据
      const script = document.createElement('script');
      script.src = '../js/games.js';
      script.onload = function() {
        // 假设全局变量allGames包含所有游戏
        if (typeof allGames !== 'undefined') {
          games = allGames;
          localStorage.setItem('lovexgames_games', JSON.stringify(games));
          renderGames(games);
        }
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading games:', error);
    }
  } else {
    renderGames(games);
  }
}

// 渲染游戏列表
function renderGames(games) {
  const tableBody = document.getElementById('games-list');
  tableBody.innerHTML = '';
  
  games.forEach(game => {
    const row = document.createElement('tr');
    
    // 创建状态标签
    let statusHTML = '';
    if (game.isFeatured) {
      statusHTML += '<span class="status featured">推荐</span> ';
    }
    if (game.isNew) {
      statusHTML += '<span class="status new">新游戏</span>';
    }
    if (!game.isFeatured && !game.isNew) {
      statusHTML = '<span class="status active">正常</span>';
    }
    
    row.innerHTML = `
      <td>${game.id}</td>
      <td><img src="${game.thumbnailUrl}" alt="${game.title}" class="thumbnail"></td>
      <td>${game.title}</td>
      <td>${game.category}</td>
      <td>${game.dateAdded}</td>
      <td>${statusHTML}</td>
      <td class="actions">
        <button class="edit-game" data-id="${game.id}" title="编辑"><i class="fas fa-edit"></i></button>
        <button class="delete-game" data-id="${game.id}" title="删除"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // 添加编辑和删除事件
  addGameEventListeners();
}

// 添加游戏行的事件监听器
function addGameEventListeners() {
  // 编辑游戏
  document.querySelectorAll('.edit-game').forEach(btn => {
    btn.addEventListener('click', function() {
      const gameId = this.getAttribute('data-id');
      editGame(gameId);
    });
  });
  
  // 删除游戏
  document.querySelectorAll('.delete-game').forEach(btn => {
    btn.addEventListener('click', function() {
      const gameId = this.getAttribute('data-id');
      openDeleteGameModal(gameId);
    });
  });
}

// 打开游戏编辑模态框
function openGameModal(gameData = null) {
  const modal = document.getElementById('game-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('game-form');
  
  // 重置表单
  form.reset();
  
  if (gameData) {
    // 编辑模式
    modalTitle.textContent = '编辑游戏';
    document.getElementById('game-id').value = gameData.id;
    document.getElementById('game-title').value = gameData.title;
    document.getElementById('game-description').value = gameData.description;
    document.getElementById('game-embed-url').value = gameData.embedUrl;
    document.getElementById('game-thumbnail').value = gameData.thumbnailUrl;
    document.getElementById('game-category').value = gameData.category;
    document.getElementById('game-rating').value = gameData.rating;
    document.getElementById('game-instructions').value = gameData.instructions;
    document.getElementById('game-featured').checked = gameData.isFeatured;
    document.getElementById('game-new').checked = gameData.isNew;
  } else {
    // 添加模式
    modalTitle.textContent = '添加新游戏';
    document.getElementById('game-id').value = generateGameId();
  }
  
  modal.style.display = 'block';
}

// 关闭游戏模态框
function closeGameModal() {
  document.getElementById('game-modal').style.display = 'none';
}

// 处理游戏表单提交
function handleGameSubmit(e) {
  e.preventDefault();
  
  const gameId = document.getElementById('game-id').value;
  const gameData = {
    id: gameId,
    title: document.getElementById('game-title').value,
    description: document.getElementById('game-description').value,
    embedUrl: document.getElementById('game-embed-url').value,
    thumbnailUrl: document.getElementById('game-thumbnail').value,
    category: document.getElementById('game-category').value,
    rating: parseFloat(document.getElementById('game-rating').value),
    dateAdded: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
    instructions: document.getElementById('game-instructions').value,
    isFeatured: document.getElementById('game-featured').checked,
    isNew: document.getElementById('game-new').checked
  };
  
  // 从localStorage获取游戏列表
  let games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  // 检查是否是编辑还是新增
  const existingGameIndex = games.findIndex(game => game.id === gameId);
  
  if (existingGameIndex !== -1) {
    // 编辑现有游戏
    games[existingGameIndex] = gameData;
  } else {
    // 添加新游戏
    games.push(gameData);
  }
  
  // 保存到localStorage
  localStorage.setItem('lovexgames_games', JSON.stringify(games));
  
  // 关闭模态框并刷新列表
  closeGameModal();
  renderGames(games);
}

// 编辑游戏
function editGame(gameId) {
  const games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  const game = games.find(g => g.id === gameId);
  
  if (game) {
    openGameModal(game);
  }
}

// 打开删除游戏确认模态框
function openDeleteGameModal(gameId) {
  const games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  const game = games.find(g => g.id === gameId);
  
  if (game) {
    document.getElementById('delete-game-title').textContent = game.title;
    document.getElementById('confirm-delete').setAttribute('data-id', gameId);
    document.getElementById('delete-modal').style.display = 'block';
  }
}

// 确认删除游戏
function confirmDeleteGame() {
  const gameId = document.getElementById('confirm-delete').getAttribute('data-id');
  let games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  // 过滤掉要删除的游戏
  games = games.filter(game => game.id !== gameId);
  
  // 保存到localStorage
  localStorage.setItem('lovexgames_games', JSON.stringify(games));
  
  // 关闭模态框并刷新列表
  document.getElementById('delete-modal').style.display = 'none';
  renderGames(games);
}

// 搜索游戏
function filterGames(searchTerm) {
  const games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  if (!searchTerm) {
    renderGames(games);
    return;
  }
  
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm) ||
    game.description.toLowerCase().includes(searchTerm) ||
    game.category.toLowerCase().includes(searchTerm)
  );
  
  renderGames(filteredGames);
}

// 生成唯一游戏ID
function generateGameId() {
  return 'game-' + Date.now();
}

// 加载分类到下拉菜单
function loadCategoriesForSelect() {
  const categories = JSON.parse(localStorage.getItem('lovexgames_categories')) || gameCategories || [];
  const select = document.getElementById('game-category');
  
  if (select) {
    select.innerHTML = '';
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }
}

// 加载分类列表
function loadCategories() {
  // 从localStorage获取分类数据，如果没有则使用默认数据
  let categories = JSON.parse(localStorage.getItem('lovexgames_categories')) || [];
  
  // 如果没有分类数据，使用默认数据
  if (categories.length === 0) {
    try {
      // 尝试从主站获取分类数据
      const script = document.createElement('script');
      script.src = '../js/games.js';
      script.onload = function() {
        // 假设全局变量gameCategories包含所有分类
        if (typeof gameCategories !== 'undefined') {
          categories = gameCategories;
          localStorage.setItem('lovexgames_categories', JSON.stringify(categories));
          renderCategories(categories);
        }
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  } else {
    renderCategories(categories);
  }
}

// 渲染分类列表
function renderCategories(categories) {
  const tableBody = document.getElementById('categories-list');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  // 获取游戏数据用于计算每个分类的游戏数量
  const games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  categories.forEach(category => {
    const row = document.createElement('tr');
    
    // 计算该分类下的游戏数量
    const gameCount = games.filter(game => 
      game.category.toLowerCase() === category.name.toLowerCase()
    ).length;
    
    row.innerHTML = `
      <td>${category.id}</td>
      <td>
        <span class="color-preview" style="background-color: ${category.color}"></span>
        ${category.name}
      </td>
      <td>${category.color}</td>
      <td>${gameCount}</td>
      <td class="actions">
        <button class="edit-category" data-id="${category.id}" title="编辑"><i class="fas fa-edit"></i></button>
        <button class="delete-category" data-id="${category.id}" title="删除"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // 添加编辑和删除事件
  addCategoryEventListeners();
}

// 添加分类行的事件监听器
function addCategoryEventListeners() {
  // 编辑分类
  document.querySelectorAll('.edit-category').forEach(btn => {
    btn.addEventListener('click', function() {
      const categoryId = this.getAttribute('data-id');
      editCategory(categoryId);
    });
  });
  
  // 删除分类
  document.querySelectorAll('.delete-category').forEach(btn => {
    btn.addEventListener('click', function() {
      const categoryId = this.getAttribute('data-id');
      openDeleteCategoryModal(categoryId);
    });
  });
}

// 打开分类编辑模态框
function openCategoryModal(categoryData = null) {
  const modal = document.getElementById('category-modal');
  const modalTitle = document.getElementById('category-modal-title');
  const form = document.getElementById('category-form');
  
  // 重置表单
  form.reset();
  
  if (categoryData) {
    // 编辑模式
    modalTitle.textContent = '编辑分类';
    document.getElementById('category-id').value = categoryData.id;
    document.getElementById('category-name').value = categoryData.name;
    document.getElementById('category-color').value = categoryData.color;
  } else {
    // 添加模式
    modalTitle.textContent = '添加新分类';
    document.getElementById('category-id').value = generateCategoryId();
    // 设置默认颜色
    document.getElementById('category-color').value = '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  modal.style.display = 'block';
}

// 关闭分类模态框
function closeCategoryModal() {
  document.getElementById('category-modal').style.display = 'none';
}

// 处理分类表单提交
function handleCategorySubmit(e) {
  e.preventDefault();
  
  const categoryId = document.getElementById('category-id').value;
  const categoryData = {
    id: categoryId,
    name: document.getElementById('category-name').value,
    color: document.getElementById('category-color').value
  };
  
  // 从localStorage获取分类列表
  let categories = JSON.parse(localStorage.getItem('lovexgames_categories')) || [];
  
  // 检查是否是编辑还是新增
  const existingCategoryIndex = categories.findIndex(category => category.id === categoryId);
  
  if (existingCategoryIndex !== -1) {
    // 编辑现有分类
    categories[existingCategoryIndex] = categoryData;
  } else {
    // 添加新分类
    categories.push(categoryData);
  }
  
  // 保存到localStorage
  localStorage.setItem('lovexgames_categories', JSON.stringify(categories));
  
  // 关闭模态框并刷新列表
  closeCategoryModal();
  renderCategories(categories);
}

// 编辑分类
function editCategory(categoryId) {
  const categories = JSON.parse(localStorage.getItem('lovexgames_categories')) || [];
  const category = categories.find(c => c.id === categoryId);
  
  if (category) {
    openCategoryModal(category);
  }
}

// 打开删除分类确认模态框
function openDeleteCategoryModal(categoryId) {
  const categories = JSON.parse(localStorage.getItem('lovexgames_categories')) || [];
  const category = categories.find(c => c.id === categoryId);
  
  if (category) {
    document.getElementById('delete-category-name').textContent = category.name;
    document.getElementById('confirm-delete-category').setAttribute('data-id', categoryId);
    document.getElementById('delete-category-modal').style.display = 'block';
  }
}

// 确认删除分类
function confirmDeleteCategory() {
  const categoryId = document.getElementById('confirm-delete-category').getAttribute('data-id');
  let categories = JSON.parse(localStorage.getItem('lovexgames_categories')) || [];
  
  // 获取要删除的分类名称
  const categoryToDelete = categories.find(c => c.id === categoryId);
  
  if (categoryToDelete) {
    // 过滤掉要删除的分类
    categories = categories.filter(category => category.id !== categoryId);
    
    // 保存到localStorage
    localStorage.setItem('lovexgames_categories', JSON.stringify(categories));
    
    // 更新所有使用该分类的游戏
    updateGamesAfterCategoryDelete(categoryToDelete.name);
    
    // 关闭模态框并刷新列表
    document.getElementById('delete-category-modal').style.display = 'none';
    renderCategories(categories);
  }
}

// 在删除分类后更新游戏
function updateGamesAfterCategoryDelete(categoryName) {
  let games = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  
  // 更新使用该分类的游戏
  games = games.map(game => {
    if (game.category === categoryName) {
      return { ...game, category: '未分类' };
    }
    return game;
  });
  
  // 保存到localStorage
  localStorage.setItem('lovexgames_games', JSON.stringify(games));
}

// 生成唯一分类ID
function generateCategoryId() {
  return 'category-' + Date.now();
}
