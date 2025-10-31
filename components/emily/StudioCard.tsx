export default function StudioCard({
  title,
  subtitle,
  children,
  footer,
  className = '',
}: {
  title?: string
  subtitle?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="p-5 border-b">
          {title && <h3 className="font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
      {footer && <div className="p-5 border-t">{footer}</div>}
    </div>
  )
}
