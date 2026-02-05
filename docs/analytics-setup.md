# Analytics & Performance Monitoring Setup

This document provides comprehensive instructions for using the PostHog analytics and performance monitoring system implemented in Boreas.

## Overview

The analytics system provides:

- **User Behavior Tracking**: Page views, clicks, form interactions, scroll depth
- **B2B Conversion Funnel**: Complete customer journey from awareness to consultation
- **Performance Monitoring**: Core Web Vitals, API response times, error tracking
- **GDPR Compliance**: Consent management and data privacy controls
- **Real-time Dashboards**: Business metrics, technical performance, marketing attribution

## Setup Instructions

### 1. Environment Configuration

Add the following variables to your `.env.local` file:

```env
# Required - PostHog Project Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PROJECT_API_KEY=phx_your_server_api_key_here

# Optional - Feature Toggles
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SESSION_RECORDING=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

### 2. PostHog Account Setup

1. **Create PostHog Account**: Sign up at [posthog.com](https://posthog.com)
2. **Create Project**: Set up a new project for Boreas
3. **Get API Keys**:
   - Project API Key: Found in Settings → Project API Key
   - Server API Key: Found in Settings → Project → API Keys
4. **Configure Project**:
   - Set timezone to Mexico/Central
   - Enable session recordings
   - Set up custom events (see Event Tracking section)

### 3. Dashboard Configuration

Import the predefined dashboards using the PostHog API or manually create them:

#### Business Dashboard
- B2B Conversion Funnel
- Business Type Performance
- Traffic Sources
- Lead Quality Metrics

#### Technical Dashboard
- Core Web Vitals Monitoring
- API Performance Metrics
- Error Tracking
- Performance by Device/Browser

#### Marketing Dashboard
- Campaign Performance (UTM tracking)
- Channel Attribution
- Content Engagement
- Referral Sources

## Event Tracking

### Automatic Events

The following events are tracked automatically:

```typescript
// Page Navigation
'$pageview' - Page visits
'$pageleave' - Page exits
'section_viewed' - When sections become visible

// User Engagement
'scroll_depth_25/50/75/100' - Scroll milestones
'time_on_page_30s/60s/120s' - Time on page milestones

// Performance Metrics
'performance_metric' - Core Web Vitals and custom metrics
'api_performance' - API response times
'javascript_error' - Frontend errors
```

### Manual Event Tracking

Use the analytics hooks in your components:

```tsx
import { useAnalytics, useCTATracking, useFormTracking } from '@/hooks/use-analytics'

function MyComponent() {
  const { track } = useAnalytics()
  const { trackCTAClick } = useCTATracking()
  const { trackFormSubmit } = useFormTracking()

  const handleCustomEvent = () => {
    track('custom_event_name', {
      property1: 'value1',
      property2: 'value2'
    })
  }

  const handleCTAClick = () => {
    trackCTAClick('hero', 'Get Started Now', 'above-fold')
  }

  return (
    // Your component JSX
  )
}
```

### Trackable Components

Use pre-built tracking components for common interactions:

```tsx
import {
  TrackableCTA,
  TrackableForm,
  TrackableLink,
  TrackablePhone,
  SectionTracker
} from '@/components/analytics/tracking-components'

// Trackable CTA Button
<TrackableCTA
  trackingType="hero"
  label="Get Started"
  position="hero-primary"
  className="btn-primary"
  onClick={handleClick}
>
  Get Started Now
</TrackableCTA>

// Trackable Form
<TrackableForm
  formType="contact"
  formId="hero-contact-form"
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</TrackableForm>

// Section Tracking
<SectionTracker sectionName="pricing">
  <PricingSection />
</SectionTracker>
```

## Performance Monitoring

### Core Web Vitals

The system automatically tracks:

- **LCP (Largest Contentful Paint)**: Page loading performance
- **FID (First Input Delay)**: Interactivity
- **CLS (Cumulative Layout Shift)**: Visual stability
- **FCP (First Contentful Paint)**: Initial loading
- **TTFB (Time to First Byte)**: Server response time

### API Performance

All API routes are automatically monitored:

```typescript
// Example: Monitored API route
import { createMonitoredAPIHandler } from '@/lib/analytics/api-middleware'

async function handleAPI(req: NextRequest) {
  // Your API logic here
}

export const POST = createMonitoredAPIHandler(handleAPI, '/api/endpoint-name')
```

### Custom Performance Tracking

Track custom performance metrics:

```typescript
import { performanceUtils } from '@/lib/analytics/performance-monitor'

// Monitor function performance
const monitoredFunction = performanceUtils.monitorFunction(
  myFunction,
  'custom_function_name'
)

// Record custom metrics
performanceUtils.recordCustomMetric('custom_metric', 1200, 'ms')

// Check performance health
const isHealthy = performanceUtils.isPerformanceHealthy()
```

## B2B Conversion Tracking

### Conversion Funnel Stages

1. **Awareness**: Landing page visit
2. **Interest**: Feature exploration, 50%+ scroll depth
3. **Consideration**: Case studies viewed, testimonials seen
4. **Intent**: Contact form started, demo requested
5. **Evaluation**: Form submitted, consultation scheduled
6. **Purchase**: Deal closed (tracked via CRM integration)

### Business Type Segmentation

Track different business types for targeted analysis:

```typescript
import { useBusinessTypeTracking } from '@/hooks/use-analytics'

function BusinessTypeSelector() {
  const { setBusinessType } = useBusinessTypeTracking()

  const handleSelection = (type: string) => {
    setBusinessType(type as BusinessType)
  }

  return (
    // Business type selector UI
  )
}
```

### Lead Quality Scoring

The system automatically calculates lead scores based on:

- Business type selected
- Engagement depth (scroll, time on page)
- UTM source quality
- Form completion
- Multiple touchpoints

## GDPR Compliance

### Consent Management

The system includes GDPR-compliant consent management:

```typescript
// Consent banner is automatically shown
// User consent is stored in localStorage
// Analytics tracking respects Do Not Track headers

// Manual consent control
window.dispatchEvent(new CustomEvent('analytics-consent-changed', {
  detail: { consent: true }
}))
```

### Data Privacy

- **No PII in Events**: Sensitive data is automatically masked
- **Session Recordings**: Input masking for passwords and sensitive fields
- **Data Retention**: Configure retention periods in PostHog
- **Opt-out Support**: Users can opt-out of tracking

## Monitoring & Alerts

### Performance Alerts

Set up alerts in PostHog for:

- Page load time > 4 seconds
- API error rate > 5%
- Core Web Vitals in "Poor" range
- JavaScript error rate > 1%

### Business Alerts

Monitor business metrics:

- Conversion rate drops below 2%
- Form abandonment rate > 70%
- High-value visitor count changes
- Campaign performance degradation

### Health Checks

Monitor system health at `/api/health`:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:45Z",
  "performance": {
    "averageResponseTime": 245,
    "errorRate": 0.5,
    "requestCount": 1250
  },
  "apiHealth": {
    "healthy": true,
    "metrics": {
      "averageResponseTime": 245,
      "errorRate": 0.5
    }
  }
}
```

## Debugging & Development

### Development Mode

In development mode:

```typescript
// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Analytics event:', eventName, properties)
}

// Test performance monitoring
import { ClientPerformanceMonitor } from '@/lib/analytics/performance-monitor'

const monitor = new ClientPerformanceMonitor((metric) => {
  console.log('Performance metric:', metric)
})
```

### Testing Analytics

```bash
# Test analytics endpoints
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'

# Check health endpoint
curl http://localhost:3000/api/health
```

## Common Issues & Solutions

### PostHog Not Loading

1. **Check API Key**: Verify `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. **Network Issues**: Ensure PostHog host is reachable
3. **Ad Blockers**: PostHog might be blocked by ad blockers

### Performance Impact

1. **Bundle Size**: PostHog adds ~50KB to bundle (acceptable for analytics)
2. **Performance**: Analytics code is loaded asynchronously
3. **Rate Limiting**: Events are batched and rate-limited automatically

### Missing Events

1. **Check Console**: Look for analytics errors in browser console
2. **Verify Hooks**: Ensure analytics hooks are properly used
3. **Component Mounting**: Events might fire before PostHog initializes

## Best Practices

### Event Naming

- Use descriptive, consistent event names
- Follow snake_case convention
- Include context properties
- Avoid PII in event properties

### Performance

- Use trackable components instead of manual tracking
- Batch events when possible
- Monitor bundle size impact
- Test on slow connections

### Privacy

- Always respect user consent
- Mask sensitive data
- Document data collection practices
- Provide opt-out mechanisms

### Maintenance

- Regularly review dashboard accuracy
- Update tracking for new features
- Monitor performance impact
- Clean up unused events

## Support & Resources

- **PostHog Documentation**: [docs.posthog.com](https://posthog.com/docs)
- **Analytics Configuration**: `src/lib/analytics/posthog-config.ts`
- **Performance Monitoring**: `src/lib/analytics/performance-monitor.ts`
- **Dashboard Config**: `src/lib/analytics/dashboard-config.ts`
- **Health Endpoint**: `/api/health`

For technical support, check the implementation files and PostHog community resources.