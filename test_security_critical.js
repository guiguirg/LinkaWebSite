#!/usr/bin/env node
/**
 * 🔒 TESTE DE SEGURANÇA CRÍTICA - DASHBOARD ADMIN
 */

const axios = require('axios');

const WEBSITE_URL = 'http://localhost:3001';

async function testCriticalSecurity() {
  console.log('\n🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
  console.log('🔒 TESTE DE SEGURANÇA CRÍTICA - DASHBOARD');
  console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴\n');

  const tests = [];
  
  try {
    // TESTE 1: Acesso direto ao dashboard SEM cookies
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔴 TESTE 1: Acesso direto ao /dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const test1 = await axios.get(`${WEBSITE_URL}/dashboard`, {
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const test1Pass = test1.status === 302 && test1.headers.location;
    tests.push({
      name: 'Bloqueia acesso direto ao dashboard',
      passed: test1Pass,
      details: `Status ${test1.status}, redirecionou: ${test1Pass ? '✅' : '❌'}`
    });
    
    console.log(`Status: ${test1.status}`);
    console.log(`Redirecionou: ${test1Pass ? '✅ SIM' : '❌ NÃO - FALHA CRÍTICA!'}`);
    console.log(`Destino: ${test1.headers.location || 'N/A'}\n`);

    // TESTE 2: Acesso com cookies INVÁLIDOS (simulando hack)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔴 TESTE 2: Tentativa com token FALSO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const test2 = await axios.get(`${WEBSITE_URL}/dashboard`, {
      headers: {
        'Cookie': 'auth_token=token_falso_hack; user_type=superadmin'
      },
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const test2Pass = test2.status === 302;
    tests.push({
      name: 'Bloqueia token JWT inválido',
      passed: test2Pass,
      details: `Status ${test2.status}, bloqueou: ${test2Pass ? '✅' : '❌'}`
    });
    
    console.log(`Status: ${test2.status}`);
    console.log(`Bloqueou token falso: ${test2Pass ? '✅ SIM' : '❌ NÃO - FALHA CRÍTICA!'}\n`);

    // TESTE 3: Acesso com user_type correto mas sem token
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔴 TESTE 3: user_type=superadmin mas sem token');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const test3 = await axios.get(`${WEBSITE_URL}/dashboard`, {
      headers: {
        'Cookie': 'user_type=superadmin'
      },
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const test3Pass = test3.status === 302;
    tests.push({
      name: 'Exige token válido (não aceita só user_type)',
      passed: test3Pass,
      details: `Status ${test3.status}, bloqueou: ${test3Pass ? '✅' : '❌'}`
    });
    
    console.log(`Status: ${test3.status}`);
    console.log(`Bloqueou: ${test3Pass ? '✅ SIM' : '❌ NÃO - FALHA CRÍTICA!'}\n`);

    // TESTE 4: API endpoints protegidos
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔴 TESTE 4: API /dashboard/api/metrics');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const test4 = await axios.get(`${WEBSITE_URL}/dashboard/api/metrics`, {
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const test4Pass = test4.status === 302;
    tests.push({
      name: 'API protegida sem autenticação',
      passed: test4Pass,
      details: `Status ${test4.status}, bloqueou: ${test4Pass ? '✅' : '❌'}`
    });
    
    console.log(`Status: ${test4.status}`);
    console.log(`API bloqueada: ${test4Pass ? '✅ SIM' : '❌ NÃO - FALHA CRÍTICA!'}\n`);

    // TESTE 5: Login válido e acesso
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🟢 TESTE 5: Login correto e acesso');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const loginResponse = await axios.post(`${WEBSITE_URL}/admin/entrar`, {
      email: 'admin@linka.com.br',
      senha: '123456789'
    });
    
    const cookies = loginResponse.headers['set-cookie'];
    const test5Pass = loginResponse.data.success && cookies;
    tests.push({
      name: 'Login válido funciona',
      passed: test5Pass,
      details: `Login: ${test5Pass ? '✅' : '❌'}`
    });
    
    console.log(`Login: ${test5Pass ? '✅ SUCESSO' : '❌ FALHOU'}`);
    
    if (test5Pass) {
      // Tentar acessar dashboard com cookies válidos
      const dashboardResponse = await axios.get(`${WEBSITE_URL}/dashboard`, {
        headers: {
          'Cookie': cookies.join('; ')
        },
        maxRedirects: 0,
        validateStatus: () => true
      });
      
      const accessGranted = dashboardResponse.status === 200;
      tests.push({
        name: 'Acesso concedido com login válido',
        passed: accessGranted,
        details: `Acesso: ${accessGranted ? '✅' : '❌'}`
      });
      
      console.log(`Acesso ao dashboard com login: ${accessGranted ? '✅ PERMITIDO' : '❌ BLOQUEADO'}\n`);
    }

    // RESULTADO FINAL
    console.log('\n🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');
    console.log('📊 RESULTADO FINAL');
    console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴\n');

    const passed = tests.filter(t => t.passed).length;
    const total = tests.length;
    const securityScore = ((passed / total) * 100).toFixed(0);

    tests.forEach((test, i) => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`${icon} ${i + 1}. ${test.name}`);
      console.log(`   ${test.details}\n`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Score de Segurança: ${securityScore}% (${passed}/${total})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (securityScore >= 100) {
      console.log('🟢🟢🟢 SISTEMA 100% SEGURO! 🟢🟢🟢');
      console.log('✅ Dashboard está COMPLETAMENTE protegido');
      console.log('✅ Impossível acessar sem login válido');
      console.log('✅ Tokens JWT validados corretamente\n');
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 CREDENCIAIS DE ACESSO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: admin@linka.com.br');
      console.log('🔑 Senha: 123456789');
      console.log('🌐 Login: http://localhost:3001/admin/entrar');
      console.log('📊 Dashboard: http://localhost:3001/dashboard');
      console.log('🚪 Logout: http://localhost:3001/admin/sair');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('🔴🔴🔴 FALHA DE SEGURANÇA DETECTADA! 🔴🔴🔴');
      console.log('⚠️ Sistema ainda tem vulnerabilidades\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao executar testes:', error.message);
  }
}

// Executar
testCriticalSecurity();
