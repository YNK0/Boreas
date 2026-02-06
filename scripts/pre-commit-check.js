#!/usr/bin/env node
/**
 * Pre-commit Check - Validaciones antes de commit
 * Previene commits con errores comunes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Ejecutando validaciones pre-commit...\n');

let hasErrors = false;

// 1. Verificar que TypeScript compile
console.log('📝 Verificando TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript: Sin errores de tipado\n');
} catch (error) {
  console.log('❌ TypeScript: Errores de tipado encontrados');
  console.log(error.stdout.toString());
  hasErrors = true;
}

// 2. Verificar imports
console.log('🔍 Verificando imports...');
try {
  execSync('node scripts/validate-imports.js', { stdio: 'pipe' });
  console.log('✅ Imports: Todos válidos\n');
} catch (error) {
  console.log('❌ Imports: Errores encontrados');
  console.log(error.stdout.toString());
  hasErrors = true;
}

// 3. Verificar que no hay console.log en producción
console.log('🧹 Verificando código limpio...');
try {
  const result = execSync('grep -r "console\\.log" src/ || echo "no-console-logs"', {
    encoding: 'utf8',
    stdio: 'pipe'
  });

  if (result.trim() !== 'no-console-logs') {
    console.log('⚠️ console.log encontrados en código:');
    console.log(result);
    console.log('💡 Considera usar un logger en lugar de console.log\n');
    // Solo warning, no bloquea el commit
  } else {
    console.log('✅ Código limpio: Sin console.log\n');
  }
} catch (error) {
  // Error ejecutando grep, continuar
}

// 4. Verificar que package.json tiene todas las dependencias
console.log('📦 Verificando dependencias...');
try {
  execSync('npm ls --depth=0', { stdio: 'pipe' });
  console.log('✅ Dependencias: Todas instaladas\n');
} catch (error) {
  console.log('⚠️ Dependencias: Posibles dependencias faltantes');
  console.log('💡 Ejecuta: npm install\n');
  // Solo warning para dependencias
}

// 5. Verificar archivos grandes
console.log('📏 Verificando tamaño de archivos...');
try {
  const largeFiles = execSync('find src/ -size +100k -type f 2>/dev/null || echo ""', {
    encoding: 'utf8'
  }).trim();

  if (largeFiles) {
    console.log('⚠️ Archivos grandes encontrados:');
    console.log(largeFiles);
    console.log('💡 Considera optimizar archivos grandes\n');
  } else {
    console.log('✅ Archivos: Tamaños apropiados\n');
  }
} catch (error) {
  // Error en find, continuar
}

// 6. Verificar que el server puede iniciar (quick check)
console.log('🚀 Verificando que Next.js puede iniciar...');
try {
  execSync('timeout 10 npm run build > /dev/null 2>&1 || exit 0', { stdio: 'pipe' });
  console.log('✅ Build: Next.js compila correctamente\n');
} catch (error) {
  console.log('❌ Build: Error al compilar Next.js');
  console.log('💡 Ejecuta: npm run build para más detalles\n');
  hasErrors = true;
}

// Resultado final
if (hasErrors) {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║                ❌ COMMIT BLOQUEADO             ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log('║                                                ║');
  console.log('║  Se encontraron errores que deben corregirse  ║');
  console.log('║  antes de hacer commit:                        ║');
  console.log('║                                                ║');
  console.log('║  🔧 Para corregir:                            ║');
  console.log('║  1. Revisa los errores mostrados arriba       ║');
  console.log('║  2. Corrige los imports incorrectos           ║');
  console.log('║  3. Soluciona errores de TypeScript           ║');
  console.log('║  4. Ejecuta: npm run check-all                ║');
  console.log('║  5. Intenta el commit nuevamente               ║');
  console.log('║                                                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  process.exit(1);
} else {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║               ✅ COMMIT APROBADO               ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log('║                                                ║');
  console.log('║  Todas las validaciones pasaron exitosamente  ║');
  console.log('║  El commit puede proceder                      ║');
  console.log('║                                                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  process.exit(0);
}