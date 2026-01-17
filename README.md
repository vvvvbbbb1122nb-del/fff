# IPIAL - Sistema de Gestao de Exames de Acesso

Sistema completo de gestao para exames de acesso do Instituto Politecnico Industrial "Alda Lara".

## Arquitetura

```
project/
├── index.html                # Pagina inicial
├── app.js                   # Logica principal
├── styles.css               # Estilos globais
├── html/                    # Templates HTML
│   ├── login.html
│   ├── admin-layout.html
│   ├── dashboard.html
│   ├── candidates-list.html
│   ├── candidate-form.html
│   ├── publications.html
│   ├── public-results.html
│   └── public-search-result.html
├── js/                      # Modulos JavaScript
│   ├── constants.js
│   ├── storage.js
│   ├── state.js
│   ├── export-import.js
│   ├── html-loader.js
│   ├── render-pages.js
│   ├── render-dashboard.js
│   ├── render-publications.js
│   ├── listeners.js
│   └── listeners-forms.js
├── css/                     # Estilos modularizados
│   ├── base.css
│   ├── login.css
│   ├── admin-layout.css
│   ├── components.css
│   └── responsive.css
└── GUIA_COMPLETO.md        # Documentacao detalhada
```

## 🚀 Como Executar

### Opcao 1: Localhost no VSCode (Recomendado para Desenvolvimento)

#### Passo 1: Instalar extensao "Live Server"
1. Abra VSCode
2. Vá para **Extensões** (Ctrl+Shift+X)
3. Procure por "Live Server"
4. Clique em **Instalar** (Extensão oficial de Ritik Bhatnagar)

#### Passo 2: Iniciar o servidor
1. Abra a pasta do projeto em VSCode
2. Clique com botão direito em `index.html`
3. Selecione **"Open with Live Server"** ou
4. Use o atalho no canto inferior direito (clique em "Go Live")

**Resultado:** O navegador abre automaticamente em `http://localhost:5500`

**Vantagens:**
- Auto-reload ao salvar ficheiros
- Sem comandos de terminal
- Ideal para desenvolvimento

---

### Opcao 2: Localhost com Python (Terminal)

Abra o terminal e navegue até a pasta do projeto:

```bash
cd d:\Users\joac\Downloads\fff-main\fff-main
```

#### Com Python 3.11:
```bash
python -m http.server 8000
```

#### Resultado:
- Acesse `http://localhost:8000` no navegador
- Servidor ativo em http://127.0.0.1:8000

**Para parar:** Pressione `Ctrl+C` no terminal

---

### Opcao 3: Acessar pela Rede Local (Host/IP da Máquina)

#### Passo 1: Encontre o IP da sua máquina

**Windows - Terminal (PowerShell):**
```powershell
ipconfig
```
Procure por **IPv4 Address** (exemplo: `192.168.1.100`)

**Windows - Alternativo:**
```powershell
hostname
```

#### Passo 2: Iniciar servidor Python com acesso externo

```bash
python -m http.server 8000 --bind 0.0.0.0
```

**Resultado:**
- Servidor escuta em **TODOS** os interfaces de rede
- Acesso local: `http://localhost:8000`
- Acesso na rede: `http://192.168.1.100:8000` (substitua pelo seu IP)

#### Passo 3: Partilhar o link com colegas na rede

Colegas no mesmo WiFi/rede podem aceder usando:
```
http://[VOSSO-IP]:8000
```

**Exemplo:**
```
http://192.168.1.100:8000
```

---

### Opcao 4: VSCode com Terminal Integrado

1. Abra o terminal integrado do VSCode (Ctrl+` ou View → Terminal)
2. Navegue até a pasta:
```bash
cd .\
```

3. Execute o servidor:
```bash
python -m http.server 8000 --bind 0.0.0.0
```

4. Abra o navegador em `http://localhost:8000`

**Dica:** Pode dividir o terminal e codigo no mesmo VSCode

---

## 📋 Comparacao das Opcoes

| Opcao | Localhost | Rede | Desenvolvimento | Facilidade |
|-------|-----------|------|---|---|
| Live Server | ✅ Sim | ❌ Não | ⭐⭐⭐⭐⭐ | Muito fácil |
| Python (localhost) | ✅ Sim | ❌ Não | ⭐⭐⭐ | Simples |
| Python (0.0.0.0) | ✅ Sim | ✅ Sim | ⭐⭐⭐ | Simples |
| VSCode Terminal | ✅ Sim | ✅ Sim | ⭐⭐⭐⭐ | Meio termo |

---

## 💡 Recomendacoes

- **Desenvolvimento local:** Use **Live Server** (mais produtivo)
- **Testes na rede:** Use `python --bind 0.0.0.0` (acesso fácil)
- **Ambiente corporativo:** Configure IP fixo antes de partilhar
- **Producao:** Use servidor profissional (Apache, Nginx, etc.)

---

## 🔗 Portas Usadas

- **Live Server:** Port `5500` (default)
- **Python http.server:** Port `8000` (configurável)

Para usar porta diferente com Python:
```bash
python -m http.server 9000 --bind 0.0.0.0
# Acesso em http://localhost:9000
```

---

## 🔐 Credenciais Padrão

- **Utilizador:** `admin`
- **Palavra-passe:** `admin`

---

## ⏱️ Sessão e Persistencia

- **Timeout:** 10 minutos de inatividade
- **Armazenamento:** LocalStorage (persiste ao fechar/reabrir navegador)
- **Auto-logout:** Após 10 min sem cliques/teclado
- **Recuperacao:** Sessão restaurada automaticamente ao recarregar página

---

## 📊 Funcionalidades

### Administrador
- ✅ Login seguro com logs de atividade
- ✅ Dashboard com estatisticas em tempo real
- ✅ CRUD completo de candidatos
- ✅ Upload de fotos (max 2MB, com miniatura)
- ✅ Pesquisa e filtros avancados
- ✅ Validacao de idade minima (15 anos)
- ✅ Prevencao de duplicacao de BI
- ✅ Relatorios em PDF/HTML/CSV
- ✅ Exportacao/Importacao JSON
- ✅ Controle de publicacao de resultados
- ✅ **Aprovacao automatica:** Score ≥ 10 = Aprovado, Score < 10 = Rejeitado

### Consulta Publica
- ✅ Visualizacao de estatisticas gerais
- ✅ Ranking top 10 melhores notas **com fotos**
- ✅ Consulta individual por BI/Passaporte **com foto grande**
- ✅ Lista completa de resultados **com fotos em coluna**
- ✅ Design responsivo (mobile, tablet, desktop)

## Cursos Disponiveis

1. Engenharia Informatica
2. Administracao
3. Contabilidade
4. Gestao de Proyectos
5. Educacao Pre-Escolar
6. Educacao Especial

## Tecnologias

- HTML5
- CSS3 (Grid + Flexbox)
- JavaScript Vanilla (ES6+)
- LocalStorage API

## 📂 Armazenamento

Dados armazenados localmente no navegador via **LocalStorage**:
- `ipial_candidates` - Dados dos candidatos (nome, BI, notas, fotos em Base64)
- `ipial_logs` - Logs de atividade (login, CRUD operations)
- `ipial_config` - Configuracoes do sistema
- `ipial_auth` - Dados da sessao atual (user, loginTime, lastActivityTime)

**Importante:** 
- Dados persistem após fechar o navegador
- Faca **backup regular** usando "Exportar JSON" na secção Publicacoes
- Limpe localStorage manualmente se necessario reset completo

## 🔍 Validacoes Implementadas

- ✅ **Idade minima:** 15 anos
- ✅ **BI/Passaporte:** Unico (sem duplicacao)
- ✅ **Foto:** Max 2MB (JPG, PNG, GIF)
- ✅ **Nota:** 0 a 20 valores
- ✅ **Nome:** Minimo 5 caracteres
- ✅ **Campos obrigatorios:** Validacao completa
- ✅ **Status automatico:** Score ≥ 10 = Aprovado
- ✅ **Sessao:** Timeout apos 10 min inatividade

## 🌐 Navegadores Suportados

- ✅ Chrome (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)
- ✅ Edge (versao 90+)
- ✅ Opera (versao 76+)

**Nota:** Use as ultimas versoes para melhor compatibilidade

## 📚 Documentacao Adicional

- [GUIA_COMPLETO.md](GUIA_COMPLETO.md) - Manual detalhado com todos os funcionalidades
- [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guia rapido para primeiros passos
- [ESTRUTURA_FINAL.md](ESTRUTURA_FINAL.md) - Informacoes sobre estrutura do projeto
- [SEPARACAO_CODIGO.md](SEPARACAO_CODIGO.md) - Detalhes da separacao HTML/JavaScript

---

## ⚙️ Requisitos Minimos

- **Navegador moderno** com suporte para ES6 e LocalStorage
- **Conexao com Internet** (opcional, funciona offline)
- **Python 3.7+** (apenas se usar opcao de servidor Python)

---

## 🐛 Troubleshooting

### "Dados nao aparecem ao recarregar"
- Verifique se LocalStorage esta habilitado no navegador
- Abra DevTools (F12) → Application → Local Storage

### "Nao consigo fazer login"
- Limpe o cache e cookies
- Tente modo incognito/privado
- Verifique a console para erros (F12 → Console)

### "Fotos nao aparecem"
- Certifique-se que o ficheiro tem menos de 2MB
- Formatos suportados: JPG, PNG, GIF
- Recarregue a pagina (Ctrl+Shift+R)

### "Servidor Python nao inicia"
- Certifique-se que port 8000 nao esta em uso
- Use porta diferente: `python -m http.server 9000`
- Verifique se Python esta instalado: `python --version`

---

## 📞 Suporte

Para questoes ou relatorios de bugs, consulte a documentacao em [GUIA_COMPLETO.md](GUIA_COMPLETO.md)
