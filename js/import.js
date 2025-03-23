// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态
  checkAuth();
  
  // 初始化文件上传区域
  initUploadArea();
  
  // 确认导入按钮事件
  document.getElementById('confirm-import').addEventListener('click', confirmImport);
  
  // 再次导入按钮事件
  document.getElementById('import-again').addEventListener('click', resetImport);
});

// 初始化上传区域
function initUploadArea() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('excel-file');
  
  // 点击上传区域触发文件选择
  uploadArea.addEventListener('click', function(e) {
    if (e.target.tagName !== 'INPUT') {
      fileInput.click();
    }
  });
  
  // 拖拽事件
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });
  
  // 文件选择事件
  fileInput.addEventListener('change', function() {
    if (this.files.length) {
      handleFileUpload(this.files[0]);
    }
  });
}

// 处理文件上传
function handleFileUpload(file) {
  const uploadStatus = document.getElementById('upload-status');
  
  // 检查文件类型
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    uploadStatus.textContent = '请上传Excel文件 (.xlsx 或 .xls)';
    uploadStatus.style.color = 'var(--admin-danger)';
    return;
  }
  
  uploadStatus.textContent = '正在解析文件...';
  uploadStatus.style.color = 'var(--admin-text)';
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // 假设第一个工作表包含游戏数据
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // 将工作表转换为JSON
      const games = XLSX.utils.sheet_to_json(worksheet);
      
      if (games.length === 0) {
        uploadStatus.textContent = '文件中没有找到游戏数据';
        uploadStatus.style.color = 'var(--admin-danger)';
        return;
      }
      
      // 显示导入预览
      showImportPreview(games);
      
      uploadStatus.textContent = `成功解析 ${games.length} 个游戏数据`;
      uploadStatus.style.color = 'var(--admin-success)';
    } catch (error) {
      console.error('解析Excel文件出错:', error);
      uploadStatus.textContent = '解析文件时出错，请检查文件格式';
      uploadStatus.style.color = 'var(--admin-danger)';
    }
  };
  
  reader.onerror = function() {
    uploadStatus.textContent = '读取文件时出错';
    uploadStatus.style.color = 'var(--admin-danger)';
  };
  
  reader.readAsArrayBuffer(file);
}

// 显示导入预览
function showImportPreview(games) {
  const previewContainer = document.getElementById('import-preview-container');
  const previewList = document.getElementById('preview-list');
  const gamesCount = document.getElementById('games-count');
  
  // 清空预览列表
  previewList.innerHTML = '';
  
  // 更新游戏计数
  gamesCount.textContent = `已解析 ${games.length} 个游戏`;
  
  // 获取现有游戏数据用于比较
  const existingGames = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  const existingIds = existingGames.map(game => game.id);
  
  // 为每个游戏创建预览行
  games.forEach(game => {
    const row = document.createElement('tr');
    
    // 检查游戏ID是否已存在
    const isExisting = existingIds.includes(game.id);
    const status = isExisting ? '更新' : '新增';
    const statusClass = isExisting ? 'status featured' : 'status new';
    
    // 创建缩略图预览
    const thumbnailPreview = game.thumbnailUrl ? 
      `<img src="${game.thumbnailUrl}" alt="${game.title}" class="thumbnail">` : 
      '<span class="no-thumbnail">无缩略图</span>';
    
    row.innerHTML = `
      <td>${game.id || '自动生成'}</td>
      <td>${game.title || ''}</td>
      <td>${game.category || ''}</td>
      <td>${thumbnailPreview}</td>
      <td>${game.embedUrl || ''}</td>
      <td><span class="${statusClass}">${status}</span></td>
    `;
    
    previewList.appendChild(row);
  });
  
  // 显示预览容器
  previewContainer.style.display = 'block';
  
  // 存储游戏数据用于后续导入
  sessionStorage.setItem('import_games', JSON.stringify(games));
  
  // 滚动到预览区域
  previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// 确认导入游戏
function confirmImport() {
  // 获取要导入的游戏数据
  const importGames = JSON.parse(sessionStorage.getItem('import_games')) || [];
  
  if (importGames.length === 0) {
    alert('没有可导入的游戏数据');
    return;
  }
  
  // 获取现有游戏数据
  let existingGames = JSON.parse(localStorage.getItem('lovexgames_games')) || [];
  const existingIds = existingGames.map(game => game.id);
  
  // 统计新增和更新的游戏数量
  let newCount = 0;
  let updateCount = 0;
  let errorCount = 0;
  const errorGames = [];
  
  // 处理每个导入的游戏
  importGames.forEach(importGame => {
    try {
      // 验证必填字段
      if (!importGame.title) {
        errorCount++;
        errorGames.push({ title: importGame.title || '未命名游戏', error: '游戏标题不能为空' });
        return;
      }
      
      // 如果没有ID，生成一个新ID
      if (!importGame.id) {
        importGame.id = 'game-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
      
      // 设置默认值
      const processedGame = {
        id: importGame.id,
        title: importGame.title,
        description: importGame.description || '',
        embedUrl: importGame.embedUrl || '',
        thumbnailUrl: importGame.thumbnailUrl || '',
        category: importGame.category || '未分类',
        rating: parseFloat(importGame.rating) || 0,
        dateAdded: importGame.dateAdded || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
        instructions: importGame.instructions || '',
        isFeatured: importGame.isFeatured === 'true' || importGame.isFeatured === true || false,
        isNew: importGame.isNew === 'true' || importGame.isNew === true || false
      };
      
      // 检查游戏ID是否已存在
      const existingIndex = existingIds.indexOf(importGame.id);
      
      if (existingIndex !== -1) {
        // 更新现有游戏
        existingGames[existingIndex] = processedGame;
        updateCount++;
      } else {
        // 添加新游戏
        existingGames.push(processedGame);
        newCount++;
      }
    } catch (error) {
      console.error('处理游戏数据出错:', error);
      errorCount++;
      errorGames.push({ title: importGame.title || '未命名游戏', error: error.message });
    }
  });
  
  // 保存更新后的游戏数据
  localStorage.setItem('lovexgames_games', JSON.stringify(existingGames));
  
  // 显示导入结果
  showImportResult(newCount, updateCount, errorCount, errorGames);
}

// 显示导入结果
function showImportResult(newCount, updateCount, errorCount, errorGames) {
  const previewContainer = document.getElementById('import-preview-container');
  const resultContainer = document.getElementById('import-result-container');
  const resultElement = document.getElementById('import-result');
  
  // 隐藏预览容器
  previewContainer.style.display = 'none';
  
  // 构建结果HTML
  let resultHTML = `
    <div class="import-summary">
      <div class="import-stat">
        <i class="fas fa-plus-circle"></i>
        <span class="stat-count">${newCount}</span>
        <span class="stat-label">新增游戏</span>
      </div>
      <div class="import-stat">
        <i class="fas fa-sync-alt"></i>
        <span class="stat-count">${updateCount}</span>
        <span class="stat-label">更新游戏</span>
      </div>
      <div class="import-stat">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="stat-count">${errorCount}</span>
        <span class="stat-label">导入失败</span>
      </div>
    </div>
  `;
  
  // 如果有错误，显示错误详情
  if (errorCount > 0) {
    resultHTML += '<div class="import-errors"><h3>导入失败的游戏</h3><ul>';
    
    errorGames.forEach(game => {
      resultHTML += `<li>${game.title}: ${game.error}</li>`;
    });
    
    resultHTML += '</ul></div>';
  }
  
  // 更新结果内容
  resultElement.innerHTML = resultHTML;
  
  // 显示结果容器
  resultContainer.style.display = 'block';
  
  // 滚动到结果区域
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 重置导入过程
function resetImport() {
  // 清空文件输入
  document.getElementById('excel-file').value = '';
  
  // 重置上传状态
  document.getElementById('upload-status').textContent = '';
  
  // 隐藏预览和结果容器
  document.getElementById('import-preview-container').style.display = 'none';
  document.getElementById('import-result-container').style.display = 'none';
  
  // 清除会话存储
  sessionStorage.removeItem('import_games');
  
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
