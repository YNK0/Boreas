#!/usr/bin/env node
/**
 * Validación de Imports - Prevención de Errores
 * Valida que todos los imports tengan paths correctos
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuración
const SRC_DIR = path.join(process.cwd(), 'src');
const EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];
const ALIAS_MAP = {
  '@/': 'src/',
  '@/components/': 'src/components/',
  '@/store/': 'src/store/',
  '@/lib/': 'src/lib/',
  '@/hooks/': 'src/hooks/',
  '@/types/': 'src/types/',
  '@/utils/': 'src/utils/'
};

let errors = [];
let warnings = [];

console.log('🔍 Validando imports...\n');

// Función para resolver el path real de un import
function resolveImportPath(importPath, currentFile) {
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    // Relative import
    const currentDir = path.dirname(currentFile);
    return path.resolve(currentDir, importPath);
  } else if (importPath.startsWith('@/')) {
    // Alias import
    const withoutAlias = importPath.replace('@/', '');
    return path.join(process.cwd(), 'src', withoutAlias);
  }

  // External package
  return null;
}

// Función para verificar si existe un archivo
function fileExists(filePath) {
  for (const ext of EXTENSIONS) {
    const fullPath = `${filePath}.${ext}`;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  // Check index files
  for (const ext of EXTENSIONS) {
    const indexPath = path.join(filePath, `index.${ext}`);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

// Función para extraer imports de un archivo
function extractImports(content) {
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)?\s*(?:,\s*{[^}]*})?\s*from\s+['"`]([^'"`]+)['"`]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      path: match[1],
      line: content.slice(0, match.index).split('\n').length
    });
  }

  return imports;
}

// Función principal de validación
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = extractImports(content);
  const relativeFilePath = path.relative(process.cwd(), filePath);

  let fileHasErrors = false;

  for (const importItem of imports) {
    const { path: importPath, line } = importItem;

    // Skip external packages
    if (!importPath.startsWith('@/') && !importPath.startsWith('./') && !importPath.startsWith('../')) {
      continue;
    }

    const resolvedPath = resolveImportPath(importPath, filePath);

    if (resolvedPath) {
      const existingFile = fileExists(resolvedPath);

      if (!existingFile) {
        errors.push({
          file: relativeFilePath,
          line: line,
          import: importPath,
          message: `Import no encontrado: ${importPath}`,
          suggestion: `Verifica que el archivo existe o corrige el path`
        });
        fileHasErrors = true;
      }
    }

    // Validaciones específicas

    // 1. Verificar convención de nombres para stores
    if (importPath.includes('@/store/') && !importPath.includes('-store')) {
      warnings.push({
        file: relativeFilePath,
        line: line,
        import: importPath,
        message: `Convención: Los stores deben terminar en '-store'`,
        suggestion: `Ej: '@/store/auth-store' en lugar de '@/store/auth'`
      });
    }

    // 2. Verificar imports de componentes UI
    if (importPath.includes('@/components/ui/') && !importPath.match(/^@\/components\/ui\/[a-z-]+$/)) {
      warnings.push({
        file: relativeFilePath,
        line: line,
        import: importPath,
        message: `Convención: Componentes UI deben usar kebab-case`,
        suggestion: `Ej: '@/components/ui/coming-soon' en lugar de '@/components/ui/comingSoon'`
      });
    }
  }

  return !fileHasErrors;
}

// Función para validar todos los archivos
function validateAllFiles() {
  const pattern = path.join(SRC_DIR, '**/*.{' + EXTENSIONS.join(',') + '}');
  console.log(`🔍 Buscando archivos en: ${pattern}`);
  const files = glob.sync(pattern.replace(/\\/g, '/'));

  console.log(`📂 Encontrados ${files.length} archivos para validar`);
  console.log('');

  let validFiles = 0;
  let invalidFiles = 0;

  for (const file of files) {
    const isValid = validateFile(file);

    if (isValid) {
      validFiles++;
    } else {
      invalidFiles++;
    }
  }

  // Mostrar resultados
  console.log('📊 Resultados de validación:\n');

  if (errors.length > 0) {
    console.log('❌ ERRORES ENCONTRADOS:\n');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.file}:${error.line}`);
      console.log(`   Import: ${error.import}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Sugerencia: ${error.suggestion}`);
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log('⚠️ ADVERTENCIAS:\n');
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning.file}:${warning.line}`);
      console.log(`   Import: ${warning.import}`);
      console.log(`   Advertencia: ${warning.message}`);
      console.log(`   Sugerencia: ${warning.suggestion}`);
      console.log('');
    });
  }

  console.log('📈 RESUMEN:');
  console.log(`   ✅ Archivos válidos: ${validFiles}`);
  console.log(`   ❌ Archivos con errores: ${invalidFiles}`);
  console.log(`   ⚠️ Total advertencias: ${warnings.length}`);
  console.log('');

  if (errors.length > 0) {
    console.log('💡 Para corregir errores de import:');
    console.log('   1. Verifica que los archivos existan');
    console.log('   2. Usa paths relativos o alias @/ correctamente');
    console.log('   3. Revisa la convención de nombres');
    console.log('   4. Ejecuta: npm run check-imports');
    console.log('');

    process.exit(1);
  }

  if (warnings.length === 0 && errors.length === 0) {
    console.log('🎉 ¡Todos los imports son válidos!');
  }

  process.exit(0);
}

// Verificar dependencias
try {
  require.resolve('glob');
} catch (e) {
  console.log('❌ Dependencia requerida: glob');
  console.log('   Ejecuta: npm install --save-dev glob');
  process.exit(1);
}

// Ejecutar validación
if (require.main === module) {
  validateAllFiles();
}

module.exports = {
  validateFile,
  validateAllFiles,
  resolveImportPath,
  fileExists,
  extractImports
};