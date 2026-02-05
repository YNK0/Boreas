---
name: landing-optimizations
status: backlog
created: 2026-02-05T06:26:05Z
progress: 0%
prd: .claude/prds/landing-optimizations.md
github: https://github.com/YNK0/Boreas/issues/1
---

# Epic: Landing Page Optimizations

## Overview

Transform Boreas landing page into a high-converting, performant B2B lead generation engine. Focus on UX simplification and Core Web Vitals optimization to achieve 90+ PageSpeed score and 75% conversion rate improvement.

**Technical Strategy:** Leverage existing Next.js architecture with component optimization, image performance enhancements, and business-type personalization without backend changes.

## Architecture Decisions

### Frontend Architecture
- **Component Optimization:** Refactor existing React components for performance
- **Dynamic Content:** URL-based business type personalization (?type=salon)
- **Performance First:** Code splitting, lazy loading, and image optimization
- **Mobile-First:** Responsive design with thumb-friendly interactions

### Technology Choices
- **Keep Current Stack:** Next.js 15 + TypeScript + Tailwind CSS
- **Image Optimization:** Next.js Image component + WebP conversion
- **Code Splitting:** Dynamic imports for non-critical components
- **Analytics:** Google Analytics 4 + PostHog (free tier)
- **Testing:** Lighthouse CI for automated performance monitoring

### Design Patterns
- **Progressive Disclosure:** Simplified forms with conditional fields
- **Component Composition:** Reusable business-type variants
- **Performance Budgets:** 150KB critical path, <2.5s LCP
- **Accessibility:** WCAG 2.1 AA compliance

## Technical Approach

### Frontend Components

**Hero Section Enhancement**
- Dynamic headlines based on business type URL params
- Visual before/after automation scenarios
- Single prominent CTA with business-specific copy

**Form Optimization**
- Progressive contact form (business type → details)
- WhatsApp integration for immediate contact
- Client-side validation with error handling

**Performance Components**
- Lazy-loaded testimonial videos
- Optimized image gallery for case studies
- Code-split FAQ section

### Backend Services (Minimal Changes)
- **Analytics Endpoints:** Existing `/api/contact` route enhancement
- **Database:** Use existing leads table with utm tracking
- **No Schema Changes:** Leverage current Supabase structure

### Infrastructure
- **Current Setup:** Maintain Vercel deployment
- **CDN:** Leverage Vercel's edge network
- **Monitoring:** Implement Lighthouse CI in GitHub Actions
- **Caching:** Static generation for business-type variants

## Implementation Strategy

### Phase 1: Performance Foundation (Tasks 1-3)
- Image optimization and WebP conversion
- Code splitting for non-critical components
- Core Web Vitals measurement setup

### Phase 2: UX Enhancement (Tasks 4-6)
- Hero section redesign with business-type personalization
- Contact form simplification and optimization
- Content restructuring for scanability

### Phase 3: Validation & Launch (Tasks 7-8)
- A/B testing setup and monitoring
- Performance validation and final optimizations

### Risk Mitigation
- **Progressive Enhancement:** All changes backward compatible
- **Rollback Strategy:** Feature flags for easy revert
- **Performance Budget:** Automated checks prevent regression

## Task Breakdown Preview

High-level task categories that will be created:
- [ ] **Performance Setup:** Image optimization, code splitting, monitoring
- [ ] **Hero Section Redesign:** Dynamic content, business-type personalization
- [ ] **Form Optimization:** Progressive disclosure, validation, WhatsApp integration
- [ ] **Content Restructuring:** Scannable format, visual hierarchy
- [ ] **Case Studies Enhancement:** Business-specific testimonials and metrics
- [ ] **Mobile Optimization:** Touch interactions, responsive improvements
- [ ] **Analytics Implementation:** Conversion tracking, user behavior monitoring
- [ ] **Testing & Validation:** A/B testing, performance monitoring, launch

## Dependencies

### External Dependencies
- **Google PageSpeed Insights API:** For automated performance monitoring
- **WhatsApp Business API:** For form integration (nice-to-have)
- **Customer Assets:** Updated testimonials and case study photos

### Internal Dependencies
- **Design Approval:** Francisco approval for UX changes
- **Content Review:** Business-specific copy validation
- **Legal Compliance:** Privacy policy updates for enhanced tracking

### Prerequisites
- Current Supabase configuration remains stable
- Existing customer testimonials can be reformatted
- Domain and SSL configuration unchanged

## Success Criteria (Technical)

### Performance Benchmarks
- **Google PageSpeed Score:** 90+ (mobile and desktop)
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

### Conversion Metrics
- **Form Completion Rate:** +35% improvement
- **Time to First CTA Interaction:** <10 seconds
- **Bounce Rate:** Reduce to <50%

### Quality Gates
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile Performance:** Same score as desktop
- **SEO:** Maintain current ranking positions
- **Cross-browser:** Chrome, Safari, Firefox compatibility

## Estimated Effort

### Overall Timeline
- **Total Duration:** 3 weeks (15 business days)
- **Parallel Execution:** 4-6 tasks can run simultaneously
- **Critical Path:** Performance setup → UX redesign → Testing

### Resource Requirements
- **Development:** 1 developer (Francisco) + Claude assistance
- **Design:** Leverage existing brand guidelines
- **Content:** Use existing customer testimonials
- **Testing:** Automated + manual validation

### Task Effort Breakdown
- **Performance Tasks:** 5-8 hours each (parallelizable)
- **UX Enhancement:** 6-10 hours each (some dependencies)
- **Testing/Validation:** 4-6 hours each (final phase)
- **Total Estimated Hours:** 45-60 hours

### Critical Path Items
1. **Performance monitoring setup** (blocks validation)
2. **Hero section redesign** (blocks other UX work)
3. **Form optimization** (blocks conversion tracking)
4. **Analytics implementation** (blocks A/B testing)

## Risk Assessment

### Technical Risks
- **Performance Target Risk:** 90+ PageSpeed score may require aggressive optimization
- **Browser Compatibility:** Advanced features might not work in older browsers
- **Conversion Impact Risk:** UX changes might initially confuse existing users

### Mitigation Strategies
- **Progressive Enhancement:** Core functionality works without JavaScript
- **Feature Detection:** Fallbacks for older browsers
- **Gradual Rollout:** A/B testing with easy rollback

### Contingency Plans
- **Performance Fallback:** Accept 80+ score if 90+ requires major changes
- **UX Revert:** Quick rollback mechanism for conversion drops
- **Timeline Buffer:** 20% buffer built into estimates

## Tasks Created
- [ ] #2 - performance-monitoring-setup (parallel: )
- [ ] #3 - image-optimization-webp (parallel: )
- [ ] #4 - code-splitting-lazy-loading (parallel: )
- [ ] #5 - hero-section-business-personalization (parallel: )
- [ ] #6 - contact-form-progressive-disclosure (parallel: )
- [ ] #7 - content-restructuring-scannable (parallel: )
- [ ] #8 - analytics-conversion-tracking (parallel: )
- [ ] #9 - ab-testing-performance-validation (parallel: )

Total tasks: 8
Parallel tasks: 0
Sequential tasks: 8
