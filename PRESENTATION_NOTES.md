# 🎓 Apollo - Notas para Apresentação (01 de julho 2026)

## 🐛 1. BUG FIXADO: Meta de Leitura Não Atualiza na Tela

### Problema Original
- Usuário edita meta de leitura
- Vê alerta "Meta atualizada!"  
- **MAS**: número não muda na tela ❌

### Root Cause
No arquivo [useRelatorioLeitura.ts](apps/mobile/src/screens/Relatorio/useRelatorioLeitura.ts#L78):
- Após salvar com `PUT /usuarios/meta-leitura`
- Hook chamava `await carregarDados()` (refetch do servidor)
- Servidor retornava valor ANTIGO → sobrescrevia o novo valor local

### Solução Implementada
**Padrão: Optimistic Update**
```
1. usuário digita valor → setMeta(valor) [UI atualiza IMEDIATAMENTE]
2. PUT /usuarios/meta-leitura (background)
3. ✅ Servidor confirma
4. ❌ Servidor nega → rollback do estado local
```

**Mudança**: Removido `await carregarDados()` da linha 78
- Frontend confia no seu próprio estado
- Melhor UX: feedback imediato
- Servidor persiste em background

**Padrão Arquitetural**: Common em aplicações modernas (Gmail, Slack, Discord)

---

## 🏗️ 2. ARQUITETURA: Clean Architecture + MVC

### Frontend (React Native + TypeScript)
```
Screen/
├── useXXX.ts          [LÓGICA] Hook = regras de negócio
├── XXX.view.tsx       [VISUAL] View = componentes puros
└── XXX.styles.ts      [ESTILO] StyleSheet
```

**Princípio**: Separação de responsabilidades
- Hook: state, validação, requisições HTTP, lógica
- View: renderização apenas, desestrutua tudo do hook
- Styles: isolado, sem contaminação de lógica

**Exemplo**: [useBeberAgua.ts](apps/mobile/src/screens/JogosHabitos/BeberAgua/useBeberAgua.ts)
- 8 states diferentes (hidratação, XP, histórico)
- Otimista: atualiza UI local ANTES de confirmar servidor

### Backend (Node.js + Express + Sequelize)
```
/controllers
├── xpLogController.js       [Gamificação] Security by Design
├── consumoAguaController.js [ACID TX] Atomicidade garantida
├── leituraController.ts     [Auto-criação] Conveniência
└── usuarioController.js     [Auth] JWT + bcrypt
```

**Princípio**: MVC clássico + Validação Fail Fast
- Model: Define dados (Sequelize)
- Controller: Validação + Lógica
- Routes: Endpoints HTTP

---

## 🔐 3. SECURITY: "Servidor Decide, Cliente Obedece"

### Padrão: Security by Design

#### ❌ INSEGURO (não fazemos):
```javascript
POST /xp/registrar { id_motivo: 1, xp_ganho: 99999 }
// Servidor acredita e registra 99999 XP! 💥
```

#### ✅ SEGURO (como fazemos):
```javascript
POST /xp/registrar { id_motivo: 1 }
// Backend:
// 1. Busca Motivo.findByPk(1)
// 2. Obtém xp_padrao do banco (ex: 20)
// 3. Registra: { usuario_id, id_motivo, xp_ganho: 20 }
// Valor vem do servidor, nunca do cliente!
```

**Arquivo**: [xpLogController.js](apps/api/src/controllers/xpLogController.js#L32-L58)
- Método `registrar()`: Nunca confia em `xp_ganho` do cliente
- Sempre busca valor no banco (Motivo.findByPk)
- Validação Fail Fast: rejeita antes de DB access

---

## ⚡ 4. PERFORMANCE: useRef + Cleanup

### Problema
Se usássemos `useState` para guardar intervalo do timer:
```javascript
// ❌ Errado
const [intervaloId, setIntervaloId] = useState(null);
// Cada re-render cria novo intervalo → múltiplos timers! 💥
```

### Solução
[useMeditar.ts](apps/mobile/src/screens/JogosHabitos/Meditar/useMeditar.ts#L45-L46):
```javascript
// ✅ Correto
const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

useEffect(() => {
  if (isAtivo && tempoRestante > 0) {
    intervaloRef.current = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);
  }
  
  // CLEANUP: Essencial para evitar memory leak!
  return () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
  };
}, [isAtivo, tempoRestante]);
```

**Por quê?**
- `useRef` não causa re-render
- Valor persiste entre renders
- Cleanup garante limpeza ao desmontar

---

## 💾 5. CONFIABILIDADE: ACID Transactions

### Cenário
Usuário bebe água:
1. Registra consumo (INSERT)
2. Ganha 20 XP (INSERT)
3. Atingiu meta? Bônus 50 XP (INSERT)

### Problema sem Transaction
Se servidor falha no passo 2:
- Consumo registrado ✅
- XP não ✅
- Resultado: Inconsistência! 💥

### Solução: [consumoAguaController.js](apps/api/src/controllers/consumoAguaController.js#L65-L130)
```javascript
const t = await sequelize.transaction();

try {
  // PASSO 1: Registra consumo
  await ConsumoAgua.create({...}, { transaction: t });
  
  // PASSO 2: Registra XP
  await XpLog.create({...}, { transaction: t });
  
  // PASSO 3: Verifica meta + bônus
  // ...
  
  // COMMIT: Tudo persiste DE UMA VEZ
  await t.commit();
} catch (error) {
  // ROLLBACK: Desfaz TUDO se falhou
  await t.rollback();
}
```

**Garantia ACID**: Atomicity
- Tudo registra (COMMIT)
- OU nada registra (ROLLBACK)
- Nunca estado intermediário

---

## 🎯 6. UX PATTERNS: Otimismo e Conveniência

### Padrão 1: Optimistic Updates
[useBeberAgua.ts](apps/mobile/src/screens/JogosHabitos/BeberAgua/useBeberAgua.ts#L120-L150):
```typescript
handleAdicionarBebida = async () => {
  // 1. ATUALIZA UI IMEDIATAMENTE (otimista)
  setTotalConsumido(prev => prev + 200);
  
  // 2. DEPOIS, requisita servidor (background)
  const resultado = await api.post('/agua/registrar', {...});
  
  // 3. Se falhou, pode fazer rollback
  if (!resultado.ok) {
    setTotalConsumido(prev => prev - 200);
  }
};
```

**Resultado**: Feedback imediato → melhor UX

### Padrão 2: Auto-criação de Recursos
[leituraController.js](apps/api/src/controllers/leituraController.js#L100-L120):
```javascript
// Se livro "O Hobbit" não existe, cria automaticamente!
let livro = await LivrosLidos.findOne({...});
if (!livro) {
  livro = await LivrosLidos.create({
    nome_livro: "O Hobbit",
    autor: "J.R.R. Tolkien"  // ← Novo: captura autor
  });
}
```

**Resultado**: Menos cliques do usuário → melhor UX

---

## 📊 7. DADOS IMPORTANTES

### Tabelas Principais
| Tabela | Propósito | Campos-chave |
|--------|-----------|--------------|
| `tab_usuario` | Contas | usuario_id, meta_leitura |
| `tab_xp_log` | Histórico de XP | usuario_id, id_motivo, xp_ganho |
| `tab_motivo` | Catálogo de XP | motivo_id, xp_padrao (20, 50, etc) |
| `tab_consumo_agua` | Água bebida | usuario_id, quantidade_ml, tipo_bebida |
| `tab_leitura` | Sessões de leitura | id_livro_lido, usuario_id, pag_lidas |
| `tab_livros_lidos` | Catálogo de livros | id_livro_lido, nome_livro, **autor** |
| `tab_nivel` | Progressão | nivel_id, xp_minimo (0, 200, 500, 1000, 2000, 5000) |

### Motivos de XP (IDs em tab_motivo)
- 1: Registro de Água → 20 XP
- 2: (Arrumar Cama) → 20 XP
- 3: Meta Diária Hidratação → 50 XP (bônus)
- 6: Leitura → 20 XP
- (+ 6 outros hábitos)

---

## 📁 Arquivos Comentados (8 total)

### Frontend (5 hooks)
✅ [useRelatorioLeitura.ts](apps/mobile/src/screens/Relatorio/useRelatorioLeitura.ts) - Bug fix + Optimistic
✅ [useCama.ts](apps/mobile/src/screens/JogosHabitos/Arrumar%20Cama/useCama.ts) - DRY pattern
✅ [useBeberAgua.ts](apps/mobile/src/screens/JogosHabitos/Beber%20Agua/useBeberAgua.ts) - Otimista + Meta
✅ [useMeditar.ts](apps/mobile/src/screens/JogosHabitos/Meditar/useMeditar.ts) - useRef + Cleanup
✅ [relatorioLeitura.view.tsx](apps/mobile/src/screens/Relatorio/relatorioLeitura.view.tsx) - View pura

### Backend (3 controllers)
✅ [xpLogController.js](apps/api/src/controllers/xpLogController.js) - Security by Design
✅ [consumoAguaController.js](apps/api/src/controllers/consumoAguaController.js) - ACID Transactions
✅ [leituraController.js](apps/api/src/controllers/leituraController.js) - Auto-criação + JOINs

---

## 🎤 Respostas Rápidas para Banca

**P: Por que Optimistic Update em vez de esperar servidor?**
- Melhor UX, feedback imediato (padrão em Gmail/Slack)
- Rollback se servidor falhar

**P: Por que XP vem do servidor?**
- Segurança: impede cheat (usuário não pode enviar XP=99999)
- Security by Design (Zero Trust Architecture)

**P: Por que useRef em vez de useState?**
- useState causa re-render → múltiplos intervals
- useRef não causa re-render, intervalo roda normalmente
- Cleanup previne memory leak

**P: Como garante consistência?**
- ACID Transactions: tudo registra ou nada registra
- Se falha no meio, rollback desfaz tudo

**P: Qual a vantagem de auto-criar livros?**
- UX melhor: menos cliques
- Padrão: livro + autor capturados automaticamente

---

## 📝 Nota Final
Todos os arquivos acima têm comentários linha por linha explicando:
- O QUÊ o código faz
- POR QUÊ é feito assim
- QUAL o padrão arquitetural

Use os links para navegar durante a apresentação!
