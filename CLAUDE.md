# Boreas - Claude Project Instructions

Servicio B2B de automatización de procesos de contacto con clientes para pequeños negocios.

## 🎯 Project Context

**Tipo:** Servicio B2B + MVP (6-8 semanas)
**Stack:** Next.js + Supabase (enfoque web-first)
**Metodología:** Documentation-First Development

### Core Business
**Boreas** automatiza comunicaciones con clientes para pequeños negocios:
- **Ejemplo:** Salón de uñas automatiza WhatsApp para agendar citas
- **Target:** Salones, restaurantes, clínicas, tiendas locales
- **Objetivo:** Página web para vender este servicio de automatización

### Core Features
- Landing page de ventas optimizada para conversión
- Dashboard CRM para gestionar leads y clientes del servicio
- Sistema de captura y seguimiento de prospectos
- Casos de uso específicos y testimoniales

## 📚 Documentation Status

### ✅ Completed
- Estructura de proyecto inicializada
- Decisiones técnicas definidas
- Stack tecnológico seleccionado

### 🔄 In Progress
- Arquitectura detallada (próximo: `/oden:architect`)

### ⏳ Pending
- Análisis competitivo (`/oden:analyze`)
- Especificaciones de módulos (`/oden:spec`)
- Plan de implementación (`/oden:plan`)

## 🛠️ Stack Decisions

### Frontend
- **Web:** Next.js + TypeScript + Tailwind
- **Mobile:** React Native + Expo
- **State:** Zustand
- **PWA:** Habilitado para funcionalidades de app

### Backend
- **Platform:** Supabase
- **Database:** PostgreSQL
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **Storage:** Supabase Storage

### Hosting
- **Web:** Vercel
- **Mobile:** Expo EAS
- **Analytics:** PostHog/Mixpanel

## 🎯 Next Actions

1. **Immediate:** `/oden:architect` - Completar arquitectura y schema
2. **Following:** `/oden:analyze` - Analizar Notion + Framer
3. **Then:** `/oden:spec` para cada módulo principal

## 📊 Success Targets

### Documentation Pre-Code
- technical-decisions.md: 2000+ líneas
- competitive-analysis.md: 1000+ líneas
- Module specs: 800+ líneas cada uno
- **Total:** 8000+ líneas antes de codificar

### Technical Goals
- MVP funcional en 6-8 semanas
- < 100ms API response times
- Mobile + web deployments ready

## 🔍 Key Competitors
- **ManyChat:** Automatización de WhatsApp/Facebook (complejo, caro)
- **Zapier:** Automatización general (técnico, no específico)
- **Calendly:** Solo agendamiento (limitado)
- **Intercom:** Enterprise focus (caro para pequeños negocios)

## 🚀 Value Proposition
**"Automatización de contacto con clientes, hecha simple para pequeños negocios locales"**

Mientras ManyChat es complejo y Zapier es técnico, Boreas ofrece soluciones pre-configuradas para casos de uso específicos (salón de uñas, restaurante, clínica) con precios accesibles y soporte en español.

---

**Created:** 2026-02-04T04:15:25Z
**Methodology:** Oden Forge Documentation-First Development