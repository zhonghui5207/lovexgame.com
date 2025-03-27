import json
import os

# 读取文件
file_path = os.path.join(os.path.dirname(__file__), 'games_for_import.json')
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 过滤游戏
filtered_games = [game for game in data['games'] if 'isNew' in game and 'isFeatured' in game]

# 更新数据
data['games'] = filtered_games

# 保存回文件
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'处理完成。保留了 {len(filtered_games)} 个游戏。')
