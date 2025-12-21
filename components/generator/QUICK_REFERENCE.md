# Website Generator - Quick Expansion Reference

## 🎯 5-Minute Expansion Checklist

### Adding a Simple Text Field
```typescript
// 1. FormData
myField: string

// 2. Initialize
myField: ''

// 3. UI
<input value={formData.myField} onChange={e => updateField('myField', e.target.value)} />
```

### Adding a Select/Dropdown
```typescript
// 1. Type
type MyOption = 'option1' | 'option2' | 'option3'

// 2. FormData
myOption: MyOption

// 3. Options array
const myOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
]

// 4. UI
<select value={formData.myOption} onChange={e => updateField('myOption', e.target.value)}>
  {myOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
</select>
```

### Adding Toggle/Checkbox
```typescript
// 1. FormData
myToggle: boolean

// 2. Initialize
myToggle: false

// 3. UI
<button onClick={() => updateField('myToggle', !formData.myToggle)}>
  {formData.myToggle ? 'Enabled' : 'Disabled'}
</button>
```

### Adding Tags/Keywords Array
```typescript
// 1. FormData
myTags: string[]

// 2. Initialize
myTags: []

// 3. State for input
const [tagInput, setTagInput] = useState('')

// 4. UI
<input value={tagInput} onChange={e => setTagInput(e.target.value)} />
<button onClick={() => { addArrayItem('myTags', tagInput); setTagInput('') }}>Add</button>
{formData.myTags.map((tag, i) => (
  <span key={i}>{tag} <button onClick={() => removeArrayItem('myTags', i)}>×</button></span>
))}
```

### Adding a New Section
```typescript
// Just add this - section management is automatic!
<div className="space-y-4">
  <SectionHeader title="My Section" section="mysection" icon={Star} />
  {expandedSections.has('mysection') && (
    <div className="space-y-4 pl-4">
      {/* Your fields here */}
    </div>
  )}
</div>
```

## 📋 Available Icons (from lucide-react)

Common ones already imported:
- `Globe, ShoppingCart, Image, Mail, Target, Users, Zap, Code, Sparkles, CheckCircle2, Layout, Palette`

To add more: `import { IconName } from 'lucide-react'`
Browse all: https://lucide.dev

## 🎨 CSS Class Patterns

### Active/Inactive Button
```tsx
className={`p-4 rounded-lg border-2 ${
  isActive 
    ? 'border-violet-500 bg-violet-500/20' 
    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
}`}
```

### Input Field
```tsx
className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
```

### Primary Button
```tsx
className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
```

### Tag/Chip
```tsx
className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm flex items-center gap-2"
```

## 🔧 Utility Functions Available

```typescript
// Update any field
updateField('fieldName', value)

// Toggle feature
toggleFeature('featureName')

// Array management
addArrayItem('arrayField', value)
removeArrayItem('arrayField', index)

// Section management (automatic via SectionHeader)
expandedSections.has('sectionName')
```

## 🎯 Common Patterns

### Multi-Select Buttons
```tsx
{options.map(option => (
  <button
    key={option.value}
    onClick={() => toggleArrayItem(option.value)}
    className={formData.array.includes(option.value) ? 'active' : 'inactive'}
  >
    <option.icon />
    {option.label}
  </button>
))}
```

### Grid Layout
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {/* Items */}
</div>
```

### Form Field with Label
```tsx
<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Label Text
  </label>
  <input ... />
</div>
```

## 📦 When to Use What

| Need | Solution |
|------|----------|
| Single choice | `<select>` or radio buttons |
| Multiple choices | Checkbox buttons or multi-select |
| Short text | `<input type="text">` |
| Long text | `<textarea>` |
| Yes/No | Toggle button or checkbox |
| Date | `<input type="date">` |
| Number | `<input type="number">` or slider |
| Color | `<input type="color">` |
| File | `<input type="file">` |
| Tags/Keywords | Array with add/remove |
| Complex objects | Object array with modal/form |

## 🚀 Files to Check

- **Main form**: `components/generator/WebsiteGeneratorForm.tsx`
- **Helper utils**: `components/generator/utils.ts`
- **Examples**: `components/generator/examples.tsx`
- **Guide**: `components/generator/README.md`
- **API**: `app/api/generator/create/route.ts`
- **Database**: `prisma/schema.prisma` (GeneratedSite model)

## 💡 Pro Tips

1. **Start with interface** - TypeScript will guide you
2. **Copy existing patterns** - Don't reinvent the wheel
3. **Test incrementally** - Add one field at a time
4. **Use defaults** - Pre-fill common choices
5. **Group logically** - Keep related fields in sections
6. **Validate early** - Add required checks before submit

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Field not updating | Check `updateField()` call |
| Type error | Add to FormData interface |
| UI not showing | Check section name in `has()` |
| Button not styled | Apply active/inactive classes |
| State not persisting | Check useState initialization |

## 📚 Quick Links

- Icons: https://lucide.dev
- Tailwind: https://tailwindcss.com/docs
- React useState: https://react.dev/reference/react/useState
- TypeScript: https://www.typescriptlang.org/docs/handbook/2/objects.html
