const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin hardcoded para testes (em produção, buscar do banco de dados)
const ADMINS = [
  {
    id: 1,
    nome: 'Super Admin Linka',
    email: 'admin@linka.com.br',
    senha: '123456789', // Em produção, usar bcrypt para hash
    role: 'superadmin'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'linka_secret_key_admin_2024';

// Exibir página de login do admin
router.get('/admin/entrar', (req, res) => {
  // Se já estiver logado como admin, redirecionar para dashboard
  if (req.cookies.user_type === 'superadmin' || req.cookies.user_type === 'admin') {
    return res.redirect('/dashboard');
  }

  res.render('admin/login', {
    title: 'Login Admin - Linka',
    page: 'admin-login'
  });
});

// Processar login do admin
router.post('/admin/entrar', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        mensagem: 'Email e senha são obrigatórios'
      });
    }

    // Buscar admin (em produção, buscar do banco com senha hasheada)
    const admin = ADMINS.find(a => a.email === email && a.senha === senha);

    if (!admin) {
      return res.status(401).json({
        success: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Salvar token e dados nos cookies
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.cookie('user_type', admin.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('user_data', JSON.stringify({
      nome: admin.nome,
      email: admin.email,
      role: admin.role
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      mensagem: 'Login realizado com sucesso',
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error('Erro no login admin:', error);
    return res.status(500).json({
      success: false,
      mensagem: 'Erro ao processar login'
    });
  }
});

// Logout do admin
router.post('/admin/sair', (req, res) => {
  res.clearCookie('auth_token');
  res.clearCookie('user_type');
  res.clearCookie('user_data');
  
  res.json({
    success: true,
    mensagem: 'Logout realizado com sucesso',
    redirect: '/admin/entrar'
  });
});

// Rota GET para logout também (caso acessem diretamente)
router.get('/admin/sair', (req, res) => {
  res.clearCookie('auth_token');
  res.clearCookie('user_type');
  res.clearCookie('user_data');
  
  res.redirect('/admin/entrar');
});

module.exports = router;
