CREATE DATABASE IF NOT EXISTS hajj_heatstroke;

USE hajj_heatstroke;
CREATE TABLE weather_readings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    zone          VARCHAR(100)  NOT NULL,
    temp_celsius  DECIMAL(5,2)  NOT NULL,
    feels_like    DECIMAL(5,2)  NOT NULL,
    humidity      DECIMAL(5,2),
    recorded_at   DATETIME      DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO weather_readings (zone, temp_celsius, feels_like, humidity, recorded_at)
VALUES
    ('Arafat',   45.2, 51.3, 18.0, '2024-06-15 12:00:00'),
    ('Mina',     43.8, 49.7, 20.5, '2024-06-15 12:30:00'),
    ('Muzdalifa',44.5, 50.1, 19.0, '2024-06-15 13:00:00'),
    ('Jamarat',  42.1, 47.9, 22.0, '2024-06-15 13:30:00'),
    ('Masjid',   40.3, 46.2, 25.0, '2024-06-15 14:00:00');

SELECT * FROM weather_readings WHERE temp_celsius > 40;

SELECT
    id,
    zone,
    temp_celsius,
    feels_like,
    CASE
        WHEN feels_like > 46 THEN 'EXTREME DANGER'
        WHEN feels_like > 43 THEN 'HIGH DANGER'
        WHEN feels_like > 40 THEN 'MODERATE'
        ELSE 'SAFE'
    END AS danger_level
FROM weather_readings;

SELECT
    zone,
    MAX(temp_celsius)   AS peak_temp,
    AVG(temp_celsius)   AS avg_temp,
    AVG(feels_like)     AS avg_feels_like,
    COUNT(*)            AS total_readings
FROM weather_readings
GROUP BY zone
ORDER BY peak_temp DESC;







