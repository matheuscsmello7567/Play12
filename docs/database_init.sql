-- =====================================================
-- Script de inicialização do banco de dados Play12
-- =====================================================

-- Criar database
CREATE DATABASE play12_dev;
CREATE DATABASE play12_test;
CREATE DATABASE play12_prod;

-- Conectar ao database dev
\c play12_dev;

-- Criar extensões (se necessário)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Tabela: operators (Operadores/Jogadores)
-- =====================================================
CREATE TABLE operators (
    id BIGSERIAL PRIMARY KEY,
    nickname VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL DEFAULT 'PLAYER',
    total_games INTEGER DEFAULT 0,
    engagement_score DOUBLE PRECISION DEFAULT 0.0,
    verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CHECK (role IN ('PLAYER', 'SQUAD_LEADER', 'ORGANIZER', 'ADMIN'))
);

CREATE INDEX idx_operators_email ON operators(email);
CREATE INDEX idx_operators_nickname ON operators(nickname);
CREATE INDEX idx_operators_role ON operators(role);

-- =====================================================
-- Tabela: squads (Equipes)
-- =====================================================
CREATE TABLE squads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    logo_url VARCHAR(500),
    leader_id BIGINT NOT NULL REFERENCES operators(id),
    total_members INTEGER DEFAULT 1,
    total_games_played INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    ranking_position INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISBANDED', 'ON_HOLD'))
);

CREATE INDEX idx_squads_leader_id ON squads(leader_id);
CREATE INDEX idx_squads_status ON squads(status);
CREATE INDEX idx_squads_ranking_position ON squads(ranking_position);

-- =====================================================
-- Tabela: squad_members (Membros de Squad)
-- =====================================================
CREATE TABLE squad_members (
    squad_id BIGINT NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    operator_id BIGINT NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    PRIMARY KEY (squad_id, operator_id)
);

CREATE INDEX idx_squad_members_operator_id ON squad_members(operator_id);

-- =====================================================
-- Tabela: games (Jogos)
-- =====================================================
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(500),
    max_players INTEGER,
    current_players INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    game_type VARCHAR(50) NOT NULL DEFAULT 'MILSIM',
    winning_squad_id BIGINT,
    registration_fee DOUBLE PRECISION DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CHECK (status IN ('SCHEDULED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    CHECK (game_type IN ('MILSIM', 'SKIRMISH', 'SCENARIO', 'TDEATH', 'CTF'))
);

CREATE INDEX idx_games_start_date ON games(start_date);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_game_type ON games(game_type);

-- =====================================================
-- Tabela: game_squads (Squads participando de jogos)
-- =====================================================
CREATE TABLE game_squads (
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    squad_id BIGINT NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, squad_id)
);

-- =====================================================
-- Tabela: rankings (Ranking de Squads)
-- =====================================================
CREATE TABLE rankings (
    id BIGSERIAL PRIMARY KEY,
    squad_id BIGINT NOT NULL UNIQUE REFERENCES squads(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 1,
    total_points INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    games_lost INTEGER DEFAULT 0,
    win_rate DOUBLE PRECISION DEFAULT 0.0,
    total_eliminations INTEGER DEFAULT 0,
    average_eliminations_per_game DOUBLE PRECISION DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX idx_rankings_position ON rankings(position);
CREATE INDEX idx_rankings_squad_id ON rankings(squad_id);

-- =====================================================
-- Dados de exemplo (Opcional)
-- =====================================================

-- Inserir operadores de exemplo
INSERT INTO operators (nickname, email, password, full_name, phone, role, created_at, updated_at)
VALUES 
('admin_user', 'admin@play12.com', '$2a$10$...', 'Admin User', '11999999999', 'ADMIN', NOW(), NOW()),
('squad_leader_1', 'leader1@play12.com', '$2a$10$...', 'Squad Leader 1', '11988888888', 'SQUAD_LEADER', NOW(), NOW()),
('player_1', 'player1@play12.com', '$2a$10$...', 'Player 1', '11977777777', 'PLAYER', NOW(), NOW());

-- Inserir squad de exemplo
INSERT INTO squads (name, description, leader_id, total_members, status, created_at, updated_at)
VALUES 
('Alpha Squad', 'Primeira equipe de airsoft', 2, 5, 'ACTIVE', NOW(), NOW());

-- Inserir membros do squad
INSERT INTO squad_members (squad_id, operator_id)
VALUES 
(1, 1),
(1, 2),
(1, 3);

-- Inserir jogo de exemplo
INSERT INTO games (name, start_date, end_date, location, description, max_players, game_type, status, created_at, updated_at)
VALUES 
('Grande Campeonato MilSim 2026', '2026-02-15 09:00:00', '2026-02-15 17:00:00', 'Campo de Airsoft - São Paulo', 'Primeiro grande evento da temporada', 200, 'MILSIM', 'REGISTRATION_OPEN', NOW(), NOW());

-- Inserir ranking de exemplo
INSERT INTO rankings (squad_id, position, total_points, games_played, games_won, win_rate, created_at, updated_at)
VALUES 
(1, 1, 100, 5, 4, 80.0, NOW(), NOW());

-- =====================================================
-- Triggers para atualização automática de updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER operators_update_timestamp BEFORE UPDATE ON operators
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER squads_update_timestamp BEFORE UPDATE ON squads
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER games_update_timestamp BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER rankings_update_timestamp BEFORE UPDATE ON rankings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- Grants de permissão (se usando usuário específico)
-- =====================================================

-- Descomente e ajuste conforme necessário:
-- CREATE USER play12_user WITH PASSWORD 'play12_password';
-- GRANT ALL PRIVILEGES ON DATABASE play12_dev TO play12_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO play12_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO play12_user;
