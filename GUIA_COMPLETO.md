# IPIAL - Sistema de Gestao de Exames de Acesso
## Guia Completo de Utilizacao

---

## Estrutura do Projeto

```
project/
├── index.html          # Estrutura HTML principal
├── styles.css          # Estilos CSS completos
├── app.js             # Logica JavaScript completa
└── GUIA_COMPLETO.md   # Esta documentacao
```

---

## Como Iniciar o Projeto

### Opcao 1: Abrir Diretamente
1. Localize o arquivo `index.html`
2. Clique duas vezes para abrir no navegador

### Opcao 2: Servidor Local (Recomendado)
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js
npx http-server

# Com PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

---

## Credenciais de Acesso

**Administrador:**
- Utilizador: `admin`
- Palavra-passe: `admin`

---

## Funcionalidades Implementadas

### 1. Gestao de Acesso e Seguranca
- Login administrativo com validacao
- Protecao de dados contra acessos nao autorizados
- Sistema de logs de atividades (login, alteracoes, publicacoes)
- Logout seguro

### 2. Gestao de Candidatos
**Registo Completo:**
- Nome completo
- Idade (minimo 15 anos com validacao)
- BI/Passaporte (sem duplicacao)
- Contacto telefonico
- Curso pretendido
- Nota do exame
- Estado (Pendente/Aprovado/Reprovado)
- Upload de foto (maximo 2MB)

**Validacoes Automaticas:**
- Idade minima: 15 anos
- Prevencao de BI/Passaporte duplicado
- Campos obrigatorios validados
- Tamanho maximo de foto: 2MB

**Funcionalidades:**
- Adicionar novo candidato
- Editar dados existentes
- Eliminar candidato
- Pre-visualizacao de foto antes de enviar
- Remover foto

### 3. Pesquisa e Filtros
- Pesquisa por nome, BI ou contacto
- Filtro por curso
- Filtro por estado (Aprovado/Reprovado/Pendente)
- Contagem de resultados filtrados

### 4. Dashboard com Estatisticas
**Resumo Geral:**
- Total de candidatos inscritos
- Total de aprovados
- Total de reprovados

**Distribuicao por Curso:**
- Graficos de barras para cada curso
- Percentagens calculadas automaticamente

**Atividade Recente:**
- Ultimas 10 acoes no sistema
- Timestamp de cada atividade
- Usuario responsavel pela acao

### 5. Gestao de Exames e Resultados
- Insercao de notas (0 a 20)
- Classificacao automatica por estado
- Ordenacao por nota
- Ranking dos melhores classificados

### 6. Relatorios e Exportacao

**Formato CSV:**
- Lista completa de candidatos
- Lista de aprovados
- Dados estruturados (Nome, BI, Curso, Nota, Estado)

**Formato PDF/HTML:**
- Relatorio geral com estatisticas
- Lista detalhada de candidatos
- Distribuicao por curso com medias
- Design profissional pronto para impressao

**Formato JSON:**
- Backup completo dos dados
- Exportacao de todos os candidatos
- Importacao de dados anteriores

### 7. Consultas Publicas
**Pagina Publica (quando publicada):**
- Estatisticas gerais (Total/Aprovados/Reprovados)
- Top 10 melhores notas
- Consulta individual por BI/Passaporte
- Tabela completa de resultados
- Data e hora da publicacao

**Controle de Publicacao:**
- Administrador controla quando publicar
- Suspender publicacao a qualquer momento
- Pre-visualizacao antes de publicar

### 8. Design e Usabilidade
- Interface moderna e intuitiva
- Totalmente responsiva (Desktop/Tablet/Mobile)
- Mensagens de erro claras
- Feedback visual em todas as acoes
- Modo de impressao otimizado
- Cores organizadas por funcao

---

## Fluxo de Utilizacao

### Para Administradores

1. **Login:**
   - Acesse a pagina inicial
   - Digite `admin` / `admin`
   - Clique em "Acesso Restrito"

2. **Dashboard:**
   - Visualize estatisticas gerais
   - Veja atividade recente
   - Analise distribuicao por curso

3. **Gestao de Candidatos:**
   - Clique em "Candidatos" no menu
   - Use "Inscrever Candidato" para adicionar novo
   - Preencha todos os campos obrigatorios
   - Faca upload da foto (opcional)
   - Clique em "Guardar"

4. **Editar/Eliminar:**
   - Na lista de candidatos, clique no botao de edicao
   - Modifique os dados necessarios
   - Ou clique em eliminar para remover

5. **Pesquisar:**
   - Use a barra de pesquisa no topo
   - Filtre por curso ou estado
   - Resultados aparecem instantaneamente

6. **Gerar Relatorios:**
   - Clique em "Relatorio Geral"
   - Arquivo HTML sera baixado automaticamente
   - Abra o arquivo para visualizar/imprimir

7. **Publicar Resultados:**
   - Va para "Publicacoes"
   - Clique em "Publicar Resultados Agora"
   - Confirme a acao
   - Resultados ficam visiveis na pagina publica

8. **Exportar/Importar:**
   - Use botoes no menu lateral
   - Exportar JSON: backup completo
   - Importar JSON: restaurar dados

9. **Logout:**
   - Clique em "Sair" no menu inferior

### Para Consulta Publica

1. **Acessar Pagina Publica:**
   - Na tela de login, clique em "Consultar Resultados"
   - Ou acesse diretamente se souber a URL

2. **Consultar Resultado Individual:**
   - Digite seu BI/Passaporte no campo de busca
   - Resultado aparece instantaneamente
   - Veja sua foto, nota e estado

3. **Ver Ranking:**
   - Role ate "Top 10 Melhores Notas"
   - Veja sua posicao se estiver no top 10

4. **Ver Todos os Resultados:**
   - Tabela completa na parte inferior
   - Use Ctrl+F para buscar seu nome

---

## Armazenamento de Dados

**LocalStorage do Navegador:**
- `ipial_candidates` - Lista de candidatos
- `ipial_logs` - Historico de atividades
- `ipial_published` - Status de publicacao

**Importante:** Os dados sao armazenados localmente no navegador. Para fazer backup:
1. Va em "Exportar JSON"
2. Guarde o arquivo em local seguro
3. Use "Importar JSON" para restaurar

---

## Cursos Disponiveis

1. Engenharia Informatica
2. Administracao
3. Contabilidade
4. Gestao de Proyectos
5. Educacao Pre-Escolar
6. Educacao Especial

---

## Estados do Candidato

- **Pendente:** Aguardando avaliacao
- **Aprovado:** Nota >= 10 (normalmente)
- **Reprovado:** Nao atingiu nota minima

---

## Resolucao de Problemas

### Dados nao aparecem
- Verifique se esta usando o mesmo navegador
- LocalStorage e especifico por navegador
- Faca backup regular com exportacao JSON

### Foto nao carrega
- Tamanho maximo: 2MB
- Formatos aceitos: JPG, PNG, GIF
- Tente redimensionar a imagem

### Erro ao importar JSON
- Verifique se o arquivo e valido
- Deve ser exportado pelo proprio sistema
- Formato deve ser array de objetos

### Pagina publica nao abre
- Certifique-se que resultados estao publicados
- Va em "Publicacoes" e clique em "Publicar"
- Icone verde indica publicacao ativa

---

## Recursos Tecnicos

**HTML5:**
- Estrutura semantica
- Suporte a file upload
- Campos de formulario validados

**CSS3:**
- Grid e Flexbox para layout
- Media queries para responsividade
- Animacoes suaves
- Modo de impressao otimizado

**JavaScript ES6+:**
- Classes para gerenciamento de estado
- LocalStorage API
- FileReader API para imagens
- Blob API para downloads
- Template literals para renderizacao

---

## Seguranca

- Validacao de entrada em todos os campos
- Protecao contra duplicacao de BI
- Logs de todas as acoes administrativas
- Dados armazenados localmente (sem servidor)
- Sem exposicao de senhas

---

## Suporte e Manutencao

Para adicionar novos cursos:
1. Abra `app.js`
2. Localize a constante `COURSES`
3. Adicione o novo curso no array

Para alterar credenciais:
1. Abra `app.js`
2. Localize a funcao `attachLoginListeners`
3. Modifique a validacao

---

## Versao

**Sistema:** IPIAL v2.0
**Data:** Janeiro 2025
**Tecnologias:** HTML5 + CSS3 + JavaScript Vanilla
**Navegadores Suportados:** Chrome, Firefox, Safari, Edge (ultimas versoes)

---

Instituto Politecnico Industrial "Alda Lara"
Sistema de Gestao de Exames de Acesso 2025
