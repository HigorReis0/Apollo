// ============================================================
// IMPORTAÇÕES (Models do Sequelize)
// ============================================================
// Model XpLog: representa a tabela tab_xp_log (histórico de XP)
const XpLog = require("../models/XpLog");

// Model Usuario: representa a tabela tab_usuario
const Usuario = require("../models/Usuario");

// Model Motivo: representa a tabela tab_motivo (catálogo de motivos de XP)
const Motivo = require("../models/Motivo");

// ============================================================
// CONTROLLER: xpLogController
// ============================================================
// Camada de controle do padrão MVC
// Responsabilidade: Gerenciar toda a lógica de gamificação
// - Registrar XP (Fail Fast validation)
// - Calcular saldo com nível (SUM, Op.lte, Op.gt)
// - Listar histórico
// - Deletar logs
//
// Princípio CRÍTICO: Security by Design
// O servidor decide o valor do XP, NUNCA o cliente!
// ============================================================
module.exports = {

  // ============================================================
  // MÉTODO 1: registrar
  // Rota: POST /xp/registrar
  // ============================================================
  // O que faz:
  // 1. Recebe id_motivo do frontend (ex: 1 = Arrumar Cama)
  // 2. Valida usando Fail Fast (rejeita antes do banco)
  // 3. Busca o xp_padrao no banco (ex: 20 XP)
  // 4. Registra o log na tab_xp_log
  //
  // POR QUE TÃO RESTRITIVO?
  // → Impede que usuário hackeado envie: { xp_ganho: 99999 }
  // → Security by Design (Schneier, 2000)
  async registrar(req, res) {
    try {
      // Obtém usuario_id do middleware de autenticação
      // O middleware já validou o JWT, então é confiável
      const usuario_id = req.usuarioId;
      
      // Extrai id_motivo do body da requisição
      // Exemplo: { id_motivo: 1 } (Arrumar Cama)
      const { id_motivo } = req.body;

      // ============================================================
      // VALIDAÇÃO 1: Dados obrigatórios presentes? (Fail Fast)
      // ============================================================
      // Rejeita IMEDIATAMENTE antes de tocar no banco
      // usuario_id vem do JWT, id_motivo vem do body
      if (!usuario_id || !id_motivo) {
        return res.status(400).json({
          erro: "Dados insuficientes (id_motivo no body e Token válido são obrigatórios)."
        });
      }

      // ============================================================
      // VALIDAÇÃO 2: Usuário existe? (Integridade referencial)
      // ============================================================
      // Garante que o usuário está no banco antes de criar o log
      // Impede XP de usuários fantasma/deletados
      const usuarioExiste = await Usuario.findByPk(usuario_id);
      if (!usuarioExiste) {
        return res.status(404).json({ 
          erro: "Usuário não encontrado." 
        });
      }

      // ============================================================
      // VALIDAÇÃO 3: Motivo existe? (BUSCA O VALOR CORRETO!)
      // ============================================================
      // SEGURANÇA CRÍTICA: O valor vem do banco, não do cliente!
      // 
      // Fluxo CORRETO:
      // 1. Frontend envia: { id_motivo: 1 }
      // 2. Backend busca no banco: Motivo.id=1 → xp_padrao=20
      // 3. Registra: { usuario_id, id_motivo, xp_ganho: 20 }
      //
      // Fluxo HACKEADO (se não validasse):
      // 1. Frontend envia: { id_motivo: 1, xp_ganho: 99999 }
      // 2. Backend acreditaria e registraria 99999 XP! 
      const motivoEncontrado = await Motivo.findByPk(id_motivo);
      if (!motivoEncontrado) {
        return res.status(404).json({
          erro: "Motivo de XP não encontrado. Verifique a tabela tab_motivo."
        });
      }

      // ============================================================
      // CRIAÇÃO DO LOG
      // ============================================================
      // Cria o registro com o valor CORRETO do banco
      // xp_ganho = motivoEncontrado.xp_padrao (não da requisição!)
      const log = await XpLog.create({
        usuario_id,                              // De quem é o XP?
        id_motivo: motivoEncontrado.motivo_id,   // Qual foi o motivo?
        xp_ganho: motivoEncontrado.xp_padrao     // Valor do banco, seguro!
      });

      // Retorna o log criado com status 201 (Created)
      return res.status(201).json(log);

    } catch (error) {
      // Erro não previsto no servidor
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO 2: calcularSaldo
  // Rota: GET /xp/saldo
  // ============================================================
  // O que faz:
  // 1. Soma TOTAL de XP do usuário (histórico completo)
  // 2. Encontra o nível ATUAL (maior xp_minimo <= totalXp)
  // 3. Encontra o próximo NÍVEL (menor xp_minimo > totalXp)
  // 4. Retorna: total_xp, nivel_atual, xp_proximo_nivel
  //
  // Exemplo:
  // - Usuários tem XP: [10, 20, 30, 40, 50] = total 150
  // - Níveis: [0(Iniciante), 200(Aprendiz), 500(Dedicado), 1000(Mestre)]
  // - Nível atual: Iniciante (0 <= 150)
  // - Próximo: Aprendiz (precisa de 200 XP)
  async calcularSaldo(req, res) {
    try {
      // usuario_id do middleware de autenticação
      const usuarioId = req.usuarioId;

      // ============================================================
      // PASSO 1: Soma TOTAL de XP (agregação SQL — SUM)
      // ============================================================
      // SUM é mais eficiente do que buscar todos os logs
      // Retorna null se não há registros, então usamos || 0
      // Exemplo: SUM(xp_ganho) = 1500
      const totalXp = await XpLog.sum('xp_ganho', {
        where: { usuario_id: usuarioId }
      }) || 0;

      // ============================================================
      // PASSO 2: Busca o modelo Nivel (importação dinâmica)
      // ============================================================
      // Importa o Model Nivel (tabela tab_nivel)
      const Nivel = require('../models/Nivel');
      
      // Importa operadores Sequelize para queries complexas
      // Op.lte = "less than or equal" (<=)
      // Op.gt = "greater than" (>)
      const { Op } = require('sequelize');

      // ============================================================
      // PASSO 3: Encontra NÍVEL ATUAL
      // ============================================================
      // Busca o maior xp_minimo que é menor ou igual ao total
      // Exemplo: totalXp = 1500, níveis = [0, 200, 500, 1000, 2000]
      // Op.lte 1500 encontra: [0, 200, 500, 1000]
      // DESC + LIMIT 1 = 1000 (Dedicado)
      const nivelAtual = await Nivel.findOne({
        where: {
          xp_minimo: { [Op.lte]: totalXp }  // xp_minimo <= totalXp
        },
        order: [['xp_minimo', 'DESC']],      // Ordenação decrescente
        attributes: ['nivel_id', 'nome_nivel', 'xp_minimo']
      });

      // ============================================================
      // PASSO 4: Encontra PRÓXIMO NÍVEL
      // ============================================================
      // Busca o menor xp_minimo que é maior que o total
      // Exemplo: totalXp = 1500, níveis = [0, 200, 500, 1000, 2000]
      // Op.gt 1500 encontra: [2000]
      // ASC + LIMIT 1 = 2000 (próximo é Mestre)
      const proximoNivel = await Nivel.findOne({
        where: {
          xp_minimo: { [Op.gt]: totalXp }   // xp_minimo > totalXp
        },
        order: [['xp_minimo', 'ASC']],      // Ordenação crescente
        attributes: ['xp_minimo']
      });

      // ============================================================
      // PASSO 5: Retorna a resposta formatada
      // ============================================================
      return res.json({
        // XP total acumulado (histórico completo)
        total_xp: totalXp,
        
        // Nome do nível atual (ex: "Dedicado")
        // Se não encontrou nível, fallback para "Iniciante"
        nivel_atual: nivelAtual ? nivelAtual.nome_nivel : 'Iniciante',
        
        // ID do nível atual (para usar em queries futuras)
        nivel_id: nivelAtual ? nivelAtual.nivel_id : null,
        
        // XP mínimo para atingir o próximo nível (ex: 2000)
        // null se já está no nível máximo
        xp_proximo_nivel: proximoNivel ? proximoNivel.xp_minimo : null
      });

    } catch (error) {
      // Log do erro
      console.error('Erro ao calcular saldo:', error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO 3: listarPorUsuario
  // Rota: GET /xp/historico
  // ============================================================
  // O que faz:
  // Retorna todos os logs de XP de um usuário
  // Ordenado: mais recente primeiro (Time-Series)
  async listarPorUsuario(req, res) {
    try {
      // usuario_id vem da URL (ex: /xp/historico/123)
      const { usuario_id } = req.params;

      // Busca todos os logs do usuário
      // order [["data_hora", "DESC"]] = mais recente primeiro
      // Time-Series: padrão comum em apps de histórico
      const logs = await XpLog.findAll({
        where: { usuario_id },                    // Filtra pelo usuário
        order: [["data_hora", "DESC"]],          // Mais recente primeiro
      });

      // Retorna o array de logs
      return res.json(logs);

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO 4: deletar
  // Rota: DELETE /xp/:id
  // ============================================================
  // O que faz:
  // Remove um log de XP específico (para corrigir erros)
  // Útil se um registro foi criado por engano
  async deletar(req, res) {
    try {
      // ID do log a deletar (vem da URL)
      const { id } = req.params;

      // Busca o log
      const log = await XpLog.findByPk(id);
      if (!log) {
        return res.status(404).json({ 
          erro: "Log não encontrado." 
        });
      }

      // Deleta o log
      await log.destroy();
      
      // Retorna mensagem de sucesso
      return res.status(200).json({ 
        mensagem: "Log removido com sucesso." 
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};