'use client';

import { ReactNode } from 'react';

interface ScannableHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  gradient?: boolean;
  badge?: string;
  eyebrow?: string;
}

export function ScannableHeading({
  children,
  level = 2,
  className = '',
  gradient = false,
  badge,
  eyebrow
}: ScannableHeadingProps) {
  const baseClasses = "font-bold leading-tight tracking-tight";
  const sizeClasses = {
    1: "text-4xl md:text-5xl lg:text-6xl",
    2: "text-2xl md:text-3xl lg:text-4xl",
    3: "text-xl md:text-2xl",
    4: "text-lg md:text-xl"
  };

  const gradientClasses = gradient
    ? "text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"
    : "text-gray-900";

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div className="text-center mb-6">
      {eyebrow && (
        <div className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-2">
          {eyebrow}
        </div>
      )}

      {badge && (
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
          {badge}
        </div>
      )}

      <Tag className={`${baseClasses} ${sizeClasses[level]} ${gradientClasses} ${className}`}>
        {children}
      </Tag>
    </div>
  );
}

interface HighlightTextProps {
  children: ReactNode;
  color?: 'primary' | 'green' | 'blue' | 'orange' | 'purple';
  variant?: 'subtle' | 'bold' | 'underline';
  className?: string;
}

export function HighlightText({
  children,
  color = 'primary',
  variant = 'subtle',
  className = ''
}: HighlightTextProps) {
  const colorClasses = {
    primary: {
      subtle: 'bg-primary-100 text-primary-800',
      bold: 'bg-primary-600 text-white',
      underline: 'text-primary-600 border-b-2 border-primary-600'
    },
    green: {
      subtle: 'bg-green-100 text-green-800',
      bold: 'bg-green-600 text-white',
      underline: 'text-green-600 border-b-2 border-green-600'
    },
    blue: {
      subtle: 'bg-blue-100 text-blue-800',
      bold: 'bg-blue-600 text-white',
      underline: 'text-blue-600 border-b-2 border-blue-600'
    },
    orange: {
      subtle: 'bg-orange-100 text-orange-800',
      bold: 'bg-orange-600 text-white',
      underline: 'text-orange-600 border-b-2 border-orange-600'
    },
    purple: {
      subtle: 'bg-purple-100 text-purple-800',
      bold: 'bg-purple-600 text-white',
      underline: 'text-purple-600 border-b-2 border-purple-600'
    }
  };

  const baseClasses = variant === 'underline'
    ? 'font-semibold pb-1'
    : 'font-semibold px-2 py-1 rounded';

  return (
    <span className={`${baseClasses} ${colorClasses[color][variant]} ${className}`}>
      {children}
    </span>
  );
}

interface ScannableListProps {
  items: string[];
  icon?: 'check' | 'star' | 'arrow' | 'bullet';
  color?: 'primary' | 'green' | 'blue';
  className?: string;
}

export function ScannableList({ items, icon = 'check', color = 'green', className = '' }: ScannableListProps) {
  const iconComponents = {
    check: (color: string) => (
      <svg className={`w-4 h-4 text-${color}-600 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    star: (color: string) => (
      <svg className={`w-4 h-4 text-${color}-600 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    arrow: (color: string) => (
      <svg className={`w-4 h-4 text-${color}-600 flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    ),
    bullet: (color: string) => (
      <span className={`w-2 h-2 bg-${color}-600 rounded-full flex-shrink-0 mt-2`}></span>
    )
  };

  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          {iconComponents[icon](color)}
          <span className="text-gray-700 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface CalloutBoxProps {
  children: ReactNode;
  type?: 'info' | 'success' | 'warning' | 'tip';
  title?: string;
  icon?: ReactNode;
  className?: string;
}

export function CalloutBox({
  children,
  type = 'info',
  title,
  icon,
  className = ''
}: CalloutBoxProps) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    tip: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  const defaultIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    tip: '💡'
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${typeStyles[type]} ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-2">
          {icon || <span className="text-lg">{defaultIcons[type]}</span>}
          <h4 className="font-semibold">{title}</h4>
        </div>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

interface StatHighlightProps {
  number: string;
  label: string;
  description?: string;
  color?: 'primary' | 'green' | 'blue' | 'orange' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatHighlight({
  number,
  label,
  description,
  color = 'primary',
  size = 'md',
  className = ''
}: StatHighlightProps) {
  const colorClasses = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  };

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl'
  };

  return (
    <div className={`text-center ${className}`}>
      <div className={`font-bold ${sizeClasses[size]} ${colorClasses[color]} mb-1`}>
        {number}
      </div>
      <div className="text-gray-900 font-semibold text-sm md:text-base mb-1">
        {label}
      </div>
      {description && (
        <div className="text-gray-600 text-xs md:text-sm">
          {description}
        </div>
      )}
    </div>
  );
}

interface QuickScanSectionProps {
  title: string;
  items: {
    icon?: string | ReactNode;
    title: string;
    description: string;
    highlight?: string;
  }[];
  className?: string;
}

export function QuickScanSection({ title, items, className = '' }: QuickScanSectionProps) {
  return (
    <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
        {title}
      </h3>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">
              {typeof item.icon === 'string' ? item.icon : item.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {item.title}
                {item.highlight && (
                  <span className="ml-2 text-green-600 font-bold text-xs">
                    {item.highlight}
                  </span>
                )}
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SummaryBoxProps {
  title: string;
  points: string[];
  cta?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function SummaryBox({ title, points, cta, className = '' }: SummaryBoxProps) {
  return (
    <div className={`bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        {title}
      </h3>

      <div className="space-y-2 mb-6">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0 mt-2"></span>
            <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
          </div>
        ))}
      </div>

      {cta && (
        <div className="text-center">
          <a
            href={cta.href}
            className="btn-primary text-sm px-4 py-2 inline-flex items-center"
          >
            {cta.text}
          </a>
        </div>
      )}
    </div>
  );
}