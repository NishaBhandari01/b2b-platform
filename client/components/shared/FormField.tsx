interface FormFieldProps {
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          error ? 'border-red-500' : 'border-input'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface SelectFieldProps {
  label: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          error ? 'border-red-500' : 'border-input'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface TextAreaFieldProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

export function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
          error ? 'border-red-500' : 'border-input'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
