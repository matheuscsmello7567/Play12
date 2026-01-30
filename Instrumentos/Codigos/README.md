# Sistema de Organização de Jogos Airsoft MilSim

## Descrição do Projeto

Sistema web desenvolvido para auxiliar organizadores de jogos de airsoft no estilo MilSim (Military Simulation) a gerenciar grandes volumes de jogadores, regras de jogo, objetivos e logística geral.

## Estrutura do Projeto

```
Codigos/
├── index.html          # Página principal da aplicação
├── styles.css          # Estilos e design responsivo
├── app.js              # Lógica da aplicação e gerenciamento de dados
└── README.md           # Documentação (este arquivo)
```

## Funcionalidades Principais

### 1. **Dashboard do Organizador**
- Visão geral com estatísticas em tempo real
- Total de jogadores cadastrados
- Jogos agendados
- Regras ativas
- Itens de logística
- Próximos jogos programados

### 2. **Gerenciamento de Jogadores**
- Cadastro completo de jogadores com:
  - Nome completo
  - Callsign (apelido tático)
  - Time (Alpha, Bravo, Charlie, Delta)
  - Função (Líder, Atirador, Suporte, Médico, Engenheiro, Sniper)
  - Contato
  - Status (Ativo/Inativo)
- Busca por nome ou callsign
- Filtro por time
- Edição e remoção de jogadores
- Interface em tabela para fácil visualização

### 3. **Gerenciamento de Jogos**
- Criação de jogos/eventos com:
  - Nome do jogo
  - Data e horário
  - Local
  - Número máximo de jogadores
  - Cenário/missão detalhada
  - Objetivos específicos
- Visualização em cards
- Status de preenchimento de vagas
- Gerenciamento de jogadores por jogo
- Cancelamento de jogos

### 4. **Gerenciamento de Regras**
- Cadastro de regras com:
  - Título da regra
  - Categoria (Segurança, Combate, Equipamento, Comportamento, Eliminação, Respawn)
  - Descrição detalhada
  - Prioridade (Alta, Média, Baixa)
  - Status (Ativa/Inativa)
- Organização por prioridade
- Ativação/desativação de regras
- Remoção de regras obsoletas

### 5. **Gerenciamento de Logística**
- Organização em três categorias:
  - **Equipamentos**: Itens necessários para o jogo
  - **Locais**: Pontos importantes no campo
  - **Transporte**: Veículos e opções de deslocamento
- Controle de quantidade
- Designação de responsáveis
- Observações adicionais

## Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização e design responsivo
- **JavaScript (ES6+)**: Lógica da aplicação
- **LocalStorage**: Persistência de dados no navegador

## Como Usar

### Instalação

1. Não é necessária instalação de dependências
2. Basta abrir o arquivo `index.html` em um navegador moderno

### Iniciando o Sistema

1. Abra o arquivo `index.html` em seu navegador
2. A aplicação carregará automaticamente
3. Se houver dados salvos anteriormente, eles serão carregados automaticamente

### Navegação

- Use as abas no topo para alternar entre diferentes seções:
  - **Dashboard**: Visão geral
  - **Jogadores**: Gerenciamento de participantes
  - **Jogos**: Criação e gestão de eventos
  - **Regras**: Definição de regras do jogo
  - **Logística**: Organização de recursos

### Cadastrando Jogadores

1. Clique na aba "Jogadores"
2. Clique no botão "+ Adicionar Jogador"
3. Preencha os campos obrigatórios (*)
4. Clique em "Salvar"
5. Use a busca e filtros para encontrar jogadores específicos

### Criando um Jogo

1. Clique na aba "Jogos"
2. Clique no botão "+ Criar Novo Jogo"
3. Preencha todas as informações do evento:
   - Nome do jogo
   - Data e horário
   - Local
   - Número máximo de participantes
   - Descrição do cenário
   - Objetivos (opcional)
4. Clique em "Criar Jogo"

### Gerenciando Regras

1. Clique na aba "Regras"
2. Clique em "+ Adicionar Regra"
3. Defina:
   - Título da regra
   - Categoria apropriada
   - Descrição completa
   - Prioridade
4. Clique em "Adicionar"
5. As regras são automaticamente ordenadas por prioridade

### Organizando Logística

1. Clique na aba "Logística"
2. Clique em "+ Adicionar Item"
3. Selecione o tipo (Equipamento, Local ou Transporte)
4. Preencha os detalhes
5. Clique em "Adicionar"

## Armazenamento de Dados

- Todos os dados são salvos automaticamente no **LocalStorage** do navegador
- Os dados persistem entre sessões
- Para fazer backup, exporte os dados do LocalStorage manualmente
- Para limpar todos os dados: Abra o Console do navegador e execute:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

## Design Responsivo

O sistema é totalmente responsivo e funciona em:
- 💻 Desktops
- 📱 Tablets
- 📱 Smartphones

## Recursos Adicionais

### Busca e Filtros
- Busca em tempo real de jogadores
- Filtro por time
- Organização automática por prioridade (regras)
- Ordenação por data (jogos)

### Interface Intuitiva
- Design moderno com gradientes
- Cards visuais para jogos
- Tabelas organizadas para jogadores
- Badges coloridos para status e prioridades
- Modais para formulários
- Mensagens de confirmação antes de ações destrutivas

### Estatísticas
- Contador em tempo real no dashboard
- Próximos jogos destacados
- Indicadores visuais de capacidade de jogos

## Melhorias Futuras Sugeridas

1. **Backend com Banco de Dados**: Migrar do LocalStorage para um servidor com banco de dados (MySQL, PostgreSQL, MongoDB)
2. **Sistema de Autenticação**: Login para organizadores e jogadores
3. **Atribuição de Jogadores a Jogos**: Sistema completo de inscrição e gestão de vagas
4. **Notificações**: Envio de avisos por email ou SMS
5. **Geração de Relatórios**: PDFs com informações do jogo, lista de presença, etc.
6. **Mapa Interativo**: Marcação de objetivos no mapa do campo
7. **Sistema de Pontuação**: Tracking de pontos e performance
8. **Histórico de Jogos**: Arquivo de jogos anteriores com estatísticas
9. **Chat em Tempo Real**: Comunicação entre organizadores e jogadores
10. **App Mobile**: Versão nativa para iOS e Android

## Requisitos do Sistema

- Navegador moderno com suporte a:
  - HTML5
  - CSS3 (Grid, Flexbox)
  - JavaScript ES6+
  - LocalStorage API

## Navegadores Testados

✅ Google Chrome (v90+)
✅ Mozilla Firefox (v88+)
✅ Microsoft Edge (v90+)
✅ Safari (v14+)

## Suporte

Para dúvidas, sugestões ou problemas:
- Abra uma issue no repositório do projeto
- Entre em contato com a equipe de desenvolvimento

## Licença

Este projeto está sob a licença especificada no arquivo LICENSE do repositório.

## Contribuindo

Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Agradecimentos

Desenvolvido para auxiliar a comunidade de airsoft na organização de eventos MilSim de qualidade.