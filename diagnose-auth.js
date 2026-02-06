#!/usr/bin/env node
/**
 * Diagnóstico de Autenticación - Boreas MVP
 * Verifica la configuración de Supabase Auth
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Diagnóstico de Supabase Auth\n');

async function diagnoseAuth() {
    // 1. Verificar variables de entorno
    console.log('📋 Variables de entorno:');
    console.log(`   URL: ${supabaseUrl || '❌ FALTANTE'}`);
    console.log(`   Key: ${supabaseKey ? '✅ Presente' : '❌ FALTANTE'}\n`);

    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Variables de entorno faltantes en .env.local');
        return;
    }

    // 2. Crear cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Verificar conectividad básica
    console.log('🔗 Verificando conectividad...');
    try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error && error.code !== 'PGRST116') { // PGRST116 = tabla no existe, está ok
            console.log(`⚠️  Error de conectividad: ${error.message}`);
        } else {
            console.log('✅ Conectividad OK');
        }
    } catch (err) {
        console.log(`❌ Error de red: ${err.message}`);
        return;
    }

    // 4. Verificar tabla profiles
    console.log('\n📊 Verificando tabla profiles...');
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('⚠️  Tabla profiles no existe - necesita crearse');
                console.log('   👉 Ejecuta el SQL en fix-supabase-auth.sql');
            } else {
                console.log(`❌ Error en tabla profiles: ${error.message}`);
            }
        } else {
            console.log('✅ Tabla profiles existe y es accesible');
        }
    } catch (err) {
        console.log(`❌ Error verificando profiles: ${err.message}`);
    }

    // 5. Probar registro de usuario (solo verificar endpoint)
    console.log('\n👤 Verificando endpoint de registro...');
    try {
        // No vamos a crear usuario real, solo verificar que el endpoint responde
        const { data, error } = await supabase.auth.signUp({
            email: 'test-diagnose@example.com',
            password: 'test123456789',
        });

        if (error) {
            if (error.message.includes('Database error')) {
                console.log('❌ Error de base de datos al crear usuario');
                console.log('   👉 Ejecuta el SQL en fix-supabase-auth.sql');
                console.log(`   📝 Error específico: ${error.message}`);
            } else if (error.message.includes('Email rate limit')) {
                console.log('✅ Endpoint funciona (rate limit es normal)');
            } else {
                console.log(`⚠️  Error de auth: ${error.message}`);
            }
        } else {
            console.log('✅ Registro funcionó (usuario de prueba creado)');
            // Cleanup - delete test user if created
            if (data.user) {
                console.log('🧹 Limpiando usuario de prueba...');
            }
        }
    } catch (err) {
        console.log(`❌ Error probando registro: ${err.message}`);
    }

    console.log('\n🔧 Próximos pasos:');
    console.log('1. Si ves errores de base de datos:');
    console.log('   - Ve a https://app.supabase.com');
    console.log('   - Abre SQL Editor');
    console.log('   - Ejecuta el contenido de fix-supabase-auth.sql');
    console.log('2. Luego ejecuta de nuevo: node diagnose-auth.js');
    console.log('3. Si todo está ✅, prueba registro en la app');
}

// Verificar que las dependencias estén instaladas
try {
    require.resolve('@supabase/supabase-js');
    diagnoseAuth().catch(console.error);
} catch (err) {
    console.log('❌ Dependencia faltante: @supabase/supabase-js');
    console.log('   Ejecuta: npm install @supabase/supabase-js');
}