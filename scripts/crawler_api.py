#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
爬虫API脚本
提供Web接口来控制爬虫操作
"""

import os
import sys
import json
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import cgi
import time
from datetime import datetime

# 导入爬虫模块
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from crazygames_crawler import CrazyGamesCrawler

# 配置
PORT = 8001
HOST = 'localhost'
IMPORT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'games_for_import.json')

class CrawlerRequestHandler(BaseHTTPRequestHandler):
    """处理爬虫API请求的HTTP处理器"""
    
    def _set_headers(self, content_type='application/json'):
        """设置响应头"""
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        """处理OPTIONS请求，用于CORS预检"""
        self._set_headers()
        
    def do_GET(self):
        """处理GET请求"""
        parsed_path = urlparse(self.path)
        
        # 路由处理
        if parsed_path.path == '/api/crawler/status':
            self._handle_status()
        else:
            self._handle_not_found()
    
    def do_POST(self):
        """处理POST请求"""
        parsed_path = urlparse(self.path)
        
        # 路由处理
        if parsed_path.path == '/api/crawler/start':
            self._handle_start_crawler()
        elif parsed_path.path == '/api/crawler/crawl-url':
            self._handle_crawl_url()
        else:
            self._handle_not_found()
    
    def _handle_status(self):
        """处理状态请求"""
        self._set_headers()
        response = {
            'status': 'ok',
            'message': '爬虫API正在运行',
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
    
    def _handle_not_found(self):
        """处理未找到的路由"""
        self.send_response(404)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            'status': 'error',
            'message': '未找到请求的资源'
        }
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
    
    def _parse_post_data(self):
        """解析POST数据"""
        content_type, pdict = cgi.parse_header(self.headers.get('Content-Type', ''))
        
        if content_type == 'application/json':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            return json.loads(post_data.decode('utf-8'))
        elif content_type == 'application/x-www-form-urlencoded':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            return {k: v[0] for k, v in parse_qs(post_data).items()}
        else:
            return {}
    
    def _handle_start_crawler(self):
        """处理启动爬虫请求"""
        try:
            # 解析POST数据
            post_data = self._parse_post_data()
            category = post_data.get('category', '')
            limit = int(post_data.get('limit', 10))
            
            print(f"收到爬虫请求: 类型={category}, 数量={limit}")
            
            # 初始化爬虫
            crawler = CrazyGamesCrawler()
            
            # 爬取游戏
            print(f"开始爬取游戏...")
            games = crawler.get_games_by_category(category, limit)
            print(f"爬取完成, 获取到 {len(games) if games else 0} 个游戏")
            
            # 导出到JSON
            if games:
                # 转换为网站格式
                site_format_games = []
                for game in games:
                    site_game = crawler._convert_to_site_format(game)
                    site_format_games.append(site_game)
                
                # 保存到导入文件
                with open(IMPORT_FILE, 'w', encoding='utf-8') as f:
                    json.dump(site_format_games, f, ensure_ascii=False, indent=2)
                
                print(f"游戏数据已保存到 {IMPORT_FILE}")
                
                # 返回成功响应
                self._set_headers()
                response = {
                    'status': 'success',
                    'message': f'成功爬取 {len(games)} 个游戏',
                    'count': len(games),
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            else:
                # 返回错误响应
                print("未爬取到任何游戏数据")
                self._set_headers()
                response = {
                    'status': 'error',
                    'message': '未爬取到任何游戏数据',
                    'count': 0,
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            # 返回错误响应
            print(f"爬虫执行错误: {str(e)}")
            print(traceback.format_exc())
            self._set_headers()
            response = {
                'status': 'error',
                'message': f'爬虫执行错误: {str(e)}',
                'traceback': traceback.format_exc(),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
    
    def _handle_crawl_url(self):
        """处理爬取指定URL请求"""
        try:
            # 解析POST数据
            post_data = self._parse_post_data()
            url = post_data.get('url', '')
            
            print(f"收到爬取URL请求: {url}")
            
            if not url:
                self._set_headers()
                response = {
                    'status': 'error',
                    'message': '未提供有效的URL',
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return
            
            # 初始化爬虫
            crawler = CrazyGamesCrawler()
            
            # 获取游戏详情
            print(f"开始爬取游戏详情: {url}")
            game_details = crawler.get_game_details(url)
            
            # 如果获取到详情，构建完整游戏数据
            if game_details:
                print(f"成功获取游戏详情")
                game_data = {
                    'title': game_details.get('title', url.split('/')[-1]),
                    'url': url,
                    'thumbnailUrl': game_details.get('thumbnailUrl', ''),
                    **game_details
                }
                
                # 转换为网站格式
                site_format_game = crawler._convert_to_site_format(game_data)
                print(f"游戏数据已转换为网站格式: {site_format_game['title']}")
                
                # 读取现有的导入文件
                existing_games = []
                if os.path.exists(IMPORT_FILE):
                    try:
                        with open(IMPORT_FILE, 'r', encoding='utf-8') as f:
                            existing_games = json.load(f)
                        print(f"已读取现有导入文件，包含 {len(existing_games)} 个游戏")
                    except Exception as e:
                        print(f"读取导入文件出错: {str(e)}")
                        existing_games = []
                
                # 检查是否已存在相同URL的游戏
                exists = False
                for i, game in enumerate(existing_games):
                    if game.get('url') == url:
                        # 更新现有游戏
                        existing_games[i] = site_format_game
                        exists = True
                        print(f"更新现有游戏: {site_format_game['title']}")
                        break
                
                # 如果不存在，添加到列表
                if not exists:
                    existing_games.append(site_format_game)
                    print(f"添加新游戏: {site_format_game['title']}")
                
                # 保存回文件
                try:
                    with open(IMPORT_FILE, 'w', encoding='utf-8') as f:
                        json.dump(existing_games, f, ensure_ascii=False, indent=2)
                    print(f"游戏数据已保存到 {IMPORT_FILE}")
                except Exception as e:
                    print(f"保存导入文件出错: {str(e)}")
                
                # 返回成功响应
                self._set_headers()
                response = {
                    'status': 'success',
                    'message': f'成功爬取游戏: {site_format_game["title"]}',
                    'game': site_format_game,
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            else:
                # 返回错误响应
                print(f"无法获取游戏详情: {url}")
                self._set_headers()
                response = {
                    'status': 'error',
                    'message': f'无法获取游戏详情: {url}',
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            # 返回错误响应
            print(f"爬取URL错误: {str(e)}")
            print(traceback.format_exc())
            self._set_headers()
            response = {
                'status': 'error',
                'message': f'爬取URL错误: {str(e)}',
                'traceback': traceback.format_exc(),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))


def run_server():
    """运行HTTP服务器"""
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, CrawlerRequestHandler)
    print(f"爬虫API服务器运行在 http://{HOST}:{PORT}")
    httpd.serve_forever()


if __name__ == "__main__":
    run_server()
