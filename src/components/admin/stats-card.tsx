interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  testId?: string
}

export function StatsCard({ title, value, subtitle, testId }: StatsCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-6"
      data-testid={testId}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}
