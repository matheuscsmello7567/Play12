// Sistema de Organização de Jogos Airsoft MilSim
// Data Storage using LocalStorage

class AirsoftManager {
    constructor() {
        this.players = this.loadData('players') || [];
        this.games = this.loadData('games') || [];
        this.rules = this.loadData('rules') || [];
        this.logistics = this.loadData('logistics') || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderPlayers();
        this.renderGames();
        this.renderRules();
        this.renderLogistics();
    }

    // Local Storage Management
    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });

        // Player form
        document.getElementById('player-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlayer();
        });

        // Game form
        document.getElementById('game-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGame();
        });

        // Rule form
        document.getElementById('rule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRule();
        });

        // Logistics form
        document.getElementById('logistics-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLogistics();
        });

        // Player search and filter
        document.getElementById('player-search').addEventListener('input', (e) => {
            this.filterPlayers(e.target.value);
        });

        document.getElementById('player-team-filter').addEventListener('change', (e) => {
            this.filterPlayers(document.getElementById('player-search').value, e.target.value);
        });
    }

    switchTab(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    // Dashboard Functions
    updateDashboard() {
        document.getElementById('total-players').textContent = this.players.length;
        document.getElementById('total-games').textContent = this.games.length;
        document.getElementById('total-rules').textContent = this.rules.length;
        document.getElementById('total-logistics').textContent = this.logistics.length;

        this.renderUpcomingGames();
    }

    renderUpcomingGames() {
        const container = document.getElementById('upcoming-games');
        const today = new Date();
        const upcomingGames = this.games
            .filter(game => new Date(game.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        if (upcomingGames.length === 0) {
            container.innerHTML = '<p class="empty-message">Nenhum jogo agendado</p>';
            return;
        }

        container.innerHTML = upcomingGames.map(game => `
            <div class="list-item">
                <div class="list-item-header">
                    <span class="list-item-title">${game.name}</span>
                    <span class="list-item-badge badge-active">${this.formatDate(game.date)}</span>
                </div>
                <div class="list-item-content">
                    <p><strong>Local:</strong> ${game.location}</p>
                    <p><strong>Horário:</strong> ${game.time}</p>
                    <p><strong>Jogadores:</strong> ${game.currentPlayers || 0}/${game.maxPlayers}</p>
                </div>
            </div>
        `).join('');
    }

    // Player Management
    addPlayer() {
        const player = {
            id: Date.now(),
            name: document.getElementById('player-name').value,
            callsign: document.getElementById('player-callsign').value,
            team: document.getElementById('player-team').value,
            role: document.getElementById('player-role').value,
            contact: document.getElementById('player-contact').value,
            status: 'Ativo',
            joinDate: new Date().toISOString()
        };

        this.players.push(player);
        this.saveData('players', this.players);
        this.renderPlayers();
        this.updateDashboard();
        closeModal('player-modal');
        document.getElementById('player-form').reset();
    }

    renderPlayers(filteredPlayers = null) {
        const playersToRender = filteredPlayers || this.players;
        const tbody = document.getElementById('players-tbody');

        if (playersToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum jogador encontrado</td></tr>';
            return;
        }

        tbody.innerHTML = playersToRender.map(player => `
            <tr>
                <td>${player.name}</td>
                <td><strong>${player.callsign}</strong></td>
                <td>${player.team}</td>
                <td>${player.role}</td>
                <td><span class="status-badge badge-${player.status === 'Ativo' ? 'active' : 'inactive'}">${player.status}</span></td>
                <td>
                    <button class="btn-small btn-primary" onclick="manager.editPlayer(${player.id})">Editar</button>
                    <button class="btn-small btn-danger" onclick="manager.deletePlayer(${player.id})">Remover</button>
                </td>
            </tr>
        `).join('');
    }

    filterPlayers(searchTerm = '', team = '') {
        let filtered = this.players;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(player =>
                player.name.toLowerCase().includes(term) ||
                player.callsign.toLowerCase().includes(term)
            );
        }

        if (team) {
            filtered = filtered.filter(player => player.team === team);
        }

        this.renderPlayers(filtered);
    }

    editPlayer(id) {
        const player = this.players.find(p => p.id === id);
        if (!player) return;

        document.getElementById('player-name').value = player.name;
        document.getElementById('player-callsign').value = player.callsign;
        document.getElementById('player-team').value = player.team;
        document.getElementById('player-role').value = player.role;
        document.getElementById('player-contact').value = player.contact || '';

        // Remove old player and prepare for update
        this.deletePlayer(id, false);
        showAddPlayerModal();
    }

    deletePlayer(id, confirm = true) {
        if (confirm && !window.confirm('Tem certeza que deseja remover este jogador?')) {
            return;
        }

        this.players = this.players.filter(p => p.id !== id);
        this.saveData('players', this.players);
        this.renderPlayers();
        this.updateDashboard();
    }

    // Game Management
    addGame() {
        const game = {
            id: Date.now(),
            name: document.getElementById('game-name').value,
            date: document.getElementById('game-date').value,
            time: document.getElementById('game-time').value,
            location: document.getElementById('game-location').value,
            maxPlayers: parseInt(document.getElementById('game-max-players').value),
            scenario: document.getElementById('game-scenario').value,
            objectives: document.getElementById('game-objectives').value,
            currentPlayers: 0,
            status: 'Agendado',
            createdAt: new Date().toISOString()
        };

        this.games.push(game);
        this.saveData('games', this.games);
        this.renderGames();
        this.updateDashboard();
        closeModal('game-modal');
        document.getElementById('game-form').reset();
    }

    renderGames() {
        const container = document.getElementById('games-list');

        if (this.games.length === 0) {
            container.innerHTML = '<p class="empty-message">Nenhum jogo criado</p>';
            return;
        }

        const sortedGames = [...this.games].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedGames.map(game => `
            <div class="game-card">
                <h3>${game.name}</h3>
                <div class="game-card-info">
                    <p><strong>📅 Data:</strong> ${this.formatDate(game.date)}</p>
                    <p><strong>🕐 Horário:</strong> ${game.time}</p>
                    <p><strong>📍 Local:</strong> ${game.location}</p>
                    <p><strong>👥 Jogadores:</strong> ${game.currentPlayers}/${game.maxPlayers}</p>
                    <p><strong>🎯 Cenário:</strong> ${game.scenario}</p>
                    ${game.objectives ? `<p><strong>🎖️ Objetivos:</strong> ${game.objectives}</p>` : ''}
                </div>
                <div class="game-card-actions">
                    <button class="btn-small btn-primary" onclick="manager.viewGameDetails(${game.id})">Detalhes</button>
                    <button class="btn-small btn-success" onclick="manager.manageGamePlayers(${game.id})">Gerenciar Jogadores</button>
                    <button class="btn-small btn-danger" onclick="manager.deleteGame(${game.id})">Cancelar</button>
                </div>
            </div>
        `).join('');
    }

    viewGameDetails(id) {
        const game = this.games.find(g => g.id === id);
        if (!game) return;

        alert(`Jogo: ${game.name}\n\nData: ${this.formatDate(game.date)} às ${game.time}\nLocal: ${game.location}\n\nCenário:\n${game.scenario}\n\nObjetivos:\n${game.objectives || 'Não especificados'}\n\nJogadores: ${game.currentPlayers}/${game.maxPlayers}`);
    }

    manageGamePlayers(id) {
        const game = this.games.find(g => g.id === id);
        if (!game) return;

        const playersList = this.players.map(p => `${p.callsign} - ${p.name}`).join('\n');
        alert(`Gerenciamento de Jogadores\n\nJogo: ${game.name}\nJogadores Cadastrados:\n\n${playersList || 'Nenhum jogador cadastrado'}\n\nEsta funcionalidade pode ser expandida para atribuir jogadores a jogos específicos.`);
    }

    deleteGame(id) {
        if (!confirm('Tem certeza que deseja cancelar este jogo?')) {
            return;
        }

        this.games = this.games.filter(g => g.id !== id);
        this.saveData('games', this.games);
        this.renderGames();
        this.updateDashboard();
    }

    // Rules Management
    addRule() {
        const rule = {
            id: Date.now(),
            title: document.getElementById('rule-title').value,
            category: document.getElementById('rule-category').value,
            description: document.getElementById('rule-description').value,
            priority: document.getElementById('rule-priority').value,
            active: true,
            createdAt: new Date().toISOString()
        };

        this.rules.push(rule);
        this.saveData('rules', this.rules);
        this.renderRules();
        this.updateDashboard();
        closeModal('rule-modal');
        document.getElementById('rule-form').reset();
    }

    renderRules() {
        const container = document.getElementById('rules-list');

        if (this.rules.length === 0) {
            container.innerHTML = '<p class="empty-message">Nenhuma regra cadastrada</p>';
            return;
        }

        const sortedRules = [...this.rules].sort((a, b) => {
            const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        container.innerHTML = sortedRules.map(rule => `
            <div class="list-item">
                <div class="list-item-header">
                    <span class="list-item-title">${rule.title}</span>
                    <div>
                        <span class="list-item-badge badge-${rule.priority === 'Alta' ? 'high' : rule.priority === 'Média' ? 'medium' : 'low'}">${rule.priority}</span>
                        <span class="list-item-badge badge-${rule.active ? 'active' : 'inactive'}" style="margin-left: 5px;">${rule.active ? 'Ativa' : 'Inativa'}</span>
                    </div>
                </div>
                <div class="list-item-content">
                    <p><strong>Categoria:</strong> ${rule.category}</p>
                    <p>${rule.description}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn-small btn-primary" onclick="manager.toggleRuleStatus(${rule.id})">${rule.active ? 'Desativar' : 'Ativar'}</button>
                    <button class="btn-small btn-danger" onclick="manager.deleteRule(${rule.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }

    toggleRuleStatus(id) {
        const rule = this.rules.find(r => r.id === id);
        if (!rule) return;

        rule.active = !rule.active;
        this.saveData('rules', this.rules);
        this.renderRules();
    }

    deleteRule(id) {
        if (!confirm('Tem certeza que deseja remover esta regra?')) {
            return;
        }

        this.rules = this.rules.filter(r => r.id !== id);
        this.saveData('rules', this.rules);
        this.renderRules();
        this.updateDashboard();
    }

    // Logistics Management
    addLogistics() {
        const logistics = {
            id: Date.now(),
            type: document.getElementById('logistics-type').value,
            name: document.getElementById('logistics-name').value,
            quantity: parseInt(document.getElementById('logistics-quantity').value) || 1,
            responsible: document.getElementById('logistics-responsible').value,
            notes: document.getElementById('logistics-notes').value,
            createdAt: new Date().toISOString()
        };

        this.logistics.push(logistics);
        this.saveData('logistics', this.logistics);
        this.renderLogistics();
        this.updateDashboard();
        closeModal('logistics-modal');
        document.getElementById('logistics-form').reset();
    }

    renderLogistics() {
        const equipment = this.logistics.filter(l => l.type === 'equipment');
        const locations = this.logistics.filter(l => l.type === 'location');
        const transport = this.logistics.filter(l => l.type === 'transport');

        this.renderLogisticsList('equipment-list', equipment, '🎒');
        this.renderLogisticsList('locations-list', locations, '📍');
        this.renderLogisticsList('transport-list', transport, '🚗');
    }

    renderLogisticsList(containerId, items, icon) {
        const container = document.getElementById(containerId);

        if (items.length === 0) {
            container.innerHTML = `<p class="empty-message">Nenhum item cadastrado</p>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="list-item">
                <div class="list-item-header">
                    <span class="list-item-title">${icon} ${item.name}</span>
                    <span class="list-item-badge badge-active">Qtd: ${item.quantity}</span>
                </div>
                <div class="list-item-content">
                    ${item.responsible ? `<p><strong>Responsável:</strong> ${item.responsible}</p>` : ''}
                    ${item.notes ? `<p><strong>Obs:</strong> ${item.notes}</p>` : ''}
                </div>
                <div class="list-item-actions">
                    <button class="btn-small btn-danger" onclick="manager.deleteLogistics(${item.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }

    deleteLogistics(id) {
        if (!confirm('Tem certeza que deseja remover este item?')) {
            return;
        }

        this.logistics = this.logistics.filter(l => l.id !== id);
        this.saveData('logistics', this.logistics);
        this.renderLogistics();
        this.updateDashboard();
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
}

// Modal Functions
function showAddPlayerModal() {
    document.getElementById('player-modal').classList.add('show');
}

function showAddGameModal() {
    document.getElementById('game-modal').classList.add('show');
}

function showAddRuleModal() {
    document.getElementById('rule-modal').classList.add('show');
}

function showAddLogisticsModal() {
    document.getElementById('logistics-modal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// Initialize the application
let manager;
document.addEventListener('DOMContentLoaded', () => {
    manager = new AirsoftManager();
});
