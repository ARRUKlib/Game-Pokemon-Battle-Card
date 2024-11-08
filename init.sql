-- สร้างตาราง user_id
CREATE TABLE IF NOT EXISTS user_id (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) UNIQUE NOT NULL,
  pass VARCHAR(255) NOT NULL,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1
);

-- สร้างตาราง user_wl
CREATE TABLE IF NOT EXISTS user_wl (
  user_id INTEGER PRIMARY KEY REFERENCES user_id(user_id),
  win INTEGER DEFAULT 0,
  lose INTEGER DEFAULT 0,
  draw INTEGER DEFAULT 0
);

-- สร้างตาราง pokemon (แม้ว่าจะดึงข้อมูลจาก API ภายนอก)
CREATE TABLE IF NOT EXISTS pokemon (
  pok_id SERIAL PRIMARY KEY,
  pok_name VARCHAR(255),
  poke_type VARCHAR(255),
  species VARCHAR(255),
  height NUMERIC,
  weight NUMERIC,
  abilities VARCHAR(255),
  catch_rate INTEGER,
  base_friendship INTEGER,
  base_exp INTEGER,
  growth_rate VARCHAR(255),
  hp_base INTEGER,
  hp_min INTEGER,
  hp_max INTEGER,
  attack_base INTEGER,
  attack_min INTEGER,
  attack_max INTEGER,
  defense_base INTEGER,
  defense_min INTEGER,
  defense_max INTEGER,
  special_attack_base INTEGER,
  special_attack_min INTEGER,
  special_attack_max INTEGER,
  special_defense_base INTEGER,
  special_defense_min INTEGER,
  special_defense_max INTEGER,
  speed_base INTEGER,
  speed_min INTEGER,
  speed_max INTEGER,
  poke_type_card VARCHAR(255)
);

-- สร้างตาราง pic_poke (แม้ว่าจะดึงข้อมูลจาก API ภายนอก)
CREATE TABLE IF NOT EXISTS pic_poke (
    id SERIAL PRIMARY KEY,
    pok_id INTEGER REFERENCES pokemon(pok_id),
    pok_name VARCHAR(255),
    pok_image TEXT
);