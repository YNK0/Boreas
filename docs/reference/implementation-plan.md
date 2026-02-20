# Plan de Implementación: Boreas Marketing Site

**Estado:** 🟢 En curso
**Última actualización:** 2026-02-19T00:00:00Z
**Modalidad:** Marketing site + Lead capture
**Duración:** 3 semanas
**Stack:** Next.js + Tailwind + PostHog + Resend + Vercel

---

## 1. Resumen Ejecutivo

### Objetivo
Lanzar el sitio de marketing de Boreas: una landing page de alta conversión que capture leads (waitlist/demo) de pequeños negocios interesados en automatizar su contacto con clientes.

### Timeline de Alto Nivel

```
┌────────────────────────────────────────────────────────────┐
│                    TIMELINE DEL PROYECTO                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Semana 1   │████████│ Polish landing + Analytics         │
│  Semana 2   │████████│ Lead capture + SEO                 │
│  Semana 3   │████████│ Blog + Deploy + Optimización       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Milestones Críticos

| # | Milestone | Semana | Criterio de Éxito |
|---|-----------|--------|-------------------|
| M1 | Site Live | 1 | Landing en Vercel, analytics activos |
| M2 | Lead Gen Activo | 2 | Formulario funcionando, emails via Resend |
| M3 | Primer Lead Orgánico | 3 | Lead desde SEO/blog |

---

## 2. Inventario de Trabajo

### Módulos del Sitio

| Módulo | Complejidad | Valor Negocio | Estado |
|--------|-------------|---------------|--------|
| **Landing Page** | Media | Crítico | ✅ Base implementada |
| **Formulario / Waitlist** | Baja | Alto | ⏳ Pendiente |
| **Analytics (PostHog)** | Baja | Alto | ✅ Setup básico |
| **Blog / SEO** | Media | Medio | ⏳ Pendiente |
| **Deploy Vercel** | Baja | Crítico | ⏳ Pendiente |

---

## 3. Semana 1: Polish Landing + Analytics

### Objetivo
Landing page pulida, optimizada y desplegada en Vercel con analytics funcionando.

### Tareas

| ID | Tarea | Criterio Done |
|----|-------|---------------|
| 1.1 | Revisar y pulir hero section | Propuesta de valor clara, CTA visible |
| 1.2 | Optimizar casos de uso por industria | 3 casos específicos (salón, restaurante, clínica) |
| 1.3 | Revisar social proof / testimoniales | Al menos 2-3 testimoniales placeholder |
| 1.4 | Optimizar FAQ section | 5+ preguntas respondiendo objeciones clave |
| 1.5 | Verificar PostHog tracking | Pageview + CTA clicks trackeados |
| 1.6 | Deploy inicial a Vercel | Site live en dominio |
| 1.7 | Meta tags y Open Graph | Título, descripción, imagen para compartir |

### Criterio de Éxito M1
- [ ] Landing accesible en URL pública
- [ ] Analytics capturando visitas
- [ ] Formulario de contacto visible (aunque sin backend)

---

## 4. Semana 2: Lead Capture + SEO Básico

### Objetivo
Sistema de captura de leads funcionando: formulario → email de confirmación → notificación al equipo.

### Tareas

| ID | Tarea | Criterio Done |
|----|-------|---------------|
| 2.1 | Formulario de contacto/waitlist completo | Nombre, email, tipo de negocio |
| 2.2 | Integración Resend para emails | Email de confirmación al lead |
| 2.3 | Notificación al equipo por email | Email a equipo con datos del lead |
| 2.4 | Meta tags SEO en todas las páginas | Title, description únicos por página |
| 2.5 | Sitemap.xml generado | Next.js sitemap automático |
| 2.6 | Google Search Console setup | Propiedad verificada |
| 2.7 | Página de gracias post-formulario | /gracias con mensaje de confirmación |

### Criterio de Éxito M2
- [ ] Lead de prueba completa el flujo form → email confirmación
- [ ] Equipo recibe notificación con datos del lead
- [ ] Sitemap indexable por Google

---

## 5. Semana 3: Blog + Optimización + Primer Lead

### Objetivo
Blog operativo con primer artículo, site optimizado para conversión, y primer lead orgánico.

### Tareas

| ID | Tarea | Criterio Done |
|----|-------|---------------|
| 3.1 | Setup blog con Next.js MDX/Contentlayer | /blog funcionando |
| 3.2 | Primer artículo de blog publicado | Artículo con keyword objetivo |
| 3.3 | Optimización Core Web Vitals | LCP < 2.5s, CLS < 0.1 |
| 3.4 | Mobile optimization review | Perfect score en mobile usability |
| 3.5 | A/B testing CTA (si hay tráfico) | Variant con mejor CTR identificada |
| 3.6 | Página de precios placeholder | /precios con "próximamente" o pricing básico |
| 3.7 | Monitoring y alertas básicas | Uptime monitoring configurado |

### Criterio de Éxito M3
- [ ] Blog live con al menos 1 artículo indexado
- [ ] Primer lead orgánico registrado
- [ ] Pagespeed score > 90

---

## 6. Decisiones Técnicas del Plan

### Lead Storage
- Opción A: Supabase tabla `leads` (si ya está configurado)
- Opción B: Solo email via Resend sin base de datos (más simple para MVP)
- **Recomendación:** Empezar con Opción B, escalar a A si se necesita

### Blog Engine
- Next.js con MDX + gray-matter (sin CMS externo)
- Archivos markdown en `/content/blog/`
- Generación estática (SSG) para máximo performance

### Analytics Events a Trackear
- `page_view` (automático PostHog)
- `cta_click` (hero CTA, nav CTA)
- `form_submit` (éxito y errores)
- `form_start` (primeros caracteres escritos)

---

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Resend emails van a spam | Media | Verificar dominio, usar SPF/DKIM |
| Bajo tráfico orgánico | Alta | Outreach manual + redes sociales |
| Conversión baja | Media | A/B test hero + CTA iterativo |

---

**Próximo paso inmediato:** Pulir hero section y hacer deploy inicial a Vercel (M1).
