# IPIAL - Sistema de Gestão de Exames de Acesso
## Versão HTML/CSS/JavaScript Puro

### Sobre o Projeto
Este é o sistema de gestão de exames de acesso do IPIAL convertido de React/TypeScript para HTML, CSS e JavaScript puro. Mantém todas as funcionalidades originais sem dependências externas.

### Como Executar

#### Opção 1: Abrir diretamente no navegador
1. Localize o arquivo `index.html` na pasta raiz
2. Clique duas vezes nele para abrir no navegador padrão

#### Opção 2: Usar um servidor local (recomendado)
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js
npx http-server

# Com PHP
php -S localhost:8000
```

Depois acesse `http://localhost:8000` no navegador.

### Credenciais de Acesso
- **Utilizador**: admin
- **Palavra-passe**: admin

### Funcionalidades

#### Painel Administrativo
- **Dashboard**: Visualizar estatísticas gerais e atividade recente
- **Gestão de Candidatos**: Adicionar, editar e eliminar candidatos
  - Upload de foto (máximo 2MB)
  - Validação de idade (mínimo 15 anos)
  - Dados como nome, BI/Passaporte, contacto, curso, nota e estado
- **Publicação de Resultados**: Controlar visibilidade das listas públicas

#### Funcionalidades Adicionais
- **Pesquisa e Filtros**: Buscar por nome, BI ou contacto
- **Exportação JSON**: Fazer backup dos dados
- **Importação JSON**: Restaurar dados anteriormente exportados
- **Impressão**: Gerar relatórios em PDF
- **Visualização Pública**: Modo de consulta de resultados para candidatos

### Armazenamento de Dados
Todos os dados são armazenados no **LocalStorage** do navegador:
- `ipial_candidates` - Lista de candidatos
- `ipial_logs` - Histórico de atividades
- `ipial_published` - Status de publicação

### Estrutura de Arquivos
```
.
├── index.html       # Página principal
├── styles.css       # Estilos CSS
├── app.js          # Lógica da aplicação
├── package.json    # Informações do projeto
├── README.md       # Este arquivo
└── metadata.json   # Metadados do projeto
```

### Tecnologias Utilizadas
- HTML5
- CSS3 (com Grid e Flexbox)
- JavaScript Vanilla (ES6+)
- LocalStorage para persistência

### Responsividade
A aplicação é completamente responsiva e funciona bem em:
- Desktops
- Tablets
- Dispositivos móveis

### Impressão
Ao imprimir, a aplicação gera automaticamente:
- Relatório geral com todos os candidatos
- Resultado individual (quando selecionado)

### Dados de Exemplo
Para testar a aplicação, você pode:
1. Fazer login com admin/admin
2. Adicionar alguns candidatos manualmente
3. Exportar os dados em JSON
4. Mais tarde, importar os dados novamente

### Tratamento de Erros
- Validação de email e campos obrigatórios
- Limite de idade mínima (15 anos)
- Limite de tamanho de arquivo de foto (2MB)
- Prevenção de duplicação de BI/Passaporte

### Dicas de Uso
- Use a barra de pesquisa para filtrar candidatos rapidamente
- Exporte seus dados regularmente como backup
- A página pública só é acessível quando você publica os resultados
- Os logs de atividade são limitados aos últimos 50 registos

### Suporte
Para dúvidas ou problemas, consulte a documentação original do projeto ou entre em contacto com a equipa de desenvolvimento.

---

**Última atualização**: Janeiro 2026
**Versão**: 2.0 (HTML/CSS/JavaScript)
