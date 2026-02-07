#!/usr/bin/env node
/**
 * Script para excluir todos os usuários do banco de dados
 * ⚠️ ATENÇÃO: Esta operação é irreversível!
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function deleteAllUsers() {
  console.log('\n⚠️  ========================================');
  console.log('⚠️  EXCLUSÃO DE TODOS OS USUÁRIOS');
  console.log('⚠️  ========================================\n');

  try {
    // Buscar todos os clientes
    console.log('🔍 Buscando clientes...');
    const clientesResponse = await axios.get(`${API_URL}/usuarios`);
    const clientes = clientesResponse.data;
    console.log(`✅ Encontrados ${clientes.length} clientes\n`);

    // Buscar todos os profissionais
    console.log('🔍 Buscando profissionais...');
    const profissionaisResponse = await axios.get(`${API_URL}/profissionais`);
    const profissionais = profissionaisResponse.data;
    console.log(`✅ Encontrados ${profissionais.length} profissionais\n`);

    const totalUsuarios = clientes.length + profissionais.length;
    console.log(`📊 Total de usuários a excluir: ${totalUsuarios}\n`);

    if (totalUsuarios === 0) {
      console.log('✅ Não há usuários para excluir.\n');
      return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  INICIANDO EXCLUSÃO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Deletar clientes
    let clientesDeletados = 0;
    let clientesErro = 0;

    console.log('🗑️  Excluindo clientes...\n');
    for (const cliente of clientes) {
      try {
        await axios.delete(`${API_URL}/usuarios/${cliente.id}`);
        console.log(`✅ Cliente excluído: ${cliente.nome} (ID: ${cliente.id})`);
        clientesDeletados++;
      } catch (error) {
        console.log(`❌ Erro ao excluir cliente ${cliente.nome} (ID: ${cliente.id}): ${error.message}`);
        clientesErro++;
      }
    }

    // Deletar profissionais
    let profissionaisDeletados = 0;
    let profissionaisErro = 0;

    console.log('\n🗑️  Excluindo profissionais...\n');
    for (const profissional of profissionais) {
      try {
        await axios.delete(`${API_URL}/profissionais/${profissional.id}`);
        console.log(`✅ Profissional excluído: ${profissional.nome} (ID: ${profissional.id})`);
        profissionaisDeletados++;
      } catch (error) {
        console.log(`❌ Erro ao excluir profissional ${profissional.nome} (ID: ${profissional.id}): ${error.message}`);
        profissionaisErro++;
      }
    }

    // Resumo
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DA EXCLUSÃO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Clientes excluídos: ${clientesDeletados}/${clientes.length}`);
    console.log(`❌ Clientes com erro: ${clientesErro}/${clientes.length}`);
    console.log(`✅ Profissionais excluídos: ${profissionaisDeletados}/${profissionais.length}`);
    console.log(`❌ Profissionais com erro: ${profissionaisErro}/${profissionais.length}`);
    console.log(`\n📊 Total excluído: ${clientesDeletados + profissionaisDeletados}/${totalUsuarios}`);
    console.log(`❌ Total de erros: ${clientesErro + profissionaisErro}/${totalUsuarios}`);
    console.log('\n========================================\n');

    if ((clientesDeletados + profissionaisDeletados) === totalUsuarios) {
      console.log('✅ Todos os usuários foram excluídos com sucesso!\n');
    } else {
      console.log('⚠️  Alguns usuários não puderam ser excluídos. Verifique os erros acima.\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao processar exclusão:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Executar
deleteAllUsers();
