# IPIAL - Sistema de Gestao de Exames de Acesso

Sistema completo de gestao para exames de acesso do Instituto Politecnico Industrial "Alda Lara".

## Arquitetura

```
project/
├── index.html          # Estrutura HTML
├── styles.css          # Estilos CSS
├── app.js             # Logica JavaScript
└── GUIA_COMPLETO.md   # Documentacao detalhada
```

## Iniciar o Projeto

### Opcao 1: Direto no Navegador
Abra o arquivo `index.html` diretamente no navegador.

### Opcao 2: Servidor Local
```bash
python -m http.server 8000
# Acesse http://localhost:8000
```

## Credenciais

- **Utilizador:** admin
- **Palavra-passe:** admin

## Funcionalidades

### Administrador
- Login seguro com logs de atividade
- Dashboard com estatisticas em tempo real
- CRUD completo de candidatos
- Upload de fotos (max 2MB)
- Pesquisa e filtros avancados
- Validacao de idade minima (15 anos)
- Prevencao de duplicacao de BI
- Relatorios em PDF/HTML/CSV
- Exportacao/Importacao JSON
- Controle de publicacao de resultados

### Consulta Publica
- Visualizacao de estatisticas gerais
- Ranking top 10 melhores notas
- Consulta individual por BI/Passaporte
- Lista completa de resultados
- Design responsivo

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

## Armazenamento

Dados armazenados localmente no navegador via LocalStorage:
- `ipial_candidates` - Candidatos
- `ipial_logs` - Logs de atividade
- `ipial_published` - Status de publicacao

**Importante:** Faca backup regular usando "Exportar JSON".

## Validacoes Implementadas

- Idade minima: 15 anos
- BI/Passaporte unico (sem duplicacao)
- Foto: max 2MB (JPG, PNG, GIF)
- Nota: 0 a 20 valores
- Nome: minimo 5 caracteres
- Campos obrigatorios validados

## Navegadores Suportados

Chrome, Firefox, Safari, Edge (ultimas versoes)

## Documentacao

Veja `GUIA_COMPLETO.md` para documentacao detalhada e instrucoes de uso.

---

**Instituto Politecnico Industrial "Alda Lara"**
Sistema de Gestao de Exames de Acesso 2025
