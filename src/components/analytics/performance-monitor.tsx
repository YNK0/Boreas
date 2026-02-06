'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

export function PerformanceMonitor() {
  const { track } = useAnalytics();

  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            track('performance_fcp', {
              value: entry.startTime,
              rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs_improvement' : 'poor'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        track('performance_lcp', {
          value: lastEntry.startTime,
          rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor',
          element: lastEntry.element?.tagName || 'unknown'
        });
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID) - via event timing
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime;
          track('performance_fid', {
            value: fid,
            rating: fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor',
            input_type: entry.name
          });
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }

        track('performance_cls', {
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Track JavaScript bundle sizes
      if ('PerformanceNavigationTiming' in window) {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        track('performance_navigation', {
          dom_content_loaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
          load_complete: navTiming.loadEventEnd - navTiming.loadEventStart,
          time_to_first_byte: navTiming.responseStart - navTiming.requestStart,
          dns_lookup: navTiming.domainLookupEnd - navTiming.domainLookupStart,
          tcp_connect: navTiming.connectEnd - navTiming.connectStart
        });
      }

      // Track resource timing for lazy-loaded chunks
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;

          // Track lazy-loaded JavaScript chunks
          if (resource.name.includes('static/chunks/') && resource.name.endsWith('.js')) {
            track('performance_chunk_load', {
              chunk_name: resource.name.split('/').pop()?.replace('.js', ''),
              load_time: resource.loadEventEnd - resource.loadEventStart,
              size: resource.transferSize || 0,
              cached: resource.transferSize === 0 ? true : false
            });
          }

          // Track image loading performance
          if (resource.initiatorType === 'img') {
            track('performance_image_load', {
              url: resource.name,
              load_time: resource.responseEnd - resource.requestStart,
              size: resource.transferSize || 0
            });
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      // Cleanup observers
      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, [track]);

  return null; // This component doesn't render anything
}

// Hook to measure component load times
export function useComponentLoadTime(componentName: string) {
  const { track } = useAnalytics();

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const loadTime = performance.now() - startTime;
      track('component_load_time', {
        component_name: componentName,
        load_time: loadTime,
        timestamp: Date.now()
      });
    };
  }, [componentName, track]);
}

// Performance budget monitor
export function PerformanceBudgetMonitor() {
  const { track } = useAnalytics();

  useEffect(() => {
    // Define performance budgets
    const budgets = {
      fcp: 1800, // ms
      lcp: 2500, // ms
      fid: 100,  // ms
      cls: 0.1,  // score
      total_js_size: 250 * 1024, // 250KB
      main_bundle_size: 150 * 1024, // 150KB
    };

    // Check bundle sizes
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let totalJSSize = 0;
        let mainBundleSize = 0;

        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;

          if (resource.name.endsWith('.js')) {
            totalJSSize += resource.transferSize || 0;

            // Identify main bundle (usually the largest JS file)
            if (resource.name.includes('main') || resource.name.includes('index')) {
              mainBundleSize = Math.max(mainBundleSize, resource.transferSize || 0);
            }
          }
        }

        // Track budget violations
        const violations = [];

        if (totalJSSize > budgets.total_js_size) {
          violations.push({
            metric: 'total_js_size',
            budget: budgets.total_js_size,
            actual: totalJSSize,
            violation_percentage: ((totalJSSize - budgets.total_js_size) / budgets.total_js_size) * 100
          });
        }

        if (mainBundleSize > budgets.main_bundle_size) {
          violations.push({
            metric: 'main_bundle_size',
            budget: budgets.main_bundle_size,
            actual: mainBundleSize,
            violation_percentage: ((mainBundleSize - budgets.main_bundle_size) / budgets.main_bundle_size) * 100
          });
        }

        if (violations.length > 0) {
          track('performance_budget_violation', {
            violations,
            total_js_size: totalJSSize,
            main_bundle_size: mainBundleSize,
            user_agent: navigator.userAgent,
            connection: (navigator as any).connection?.effectiveType || 'unknown'
          });
        } else {
          track('performance_budget_passed', {
            total_js_size: totalJSSize,
            main_bundle_size: mainBundleSize
          });
        }
      });

      observer.observe({ entryTypes: ['resource'] });

      return () => observer.disconnect();
    }
  }, [track]);

  return null;
}