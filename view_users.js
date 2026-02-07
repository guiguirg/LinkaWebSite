#!/usr/bin/env node
/**
 * Script para visualizar todos os usuários do banco de dados
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function getAllUsers() {
  console.log('\n========================================');
  console.log('📊 DADOS DE USUÁRIOS - BANCO DE DADOS');
  console.log('========================================\n');

  try {
    // Buscar clientes
    console.log('🔍 Buscando clientes...\n');
    const clientesResponse = await axios.get(`${API_URL}/usuarios`);
    const clientes = clientesResponse.data;

    console.log(`✅ Total de Clientes: ${clientes.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👥 CLIENTES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    clientes.forEach((cliente, index) => {
      console.log(`\n[${index + 1}] Cliente ID: ${cliente.id}`);
      console.log(`    📛 Nome: ${cliente.nome}`);
      console.log(`    📧 Email: ${cliente.email}`);
      console.log(`    📱 Telefone: ${cliente.telefone || 'N/A'}`);
      console.log(`    🆔 ID Público: ${cliente.id_public}`);
      console.log(`    ✅ Ativo: ${cliente.ativo ? 'Sim' : 'Não'}`);
      console.log(`    🔓 Logado: ${cliente.logado ? 'Sim' : 'Não'}`);
      console.log(`    ⭐ Nota: ${cliente.nota}`);
      console.log(`    📊 Status: ${cliente.status}`);
      console.log(`    📅 Criado em: ${new Date(cliente.criado_em).toLocaleString('pt-BR')}`);
      console.log(`    🔄 Atualizado em: ${new Date(cliente.atualizado_em).toLocaleString('pt-BR')}`);
      console.log(`    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    });

    // Buscar profissionais
    console.log('\n\n🔍 Buscando profissionais/prestadores...\n');
    const profissionaisResponse = await axios.get(`${API_URL}/profissionais`);
    const profissionais = profissionaisResponse.data;

    console.log(`✅ Total de Profissionais: ${profissionais.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍🔧 PROFISSIONAIS/PRESTADORES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    profissionais.forEach((profissional, index) => {
      console.log(`\n[${index + 1}] Profissional ID: ${profissional.id}`);
      console.log(`    📛 Nome: ${profissional.nome}`);
      console.log(`    📧 Email: ${profissional.email}`);
      console.log(`    🔧 Tipo: ${profissional.tipo}`);
      console.log(`    📄 CPF: ${profissional.cpf || 'N/A'}`);
      console.log(`    ✅ Ativo: ${profissional.ativo ? 'Sim' : 'Não'}`);
      console.log(`    🟢 Disponível: ${profissional.disponivel ? 'Sim' : 'Não'}`);
      console.log(`    ✔️ Verificado: ${profissional.verificado ? 'Sim' : 'Não'}`);
      console.log(`    ⭐ Nota Média: ${profissional.nota_media}`);
      console.log(`    📊 Total de Serviços: ${profissional.total_servicos}`);
      console.log(`    💰 Preço Mínimo: R$ ${profissional.preco_minimo}`);
      console.log(`    📍 Raio Atendimento: ${profissional.raio_atendimento} km`);
      console.log(`    🗺️ Latitude: ${profissional.latitude || 'N/A'}`);
      console.log(`    🗺️ Longitude: ${profissional.longitude || 'N/A'}`);
      console.log(`    📅 Criado em: ${new Date(profissional.criado_em).toLocaleString('pt-BR')}`);
      console.log(`    🔄 Atualizado em: ${new Date(profissional.atualizado_em).toLocaleString('pt-BR')}`);
      console.log(`    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    });

    // Resumo geral
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 RESUMO GERAL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n👥 Total de Clientes: ${clientes.length}`);
    console.log(`👨‍🔧 Total de Profissionais: ${profissionais.length}`);
    console.log(`📊 Total de Usuários: ${clientes.length + profissionais.length}`);
    
    const clientesAtivos = clientes.filter(c => c.ativo === 1).length;
    const profissionaisAtivos = profissionais.filter(p => p.ativo === 1).length;
    const clientesLogados = clientes.filter(c => c.logado === 1).length;
    
    console.log(`\n✅ Clientes Ativos: ${clientesAtivos}`);
    console.log(`✅ Profissionais Ativos: ${profissionaisAtivos}`);
    console.log(`🔓 Clientes Logados: ${clientesLogados}`);
    console.log(`✔️ Profissionais Verificados: ${profissionais.filter(p => p.verificado === 1).length}`);
    console.log('\n========================================\n');

  } catch (error) {
    console.error('\n❌ Erro ao buscar dados:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Executar
getAllUsers();
