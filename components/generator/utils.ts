/**
 * Helper utilities and templates for expanding the Website Generator
 * 
 * These utilities make it easy to add new fields, sections, and features
 * without writing boilerplate code.
 */

import { useState } from 'react'

// ============================================
// TYPE HELPERS
// ============================================

/**
 * Generic option type for select/radio inputs
 */
export interface Option<T = string> {
  value: T
  label: string
  description?: string
  icon?: any
  disabled?: boolean
}

/**
 * Section configuration
 */
export interface SectionConfig {
  id: string
  title: string
  icon: any
  description?: string
  required?: boolean
}

// ============================================
// ARRAY FIELD UTILITIES
// ============================================

/**
 * Hook for managing array fields (keywords, tags, etc)
 * 
 * @example
 * const keywords = useArrayField<string>()
 * 
 * <input value={keywords.input} onChange={e => keywords.setInput(e.target.value)} />
 * <button onClick={keywords.add}>Add</button>
 * {keywords.items.map((item, i) => (
 *   <span key={i}>{item} <button onClick={() => keywords.remove(i)}>×</button></span>
 * ))}
 */
export function useArrayField<T = string>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [input, setInput] = useState<string>('')

  const add = (value?: T | string) => {
    const val = (value || input) as T
    if (val && String(val).trim()) {
      setItems([...items, val])
      setInput('')
    }
  }

  const remove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const update = (index: number, value: T) => {
    setItems(items.map((item, i) => i === index ? value : item))
  }

  const clear = () => {
    setItems([])
    setInput('')
  }

  return {
    items,
    setItems,
    input,
    setInput,
    add,
    remove,
    update,
    clear,
  }
}

// ============================================
// OBJECT ARRAY UTILITIES (for complex items like team members)
// ============================================

/**
 * Hook for managing arrays of objects
 * 
 * @example
 * interface TeamMember { name: string; role: string }
 * const team = useObjectArray<TeamMember>({ name: '', role: '' })
 * 
 * <button onClick={team.add}>Add Member</button>
 * {team.items.map((member, i) => (
 *   <div key={i}>
 *     <input value={member.name} onChange={e => team.updateField(i, 'name', e.target.value)} />
 *     <button onClick={() => team.remove(i)}>Remove</button>
 *   </div>
 * ))}
 */
export function useObjectArray<T extends Record<string, any>>(
  defaultItem: T,
  initialItems: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialItems)

  const add = (item?: Partial<T>) => {
    setItems([...items, { ...defaultItem, ...item } as T])
  }

  const remove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const update = (index: number, item: T) => {
    setItems(items.map((existing, i) => i === index ? item : existing))
  }

  const updateField = <K extends keyof T>(index: number, field: K, value: T[K]) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  return {
    items,
    setItems,
    add,
    remove,
    update,
    updateField,
  }
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validation rules for form fields
 */
export interface ValidationRule<T> {
  test: (value: T) => boolean
  message: string
}

/**
 * Validates a field against multiple rules
 */
export function validateField<T>(value: T, rules: ValidationRule<T>[]): string | null {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message
    }
  }
  return null
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    test: (value) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value != null
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    test: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    test: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  url: (message = 'Invalid URL'): ValidationRule<string> => ({
    test: (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    test: (value) => regex.test(value),
    message,
  }),
}

// ============================================
// SECTION MANAGEMENT
// ============================================

/**
 * Hook for managing collapsible sections
 * 
 * @example
 * const sections = useSections(['basic', 'advanced'])
 * 
 * <SectionHeader 
 *   title="Basic" 
 *   expanded={sections.isExpanded('basic')}
 *   onToggle={() => sections.toggle('basic')}
 * />
 */
export function useSections(initialExpanded: string[] = []) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(initialExpanded)
  )

  const toggle = (section: string) => {
    const newSet = new Set(expandedSections)
    if (newSet.has(section)) {
      newSet.delete(section)
    } else {
      newSet.add(section)
    }
    setExpandedSections(newSet)
  }

  const expand = (section: string) => {
    setExpandedSections(new Set([...expandedSections, section]))
  }

  const collapse = (section: string) => {
    const newSet = new Set(expandedSections)
    newSet.delete(section)
    setExpandedSections(newSet)
  }

  const expandAll = (sections: string[]) => {
    setExpandedSections(new Set(sections))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  const isExpanded = (section: string) => expandedSections.has(section)

  return {
    expandedSections,
    toggle,
    expand,
    collapse,
    expandAll,
    collapseAll,
    isExpanded,
  }
}

// ============================================
// OPTION GENERATORS
// ============================================

/**
 * Generate options from an array of strings
 */
export function createOptions<T extends string>(
  values: T[],
  labelFormatter?: (value: T) => string
): Option<T>[] {
  return values.map(value => ({
    value,
    label: labelFormatter ? labelFormatter(value) : value,
  }))
}

/**
 * Generate options from an enum
 */
export function enumToOptions<T extends Record<string, string>>(
  enumObj: T,
  labelFormatter?: (key: string) => string
): Option<string>[] {
  return Object.keys(enumObj).map(key => ({
    value: enumObj[key],
    label: labelFormatter ? labelFormatter(key) : key.replace(/_/g, ' '),
  }))
}

// ============================================
// FORM STATE UTILITIES
// ============================================

/**
 * Deep clone utility for form state
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if form has unsaved changes
 */
export function hasChanges<T extends Record<string, any>>(
  current: T,
  original: T
): boolean {
  return JSON.stringify(current) !== JSON.stringify(original)
}

/**
 * Reset form to initial state
 */
export function resetForm<T>(
  setFormData: (data: T) => void,
  initialData: T
) {
  setFormData(deepClone(initialData))
}

// ============================================
// FILE UPLOAD UTILITIES
// ============================================

export interface FileUploadResult {
  url: string
  filename: string
  size: number
  type: string
}

/**
 * Convert file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.startsWith(type))
}

// ============================================
// PRESET TEMPLATES
// ============================================

/**
 * Common color scheme presets
 */
export const colorPresets = {
  modern: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#0F172A',
    text: '#F8FAFC',
  },
  professional: {
    primary: '#1E40AF',
    secondary: '#059669',
    accent: '#7C3AED',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  vibrant: {
    primary: '#F59E0B',
    secondary: '#EF4444',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    text: '#111827',
  },
  minimal: {
    primary: '#000000',
    secondary: '#6B7280',
    accent: '#3B82F6',
    background: '#FFFFFF',
    text: '#000000',
  },
}

/**
 * Common font pairings
 */
export const fontPairings = [
  { heading: 'Inter', body: 'Inter' },
  { heading: 'Playfair Display', body: 'Source Sans Pro' },
  { heading: 'Montserrat', body: 'Open Sans' },
  { heading: 'Roboto', body: 'Roboto' },
  { heading: 'Poppins', body: 'Poppins' },
]

/**
 * Common animation durations
 */
export const animationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
}

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Export form data as JSON
 */
export function exportAsJSON<T>(data: T, filename = 'form-data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Import form data from JSON file
 */
export async function importFromJSON<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
