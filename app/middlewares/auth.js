const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'linka_secret_key_admin_2024';

// Middleware de autenticação
function isAuthenticated(req, res, next) {
  const token = req.cookies.auth_token;
  const userType = req.cookies.user_type;

  if (!token || !userType) {
    // Limpar cookies inválidos
    res.clearCookie('auth_token');
    res.clearCookie('user_type');
    res.clearCookie('user_data');
    return res.redirect('/entrar');
  }

  // Validar token JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Adiciona informações do usuário ao request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      type: userType
    };
    
    next();
  } catch (error) {
    // Token inválido ou expirado
    console.error('[AUTH] Token inválido:', error.message);
    res.clearCookie('auth_token');
    res.clearCookie('user_type');
    res.clearCookie('user_data');
    return res.redirect('/entrar');
  }
}

// Middleware para verificar tipo de usuário
function isPrestador(req, res, next) {
  if (req.cookies.user_type !== 'prestador') {
    return res.status(403).render('errors/403', {
      title: 'Acesso negado - Linka',
      message: 'Esta área é exclusiva para prestadores de serviço. Você está tentando acessar com uma conta de cliente.',
      page: 'error'
    });
  }
  next();
}

function isCliente(req, res, next) {
  if (req.cookies.user_type !== 'cliente') {
    return res.status(403).render('errors/403', {
      title: 'Acesso negado - Linka',
      message: 'Esta área é exclusiva para clientes. Você está tentando acessar com uma conta de prestador.',
      page: 'error'
    });
  }
  next();
}

// Middleware para verificar se é admin/superadmin
function isAdmin(req, res, next) {
  const token = req.cookies.auth_token;
  const userType = req.cookies.user_type;
  
  // Verificar se tem token e tipo de usuário
  if (!token || !userType) {
    res.clearCookie('auth_token');
    res.clearCookie('user_type');
    res.clearCookie('user_data');
    return res.redirect('/admin/entrar');
  }

  // Validar token JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar se é realmente admin/superadmin
    if (decoded.role !== 'superadmin' && decoded.role !== 'admin') {
      return res.status(403).render('errors/403', {
        title: 'Acesso negado - Linka',
        message: 'Área restrita a administradores.',
        page: 'error'
      });
    }
    
    // Garantir que o userType no cookie corresponde ao role no token
    if (userType !== decoded.role) {
      res.clearCookie('auth_token');
      res.clearCookie('user_type');
      res.clearCookie('user_data');
      return res.redirect('/admin/entrar');
    }
    
    next();
  } catch (error) {
    // Token inválido ou expirado
    console.error('[AUTH] Token admin inválido:', error.message);
    res.clearCookie('auth_token');
    res.clearCookie('user_type');
    res.clearCookie('user_data');
    return res.redirect('/admin/entrar');
  }
}

// Middleware específico para superadmin
function isSuperAdmin(req, res, next) {
  if (req.cookies.user_type !== 'superadmin') {
    return res.status(403).render('errors/403', {
      title: 'Acesso negado - Linka',
      message: 'Área restrita a super administradores.',
      page: 'error'
    });
  }
  next();
}

module.exports = {
  isAuthenticated,
  isPrestador,
  isCliente,
  isAdmin,
  isSuperAdmin
};
