# LovexGames - 在线游戏门户网站

LovexGames是一个提供多种类型在线游戏的网页平台，允许用户无需下载即可在浏览器中直接体验各种游戏。

## 项目概述

LovexGames提供了丰富的游戏内容，包括动作、冒险、益智和策略等多种类型的游戏。网站采用现代化的界面设计，为用户提供流畅的游戏浏览和游玩体验。

## 主要功能

- **游戏浏览**：首页展示推荐游戏、新游戏和热门游戏
- **分类导航**：根据游戏类型进行分类浏览
- **游戏详情**：每个游戏有独立的详情页，提供游戏描述和直接游玩功能
- **游戏搜索**：支持按游戏名称搜索
- **管理后台**：管理游戏内容、分类和导入新游戏

## 技术架构

- **前端**：HTML5、CSS3、JavaScript
- **数据存储**：浏览器 localStorage
- **数据获取**：Python爬虫脚本从其他游戏网站获取游戏数据
- **部署**：静态网站，可部署在任何Web服务器上

## 项目结构

```
LovexGames/
├── admin/                  # 管理后台页面
│   ├── index.html          # 管理首页
│   ├── login.html          # 管理员登录
│   ├── categories.html     # 分类管理
│   └── crawler-import.html # 游戏爬取与导入
├── css/                    # 样式文件
│   ├── style.css           # 主样式
│   └── admin.css           # 管理后台样式
├── js/                     # JavaScript文件
│   ├── games.js            # 游戏相关功能
│   └── admin.js            # 管理后台功能
├── images/                 # 图片资源
├── scripts/                # Python脚本
│   ├── crazygames_crawler.py  # 游戏爬虫
│   └── games_for_import.json  # 导入游戏数据
├── index.html              # 首页
├── game.html               # 游戏详情页
└── category.html           # 分类页面
```

## 启动项目

1. 克隆本仓库到本地:
   ```
   git clone <repository-url>
   ```

2. 使用HTTP服务器启动项目:
   ```
   python -m http.server 8000
   ```
   
3. 在浏览器中访问:
   ```
   http://localhost:8000
   ```

## 管理后台

管理后台路径: `/admin/login.html`

默认管理员账号:
- 用户名: admin
- 密码: lovexgames2025

## 游戏数据导入

项目支持两种方式导入游戏数据:

1. 通过管理后台手动添加
2. 使用Python爬虫脚本获取游戏数据

运行爬虫脚本:
```
cd scripts
python crazygames_crawler.py
```

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 版权信息

© 2025 LovexGames. 保留所有权利。 