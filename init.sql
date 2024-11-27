-- สร้างตาราง user_id
CREATE TABLE IF NOT EXISTS al_user_id (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) UNIQUE NOT NULL,
  pass VARCHAR(255) NOT NULL,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1
);

-- สร้างตาราง user_wl
CREATE TABLE IF NOT EXISTS al_user_wl (
  user_id INTEGER PRIMARY KEY REFERENCES al_user_id(user_id),
  win INTEGER DEFAULT 0,
  lose INTEGER DEFAULT 0,
  draw INTEGER DEFAULT 0
);

INSERT INTO al_user_id (user_name, pass)
VALUES ('admin', '$2b$10$JW3SfXTJ.zPq/UJUlLbRNeFrkbBVan/YonVd3CGAbzc.iqSXyTc42');