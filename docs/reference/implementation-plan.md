# Plan de Implementación: Boreas

**Estado:** 🟢 Aprobado
**Última actualización:** 2026-02-04T05:15:20Z
**Modalidad:** MVP (Minimum Viable Product)
**Duración:** 8 semanas
**Stack:** Next.js + Supabase + WhatsApp Business API

---

## 1. Resumen Ejecutivo

### Valor Propuesto
Boreas automatiza las comunicaciones WhatsApp de pequeños negocios (salones, restaurantes, clínicas), reduciendo de 4 horas/día a 1 hora/día el tiempo dedicado a responder mensajes, mientras incrementa las conversiones en 25%.

### Timeline de Alto Nivel

```
┌────────────────────────────────────────────────────────────┐
│                    TIMELINE DEL PROYECTO                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Sem 1-2    │████████│ Foundation + Auth                  │
│  Sem 3-4    │████████│ Landing + Dashboard Core           │
│  Sem 5-6    │████████│ WhatsApp Automation Core           │
│  Sem 7-8    │████████│ Integration + Polish + Launch      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Milestones Críticos

| # | Milestone | Semana | Criterio de Éxito | ROI Esperado |
|---|-----------|--------|-------------------|--------------|
| M1 | Foundation Ready | 2 | Auth + DB + Deploy funcionando | Tech debt = 0 |
| M2 | B2B Landing Live | 4 | Landing página convirtiendo leads | Lead gen activo |
| M3 | Bot MVP Working | 6 | Bot básico respondiendo WhatsApp | Demo con clientes |
| M4 | Launch Ready | 8 | Cliente piloto usando sistema | First revenue |

---

## 2. Inventario de Trabajo

### Módulos Identificados (de specs)

| Módulo | Líneas Spec | Complejidad | Valor Negocio | Prioridad |
|--------|-------------|-------------|---------------|-----------|
| **Landing Page** | 1,087 | Media | Alto | 🔴 Critical |
| **Auth System** | 1,156 | Media | Alto | 🔴 Critical |
| **Dashboard CRM** | 1,124 | Alta | Alto | 🟡 Important |
| **WhatsApp Automation** | 1,234 | Muy Alta | Crítico | 🔴 Critical |

### Features MVP (extraídos de user stories)

| Feature | User Story | Complejidad | Semanas |
|---------|------------|-------------|---------|
| Landing B2B | US-015, US-016 | Media | 1 |
| Auth completo | Auth flows | Media | 1 |
| Dashboard CRM | US-006, US-007 | Alta | 2 |
| Bot WhatsApp básico | US-001, US-002 | Muy Alta | 2 |
| Agendamiento | US-002, US-003 | Alta | 1 |
| Escalación manual | US-007 | Media | 0.5 |

---

## 3. Fase 1: Foundation (Semanas 1-2)

### Objetivo
Establecer base técnica sólida con autenticación y infraestructura para escalar.

### Semana 1: Project Setup + Database

#### Día 1: Project Initialization
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 1.1 | Crear Next.js app + TypeScript | 2h | - | `npm run build` exitoso |
| 1.2 | Configurar estructura carpetas según spec | 2h | 1.1 | Carpetas según technical-decisions.md |
| 1.3 | Setup ESLint + Prettier + Tailwind | 2h | 1.2 | Linting + styling funcionan |
| 1.4 | Configurar testing (Jest + RTL) | 2h | 1.1 | Test dummy pasa |

**Total: 8h**

#### Día 2: Database + Environment
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 1.5 | Setup Supabase proyecto | 1h | - | Dashboard accesible |
| 1.6 | Crear schema BD según technical-decisions | 6h | 1.5 | 9 tablas creadas, relaciones OK |
| 1.7 | Configurar variables entorno | 1h | 1.5 | .env.local + .env.example |

**Total: 8h**

#### Día 3: Supabase Integration
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 1.8 | Integrar Supabase cliente | 2h | 1.6, 1.7 | Conexión DB exitosa |
| 1.9 | Configurar Row Level Security | 4h | 1.8 | Policies según specs |
| 1.10 | Setup migrations workflow | 2h | 1.8 | Migrations versionadas |

**Total: 8h**

#### Día 4: CI/CD + Deployment
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 1.11 | Configurar GitHub Actions | 2h | 1.4 | Tests en PR |
| 1.12 | Setup Vercel deployment | 2h | 1.1 | Deploy automático main |
| 1.13 | Configurar staging environment | 2h | 1.12 | staging.boreas.com |
| 1.14 | Setup monitoring básico | 2h | 1.12 | Error tracking |

**Total: 8h**

#### Día 5: Buffer + Documentation
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 1.15 | Buffer para imprevistos | 3h | - | Issues resueltos |
| 1.16 | Documentar setup en README | 2h | Todo | Onboarding < 30 min |
| 1.17 | Code review y cleanup | 3h | Todo | Code quality > 8/10 |

**Total: 8h**

### Semana 2: Authentication System

#### Día 1-2: Core Auth (12h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 2.1 | Configurar Supabase Auth | 2h | 1.8 | Providers configurados |
| 2.2 | Implementar registro | 4h | 2.1 | Usuario puede crear cuenta |
| 2.3 | Implementar login/logout | 3h | 2.1 | Usuario puede iniciar/cerrar sesión |
| 2.4 | Auth middleware Next.js | 3h | 2.3 | Rutas protegidas funcionan |

#### Día 3: Advanced Auth (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 2.5 | Password reset flow | 3h | 2.1 | Email reset funciona |
| 2.6 | Email confirmation | 2h | 2.1 | Flow confirmación completo |
| 2.7 | User profile management | 3h | 2.3 | Editar perfil |

#### Día 4: Auth UI (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 2.8 | Páginas login/register | 4h | 2.2, 2.3 | UI según auth-spec.md |
| 2.9 | Páginas forgot/reset password | 2h | 2.5 | Flow completo UI |
| 2.10 | Profile page + edit | 2h | 2.7 | CRUD perfil usuario |

#### Día 5: Testing + Polish (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 2.11 | Tests auth flows | 4h | 2.1-2.10 | Coverage > 80% |
| 2.12 | Error handling + UX | 2h | 2.8-2.10 | Errores user-friendly |
| 2.13 | Code review + refactor | 2h | Todo | PR aprobado |

### Entregables Milestone M1 (Fin Semana 2)
- [ ] ✅ App Next.js con TypeScript corriendo
- [ ] ✅ Supabase con schema completo (9 tablas)
- [ ] ✅ Sistema auth completo (registro, login, reset)
- [ ] ✅ CI/CD funcionando con Vercel
- [ ] ✅ Environment staging operativo
- [ ] ✅ Tests > 80% coverage en auth
- [ ] ✅ Documentation setup actualizada

---

## 4. Fase 2: Landing + Dashboard Core (Semanas 3-4)

### Objetivo
Landing page B2B generando leads + Dashboard CRM básico para gestionar clientes.

### Semana 3: Landing Page B2B

#### Día 1-2: Landing Structure + Hero (16h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 3.1 | Layout landing page | 3h | M1 | Estructura según landing-spec.md |
| 3.2 | Hero section + value prop | 4h | 3.1 | Mensaje claro para Carmen (salón) |
| 3.3 | Casos de uso industrias | 4h | 3.2 | Secciones salón/restaurante/dental |
| 3.4 | Call-to-action principal | 2h | 3.2 | CTA "Demo gratuita" prominente |
| 3.5 | Responsive mobile | 3h | 3.1-3.4 | Mobile-first según spec |

#### Día 3: Form + Lead Capture (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 3.6 | Formulario contacto optimizado | 4h | 3.4 | Según ContactLead model |
| 3.7 | Validaciones + UX form | 2h | 3.6 | Validaciones landing-spec.md |
| 3.8 | Integración BD leads | 2h | 3.6 | Leads guardados en Supabase |

#### Día 4: Content + SEO (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 3.9 | FAQ section | 2h | 3.3 | Preguntas según user-personas.md |
| 3.10 | Testimonials placeholder | 2h | 3.3 | Social proof para credibilidad |
| 3.11 | SEO básico (meta, títulos) | 2h | 3.1 | Meta tags optimizados |
| 3.12 | Analytics setup (PostHog) | 2h | 3.1 | Tracking conversiones |

#### Día 5: Polish + Deploy (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 3.13 | Performance optimization | 2h | Todo | Lighthouse > 90 |
| 3.14 | Cross-browser testing | 2h | Todo | Chrome, Safari, Firefox OK |
| 3.15 | Deploy production landing | 2h | 3.14 | boreas.com live |
| 3.16 | Buffer + documentation | 2h | - | Issues menores resueltos |

### Semana 4: Dashboard CRM Core

#### Día 1-2: Dashboard Structure (16h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 4.1 | Layout dashboard principal | 3h | M1 | Layout según dashboard-spec.md |
| 4.2 | Sidebar navigation | 2h | 4.1 | Nav responsive |
| 4.3 | Métricas cards overview | 4h | 4.1 | 6 métricas principales |
| 4.4 | Leads table básica | 4h | 4.3 | CRUD leads según spec |
| 4.5 | Paginación + filtros | 3h | 4.4 | Filtros por status, business_type |

#### Día 3: Leads Management (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 4.6 | Modal crear/editar lead | 3h | 4.4 | Form completo Lead model |
| 4.7 | Lead detail view | 3h | 4.4 | Vista detalle con notas |
| 4.8 | Notes system | 2h | 4.7 | CRUD notas por lead |

#### Día 4: Pipeline + States (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 4.9 | Pipeline visual kanban | 4h | 4.4 | Estados según dashboard-spec.md |
| 4.10 | Drag & drop transitions | 3h | 4.9 | Cambio estados funcional |
| 4.11 | Status validation rules | 1h | 4.10 | Reglas según spec |

#### Día 5: Integration + Tests (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 4.12 | Conectar landing → dashboard | 2h | 3.8, 4.4 | Leads aparecen en dashboard |
| 4.13 | Dashboard real-time updates | 3h | 4.12 | Supabase realtime |
| 4.14 | Tests dashboard core | 3h | 4.1-4.13 | Tests principales flows |

### Entregables Milestone M2 (Fin Semana 4)
- [ ] ✅ Landing page live generando leads
- [ ] ✅ Dashboard CRM con gestión básica leads
- [ ] ✅ Pipeline visual con drag & drop
- [ ] ✅ Sistema de notas funcionando
- [ ] ✅ Real-time updates entre landing y dashboard
- [ ] ✅ SEO básico + analytics configurados
- [ ] ✅ Mobile responsive completo

---

## 5. Fase 3: WhatsApp Automation Core (Semanas 5-6)

### Objetivo
Bot WhatsApp funcional respondiendo consultas básicas y agendando citas.

### Semana 5: WhatsApp Integration + Bot Foundation

#### Día 1-2: WhatsApp Business API Setup (16h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 5.1 | Configurar WhatsApp Business API | 4h | M2 | Webhooks funcionando |
| 5.2 | Webhook endpoint /api/webhook/whatsapp | 4h | 5.1 | Recibe mensajes OK |
| 5.3 | Message sending infrastructure | 4h | 5.2 | Envío mensajes exitoso |
| 5.4 | Bot config UI básica | 4h | 4.1 | Form según automation-spec.md |

#### Día 3: Intent Recognition + Flows (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 5.5 | Intent classifier simple | 3h | 5.3 | Clasifica según automation-spec |
| 5.6 | Conversation context management | 3h | 5.5 | State machine básica |
| 5.7 | Template message system | 2h | 5.3 | Templates dinámicos |

#### Día 4: Basic Responses (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 5.8 | FAQ auto-responses | 3h | 5.5, 5.7 | US-001 funcionando |
| 5.9 | Business hours responses | 2h | 5.8 | US-004 funcionando |
| 5.10 | Greeting messages | 2h | 5.7 | Saludo personalizable |
| 5.11 | Fallback to human | 1h | 5.6 | Escalación básica |

#### Día 5: Testing + Integration (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 5.12 | WhatsApp webhook tests | 3h | 5.1-5.11 | Tests webhook flow |
| 5.13 | Bot config en dashboard | 3h | 5.4 | UI configuración bot |
| 5.14 | Error handling WhatsApp API | 2h | 5.3 | Rate limits + retries |

### Semana 6: Appointment Booking + Advanced Features

#### Día 1-2: Appointment Booking Flow (16h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 6.1 | Service selection flow | 4h | 5.6 | US-002 paso 1 |
| 6.2 | Availability calculation | 4h | 6.1 | Calendario disponible |
| 6.3 | Date/time selection | 4h | 6.2 | US-002 paso 2-3 |
| 6.4 | Appointment confirmation | 4h | 6.3 | US-002 completo |

#### Día 3: Google Calendar Integration (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 6.5 | Google Calendar API setup | 3h | 6.4 | API credentials OK |
| 6.6 | Sync appointments bidirectional | 4h | 6.5 | Eventos sincronizados |
| 6.7 | Availability real-time | 1h | 6.6 | Disponibilidad actualizada |

#### Día 4: Conversation Management (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 6.8 | Dashboard conversation view | 4h | 4.1, 5.6 | US-007 básico |
| 6.9 | Manual message sending | 2h | 6.8 | Humano puede responder |
| 6.10 | Escalation triggers | 2h | 6.9 | Auto-escalate keywords |

#### Día 5: Reminders + Polish (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 6.11 | Automated reminders | 3h | 6.4 | US-003 funcionando |
| 6.12 | Message templates management | 2h | 5.7 | US-008 básico |
| 6.13 | End-to-end testing | 3h | Todo | Flow completo funciona |

### Entregables Milestone M3 (Fin Semana 6)
- [ ] ✅ Bot WhatsApp respondiendo consultas automáticamente
- [ ] ✅ Sistema agendamiento citas funcional
- [ ] ✅ Integración Google Calendar bidireccional
- [ ] ✅ Dashboard conversaciones en tiempo real
- [ ] ✅ Escalación manual funcionando
- [ ] ✅ Recordatorios automáticos
- [ ] ✅ Templates configurables

---

## 6. Fase 4: Integration + Launch (Semanas 7-8)

### Objetivo
Sistema integrado, pulido, y listo para cliente piloto.

### Semana 7: Integration + Advanced Features

#### Día 1-2: Dashboard ↔ WhatsApp Integration (16h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 7.1 | Metrics automation calculation | 4h | M3 | Métricas auto vs manual |
| 7.2 | Real-time conversation updates | 4h | 6.8 | Dashboard sync WhatsApp |
| 7.3 | Lead → Client conversion | 4h | 4.4, 6.4 | Appointment → Client |
| 7.4 | Advanced filtering dashboard | 4h | 4.5 | Filtros complejos según spec |

#### Día 3: Business Configuration (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 7.5 | Business hours configuration | 3h | 5.4 | Config horarios por día |
| 7.6 | Services management | 3h | 6.1 | CRUD servicios |
| 7.7 | Custom templates UI | 2h | 6.12 | Editor templates |

#### Día 4: Performance + Reliability (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 7.8 | Database optimization | 2h | Todo | Queries < 100ms |
| 7.9 | WhatsApp rate limiting | 2h | 5.14 | Manejo 1000 msg/min |
| 7.10 | Error monitoring | 2h | 1.14 | Alertas configuradas |
| 7.11 | Backup strategy | 2h | M1 | Backup automático DB |

#### Día 5: Security + Compliance (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 7.12 | Input sanitization | 2h | Todo | XSS protection |
| 7.13 | Rate limiting API | 2h | M1 | DoS protection |
| 7.14 | Data privacy compliance | 2h | M1 | GDPR básico |
| 7.15 | Security audit | 2h | 7.12-7.14 | Vulnerabilities < 5 |

### Semana 8: Polish + Launch Preparation

#### Día 1-2: UX Polish + Bug Fixes (16h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 8.1 | UI/UX polish landing | 4h | M2 | Design review passed |
| 8.2 | UI/UX polish dashboard | 4h | M3 | Responsive perfected |
| 8.3 | WhatsApp flow optimization | 4h | M3 | Conversational UX smooth |
| 8.4 | Bug fixes críticos | 4h | Todo | 0 bugs severity high |

#### Día 3: Testing + QA (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 8.5 | E2E testing complete flow | 4h | M3 | Lead → client → appointment |
| 8.6 | Load testing | 2h | M3 | 100 concurrent users |
| 8.7 | Cross-device testing | 2h | 8.1, 8.2 | Mobile + desktop + tablet |

#### Día 4: Documentation + Training (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 8.8 | User documentation | 3h | M3 | Manual para Carmen |
| 8.9 | Admin documentation | 2h | M3 | Setup guide clients |
| 8.10 | Video demo creation | 3h | M3 | Demo 5 min grabado |

#### Día 5: Launch Preparation (8h)
| ID | Tarea | Est. | Deps | Criterio Done |
|----|-------|------|------|---------------|
| 8.11 | Production environment | 2h | M3 | Prod config completa |
| 8.12 | Monitoring dashboard | 2h | 7.10 | Metrics real-time |
| 8.13 | Client onboarding flow | 2h | 8.9 | Proceso documentado |
| 8.14 | Launch readiness checklist | 2h | Todo | All items ✅ |

### Entregables Milestone M4 (Fin Semana 8)
- [ ] ✅ Sistema completamente integrado y funcional
- [ ] ✅ Performance optimizada (< 100ms queries)
- [ ] ✅ Security audit passed
- [ ] ✅ Documentation completa para usuarios
- [ ] ✅ Demo video preparado
- [ ] ✅ Cliente piloto ready to onboard
- [ ] ✅ Production environment stable
- [ ] ✅ 0 bugs críticos pendientes

---

## 7. Dependencias Críticas

### Grafo de Dependencias

```
Foundation (S1) ──▶ Auth (S2) ──▶ Landing (S3) ──▶ Dashboard (S4)
    │                    │            │               │
    │                    │            │               ▼
    │                    │            │        WhatsApp Setup (S5)
    │                    │            │               │
    │                    │            │               ▼
    │                    │            │        Bot Core (S6)
    │                    │            │               │
    │                    │            ▼               ▼
    │                    └────────▶ Dashboard Integration (S7)
    │                                        │
    ▼                                        ▼
WhatsApp Business API ──────────────▶ Final Integration (S8)
```

### Dependencias Críticas

| Dependencia | Bloquea | Riesgo | Mitigación |
|-------------|---------|--------|------------|
| **Supabase setup** | Todo development | Bajo | Managed service, fallback PostgreSQL |
| **WhatsApp Business API** | Bot functionality | Alto | Setup paralelo S1, backup SMS |
| **Google Calendar API** | Appointment booking | Medio | Manual booking fallback |
| **Auth system** | Todo user features | Bajo | Supabase Auth managed |

---

## 8. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación | Contingencia |
|--------|--------------|---------|------------|--------------|
| **WhatsApp API approval delays** | Alta | Crítico | Aplicar semana 1, tener sandbox | SMS fallback |
| **Google Calendar rate limits** | Media | Alto | Implement caching, batching | Manual calendar sync |
| **Supabase performance issues** | Baja | Alto | DB optimization desde S1 | Migrate PostgreSQL |
| **Scope creep client feedback** | Alta | Medio | Lock specs, controlled changes | MVP + v1.1 plan |
| **Integration complexity underestimated** | Media | Alto | Buffer 20%, simplify MVP | Remove non-critical features |
| **WhatsApp Business policy changes** | Baja | Crítico | Monitor policy updates | Multi-channel strategy |

### Contingency Plans

1. **Si WhatsApp API delayed:**
   - Desarrollar todo menos WhatsApp
   - Demo con simulador
   - Launch con SMS integration

2. **Si performance issues:**
   - Database optimization sprint
   - Caching aggressive
   - Simplify real-time features

3. **Si integration too complex:**
   - Manual workflows
   - Phased rollout features
   - v1.1 for advanced features

---

## 9. Definition of Done

### Por Tarea
- [ ] ✅ Código implementado según especificación exacta
- [ ] ✅ Tests escritos (unit mínimo, integration si crítico)
- [ ] ✅ Code review aprobado por lead
- [ ] ✅ Responsive funcionando mobile + desktop
- [ ] ✅ Error handling implementado
- [ ] ✅ Desplegado en staging automáticamente

### Por Milestone
- [ ] ✅ Demo functional completa
- [ ] ✅ Todos los criterios de aceptación ✅
- [ ] ✅ Performance targets alcanzados
- [ ] ✅ 0 bugs críticos, < 5 bugs menores
- [ ] ✅ Documentation actualizada
- [ ] ✅ Cliente interno puede usar feature

### Para Launch (M4)
- [ ] ✅ Cliente piloto usando sistema exitosamente
- [ ] ✅ Sistema handling 100 conversaciones/día
- [ ] ✅ Landing converting > 5% visitors to leads
- [ ] ✅ Bot automation rate > 80%
- [ ] ✅ Uptime > 99.5% últimos 7 días

---

## 10. Recursos y Budget

### Equipo Requerido
| Rol | % Tiempo | Semanas | Costo/semana | Total |
|-----|----------|---------|--------------|-------|
| **Full-stack Developer** | 100% | 1-8 | $2,000 | $16,000 |
| **UI/UX Designer** | 50% | 1-4 | $800 | $1,600 |
| **QA Tester** | 25% | 6-8 | $400 | $300 |
| **DevOps/Setup** | 25% | 1-2 | $500 | $250 |
| **Total Team** | | | | **$18,150** |

### Servicios y Tools
| Servicio | Costo/mes | 2 meses | Notas |
|----------|-----------|---------|-------|
| Supabase | $0-25 | $50 | Free tier + small buffer |
| Vercel | $20 | $40 | Pro plan for team |
| WhatsApp Business | $0 | $0 | Free tier 1K users/month |
| Google Calendar API | $0 | $0 | Free quotas sufficient |
| PostHog Analytics | $0 | $0 | Free tier |
| Error Tracking | $0 | $0 | Vercel built-in |
| **Total Services** | | **$90** | Very cost-effective |

### Total Investment
- **Development:** $18,150
- **Services:** $90
- **Buffer (10%):** $1,824
- **Total:** **$20,064**

---

## 11. Métricas de Seguimiento

### Development Metrics (Daily)
| Métrica | Target | Cómo medir | Alert If |
|---------|--------|-----------||
| **Tasks completed** | ≥ 80% | GitHub Projects | < 60% 2 días |
| **PRs merged** | Same day | GitHub | PRs > 2 días |
| **Build status** | 100% green | CI/CD | Any failure |
| **Test coverage** | ≥ 70% | Jest reports | < 60% |
| **Performance** | < 100ms avg | Lighthouse | > 200ms |

### Business Metrics (Weekly)
| Métrica | Target | Cómo medir | Alert If |
|---------|--------|-----------||
| **Landing conversion** | ≥ 5% | PostHog | < 3% |
| **Demo completion** | ≥ 80% | User testing | < 60% |
| **Bot automation rate** | ≥ 80% | WhatsApp metrics | < 70% |
| **System uptime** | ≥ 99.5% | Vercel monitoring | < 99% |

---

## 12. Checklist Pre-Implementación

**CRÍTICO:** Verificar antes de escribir primera línea de código:

### Documentación ✅
- [x] ✅ technical-decisions.md > 2000 líneas ✅
- [x] ✅ competitive-analysis.md completo ✅
- [x] ✅ user-personas.md + user-stories.md ✅
- [x] ✅ 4 module specs > 800 líneas cada uno ✅
- [x] ✅ Este implementation plan revisado ✅

### Accesos y Permisos ⏳
- [ ] ⏳ WhatsApp Business API application submitted
- [ ] ⏳ Google Calendar API credentials
- [ ] ⏳ Supabase project created
- [ ] ⏳ Vercel account + GitHub integration
- [ ] ⏳ Domain boreas.com configured

### Equipo y Tools ⏳
- [ ] ⏳ Development team assigned
- [ ] ⏳ GitHub repository created
- [ ] ⏳ Design system/mockups ready
- [ ] ⏳ Development environment set up
- [ ] ⏳ Project management tools configured

**Status:** 🟡 Documentation Complete, Services Setup Pending

**Próximo paso:** `/oden:checklist` para verificación final

---

**Plan Creado:** 2026-02-04T05:15:20Z
**Autor:** Implementation Planner Agent
**Modalidad:** MVP - 8 semanas
**Total Investment:** $20,064
**Expected ROI:** Cliente piloto paying $200/mes = break-even 100 months

**🚀 Ready to execute when services are configured!**