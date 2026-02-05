---
name: landing-optimizations
description: Optimize Boreas landing page UX and performance for better conversions and Core Web Vitals
status: backlog
created: 2026-02-05T06:22:54Z
---

# PRD: Landing Page Optimizations

## Executive Summary

**Boreas Landing Optimization Initiative** aims to transform our B2B automation landing page into a high-converting, fast-loading, and user-friendly experience. Current issues include confusing UX flow and poor Core Web Vitals scores affecting SEO ranking and user conversion.

**Value Proposition:** Increase lead conversion rate by 40% and achieve Google PageSpeed score of 90+ by simplifying user experience and optimizing performance.

## Problem Statement

### Current State Issues

**Primary Problem:** Confusing UX prevents potential B2B clients from understanding Boreas value proposition and converting to leads.

**Secondary Problem:** Poor Page Speed Score (likely <60) hurts SEO ranking and user experience, losing potential customers before they engage.

**Impact:**
- Low conversion rate from visitor to lead
- Poor Google search ranking for "automatización WhatsApp pequeños negocios"
- Users abandoning page before understanding service value
- Missed opportunities with salon/restaurant/clinic owners

**Why Now:**
- Competitive landscape is growing (ManyChat, Zapier getting more presence)
- Small business digitization accelerating post-COVID
- Google Core Web Vitals becoming crucial SEO ranking factor

## User Stories

### Primary Persona: Small Business Owner (María, Salon Owner)
**Background:** Owns nail salon, 30-45 years old, not tech-savvy but wants to modernize booking system

**User Journey - Current (Problematic):**
1. **Arrives** via Google search "automatización citas salón"
2. **Confused** by landing page - too much text, unclear value prop
3. **Overwhelmed** by technical jargon and feature lists
4. **Frustrated** by slow loading, especially on mobile
5. **Abandons** without understanding how Boreas helps her specific business

**User Journey - Desired (Optimized):**
1. **Arrives** via Google search "automatización citas salón"
2. **Immediately sees** clear headline: "Automatiza las citas de tu salón con WhatsApp"
3. **Understands value** through simple visual: before/after scenario
4. **Sees proof** through specific salon testimonial (Carmen's story)
5. **Takes action** via simple form: "Quiero automatizar mi salón"

### Secondary Persona: Restaurant Owner (Carlos)
**Background:** Family restaurant, wants to automate reservations but worried about complexity

**Pain Points:**
- Fears technology will be too complicated
- Needs proof it works for restaurants specifically
- Limited budget, wants clear pricing

**Success Criteria:**
- Finds restaurant-specific case study within 10 seconds
- Understands pricing and ROI in 30 seconds
- Completes contact form in under 60 seconds

## Requirements

### Functional Requirements

#### F1: Simplified Navigation & Information Architecture
- **Hero Section Redesign**
  - Clear value proposition headline specific to business type
  - Visual before/after comparison (manual vs automated booking)
  - Single prominent CTA: "Automatiza Tu Negocio"

- **Business-Specific Landing Paths**
  - Dynamic content based on URL params (?type=salon, ?type=restaurant)
  - Tailored headlines, testimonials, and use cases per business type
  - Contextual CTAs ("Automatiza tu salón", "Automatiza tu restaurante")

#### F2: Streamlined Conversion Flow
- **Smart Lead Capture Form**
  - Progressive disclosure: Start with business type, then details
  - Pre-filled examples based on business type
  - WhatsApp integration for immediate contact
  - Maximum 3 fields initially: Business Type, Name, Phone

- **Social Proof Integration**
  - Customer logos prominently displayed
  - Video testimonials (30-second max)
  - ROI metrics: "Carmen aumentó sus citas 40% en 2 semanas"

#### F3: Content Simplification
- **Remove Technical Jargon**
  - Replace "API integration" with "Conecta con tu calendario"
  - Replace "workflow automation" with "Responde automáticamente"
  - Use benefits, not features language

- **Scannable Content Structure**
  - Bullet points instead of paragraphs
  - Visual icons for each benefit
  - Maximum 7 words per headline (cognitive load theory)

### Non-Functional Requirements

#### NF1: Performance Optimization
- **Core Web Vitals Targets**
  - Largest Contentful Paint (LCP): <2.5 seconds
  - First Input Delay (FID): <100 milliseconds
  - Cumulative Layout Shift (CLS): <0.1
  - Google PageSpeed Score: 90+ mobile and desktop

- **Technical Implementation**
  - Image optimization: WebP format, lazy loading
  - Code splitting: Load only critical CSS/JS initially
  - CDN implementation for static assets
  - Database query optimization for testimonials/metrics

#### NF2: Mobile-First Responsiveness
- **Mobile Performance Priority**
  - 90% of small business owners browse on mobile
  - Touch-optimized CTAs (minimum 44px height)
  - Thumb-friendly navigation
  - Readable without zooming

#### NF3: SEO Optimization
- **Technical SEO**
  - Schema markup for business services
  - Meta descriptions optimized for local business searches
  - Structured data for testimonials and reviews
  - Canonical URLs for business-type variations

#### NF4: Accessibility Compliance
- **WCAG 2.1 AA Standards**
  - Color contrast ratios >4.5:1
  - Alt text for all images
  - Keyboard navigation support
  - Screen reader compatibility

## Success Criteria

### Primary Metrics (30-60 days post-launch)

**Conversion Rate Improvement**
- Current baseline: ~2% (assumed from industry standards)
- Target: 3.5% (75% improvement)
- Measurement: Google Analytics conversion tracking

**Page Speed Score**
- Current: <60 (estimated based on Next.js default)
- Target: 90+ on both mobile and desktop
- Measurement: Google PageSpeed Insights, daily monitoring

### Secondary Metrics

**User Engagement**
- Time on page: Increase from ~45s to 90s
- Bounce rate: Decrease from ~70% to <50%
- Form completion rate: Increase from ~15% to 35%

**SEO Impact**
- Organic traffic increase: 25% within 90 days
- Ranking improvement for "automatización WhatsApp [business type]"
- Click-through rate from SERP: +20%

**Business Impact**
- Lead quality score: Maintain current levels while increasing volume
- Cost per lead: Reduce by 30% through organic improvement
- Sales conversion from leads: Maintain >25% current rate

### Success Validation Methods

- **A/B Testing:** 50/50 split for 2 weeks minimum
- **User Testing:** 10 target persona interviews pre/post
- **Analytics Tracking:** Daily Core Web Vitals monitoring
- **Heat Mapping:** Hotjar implementation for user behavior analysis

## Constraints & Assumptions

### Technical Constraints
- **Current Tech Stack:** Next.js + Supabase must remain
- **Development Timeline:** Must complete before month-end for marketing campaign
- **Resource Limitation:** Single developer (Francisco) + Claude assistance
- **Budget Constraint:** $0 budget - use only free tools/services

### Business Constraints
- **Brand Guidelines:** Maintain current color scheme and logo
- **Legal Requirements:** Must include privacy policy link, GDPR compliance
- **Content Approval:** All testimonials must have written customer consent
- **Deployment Timeline:** Cannot disrupt current traffic during business hours

### Key Assumptions
- **User Behavior:** Small business owners prefer simple, visual explanations over detailed feature lists
- **Market Readiness:** Target market is ready for WhatsApp automation (validated through competitor analysis)
- **Technical Capability:** Current Supabase setup can handle 5x traffic increase
- **Content Availability:** Existing customer testimonials can be reformatted for new design

## Out of Scope

### Explicitly NOT Included in This PRD

**Backend Changes**
- No database schema modifications
- No new API endpoints creation
- No Supabase configuration changes
- No payment processing integration

**Advanced Features**
- Multi-language support (Spanish-only for now)
- Advanced analytics dashboard
- Custom domain setup
- Integration with external CRM systems

**Content Creation**
- New customer case study development
- Professional photography/videography
- Copywriting for entirely new service offerings
- Blog content or additional pages

**Marketing Features**
- Email marketing automation setup
- Social media integration
- Paid advertising landing page variants
- Lead nurturing workflow creation

### Future Consideration Items
- Multi-language support (Phase 2)
- Advanced A/B testing platform integration
- Customer portal integration
- Mobile app companion

## Dependencies

### External Dependencies

**Google Services**
- PageSpeed Insights API for performance monitoring
- Google Analytics for conversion tracking
- Google Search Console for SEO validation

**Third-Party Tools**
- Hotjar or similar for user behavior analysis (free tier)
- Lighthouse CI for automated performance testing
- WebPageTest for detailed performance analysis

### Internal Dependencies

**Content Dependencies**
- Customer testimonials (Carmen, Miguel, Patricia) - formatted quotes and photos
- Business metrics from existing clients
- Updated value proposition copy approved by Francisco
- Legal compliance text (privacy policy, terms)

**Technical Dependencies**
- Current .env configurations remain stable
- Supabase connection maintains current performance
- Domain and hosting setup remains unchanged
- SSL certificate and security configurations maintained

### Team Dependencies

**Development Execution**
- Francisco: Frontend development, performance optimization
- Claude: Code review, testing strategy, documentation
- Customer validation: 3 existing clients for testimonial updates

**Timeline Dependencies**
- Week 1: UX redesign and content optimization
- Week 2: Performance optimization implementation
- Week 3: Testing, validation, and deployment
- Week 4: Monitoring and iterative improvements

## Risk Assessment

### High Risk Items

**Performance Target Risk**
- Risk: Achieving 90+ PageSpeed score may require significant architecture changes
- Mitigation: Start with low-hanging fruit (image optimization, code splitting)
- Contingency: Accept 80+ score if 90+ requires backend changes

**Conversion Rate Risk**
- Risk: UX changes might initially decrease conversions during user adaptation
- Mitigation: Implement gradual rollout, A/B testing
- Contingency: Quick rollback mechanism ready

### Medium Risk Items

**Content Quality Risk**
- Risk: Simplified content might lose important technical credibility
- Mitigation: Maintain technical proof points in testimonials and case studies

**Timeline Risk**
- Risk: Month-end deadline might pressure quality
- Mitigation: Define MVP vs nice-to-have features clearly

## Implementation Approach

### Phase 1: Foundation (Week 1)
- UX audit and wireframe creation
- Content simplification and business-type personalization
- Basic performance optimization (image optimization)

### Phase 2: Development (Week 2)
- Component redesign and responsive implementation
- Advanced performance optimization
- Analytics and tracking setup

### Phase 3: Validation (Week 3)
- User testing with target personas
- Performance testing and optimization
- A/B testing setup

### Phase 4: Launch & Monitor (Week 4)
- Gradual rollout with monitoring
- Performance tracking and adjustments
- Success metrics validation

---

**Next Steps:**
1. Stakeholder review and approval
2. Epic decomposition and task breakdown
3. Development environment setup
4. Baseline metrics establishment

**Ready for Epic Creation:** This PRD is complete and ready for technical decomposition via `/oden:epic-decompose landing-optimizations`