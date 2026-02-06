'use client';

interface SectionLoadingProps {
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function SectionLoading({ height = 'md', className = '' }: SectionLoadingProps) {
  const heightClasses = {
    sm: 'h-48',
    md: 'h-96',
    lg: 'h-[500px]',
    xl: 'h-[600px]'
  };

  return (
    <div className={`animate-pulse bg-gray-100 ${heightClasses[height]} ${className}`}>
      <div className="container-boreas h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto animate-spin border-2 border-gray-200 border-t-primary-600"></div>
          <div className="text-gray-500 text-sm">Cargando...</div>
        </div>
      </div>
    </div>
  );
}

// Specific loading components for different sections
export function TestimonialsLoading() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-4/5 mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/5 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesLoading() {
  return (
    <div className="py-20 bg-white">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-2 rounded-xl p-6 bg-gray-50">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
              </div>

              <div className="space-y-4 mb-6">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white p-3 rounded-lg">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded w-4 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded w-12 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="h-6 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactFormLoading() {
  return (
    <div className="py-20 bg-primary-600">
      <div className="container-boreas">
        <div className="text-center mb-12">
          <div className="h-10 bg-white/20 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQLoading() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}