'use client';

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { useLazyLoad } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  id?: string;
}

// Component for intersection-observer based lazy loading
export function LazySection({ children, fallback, className = '', id }: LazySectionProps) {
  const { ref, shouldLoad } = useLazyLoad();

  return (
    <div ref={ref} className={className} id={id}>
      {shouldLoad ? children : fallback}
    </div>
  );
}

// Higher-order component factory for creating lazy-loaded sections
export function createLazySection<T extends {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  LoadingComponent: ComponentType
) {
  const LazyComponent = lazy(importFn);

  return function LazyLoadedSection(props: T & { className?: string; id?: string }) {
    const { className = '', id, ...componentProps } = props;
    const { ref, shouldLoad } = useLazyLoad();

    return (
      <div ref={ref} className={className} id={id}>
        {shouldLoad ? (
          <Suspense fallback={<LoadingComponent />}>
            <LazyComponent {...(componentProps as T)} />
          </Suspense>
        ) : (
          <LoadingComponent />
        )}
      </div>
    );
  };
}

// Pre-configured lazy sections for the landing page
export const LazyCaseStudies = createLazySection(
  () => import('@/components/landing/case-studies'),
  () => (
    <div className="py-20 bg-white">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-2 rounded-xl p-6 bg-gray-50 animate-pulse">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
);

export const LazyTestimonials = createLazySection(
  () => import('@/components/landing/testimonials'),
  () => (
    <div className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 max-w-4xl mx-auto">
          <div className="text-center space-y-6 animate-pulse">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-4/5 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

export const LazyContactForm = createLazySection(
  () => import('@/components/landing/contact-form-section'),
  () => (
    <div className="py-20 bg-primary-600">
      <div className="container-boreas">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 animate-pulse">
          <div className="space-y-6">
            <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
);

export const LazyFAQ = createLazySection(
  () => import('@/components/landing/faq-section'),
  () => (
    <div className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
);