#!/usr/bin/env node
/**
 * Script para testar o acesso ao dashboard sem autenticação
 */

const axios = require('axios');

const WEBSITE_URL = 'http://localhost:3001';

async function testDashboardAccess() {
  console.log('\n========================================');
  console.log('🔒 TESTE DE PROTEÇÃO DO DASHBOARD');
  console.log('========================================\n');

  try {
    // Teste 1: Acesso sem autenticação
    console.log('📋 Teste 1: Acessando /dashboard sem autenticação\n');
    
    const response1 = await axios.get(`${WEBSITE_URL}/dashboard`, {
      maxRedirects: 0,
      validateStatus: () => true // Aceita qualquer status
    });

    console.log(`Status: ${response1.status}`);
    console.log(`Redirecionado: ${response1.status === 302 ? 'Sim ✅' : 'Não ❌'}`);
    if (response1.headers.location) {
      console.log(`Redirecionou para: ${response1.headers.location}`);
    }

    // Teste 2: Acesso à API sem autenticação
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Teste 2: Acessando /dashboard/api/metrics sem autenticação\n');
    
    const response2 = await axios.get(`${WEBSITE_URL}/dashboard/api/metrics`, {
      maxRedirects: 0,
      validateStatus: () => true
    });

    console.log(`Status: ${response2.status}`);
    console.log(`Bloqueado: ${response2.status === 302 || response2.status === 403 ? 'Sim ✅' : 'Não ❌'}`);
    
    // Teste 3: Verificar se Dashboard foi removido do menu
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Teste 3: Verificando página inicial\n');
    
    const response3 = await axios.get(`${WEBSITE_URL}/`);
    const hasMenuLink = response3.data.includes('/dados') || response3.data.includes('href="/dashboard"');
    
    console.log(`Link do Dashboard no menu: ${hasMenuLink ? 'Encontrado ❌' : 'Removido ✅'}`);

    // Resumo
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DOS TESTES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const test1Pass = response1.status === 302;
    const test2Pass = response2.status === 302 || response2.status === 403;
    const test3Pass = !hasMenuLink;
    
    console.log(`✓ Dashboard bloqueia acesso direto: ${test1Pass ? '✅ PASSOU' : '❌ FALHOU'}`);
    console.log(`✓ API bloqueia acesso sem auth: ${test2Pass ? '✅ PASSOU' : '❌ FALHOU'}`);
    console.log(`✓ Link removido do menu público: ${test3Pass ? '✅ PASSOU' : '❌ FALHOU'}`);
    
    const allPassed = test1Pass && test2Pass && test3Pass;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (allPassed) {
      console.log('✅ TODOS OS TESTES PASSARAM!');
      console.log('🔒 Dashboard está protegido corretamente');
    } else {
      console.log('⚠️ ALGUNS TESTES FALHARAM');
      console.log('❌ Verifique a configuração de segurança');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Informações de acesso admin
    if (allPassed) {
      console.log('🎯 ACESSO ADMINISTRATIVO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 Login: http://localhost:3001/admin/entrar');
      console.log('📧 Email: admin@linka.com.br');
      console.log('🔑 Senha: 123456789');
      console.log('📊 Dashboard: http://localhost:3001/dashboard');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao testar:', error.message);
  }
}

// Executar
testDashboardAccess();
