# Base de Conhecimento — Controle de Gastos

## Sobre o Desenvolvedor

- Desenvolvedor sênior Delphi com entusiasmo em aprender desenvolvimento WEB.
- Está aprendendo os fundamentos de aplicações WEB na prática.
- Futuramente fará um TCC usando HTML, CSS, React, Next.js, PostgreSQL e Vercel.
- O objetivo deste projeto é entender o ciclo completo de uma aplicação WEB antes de usar frameworks.

## Sobre o Projeto

**Nome:** Controle de Gastos  
**Objetivo:** Aplicação web para controle de despesas pessoais.  
**Stack atual:** HTML, CSS e JavaScript puro (vanilla JS), sem frameworks.  
**Autenticação:** Firebase Authentication (SDK compat versão 12.16.0).  
**Banco de dados / Backend:** Firestore (já integrado).  
**Hospedagem:** A definir (Vercel planejado para o TCC).

### Roadmap planejado
1. ✅ Telas e lógica em HTML/CSS/JS puro.
2. ✅ Integração com Firestore para persistência de dados.
3. ✅ Criação de uma camada de serviço para abstrair o acesso ao backend.
4. Criação de uma API REST para conectar frontend e backend.

---

## Estrutura de Pastas

Cada tela tem sua própria pasta dentro de `pages/`, com um `.html`, um `.js` e, quando necessário, um `.css` dedicado.  
Arquivos compartilhados ficam na raiz do projeto.  
Serviços de acesso ao Firestore ficam na pasta `services/`.

```
expenses-control/
├── index.html                          # Tela de login
├── index.js                            # Lógica da tela de login
├── global.css                          # Estilos globais compartilhados por todas as telas
├── firebase-init.js                    # Inicialização do Firebase (compartilhado)
├── usable.js                           # Funções utilitárias, validações, loading e logout
├── services/
│   └── transaction.services.js         # Camada de serviço para transações (Firestore)
└── pages/
    ├── home/
    │   ├── home.html                   # Tela principal após login
    │   ├── home.js                     # Lógica da tela principal
    │   └── home.css                    # Estilos específicos da tela principal
    ├── register/
    │   ├── register.html               # Tela de cadastro
    │   └── register.js                 # Lógica da tela de cadastro
    └── transaction/
        ├── transaction.html            # Tela de inserção/edição de transação
        ├── transaction.js              # Lógica da tela de transação
        └── transaction.css             # Estilos específicos da tela de transação
```

---

## Paleta de Cores

| Elemento            | Valor                        |
|---------------------|------------------------------|
| Fundo da página     | `rgb(0, 199, 146)` (verde)   |
| Texto dos botões    | Branco                       |
| Erros               | `red`                        |
| Loading overlay     | `rgba(0, 0, 0, 0.5)`         |
| Botão `.solid`      | Fundo branco, sem borda      |

---

## Padrões de Componentes — global.css

### Botões
Existem três variantes de botão. Use sempre uma dessas classes:

| Classe     | Aparência                              | Uso típico                          |
|------------|----------------------------------------|-------------------------------------|
| `.solid`   | Fundo branco, sem borda, texto escuro  | Ação principal (ex: Salvar)         |
| `.outline` | Fundo transparente, borda branca       | Ação secundária (ex: Registrar)     |
| `.clear`   | Fundo transparente, sem borda          | Ação terciária (ex: Cancelar, Sair) |

Regras gerais de botão:
- `padding: 10px`, `width: -webkit-fill-available`, `cursor: pointer`, `margin-bottom: 10px`.
- Botão desabilitado: `opacity: 0.6`.
- Botão ao clicar (`:active`): `opacity: 0.7`.

#### Botão FAB
- Classe `.fab` combinada com `.fixed .bottom .right`: botão flutuante fixo no canto inferior direito.
- Usado na home para abrir a tela de inserção de transação.

### Inputs
- `padding: 10px`, `width: -webkit-fill-available`.
- Sempre dentro de um `<div class="form-field">` com `margin-bottom: 10px`.
- Label acima do input, dentro de `<div><label>...</label></div>`.

### Mensagens de erro
- Usar `<div class="error" id="[campo]-[tipo]-error">Mensagem</div>` logo abaixo do input.
- Classe `.error`: `color: red; display: none;`.
- Exibir/ocultar via JavaScript: `element.style.display = "block"` ou `"none"`.
- Padrão de IDs: `[campo]-required-error`, `[campo]-invalid-error`, `[campo]-min-length-error`, etc.

### Formulários
- Formulários centralizados na tela: `<body class="centralize">` ou `<main class="centralize">`.
- Largura do formulário: `width: 400px`.
- Classe `.centralize`: `display: flex; justify-content: center; align-items: center;`.
- Telas com header usam `body { display: flex; flex-direction: column; }` e `main` como container centralizado.

### Loading
- Overlay global via `showLoading()` e `hideLoading()` (funções em `usable.js`).
- Sempre chamar `showLoading()` antes de operações assíncronas e `hideLoading()` no `.then()` e no `.catch()`.

---

## Padrões de JavaScript

### Objeto `form`
Cada arquivo `.js` de tela deve ter um objeto `form` ao final do arquivo, com funções que retornam os elementos do DOM via `getElementById`. Nunca usar `getElementById` espalhado pelo código.

```js
const form = {
    email: () => document.getElementById("email"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    // ...
}
```

### usable.js — Funções disponíveis
O arquivo `usable.js` centraliza todas as funções utilitárias compartilhadas:

| Função                  | Descrição                                              |
|-------------------------|--------------------------------------------------------|
| `getErrorMessage(error)`| Traduz códigos de erro do Firebase para mensagens PT   |
| `showLoading()`         | Exibe o overlay de carregamento                        |
| `hideLoading()`         | Remove o overlay de carregamento                       |
| `validateEmail(email)`  | Valida formato de e-mail via regex                     |
| `formatDate(date)`      | Formata data para `pt-br` (ex: `01/01/2025`)           |
| `formatMoney(money)`    | Formata objeto `{ currency, value }` (ex: `BRL 99.90`) |
| `logout()`              | Faz signOut no Firebase e redireciona para `index.html`|

> Não existem arquivos `loading.js` ou `validations.js` separados — tudo está em `usable.js`.

### Camada de serviço — services/
Funções de acesso ao Firestore ficam em arquivos de serviço dentro da pasta `services/`.

**`transaction.services.js`** — objeto `transactionService`:

| Método                      | Descrição                                              |
|-----------------------------|--------------------------------------------------------|
| `findByUser(user)`          | Busca transações do usuário, ordenadas por data desc   |
| `findByUid(uid)`            | Busca uma transação pelo ID do documento               |
| `save(transaction)`         | Insere nova transação                                  |
| `update(uid, transaction)`  | Atualiza transação existente                           |
| `remove(transaction)`       | Remove transação pelo `uid`                            |

### Validações
- Funções de validação reutilizáveis ficam em `usable.js` (ex: `validateEmail()`).

### Eventos de blur
- Validações de campo são disparadas no evento `onblur` do input.
- A função de blur deve: atualizar visibilidade dos erros + verificar se habilita/desabilita botões.

### Habilitação de botões
- Botões de ação principal começam com `disabled="true"`.
- São habilitados/desabilitados dinamicamente conforme o formulário é preenchido.
- Nunca habilitar um botão sem validar todos os campos necessários.

### Erros do Firebase
- Erros de autenticação são tratados em `usable.js` na função `getErrorMessage(error)`.
- Usar `alert()` para exibir erros de operações assíncronas (login, cadastro, etc.).

---

## Inclusão de Scripts no HTML

- O `<link rel="stylesheet">` para o `global.css` é incluído antes dos scripts (ao final do `<body>`).
- CSS específico da tela é incluído logo após o `global.css`.
- Scripts são incluídos no final do HTML, fora do `<body>`, na seguinte ordem:
  1. SDKs externos (Firebase compat)
  2. `firebase-init.js`
  3. `usable.js`
  4. Scripts de serviço (ex: `transaction.services.js`)
  5. Script da tela (ex: `index.js`, `home.js`, `transaction.js`)
- Para telas em subpastas (`pages/[tela]/`), os caminhos usam `../../` para chegar à raiz.

---

## Firebase

- **Versão SDK:** compat 12.16.0 (carregado via CDN do gstatic).
- **Módulos em uso:** `firebase-app-compat.js`, `firebase-auth-compat.js`, `firebase-firestore-compat.js`.
- A inicialização do Firebase está em `firebase-init.js` na raiz — nunca duplicar a configuração.
- Usar sempre `firebase.auth()` para operações de autenticação.
- Usar sempre `firebase.firestore()` para operações de banco de dados.
- Coleção de transações: `"transactions"`. Cada documento contém: `type`, `date`, `money: { currency, value }`, `cathegory`, `description`, `user: { uid }`.

---

## Regras Gerais de Desenvolvimento

1. Toda tela nova deve seguir a paleta de cores, padrões de botões, inputs e erros definidos no `global.css`.
2. Nunca criar estilos inline que contradigam o `global.css`.
3. Nunca duplicar lógica que já existe em `usable.js` ou nos arquivos de serviço em `services/`.
4. Manter o código em português (labels, mensagens de erro, comentários).
5. Cada tela nova ganha sua própria pasta em `pages/[tela]/` com `[tela].html`, `[tela].js` e `[tela].css` quando necessário.
6. Ao criar novos campos de formulário, seguir o padrão de IDs: `[campo]-[tipo]-error`.
7. Firebase já está inicializado globalmente via `firebase-init.js` — não reinicializar.
8. Novas operações de banco de dados devem ser adicionadas ao serviço correspondente em `services/`, nunca diretamente no `.js` da tela.
