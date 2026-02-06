#!/usr/bin/env node
/**
 * Test simple de autenticación usando curl
 */

const fs = require('fs');
const { exec } = require('child_process');

// Leer variables de .env.local
function readEnvLocal() {
    try {
        const envContent = fs.readFileSync('.env.local', 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                env[key.trim()] = valueParts.join('=').trim();
            }
        });
        return env;
    } catch (err) {
        console.log('❌ Error leyendo .env.local:', err.message);
        return {};
    }
}

console.log('🔍 Diagnóstico Simple de Supabase Auth\n');

const env = readEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Variables encontradas:');
console.log(`   URL: ${url || '❌ FALTANTE'}`);
console.log(`   Key: ${key ? '✅ Presente' : '❌ FALTANTE'}\n`);

if (!url || !key) {
    console.log('❌ Variables faltantes en .env.local');
    process.exit(1);
}

// Test 1: Verificar endpoint básico de Supabase
console.log('🔗 Test 1: Conectividad básica...');
exec(`curl -s "${url}/rest/v1/" -H "apikey: ${key}"`, (err, stdout, stderr) => {
    if (err) {
        console.log('❌ Error de conectividad:', err.message);
        return;
    }

    try {
        const response = JSON.parse(stdout);
        if (response.swagger || response.openapi) {
            console.log('✅ Supabase API responde correctamente\n');

            // Test 2: Verificar tabla profiles
            console.log('📊 Test 2: Verificando tabla profiles...');
            exec(`curl -s "${url}/rest/v1/profiles?select=*&limit=1" -H "apikey: ${key}"`, (err2, stdout2) => {
                if (err2) {
                    console.log('❌ Error verificando profiles:', err2.message);
                    return;
                }

                try {
                    JSON.parse(stdout2);
                    console.log('✅ Tabla profiles accesible\n');
                } catch (parseErr) {
                    if (stdout2.includes('relation "public.profiles" does not exist')) {
                        console.log('⚠️  Tabla profiles NO existe');
                        console.log('   👉 Necesitas ejecutar el SQL de setup\n');
                    } else {
                        console.log('⚠️  Error verificando profiles:', stdout2);
                    }
                }

                // Test 3: Verificar auth endpoint
                runAuthTest();
            });
        }
    } catch (parseErr) {
        console.log('❌ Respuesta inválida del servidor:', stdout);
    }
});

function runAuthTest() {
    console.log('👤 Test 3: Endpoint de autenticación...');
    const authData = JSON.stringify({
        email: 'test-diagnostico@example.com',
        password: 'test123456789'
    });

    const cmd = `curl -s "${url}/auth/v1/signup" -X POST -H "apikey: ${key}" -H "Content-Type: application/json" -d '${authData}'`;

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log('❌ Error en auth test:', err.message);
            return;
        }

        try {
            const result = JSON.parse(stdout);

            if (result.error_code === 'unexpected_failure' && result.msg.includes('Database error')) {
                console.log('❌ ERROR ENCONTRADO: Database error saving new user');
                console.log('   📝 Esto indica que falta configuración en la base de datos\n');
                showSolution();
            } else if (result.error && result.error.includes('Email rate limit')) {
                console.log('✅ Auth endpoint funciona (rate limit es esperado)\n');
            } else if (result.user || result.access_token) {
                console.log('✅ Auth funciona correctamente\n');
            } else {
                console.log('⚠️  Respuesta inesperada de auth:', JSON.stringify(result, null, 2));
            }
        } catch (parseErr) {
            console.log('⚠️  Respuesta no JSON de auth:', stdout);
        }
    });
}

function showSolution() {
    console.log('🔧 SOLUCIÓN:');
    console.log('1. Ve a tu Supabase Dashboard:');
    console.log('   👉 https://app.supabase.com/project/ktqgoxxwlqlbctkvqepl');
    console.log('');
    console.log('2. Abre el SQL Editor');
    console.log('');
    console.log('3. Ejecuta este SQL para configurar auth:');
    console.log('   👉 Copia el contenido de fix-supabase-auth.sql');
    console.log('');
    console.log('4. Esto creará:');
    console.log('   - Tabla profiles para usuarios');
    console.log('   - Trigger para auto-crear profile al registrarse');
    console.log('   - Políticas de seguridad RLS');
    console.log('');
    console.log('5. Luego prueba el registro en tu app');
}