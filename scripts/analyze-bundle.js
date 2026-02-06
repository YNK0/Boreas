#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Bundle Analysis Script for Boreas
 * Analyzes Next.js build output to measure code splitting effectiveness
 */

const BUNDLE_THRESHOLDS = {
  // Performance budget thresholds (in KB)
  MAIN_BUNDLE_MAX: 150,  // Main bundle size
  TOTAL_JS_MAX: 250,     // Total JavaScript size
  CHUNK_MAX: 50,         // Individual chunk size
  FIRST_LOAD_MAX: 200,   // First load JS
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing bundle for code splitting effectiveness...\n');

  const buildDir = path.join(process.cwd(), '.next');

  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  try {
    // Run Next.js build analysis
    const buildInfo = execSync('npx next build --json', { encoding: 'utf8', cwd: process.cwd() });

    // Parse build output
    const lines = buildInfo.split('\n');
    const buildStats = [];
    let isStatsSection = false;

    lines.forEach(line => {
      if (line.includes('Route (pages)') || line.includes('Route (app)')) {
        isStatsSection = true;
        return;
      }

      if (isStatsSection && line.trim() && !line.includes('├') && !line.includes('└')) {
        // Parse route line: "○ / 85.1 kB 168 kB"
        const match = line.match(/[○●☆]\s+(\S+)\s+([\d.]+\s+\w+)\s+([\d.]+\s+\w+)/);
        if (match) {
          const [, route, firstLoad, total] = match;
          buildStats.push({
            route,
            firstLoad: match[2],
            total: match[3]
          });
        }
      }
    });

    console.log('📊 Bundle Analysis Results:\n');

    // Analyze main page (landing page)
    const mainPage = buildStats.find(stat => stat.route === '/');
    if (mainPage) {
      const firstLoadKB = parseFloat(mainPage.firstLoad);
      const totalKB = parseFloat(mainPage.total);

      console.log(`🏠 Landing Page (${mainPage.route}):`);
      console.log(`   First Load JS: ${mainPage.firstLoad} ${firstLoadKB > BUNDLE_THRESHOLDS.FIRST_LOAD_MAX ? '❌' : '✅'}`);
      console.log(`   Total Size: ${mainPage.total} ${totalKB > BUNDLE_THRESHOLDS.TOTAL_JS_MAX ? '❌' : '✅'}\n`);

      // Performance assessment
      if (firstLoadKB <= BUNDLE_THRESHOLDS.FIRST_LOAD_MAX) {
        console.log('✅ Performance: EXCELLENT - Landing page loads fast');
      } else if (firstLoadKB <= BUNDLE_THRESHOLDS.FIRST_LOAD_MAX * 1.5) {
        console.log('⚠️  Performance: GOOD - Could be optimized further');
      } else {
        console.log('❌ Performance: NEEDS IMPROVEMENT - Bundle too large');
      }
    }

    // Analyze other routes
    console.log('\n📄 Other Routes:');
    buildStats.filter(stat => stat.route !== '/').forEach(stat => {
      const firstLoadKB = parseFloat(stat.firstLoad);
      const status = firstLoadKB > BUNDLE_THRESHOLDS.FIRST_LOAD_MAX ? '❌' : '✅';
      console.log(`   ${stat.route}: ${stat.firstLoad} ${status}`);
    });

    // Check for lazy loading effectiveness
    console.log('\n🚀 Code Splitting Analysis:');

    const staticDir = path.join(buildDir, 'static/chunks');
    if (fs.existsSync(staticDir)) {
      const chunks = fs.readdirSync(staticDir)
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const filePath = path.join(staticDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            sizeFormatted: formatBytes(stats.size)
          };
        })
        .sort((a, b) => b.size - a.size);

      console.log(`   Total chunks: ${chunks.length}`);
      console.log(`   Largest chunks:`);
      chunks.slice(0, 5).forEach((chunk, index) => {
        const sizeKB = chunk.size / 1024;
        const status = sizeKB > BUNDLE_THRESHOLDS.CHUNK_MAX ? '❌' : '✅';
        console.log(`     ${index + 1}. ${chunk.name}: ${chunk.sizeFormatted} ${status}`);
      });

      // Check for component-specific chunks (evidence of code splitting)
      const componentChunks = chunks.filter(chunk =>
        chunk.name.includes('components') ||
        chunk.name.includes('pages') ||
        chunk.name.includes('lazy')
      );

      console.log(`\n📦 Component Chunks (evidence of code splitting):`);
      componentChunks.slice(0, 3).forEach(chunk => {
        console.log(`   ${chunk.name}: ${chunk.sizeFormatted}`);
      });

      if (componentChunks.length > 5) {
        console.log('✅ Good code splitting detected!');
      } else if (componentChunks.length > 2) {
        console.log('⚠️  Some code splitting present, could be improved');
      } else {
        console.log('❌ Limited code splitting detected');
      }
    }

    // Recommendations
    console.log('\n💡 Recommendations:');

    if (mainPage && parseFloat(mainPage.firstLoad) > BUNDLE_THRESHOLDS.FIRST_LOAD_MAX) {
      console.log('   • Landing page bundle is large - consider more aggressive lazy loading');
    }

    const largeChunks = chunks?.filter(chunk => (chunk.size / 1024) > BUNDLE_THRESHOLDS.CHUNK_MAX) || [];
    if (largeChunks.length > 0) {
      console.log(`   • ${largeChunks.length} chunks exceed ${BUNDLE_THRESHOLDS.CHUNK_MAX}KB - consider splitting further`);
    }

    console.log('   • Run "npm run analyze" for detailed bundle visualization');
    console.log('   • Monitor Core Web Vitals in production with PerformanceMonitor');

    console.log('\n🎯 Bundle Analysis Complete!');

  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);

    // Fallback: basic file size analysis
    console.log('\nFalling back to file size analysis...\n');

    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const getDirectorySize = (dirPath) => {
        let totalSize = 0;
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);

          if (stats.isDirectory()) {
            totalSize += getDirectorySize(filePath);
          } else {
            totalSize += stats.size;
          }
        });

        return totalSize;
      };

      const totalSize = getDirectorySize(staticDir);
      console.log(`📊 Total static assets: ${formatBytes(totalSize)}`);

      if (totalSize > BUNDLE_THRESHOLDS.TOTAL_JS_MAX * 1024) {
        console.log('⚠️  Total bundle size is large - optimization recommended');
      } else {
        console.log('✅ Bundle size looks good!');
      }
    }
  }
}

// Run the analysis
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle, formatBytes };