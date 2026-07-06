import { Card } from '@/components/ui/card'

interface BarChartData {
  label: string
  value: number
}

interface BarChartProps {
  title: string
  data: BarChartData[]
  maxValue?: number
}

export function SimpleBarChart({ title, data, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value))

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.value}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface PieChartData {
  label: string
  value: number
  color: string
}

interface PieChartProps {
  title: string
  data: PieChartData[]
}

export function SimplePieChart({ title, data }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">{title}</h3>
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100
              const circumference = 2 * Math.PI * 45
              const offset = circumference - (percentage / 100) * circumference

              let cumulativePercentage = data
                .slice(0, idx)
                .reduce((sum, d) => sum + (d.value / total) * 100, 0)
              const angle = (cumulativePercentage / 100) * 360

              return (
                <circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform={`rotate(${angle} 50 50)`}
                  opacity="0.8"
                />
              )
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm">
                {item.label}: <span className="font-medium">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
