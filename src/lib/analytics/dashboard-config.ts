/**
 * Analytics Dashboard Configuration for Boreas
 * Defines dashboards, funnels, and insights for PostHog
 */

export interface DashboardItem {
  id: string
  name: string
  type: 'insight' | 'funnel' | 'retention' | 'trends' | 'paths'
  query: Record<string, any>
  description?: string
  tags?: string[]
}

export interface Dashboard {
  name: string
  description: string
  tags: string[]
  items: DashboardItem[]
}

/**
 * Main business dashboard for Boreas B2B analytics
 */
export const mainBusinessDashboard: Dashboard = {
  name: 'Boreas B2B Performance Dashboard',
  description: 'Key metrics for small business automation platform performance',
  tags: ['business', 'conversion', 'b2b'],
  items: [
    // Conversion Funnel
    {
      id: 'main_conversion_funnel',
      name: 'B2B Conversion Funnel',
      type: 'funnel',
      query: {
        series: [
          { event: '$pageview', name: 'Landing Page Visit' },
          { event: 'scroll_depth_50', name: 'Engaged (50% scroll)' },
          { event: 'features_cta_clicked', name: 'Explored Features' },
          { event: 'contact_form_started', name: 'Started Contact Form' },
          { event: 'contact_form_submitted', name: 'Submitted Contact Form' },
          { event: 'consultation_scheduled', name: 'Scheduled Consultation' }
        ],
        interval: 'day',
        date_range: '-30d',
        breakdown_by: 'business_type'
      },
      description: 'Track the complete B2B customer journey from awareness to consultation'
    },

    // Business Type Performance
    {
      id: 'business_type_conversion',
      name: 'Conversion by Business Type',
      type: 'trends',
      query: {
        series: [
          { event: 'contact_form_submitted' }
        ],
        breakdown_by: 'business_type',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Which business types convert best (salon, restaurant, clinic)'
    },

    // Traffic Sources
    {
      id: 'traffic_sources',
      name: 'Traffic Sources Performance',
      type: 'trends',
      query: {
        series: [
          { event: '$pageview' }
        ],
        breakdown_by: '$initial_utm_source',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Track which channels drive the most qualified traffic'
    },

    // Page Performance
    {
      id: 'page_performance',
      name: 'Page Load Performance',
      type: 'trends',
      query: {
        series: [
          { event: 'performance_metric', math: 'avg' }
        ],
        filter: {
          properties: [
            { key: 'metric_name', operator: 'exact', value: 'page_load_time' }
          ]
        },
        breakdown_by: 'url',
        date_range: '-7d',
        interval: 'hour'
      },
      description: 'Monitor page load times across different sections'
    },

    // Core Web Vitals
    {
      id: 'core_web_vitals',
      name: 'Core Web Vitals',
      type: 'trends',
      query: {
        series: [
          {
            event: 'performance_metric',
            math: 'p75',
            name: 'LCP (75th percentile)'
          }
        ],
        filter: {
          properties: [
            { key: 'metric_name', operator: 'exact', value: 'LCP' }
          ]
        },
        date_range: '-7d',
        interval: 'hour'
      },
      description: 'Track Core Web Vitals for user experience optimization'
    },

    // Feature Engagement
    {
      id: 'feature_engagement',
      name: 'Feature Section Engagement',
      type: 'trends',
      query: {
        series: [
          { event: 'section_viewed', name: 'Section Views' },
          { event: 'features_cta_clicked', name: 'CTA Clicks' }
        ],
        filter: {
          properties: [
            { key: 'section_name', operator: 'exact', value: 'features' }
          ]
        },
        date_range: '-30d',
        interval: 'day'
      },
      description: 'How users engage with the features section'
    },

    // Case Study Impact
    {
      id: 'case_study_impact',
      name: 'Case Study Impact on Conversions',
      type: 'funnel',
      query: {
        series: [
          { event: 'case_study_viewed', name: 'Viewed Case Study' },
          { event: 'contact_form_started', name: 'Started Contact Form' },
          { event: 'contact_form_submitted', name: 'Submitted Form' }
        ],
        interval: 'day',
        date_range: '-30d'
      },
      description: 'Do case studies improve conversion rates?'
    },

    // Mobile vs Desktop Performance
    {
      id: 'device_performance',
      name: 'Mobile vs Desktop Conversion',
      type: 'trends',
      query: {
        series: [
          { event: 'contact_form_submitted' }
        ],
        breakdown_by: '$device_type',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Compare conversion rates across device types'
    },

    // Time-based Engagement
    {
      id: 'engagement_depth',
      name: 'User Engagement Depth',
      type: 'trends',
      query: {
        series: [
          { event: 'scroll_depth_25', name: '25% Scroll' },
          { event: 'scroll_depth_50', name: '50% Scroll' },
          { event: 'scroll_depth_75', name: '75% Scroll' },
          { event: 'time_on_page_60s', name: '60s+ Time' },
          { event: 'time_on_page_120s', name: '120s+ Time' }
        ],
        date_range: '-14d',
        interval: 'day'
      },
      description: 'Track how deeply users engage with content'
    },

    // API Performance
    {
      id: 'api_performance',
      name: 'API Response Times',
      type: 'trends',
      query: {
        series: [
          { event: 'api_performance', math: 'avg' }
        ],
        breakdown_by: 'endpoint',
        date_range: '-7d',
        interval: 'hour'
      },
      description: 'Monitor API performance and identify bottlenecks'
    },

    // Error Tracking
    {
      id: 'error_tracking',
      name: 'Frontend Errors',
      type: 'trends',
      query: {
        series: [
          { event: 'javascript_error', math: 'total' },
          { event: 'promise_rejection', math: 'total' },
          { event: 'api_error', math: 'total' }
        ],
        date_range: '-7d',
        interval: 'day'
      },
      description: 'Track and monitor frontend errors'
    }
  ]
}

/**
 * Marketing dashboard for campaign performance
 */
export const marketingDashboard: Dashboard = {
  name: 'Marketing Campaign Performance',
  description: 'Track marketing campaigns and channel effectiveness',
  tags: ['marketing', 'campaigns', 'utm'],
  items: [
    // UTM Campaign Performance
    {
      id: 'utm_campaigns',
      name: 'Campaign Performance',
      type: 'trends',
      query: {
        series: [
          { event: '$pageview', name: 'Traffic' },
          { event: 'contact_form_submitted', name: 'Conversions' }
        ],
        breakdown_by: '$initial_utm_campaign',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Track performance of individual marketing campaigns'
    },

    // Channel Attribution
    {
      id: 'channel_attribution',
      name: 'Channel Attribution',
      type: 'funnel',
      query: {
        series: [
          { event: '$pageview' },
          { event: 'hero_cta_clicked' },
          { event: 'contact_form_submitted' }
        ],
        breakdown_by: '$initial_utm_medium',
        interval: 'day',
        date_range: '-30d'
      },
      description: 'Which channels drive the highest quality leads'
    },

    // Content Performance
    {
      id: 'content_performance',
      name: 'Content Engagement',
      type: 'trends',
      query: {
        series: [
          { event: 'section_viewed' }
        ],
        breakdown_by: 'section_name',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Which content sections perform best'
    },

    // Referral Sources
    {
      id: 'referral_sources',
      name: 'Referral Traffic',
      type: 'trends',
      query: {
        series: [
          { event: '$pageview' }
        ],
        breakdown_by: '$initial_referring_domain',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Track traffic from referral sources'
    }
  ]
}

/**
 * Product dashboard for feature usage and UX
 */
export const productDashboard: Dashboard = {
  name: 'Product & UX Analytics',
  description: 'User experience and product feature performance',
  tags: ['product', 'ux', 'features'],
  items: [
    // Feature Usage Paths
    {
      id: 'user_paths',
      name: 'User Journey Paths',
      type: 'paths',
      query: {
        start_point: '$pageview',
        path_type: 'event',
        date_range: '-14d'
      },
      description: 'How users navigate through the site'
    },

    // CTA Performance
    {
      id: 'cta_performance',
      name: 'CTA Performance Comparison',
      type: 'trends',
      query: {
        series: [
          { event: 'hero_cta_clicked', name: 'Hero CTA' },
          { event: 'features_cta_clicked', name: 'Features CTA' },
          { event: 'pricing_cta_clicked', name: 'Pricing CTA' }
        ],
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Compare performance of different CTAs'
    },

    // Form Analytics
    {
      id: 'form_analytics',
      name: 'Contact Form Funnel',
      type: 'funnel',
      query: {
        series: [
          { event: 'contact_form_started' },
          { event: 'form_field_focused' },
          { event: 'contact_form_submitted' }
        ],
        interval: 'day',
        date_range: '-30d'
      },
      description: 'Analyze contact form completion rates'
    },

    // Business Type Selection
    {
      id: 'business_type_selection',
      name: 'Business Type Interest',
      type: 'trends',
      query: {
        series: [
          { event: 'business_type_selected' }
        ],
        breakdown_by: 'business_type',
        date_range: '-30d',
        interval: 'day'
      },
      description: 'Which business types show most interest'
    }
  ]
}

/**
 * Technical dashboard for performance monitoring
 */
export const technicalDashboard: Dashboard = {
  name: 'Technical Performance Monitoring',
  description: 'System performance, errors, and technical metrics',
  tags: ['technical', 'performance', 'monitoring'],
  items: [
    // Core Web Vitals Detailed
    {
      id: 'detailed_web_vitals',
      name: 'Core Web Vitals Breakdown',
      type: 'trends',
      query: {
        series: [
          { event: 'performance_metric', math: 'p75' }
        ],
        breakdown_by: 'metric_name',
        filter: {
          properties: [
            {
              key: 'metric_name',
              operator: 'in',
              value: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB']
            }
          ]
        },
        date_range: '-7d',
        interval: 'hour'
      },
      description: 'Detailed Core Web Vitals monitoring'
    },

    // API Error Rate
    {
      id: 'api_error_rate',
      name: 'API Error Rate',
      type: 'trends',
      query: {
        series: [
          { event: 'api_error', math: 'total' },
          { event: 'api_performance', math: 'total' }
        ],
        date_range: '-7d',
        interval: 'hour'
      },
      description: 'Track API success/failure rates'
    },

    // Performance by Connection Type
    {
      id: 'performance_by_connection',
      name: 'Performance by Connection Type',
      type: 'trends',
      query: {
        series: [
          { event: 'performance_metric', math: 'avg' }
        ],
        breakdown_by: 'connection_type',
        filter: {
          properties: [
            { key: 'metric_name', operator: 'exact', value: 'page_load_time' }
          ]
        },
        date_range: '-7d',
        interval: 'day'
      },
      description: 'How performance varies by connection speed'
    },

    // Browser Performance
    {
      id: 'browser_performance',
      name: 'Performance by Browser',
      type: 'trends',
      query: {
        series: [
          { event: 'performance_metric', math: 'p75' }
        ],
        breakdown_by: '$browser',
        filter: {
          properties: [
            { key: 'metric_name', operator: 'exact', value: 'LCP' }
          ]
        },
        date_range: '-14d',
        interval: 'day'
      },
      description: 'Compare performance across different browsers'
    }
  ]
}

/**
 * All available dashboards
 */
export const allDashboards: Dashboard[] = [
  mainBusinessDashboard,
  marketingDashboard,
  productDashboard,
  technicalDashboard,
]

/**
 * Dashboard creation utility for PostHog API
 */
export const createDashboardConfig = (dashboard: Dashboard) => {
  return {
    name: dashboard.name,
    description: dashboard.description,
    tags: dashboard.tags,
    items: dashboard.items.map(item => ({
      name: item.name,
      description: item.description,
      tags: item.tags || [],
      filters: item.query,
      type: item.type,
    }))
  }
}

/**
 * Key metrics configuration for alerts
 */
export const alertMetrics = {
  // Conversion rate thresholds
  CONVERSION_RATE_LOW: 2.0, // Alert if < 2% conversion rate

  // Performance thresholds
  PAGE_LOAD_HIGH: 4000, // Alert if page load > 4s
  API_ERROR_RATE_HIGH: 5.0, // Alert if API error rate > 5%

  // Engagement thresholds
  BOUNCE_RATE_HIGH: 70.0, // Alert if bounce rate > 70%
  SESSION_DURATION_LOW: 30, // Alert if avg session < 30s

  // Technical thresholds
  JAVASCRIPT_ERROR_RATE_HIGH: 1.0, // Alert if JS error rate > 1%
  CLS_POOR: 0.25, // Alert if CLS > 0.25
}

/**
 * Predefined segments for analysis
 */
export const userSegments = {
  highValueVisitors: {
    name: 'High Value Visitors',
    criteria: {
      properties: [
        { key: 'scroll_depth', operator: 'gte', value: 75 },
        { key: 'time_on_page', operator: 'gte', value: 120 }
      ]
    }
  },

  businessTypeLeads: {
    name: 'Business Type Leads',
    criteria: {
      events: [
        { event: 'business_type_selected' },
        { event: 'contact_form_started' }
      ]
    }
  },

  mobileUsers: {
    name: 'Mobile Users',
    criteria: {
      properties: [
        { key: '$device_type', operator: 'exact', value: 'Mobile' }
      ]
    }
  },

  returnVisitors: {
    name: 'Return Visitors',
    criteria: {
      properties: [
        { key: '$session_count', operator: 'gte', value: 2 }
      ]
    }
  }
}