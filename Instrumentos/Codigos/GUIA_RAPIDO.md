# Guia Rápido de Uso - Sistema Airsoft MilSim

## 🚀 Início Rápido

### 1. Abrir o Sistema
- Localize o arquivo `index.html` na pasta `Instrumentos/Codigos/`
- Dê um duplo clique ou abra com seu navegador preferido
- O sistema carregará automaticamente

### 2. Primeiro Uso

#### Cadastrar Jogadores
1. Clique na aba **"Jogadores"**
2. Clique em **"+ Adicionar Jogador"**
3. Preencha:
   - Nome completo
   - Callsign (apelido tático)
   - Time (Alpha, Bravo, Charlie ou Delta)
   - Função (Líder, Atirador, Suporte, Médico, Engenheiro ou Sniper)
   - Contato (opcional)
4. Clique em **"Salvar"**

#### Criar um Jogo
1. Clique na aba **"Jogos"**
2. Clique em **"+ Criar Novo Jogo"**
3. Preencha:
   - Nome do jogo
   - Data e horário
   - Local
   - Número máximo de jogadores
   - Descrição do cenário/missão
   - Objetivos (opcional)
4. Clique em **"Criar Jogo"**

#### Adicionar Regras
1. Clique na aba **"Regras"**
2. Clique em **"+ Adicionar Regra"**
3. Preencha:
   - Título da regra
   - Categoria
   - Descrição
   - Prioridade (Alta, Média ou Baixa)
4. Clique em **"Adicionar"**

#### Gerenciar Logística
1. Clique na aba **"Logística"**
2. Clique em **"+ Adicionar Item"**
3. Selecione o tipo:
   - **Equipamento**: Itens necessários para o jogo
   - **Local**: Pontos importantes no campo
   - **Transporte**: Veículos disponíveis
4. Preencha os detalhes
5. Clique em **"Adicionar"**

## 📊 Dashboard

O Dashboard mostra:
- Total de jogadores cadastrados
- Total de jogos agendados
- Total de regras ativas
- Total de itens de logística
- Próximos jogos programados

## 🔍 Recursos Úteis

### Buscar Jogadores
- Use o campo de busca para encontrar por nome ou callsign
- Use o filtro de time para ver apenas jogadores de um time específico

### Editar Informações
- Clique em **"Editar"** ao lado do jogador para modificar seus dados
- Preencha o formulário novamente com as novas informações

### Remover Itens
- Clique em **"Remover"** ou **"Cancelar"**
- Confirme a ação
- ⚠️ Atenção: Esta ação não pode ser desfeita!

### Ativar/Desativar Regras
- Clique no botão **"Desativar"** para tornar uma regra inativa
- Regras inativas não contam no total do dashboard
- Clique em **"Ativar"** para reativar

## 💾 Salvamento de Dados

- Todos os dados são salvos **automaticamente** no navegador
- Os dados persistem mesmo fechando e abrindo o navegador
- Os dados são específicos para cada navegador
- Para fazer backup, veja a seção abaixo

## 🔒 Backup e Restauração

### Fazer Backup
1. Abra o Console do navegador (F12)
2. Digite:
```javascript
console.save = function(data, filename){
    const blob = new Blob([data], {type: 'text/json'});
    const a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.click();
}
// Fazer backup
console.save(JSON.stringify({
    players: localStorage.getItem('players'),
    games: localStorage.getItem('games'),
    rules: localStorage.getItem('rules'),
    logistics: localStorage.getItem('logistics')
}), 'backup-airsoft.json');
```

### Limpar Todos os Dados
1. Abra o Console do navegador (F12)
2. Digite:
```javascript
localStorage.clear();
location.reload();
```

## 📱 Uso em Dispositivos Móveis

O sistema é totalmente responsivo:
- Funciona em smartphones
- Funciona em tablets
- Adapta-se automaticamente ao tamanho da tela
- Touch-friendly (amigável ao toque)

## ⚠️ Dicas Importantes

1. **Navegador Moderno**: Use versões recentes do Chrome, Firefox, Edge ou Safari
2. **JavaScript Ativado**: Certifique-se de que o JavaScript está habilitado
3. **Cookies/LocalStorage**: Não limpe os dados do navegador para manter suas informações
4. **Backup Regular**: Faça backups periódicos se tiver muitos dados cadastrados
5. **Um Navegador**: Use sempre o mesmo navegador para acessar seus dados

## 🎯 Casos de Uso Comuns

### Organizar um Jogo no Final de Semana
1. Crie o jogo na aba "Jogos"
2. Defina as regras na aba "Regras"
3. Liste os equipamentos necessários na aba "Logística"
4. Convide os jogadores e cadastre-os na aba "Jogadores"
5. Use o Dashboard para acompanhar tudo

### Gerenciar Múltiplos Times
1. Cadastre jogadores de diferentes times
2. Use o filtro de time para visualizar cada equipe
3. Organize jogadores por função dentro de cada time
4. Crie jogos específicos para cada time ou entre times

### Preparar Logística do Evento
1. Liste todos os equipamentos necessários
2. Marque os locais importantes no campo
3. Organize o transporte dos jogadores
4. Designe responsáveis para cada item

## 🆘 Problemas Comuns

### Dados Não Aparecem
- Verifique se está usando o mesmo navegador
- Confira se não limpou o cache/cookies recentemente
- Tente recarregar a página (F5)

### Formulário Não Salva
- Preencha todos os campos obrigatórios (marcados com *)
- Verifique se há mensagens de erro
- Certifique-se de clicar no botão "Salvar" ou "Criar"

### Interface Não Responde
- Recarregue a página (F5)
- Limpe o cache do navegador
- Tente em outro navegador

## 📞 Suporte

Para mais informações, consulte:
- `README.md` - Documentação completa
- Issues no GitHub - Reportar problemas
- Comunidade - Sugestões e melhorias

---

**Desenvolvido para a comunidade de Airsoft MilSim** 🎯
