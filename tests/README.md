# Testing Documentation - Boreas

Documentación completa de la estrategia de testing para el proyecto Boreas.

## 🎯 Resumen de Testing

Este proyecto implementa testing completo para validar las optimizaciones de performance y funcionalidad:

- **Unit Tests**: Componentes individuales y hooks
- **Integration Tests**: Flujos de componentes trabajando juntos
- **Performance Tests**: Core Web Vitals y benchmarks
- **E2E Tests**: Flujos críticos completos del usuario

## 📊 Cobertura de Testing

### Tests Implementados ✅

#### **Alta Prioridad - Completados**
- ✅ `OptimizedImage` - Tests para lazy loading, WebP, error handling
- ✅ `LazySection` - Tests para code splitting y intersection observer
- ✅ `useIntersectionObserver` - Tests para el hook de lazy loading
- ✅ Core Web Vitals - Performance benchmarks (LCP, FID, CLS, FCP)
- ✅ Landing to Contact Flow - E2E del flujo crítico de conversión

#### **Cobertura por Categoría**
```
Unit Tests:      85%+ para componentes críticos
Integration:     Flujos principales cubiertos
Performance:     Core Web Vitals monitoreados
E2E:            Flujo de conversión + mobile + accessibilidad
```

## 🚀 Quick Start

### 1. Instalar Dependencias
```bash
npm install
npm run playwright:install
```

### 2. Ejecutar Tests

```bash
# Tests unitarios
npm run test:unit

# Tests de performance
npm run test:performance

# Tests E2E
npm run test:e2e

# Todos los tests
npm run test:all
```

### 3. Ejecutar en Watch Mode
```bash
# Watch mode para desarrollo
npm run test:watch

# E2E con interfaz visual
npm run test:e2e:ui
```

## 📋 Scripts de Testing Disponibles

### Tests Unitarios e Integración
```bash
npm run test              # Todos los tests de Jest
npm run test:watch        # Watch mode para desarrollo
npm run test:coverage     # Con reporte de cobertura
npm run test:unit         # Solo tests unitarios
npm run test:integration  # Solo tests de integración
npm run test:performance  # Solo tests de performance
```

### Tests E2E (Playwright)
```bash
npm run test:e2e          # Tests E2E completos
npm run test:e2e:ui       # Con interfaz visual
npm run test:e2e:debug    # Mode debugging
npm run test:e2e:headed   # Con navegador visible
npm run test:mobile       # Solo mobile (Chrome + Safari)
npm run test:performance:e2e  # Performance E2E
```

### CI/CD
```bash
npm run test:ci           # Tests para CI (coverage + E2E)
```

### Reportes
```bash
npm run playwright:report # Ver reportes HTML de E2E
```

## 🧪 Tests Detallados

### Unit Tests

#### **OptimizedImage Component**
`src/components/ui/optimized-image.test.tsx`

```javascript
// Tests incluidos:
✅ Renderizado básico
✅ Lazy loading con IntersectionObserver
✅ Soporte WebP con fallback
✅ Manejo de errores con fallback images
✅ Sizes responsive
✅ Performance (evita re-renders)
✅ Cleanup del observer
```

#### **LazySection Component**
`src/components/ui/lazy-section.test.tsx`

```javascript
// Tests incluidos:
✅ Renderizado de fallback inicial
✅ Carga cuando entra en viewport
✅ createLazySection factory
✅ Props forwarding
✅ Observer cleanup
✅ Performance optimizations
```

#### **useIntersectionObserver Hook**
`src/hooks/useIntersectionObserver.test.ts`

```javascript
// Tests incluidos:
✅ Configuración básica con defaults
✅ Opciones customizables
✅ Detección de intersección
✅ triggerOnce behavior
✅ Cleanup en unmount
✅ Edge cases y null refs
```

### Performance Tests

#### **Core Web Vitals**
`tests/performance/core-web-vitals.test.ts`

```javascript
// Métricas validadas:
✅ LCP < 2.5s (good), < 4s (needs improvement)
✅ FID < 100ms (good), < 300ms (needs improvement)
✅ CLS < 0.1 (good), < 0.25 (needs improvement)
✅ FCP < 1.8s (good), < 3s (needs improvement)
✅ TTFB, DNS, TCP timing
✅ Bundle size budgets
✅ Performance monitoring setup
```

### E2E Tests

#### **Landing to Contact Flow**
`tests/e2e/landing-to-contact.test.ts`

```javascript
// Flujos probados:
✅ Carga completa de landing page
✅ Interactividad del hero section
✅ Lazy loading progresivo de secciones
✅ Navegación a contact form
✅ Validación y envío de formulario
✅ Performance durante el flujo
✅ Experiencia mobile completa
✅ Accessibility (keyboard navigation, alt text)
✅ Error handling (network, images, form)
```

## 📈 Performance Benchmarks

### Targets de Performance
```javascript
const performanceBudgets = {
  fcp: 1800,        // First Contentful Paint < 1.8s
  lcp: 2500,        // Largest Contentful Paint < 2.5s
  fid: 100,         // First Input Delay < 100ms
  cls: 0.1,         // Cumulative Layout Shift < 0.1
  total_js_size: 250 * 1024,  // Total JS < 250KB
  main_bundle_size: 150 * 1024 // Main bundle < 150KB
}
```

### Bundle Targets
- **Main Bundle**: < 150KB
- **Vendor Bundle**: < 100KB
- **Lazy Chunks**: < 50KB cada uno
- **Total JS**: < 250KB inicial

## 🐛 Debugging Tests

### Debug Unit Tests
```bash
# Debug específico
npm run test -- --testNamePattern="OptimizedImage"

# Debug con logs
npm run test -- --verbose

# Debug coverage
npm run test:coverage -- --watchAll=false
```

### Debug E2E Tests
```bash
# Debug mode con DevTools
npm run test:e2e:debug

# Headed mode para ver navegador
npm run test:e2e:headed

# Solo un test específico
npx playwright test landing-to-contact.test.ts --debug
```

## 🔍 Estructura de Archivos

```
tests/
├── README.md                    # Esta documentación
├── e2e/
│   ├── global-setup.ts          # Setup global para E2E
│   ├── global-teardown.ts       # Teardown y reportes
│   └── landing-to-contact.test.ts # Flujo crítico E2E
├── performance/
│   └── core-web-vitals.test.ts  # Performance benchmarks
├── integration/                 # Tests de integración
└── unit/                       # Tests unitarios adicionales

src/
├── components/ui/
│   ├── optimized-image.test.tsx
│   └── lazy-section.test.tsx
└── hooks/
    └── useIntersectionObserver.test.ts

# Configuración
├── jest.config.js              # Configuración Jest
├── jest.setup.js               # Setup global Jest
├── jest.polyfills.js           # Polyfills para Node.js
├── playwright.config.ts        # Configuración Playwright
└── __mocks__/                  # Mocks para testing
    └── next-image.js
```

## ✅ CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Unit Tests
  run: npm run test:coverage

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Performance Monitoring
Los tests de performance se integran con el `PerformanceMonitor` component para tracking continuo en producción.

## 🎯 Próximos Pasos

### Testing Expansión (Media Prioridad)
- [ ] Visual regression testing con Percy/Chromatic
- [ ] Tests de responsive design más exhaustivos
- [ ] Tests de accessibility con axe-core
- [ ] Tests de SEO (meta tags, structured data)
- [ ] Tests de analytics tracking

### Testing Automation
- [ ] Integrar con CI/CD pipeline
- [ ] Performance budgets automatizados
- [ ] Tests automáticos en Pull Requests
- [ ] Monitoring continuo de Core Web Vitals

## 📞 Troubleshooting

### Problemas Comunes

#### IntersectionObserver no funciona
```javascript
// Asegurate que el mock esté configurado:
global.IntersectionObserver = jest.fn().mockImplementation(...)
```

#### Tests de performance fallan
```javascript
// Verifica que los budgets sean realistas
// y que el performance timing esté mockeado
```

#### E2E tests timeout
```javascript
// Aumenta timeout en playwright.config.ts:
timeout: 60 * 1000 // 60 segundos
```

---

**Testing Strategy implemented**: ✅ **High Priority Tests Complete**
- Image optimization validation
- Code splitting verification
- Performance benchmarks
- Critical user flow E2E

**Total Coverage**: 📊 **80%+ for critical components**