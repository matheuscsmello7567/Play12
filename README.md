# Sistema de Organização de Jogos Airsoft MilSim

Este projeto consiste em um sistema web para auxiliar organizadores de jogos de airsoft no estilo MilSim (Military Simulation) a gerenciar eficientemente grandes volumes de jogadores e as diversas nuances envolvidas na organização destes eventos. O sistema oferece ferramentas para gestão de jogadores, criação e agendamento de jogos, definição de regras, gerenciamento de objetivos e organização da logística geral necessária para a realização dos eventos.

O sistema foi desenvolvido com foco na simplicidade de uso e acessibilidade, permitindo que organizadores possam rapidamente cadastrar informações, visualizar estatísticas em tempo real e gerenciar todos os aspectos de um evento de airsoft MilSim de forma centralizada e organizada.

## Alunos integrantes da equipe

* Nome completo do aluno 1
* Nome completo do aluno 2

## Professores responsáveis

* Nome do orientador de conteúdo (TCCI)
* Nome do orientador de acadêmico (TCCI)
* Nome do orientador de TCC II

## Funcionalidades Implementadas

### Dashboard
- Visão geral com estatísticas em tempo real (total de jogadores, jogos, regras e itens de logística)
- Exibição dos próximos jogos agendados

### Gerenciamento de Jogadores
- Cadastro completo de jogadores (nome, callsign, time, função, contato)
- Sistema de busca e filtros por time
- Edição e remoção de jogadores
- Organização em times (Alpha, Bravo, Charlie, Delta)
- Funções específicas (Líder, Atirador, Suporte, Médico, Engenheiro, Sniper)

### Gerenciamento de Jogos
- Criação de eventos com data, horário, local e cenário
- Definição de objetivos e missões
- Controle de capacidade de jogadores
- Visualização em cards com informações completas

### Gerenciamento de Regras
- Cadastro de regras por categorias (Segurança, Combate, Equipamento, etc.)
- Sistema de prioridades (Alta, Média, Baixa)
- Ativação/desativação de regras
- Organização automática por prioridade

### Gerenciamento de Logística
- Organização de equipamentos, locais e transporte
- Controle de quantidade e responsáveis
- Anotações e observações adicionais

## Instruções de Replicação/Reprodução

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Não requer instalação de servidor ou banco de dados

### Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/matheuscsmello7567/Play12.git
cd Play12
```

2. Navegue até o diretório do código:
```bash
cd Instrumentos/Codigos
```

3. Abra o arquivo `index.html` em seu navegador web:
   - **Windows**: Duplo clique no arquivo `index.html`
   - **macOS**: Clique com botão direito > Abrir com > Navegador
   - **Linux**: `xdg-open index.html` ou abra diretamente pelo navegador

4. A aplicação está pronta para uso! Todos os dados serão armazenados localmente no navegador.

### Estrutura do Projeto

```
Play12/
├── Instrumentos/
│   └── Codigos/
│       ├── index.html      # Página principal
│       ├── styles.css      # Estilos da aplicação
│       ├── app.js          # Lógica JavaScript
│       └── README.md       # Documentação detalhada
├── Divulgacao/            # Materiais de divulgação
├── Fichamentos/           # Fichamentos de pesquisa
├── Artigo/                # Artigo científico
├── Memorial/              # Memorial do projeto
├── README.md              # Este arquivo
└── LICENSE                # Licença do projeto
```

### Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação web
- **CSS3**: Estilização e design responsivo
- **JavaScript (ES6+)**: Lógica da aplicação
- **LocalStorage API**: Persistência de dados no navegador

### Uso do Sistema

1. **Dashboard**: Visualize estatísticas gerais e próximos jogos
2. **Jogadores**: Cadastre e gerencie os participantes
3. **Jogos**: Crie e organize eventos de airsoft
4. **Regras**: Defina as regras do jogo
5. **Logística**: Organize equipamentos, locais e transporte

Para instruções detalhadas de uso, consulte o arquivo `Instrumentos/Codigos/README.md`.

### Observações

- Os dados são armazenados localmente no navegador (LocalStorage)
- Para fazer backup, exporte os dados manualmente ou use ferramentas do navegador
- Para limpar todos os dados, abra o Console do navegador (F12) e execute:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

## Design Responsivo

O sistema é totalmente responsivo e funciona perfeitamente em:
- 💻 Computadores Desktop
- 📱 Tablets
- 📱 Smartphones
