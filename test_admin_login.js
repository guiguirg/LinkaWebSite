#!/usr/bin/env node
/**
 * Script para testar o login do superadmin
 */

const axios = require('axios');

const WEBSITE_URL = 'http://localhost:3001';

async function testAdminLogin() {
  console.log('\n========================================');
  console.log('🔐 TESTE DE LOGIN - SUPERADMIN');
  console.log('========================================\n');

  try {
    console.log('📧 Email: admin@linka.com.br');
    console.log('🔑 Senha: 123456789\n');

    console.log('🔄 Tentando fazer login...\n');

    const response = await axios.post(`${WEBSITE_URL}/admin/entrar`, {
      email: 'admin@linka.com.br',
      senha: '123456789'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // Aceita qualquer status
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESPOSTA DO SERVIDOR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.data.success ? '✅ Sim' : '❌ Não'}`);
    console.log(`Mensagem: ${response.data.mensagem}`);
    console.log(`Redirect: ${response.data.redirect || 'N/A'}`);

    if (response.data.success) {
      console.log('\n✅ LOGIN REALIZADO COM SUCESSO!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 INFORMAÇÕES DE ACESSO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log(`📧 Email: admin@linka.com.br`);
      console.log(`🔑 Senha: 123456789`);
      console.log(`🌐 URL Login: ${WEBSITE_URL}/admin/entrar`);
      console.log(`📊 Dashboard: ${WEBSITE_URL}/dashboard`);
      console.log(`👤 Role: superadmin`);
      console.log('\n========================================\n');
    } else {
      console.log('\n❌ ERRO NO LOGIN!');
      console.log(`Motivo: ${response.data.mensagem}\n`);
    }

  } catch (error) {
    console.error('\n❌ Erro ao testar login:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Executar
testAdminLogin();
