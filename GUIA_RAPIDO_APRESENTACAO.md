# 📖 GUIA RÁPIDO - APOLLO COMENTADO LINHA POR LINHA

**Apresentação:** 01 de julho de 2026  
**Documento:** Seu estudo para a banca

---

## 🗺️ MAPA MENTAL DO APOLLO

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICATIVO APOLLO                         │
│            Gamificação de Hábitos Saudáveis                 │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    FRONTEND            BACKEND            BANCO
   (React Native)    (Node.js + Express)  (PostgreSQL)
        │                 │                 │
   ┌────┴────┐        ┌────┴────┐      ┌───┴────┐
   │ Screens │        │Controller│      │ Tabelas│
   │ Hooks   │        │Routes    │      │Models  │
   │Services │        │Middleware│      │        │
   └─────────┘        └──────────┘      └────────┘
```

---

## 📂 ARQUIVOS COMENTADOS (NESTE DOCUMENTO)

### Frontend Mobile (React Native + TypeScript)

#### 1. Relatório de Leitura
- **`useRelatorioLeitura.ts`** - Hook com lógica completa
  - Busca dados `/relatorio/leitura`
  - Gerencia meta de leitura
  - Atualiza estado LOCAL (não recarrega servidor)
  
- **`relatorioLeitura.view.tsx`** - View pura (Clean Architecture)
  - Renderização condicional (carregando/erro/vazio/dados)
  - Grid de 4 cards com métricas
  - Barra de progresso com edição de meta
  - Último livro lido

- **`relatorioLeitura.styles.ts`** - Estilos centralizados
  - Cores do tema Apollo
  - Layout grid responsivo
  - Componentes de card, barra, input

#### 2. JogosHabitos

##### Arrumar Cama
- **`useCama.ts`** - Hook simples
  - Evita duplo registro no mesmo dia
  - Chama `useRegistrarXP(MOTIVOS_XP.ARRUMAR_CAMA)`
  - Valor de XP vem do backend (segurança)

##### Beber Água
- **`useBeberAgua.ts`** - Hook completo com meta
  - Consumo diário com múltiplos tipos de bebida
  - Meta: 2000ml/dia
  - Histórico de consumos
  - Bônus XP ao bater meta
  - **Padrão otimista:** atualiza estado LOCAL sem recarregar

##### Meditação
- **`useMeditar.ts`** - Hook com timer avançado
  - Timer regressivo (5, 10, 15 ou customizado)
  - Usa `useRef` para intervalo (evita memory leak)
  - Registra XP ao concluir sessão
  - Cleanup function importante

---

### Backend (Node.js + Express + Sequelize + PostgreSQL)

#### Controllers (Camada MVC)

##### 1. xpLogController.js
- **`registrar()`** - POST `/xp/registrar`
  - Recebe id_motivo
  - Busca xp_padrao no banco (servidor decide!)
  - Security by Design: nunca confiar no cliente
  
- **`calcularSaldo()`** - GET `/xp/saldo`
  - SUM(xp_ganho) - total histórico
  - Op.lte, Op.gt - operadores SQL
  - Retorna: total_xp, nivel_atual, xp_proximo_nivel

##### 2. consumoAguaController.js
- **`registrarConsumo()`** - POST `/agua/registrar`
  - **Transaction ACID:** tudo ou nada
  - Passo 1: INSERT consumo
  - Passo 2: INSERT xp_log (20 XP)
  - Passo 3: Verifica se bateu meta (2000ml)
  - Passo 4: INSERT xp_log bônus (50 XP) se meta batida
  - Evita duplo bônus no mesmo dia

##### 3. leituraController.js
- **`registrarSessao()`** - POST `/leitura/registrar`
  - Suporta nome_livro (auto-cria) ou id_livro_lido
  - **Novo:** Captura e salva autor do livro
  - Transaction ACID: leitura + xp atomicamente
  - Busca livro existente ou cria novo

---

## 🎯 CONCEITOS-CHAVE

### 1. Clean Architecture (Frontend)
```
View (renderiza)
  ↑
Hook (lógica)
  ↑
API Service (requisições)
  ↑
Backend
```

### 2. MVC (Backend)
```
Route (recebe requisição)
  ↓
Controller (lógica)
  ↓
Model (banco)
```

### 3. Segurança (Security by Design)
```
❌ NUNCA: xp_ganho = req.body.xp_ganho  // Cliente define
✅ SEMPRE: xp_ganho = motivo.xp_padrao  // Servidor define
```

### 4. ACID Transactions
```
try {
  INSERT consumo
  INSERT xp_log
  INSERT xp_log (bônus)
  ✅ COMMIT (tudo persiste)
} catch {
  ❌ ROLLBACK (volta tudo)
}
```

### 5. Padrão Otimista
```
1. setMeta(750)           // Atualiza UI imediatamente
2. await api.put(...)     // Envia ao backend
3. Sem recarregar dados   // Não refaz requisição GET
```

### 6. Fail Fast
```
if (!usuario_id) return 400  // Rejeita antes do banco
if (!id_motivo) return 400   // Não toca banco
if (!motivo) return 404      // Valida integridade
```

---

## 📝 ESTRUTURA DO DOCUMENTO PRINCIPAL

O documento `DOCUMENTACAO_COMENTADA.md` contém:

### Seção 1: Relatório de Leitura (3 arquivos)
- 150+ linhas de código comentado
- Explicação linha-por-linha de cada função
- Diagramas de fluxo de dados

### Seção 2: JogosHabitos (3 exemplos principais)
- **Arrumar Cama:** padrão simples (DRY)
- **Beber Água:** padrão otimista com meta
- **Meditação:** padrão avançado com useRef

### Seção 3: Controllers (3 examples principais)
- **xpLogController:** Segurança e validação
- **consumoAguaController:** Transactions ACID
- **leituraController:** Auto-criação de recursos

---

## 🎓 COMO ESTUDAR PARA A APRESENTAÇÃO

### Dia anterior (30 de junho)
1. Leia **Seção 1** (Relatório) - entenda o padrão Hook/View
2. Leia **Seção 2** (JogosHabitos) - fixe os 3 padrões principais
3. Leia **Seção 3** (Controllers) - domine a segurança

### Dia da apresentação (01 de julho)
- **10 min antes:** revise os fluxos principais
- **Durante banca:** tenha o documento aberto
- **Se perguntarem:** "Veja aqui no comentário linha X..."

---

## ❓ POSSÍVEIS PERGUNTAS DA BANCA

### Q1: "Como o XP é registrado?"
**Resposta:** 
- Frontend envia id_motivo (ex: 1 = Arrumar Cama)
- Backend busca o xp_padrao no banco (ex: 20 XP)
- Servidor decide o valor, cliente nunca manda XP
- Isso é Security by Design (código no documento)

### Q2: "O que é uma transação?"
**Resposta:**
- Bloco atomático: tudo registra OU nada registra
- Se consumo registra mas XP falha → ROLLBACK
- Garante integridade: nunca há consumo sem XP
- Ver exemplo no consumoAguaController.js

### Q3: "Por que não recarrega dados após editar meta?"
**Resposta:**
- Padrão otimista: atualiza estado LOCAL na hora
- Se recarregasse, seria 200-500ms de delay
- UX melhor + menos carga no servidor
- Backend já persistiu, então é seguro

### Q4: "Como o app sabe o nível do usuário?"
**Resposta:**
- GET /xp/saldo faz SUM(xp_ganho)
- Busca o nível com Op.lte (maior xp_minimo ≤ total)
- Retorna: Iniciante (0), Aprendiz (200), Dedicado (1000), etc

### Q5: "O que é useRef?"
**Resposta:**
- Armazena referência (intervalo do timer) SEM causar re-render
- cleanup function no return do useEffect limpa ao desmontar
- Evita memory leak (timer rodando após tela sair)

---

## 🔗 LINKS PARA ARQUIVOS ORIGINAIS

```
Frontend:
- apps/mobile/src/screens/Relatorio/relatorioLeitura.view.tsx
- apps/mobile/src/screens/Relatorio/useRelatorioLeitura.ts
- apps/mobile/src/screens/Relatorio/relatorioLeitura.styles.ts
- apps/mobile/src/screens/JogosHabitos/ArrumarCama/useCama.ts
- apps/mobile/src/screens/JogosHabitos/BeberAgua/useBeberAgua.ts
- apps/mobile/src/screens/JogosHabitos/Meditar/useMeditar.ts

Backend:
- apps/api/src/controllers/xpLogController.js
- apps/api/src/controllers/consumoAguaController.js
- apps/api/src/controllers/leituraController.js
- apps/api/src/controllers/usuarioController.js
- apps/api/src/controllers/habitoController.js
- apps/api/src/controllers/relatorioController.js
```

---

## 💡 DICAS IMPORTANTES

### Arquitectura
- Frontend: **Clean Architecture** (View/Hook separados)
- Backend: **MVC** (Model-View-Controller)
- Banco: **PostgreSQL** com **Sequelize ORM**

### Segurança
- JWT válida antes de cada requisição
- XP decidido pelo servidor (nunca pelo cliente)
- Transactions garantem integridade

### Performance
- Promise.all() para requisições paralelas
- useRef para refs que não causam re-render
- SUM/COUNT no banco (não traz todos os registros)

### UX
- Padrão otimista (feedback imediato)
- Alerts para sucesso/erro
- Loading spinners durante requisições

---

**Boa apresentação! 🚀**

*Documento criado: 30 de junho de 2026*  
*Para: Apresentação ADS 5º semestre - Faculdade CCI*  
*Integrantes: Caio Trajano, Higor Ferreira Reis, Gustavo Alves*
