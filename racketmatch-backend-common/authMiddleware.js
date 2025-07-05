const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * Validar formato básico do token JWT
 */
const isValidTokenFormat = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      console.log('❌ [AUTH] Token não é string válida');
      return false;
    }

    // Token JWT deve ter 3 partes separadas por pontos
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ [AUTH] Token não tem 3 partes:', parts.length);
      return false;
    }

    // Verificar se cada parte tem conteúdo
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i] || parts[i].length === 0) {
        console.log(`❌ [AUTH] Parte ${i} do token está vazia`);
        return false;
      }
    }

    console.log('✅ [AUTH] Formato do token é válido');
    return true;
  } catch (error) {
    console.log('❌ [AUTH] Erro ao validar formato do token:', error.message);
    return false;
  }
};

/**
 * Middleware de autenticação JWT
 * Verifica e valida tokens JWT, carrega dados do utilizador
 * ✅ ATUALIZADO: Melhor tratamento de tokens malformados
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Log para debug (remover em produção)
    console.log('🔍 [AUTH] Header Authorization:', authHeader ? 'Presente' : 'Ausente');
    console.log('🔍 [AUTH] Token extraído:', token ? 'Token presente' : 'Token ausente');

    if (!token) {
      console.warn('🚫 [AUTH] Token não fornecido na requisição');
      return res.status(401).json({ 
        message: 'Token de acesso requerido',
        error: 'MISSING_TOKEN'
      });
    }

    // ✅ NOVO: Validar formato do token antes de tentar verificar
    if (!isValidTokenFormat(token)) {
      console.warn('❌ [AUTH] Token com formato inválido (malformado)');
      return res.status(401).json({ 
        message: 'Token malformado - faça login novamente',
        error: 'MALFORMED_TOKEN'
      });
    }

    // Verificar e descodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('🔍 [AUTH] Token descodificado com sucesso:', {
      id: decoded.id,
      email: decoded.email,
      exp: new Date(decoded.exp * 1000)
    });

    // Validar se o token contém ID do utilizador
    if (!decoded.id) {
      console.warn('❌ [AUTH] Token válido mas sem ID de utilizador');
      return res.status(401).json({ 
        message: 'Token inválido - ID de utilizador em falta',
        error: 'INVALID_TOKEN_STRUCTURE'
      });
    }

    // Buscar utilizador na base de dados
    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn('❌ [AUTH] Token válido mas utilizador não encontrado:', decoded.id);
      return res.status(401).json({ 
        message: 'Utilizador não encontrado',
        error: 'USER_NOT_FOUND'
      });
    }

    // Atualizar lastSeen do utilizador
    user.lastSeen = new Date();
    await user.save();

    // Adicionar dados do utilizador ao request
    req.user = user;
    req.userId = user._id.toString();

    console.log('✅ [AUTH] Autenticação bem-sucedida:', {
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    });

    next();

  } catch (error) {
    console.error('❌ [AUTH] Erro na autenticação:', error.message);

    // ✅ MELHORADO: Tratar diferentes tipos de erro JWT
    if (error.name === 'TokenExpiredError') {
      console.warn('⏰ [AUTH] Token expirado');
      return res.status(401).json({ 
        message: 'Token expirado - faça login novamente',
        error: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      console.warn('🔧 [AUTH] Token JWT inválido ou malformado');
      return res.status(401).json({ 
        message: 'Token inválido ou malformado - faça login novamente',
        error: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'NotBeforeError') {
      console.warn('📅 [AUTH] Token ainda não é válido');
      return res.status(401).json({ 
        message: 'Token ainda não é válido',
        error: 'TOKEN_NOT_ACTIVE'
      });
    }

    // ✅ NOVO: Tratar erros de formato/parsing
    if (error.message.includes('malformed') || error.message.includes('invalid')) {
      console.warn('🔧 [AUTH] Token malformado detectado');
      return res.status(401).json({ 
        message: 'Token malformado - faça login novamente',
        error: 'MALFORMED_TOKEN'
      });
    }

    // Erro genérico
    return res.status(403).json({ 
      message: 'Falha na autenticação',
      error: 'AUTH_FAILED',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Middleware adicional para verificar autorização de edição de perfil
 * Garante que o utilizador só pode editar o próprio perfil
 * ✅ MELHORADO: Logs mais detalhados
 */
const authorizeUserEdit = (req, res, next) => {
  try {
    const tokenUserId = req.user._id.toString();
    const requestedUserId = req.params.id;

    console.log('🔍 [AUTHORIZATION] Verificando autorização:');
    console.log('🔍 [AUTHORIZATION] ID do utilizador no token:', tokenUserId);
    console.log('🔍 [AUTHORIZATION] ID solicitado na rota:', requestedUserId);
    console.log('🔍 [AUTHORIZATION] IDs coincidem:', tokenUserId === requestedUserId);
    console.log('🔍 [AUTHORIZATION] Tipos - Token:', typeof tokenUserId, 'Rota:', typeof requestedUserId);

    // Verificar se o utilizador está a tentar editar o próprio perfil
    if (tokenUserId !== requestedUserId) {
      console.warn('❌ [AUTHORIZATION] Acesso negado - IDs não coincidem');
      console.warn('🔍 [AUTHORIZATION] Possível causa: Token antigo ou IDs incompatíveis');
      
      return res.status(403).json({ 
        message: 'Acesso negado - só pode editar o próprio perfil',
        error: 'UNAUTHORIZED_ACCESS',
        debug: process.env.NODE_ENV === 'development' ? {
          tokenUserId,
          requestedUserId,
          match: false,
          suggestion: 'Faça logout e login novamente se o problema persistir'
        } : undefined
      });
    }

    console.log('✅ [AUTHORIZATION] Autorização concedida');
    next();

  } catch (error) {
    console.error('❌ [AUTHORIZATION] Erro na verificação de autorização:', error.message);
    return res.status(500).json({ 
      message: 'Erro interno na verificação de autorização',
      error: 'AUTHORIZATION_ERROR'
    });
  }
};

/**
 * Middleware opcional para verificar se o utilizador é premium
 */
const requirePremium = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Autenticação requerida',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (!req.user.isPremium) {
      console.warn('❌ [PREMIUM] Acesso negado - utilizador não é premium:', req.user.email);
      return res.status(403).json({ 
        message: 'Acesso restrito a utilizadores premium',
        error: 'PREMIUM_REQUIRED'
      });
    }

    console.log('✅ [PREMIUM] Utilizador premium verificado:', req.user.email);
    next();

  } catch (error) {
    console.error('❌ [PREMIUM] Erro na verificação premium:', error.message);
    return res.status(500).json({ 
      message: 'Erro na verificação premium',
      error: 'PREMIUM_CHECK_ERROR'
    });
  }
};

/**
 * Middleware para verificar se o utilizador pertence ao tenant correto
 */
const checkTenant = (req, res, next) => {
  try {
    const userTenantId = req.user.tenantId;
    const requestedTenantId = req.headers['x-tenant-id'] || req.body.tenantId || req.query.tenantId;

    if (requestedTenantId && userTenantId !== requestedTenantId) {
      console.warn('❌ [TENANT] Acesso negado - tenant incorreto:', {
        userTenant: userTenantId,
        requestedTenant: requestedTenantId
      });
      return res.status(403).json({ 
        message: 'Acesso negado - tenant incorreto',
        error: 'INVALID_TENANT'
      });
    }

    console.log('✅ [TENANT] Tenant verificado:', userTenantId);
    next();

  } catch (error) {
    console.error('❌ [TENANT] Erro na verificação de tenant:', error.message);
    return res.status(500).json({ 
      message: 'Erro na verificação de tenant',
      error: 'TENANT_CHECK_ERROR'
    });
  }
};

/**
 * ✅ NOVO: Middleware para debug de tokens malformados
 * Use apenas em desenvolvimento para diagnosticar problemas
 */
const debugTokenMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return next();
  }

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔍 [TOKEN DEBUG] === DEBUG DE TOKEN ===');
    console.log('🔍 [TOKEN DEBUG] Header completo:', authHeader);
    console.log('🔍 [TOKEN DEBUG] Token extraído:', token ? `${token.substring(0, 20)}...` : 'Nenhum');
    
    if (token) {
      console.log('🔍 [TOKEN DEBUG] Comprimento do token:', token.length);
      console.log('🔍 [TOKEN DEBUG] Formato válido:', isValidTokenFormat(token));
      
      const parts = token.split('.');
      console.log('🔍 [TOKEN DEBUG] Número de partes:', parts.length);
      
      if (parts.length === 3) {
        try {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          
          console.log('🔍 [TOKEN DEBUG] Header:', header);
          console.log('🔍 [TOKEN DEBUG] Payload (parcial):', {
            id: payload.id,
            email: payload.email,
            exp: payload.exp ? new Date(payload.exp * 1000) : 'Sem expiração',
            iat: payload.iat ? new Date(payload.iat * 1000) : 'Sem data de criação'
          });
        } catch (decodeError) {
          console.log('❌ [TOKEN DEBUG] Erro ao descodificar:', decodeError.message);
        }
      }
    }
    
    console.log('🔍 [TOKEN DEBUG] === FIM DEBUG ===');
    next();

  } catch (error) {
    console.log('❌ [TOKEN DEBUG] Erro no debug:', error.message);
    next();
  }
};

/**
 * ✅ NOVO: Middleware para limpar tokens malformados automaticamente
 * Detecta e responde com instruções para limpar tokens malformados no frontend
 */
const cleanMalformedTokens = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token && !isValidTokenFormat(token)) {
      console.warn('🔧 [CLEAN] Token malformado detectado - enviando instrução de limpeza');
      
      return res.status(401).json({
        message: 'Token malformado detectado',
        error: 'MALFORMED_TOKEN',
        action: 'CLEAR_AUTH_DATA',
        instructions: {
          frontend: 'Execute AuthService.clearAllAuthData() e redirecione para login',
          description: 'Token JWT está malformado e deve ser removido'
        }
      });
    }

    next();

  } catch (error) {
    console.error('❌ [CLEAN] Erro na limpeza de tokens:', error.message);
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeUserEdit,
  requirePremium,
  checkTenant,
  debugTokenMiddleware,
  cleanMalformedTokens,
  isValidTokenFormat,
  // Exportar como default para compatibilidade
  default: authenticateToken
};

