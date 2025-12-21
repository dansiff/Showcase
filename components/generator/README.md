# Website Generator - Developer Guide

## 🎯 Understanding the Architecture

The generator uses a **modular, data-driven approach** where you define configurations that automatically generate UI and functionality.

## 📦 Core Concepts

### 1. FormData Interface (The Schema)
Located in `WebsiteGeneratorForm.tsx`, this TypeScript interface defines **all possible fields** the form can collect:

```typescript
interface FormData {
  // Each property becomes a form field or section
  businessName: string        // Simple text input
  siteType: SiteType[]       // Multi-select checkboxes
  features: {                // Nested object with toggles
    contact: boolean
    newsletter: boolean
  }
  brandKeywords: string[]    // Dynamic array (add/remove items)
}
```

**Key Pattern**: The interface structure determines how data is stored and validated.

### 2. Section System (Collapsible UI)
Sections are controlled by the `expandedSections` Set:

```typescript
const [expandedSections, setExpandedSections] = useState<Set<string>>(
  new Set(['basic']) // 'basic' section starts expanded
)
```

**Pattern**: Add section name to Set → section expands

### 3. Options Arrays (Configuration Data)
These arrays define choices shown to users:

```typescript
const siteTypeOptions = [
  { 
    value: 'business',      // Saved to database
    label: 'Business Site', // Shown to user
    icon: Globe,            // Visual element
    description: '...'      // Helper text
  }
]
```

**Pattern**: Add to array → automatically appears in UI

## 🔧 How to Add Features

### ✅ Adding a New Simple Field

**Step 1**: Add to `FormData` interface
```typescript
interface FormData {
  // ... existing fields
  projectTimeline: string  // NEW FIELD
}
```

**Step 2**: Initialize in `useState`
```typescript
const [formData, setFormData] = useState<FormData>({
  // ... existing initial values
  projectTimeline: '1-month'  // DEFAULT VALUE
})
```

**Step 3**: Add UI in a section
```tsx
<input
  type="text"
  value={formData.projectTimeline}
  onChange={e => updateField('projectTimeline', e.target.value)}
  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600..."
/>
```

### ✅ Adding a New Multi-Select Feature

**Step 1**: Define options array
```typescript
const advancedFeatures = [
  { key: 'multilingual', label: 'Multi-language', description: 'Support multiple languages' },
  { key: 'pwa', label: 'PWA', description: 'Progressive Web App' },
  { key: 'offline', label: 'Offline Mode', description: 'Work without internet' },
]
```

**Step 2**: Add to FormData features
```typescript
features: {
  // ... existing features
  multilingual: boolean
  pwa: boolean
  offline: boolean
}
```

**Step 3**: Initialize defaults
```typescript
features: {
  // ... existing
  multilingual: false,
  pwa: false,
  offline: false,
}
```

**Step 4**: Render in UI (auto-generates from array)
```tsx
{advancedFeatures.map(feature => (
  <button
    key={feature.key}
    onClick={() => toggleFeature(feature.key)}
    className={formData.features[feature.key] ? 'active' : 'inactive'}
  >
    {feature.label}
  </button>
))}
```

### ✅ Adding a New Section

**Step 1**: Create section UI
```tsx
{/* Advanced Options Section */}
<div className="space-y-4">
  <SectionHeader 
    title="Advanced Options" 
    section="advanced"  // Unique section ID
    icon={Sparkles}     // Icon from lucide-react
  />
  
  {expandedSections.has('advanced') && (
    <div className="space-y-4 pl-4">
      {/* Section content here */}
    </div>
  )}
</div>
```

**Step 2**: Section automatically toggles via `SectionHeader` component (no extra code needed!)

### ✅ Adding Dynamic Array Fields (Keywords, Tags, etc)

**Pattern Used**: State + Input + Display

```typescript
// 1. Add state for input
const [myTagInput, setMyTagInput] = useState('')

// 2. Add array to FormData
myTags: string[]

// 3. Initialize
myTags: []

// 4. UI Component
<div>
  <input
    value={myTagInput}
    onChange={e => setMyTagInput(e.target.value)}
    onKeyPress={e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        addArrayItem('myTags', myTagInput)
        setMyTagInput('')
      }
    }}
  />
  <button onClick={() => {
    addArrayItem('myTags', myTagInput)
    setMyTagInput('')
  }}>
    Add
  </button>
  
  {/* Display tags */}
  {formData.myTags.map((tag, i) => (
    <span key={i}>
      {tag}
      <button onClick={() => removeArrayItem('myTags', i)}>×</button>
    </span>
  ))}
</div>
```

## 🎨 Styling Patterns

### Active/Inactive States
```tsx
className={`p-4 rounded-lg border-2 transition ${
  isActive
    ? 'border-violet-500 bg-violet-500/20'  // Selected
    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'  // Not selected
}`}
```

### Form Inputs
```tsx
className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
```

### Buttons
```tsx
// Primary Action
className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"

// Secondary Action
className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
```

## 🔄 State Management Flow

```
User Interaction
      ↓
updateField() called
      ↓
setFormData() updates state
      ↓
React re-renders
      ↓
New value shown in UI
```

**Helper Function**:
```typescript
const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}
```

## 🎯 Common Expansion Scenarios

### Scenario 1: Add "Budget Range" Selector

```typescript
// 1. Add type
type BudgetRange = 'under-5k' | '5k-15k' | '15k-30k' | '30k-plus'

// 2. Add to FormData
budgetRange: BudgetRange

// 3. Initialize
budgetRange: '5k-15k'

// 4. Create options
const budgetOptions = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-30k', label: '$15,000 - $30,000' },
  { value: '30k-plus', label: '$30,000+' },
]

// 5. Render
<select 
  value={formData.budgetRange}
  onChange={e => updateField('budgetRange', e.target.value as BudgetRange)}
>
  {budgetOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>
```

### Scenario 2: Add "Team Members" Section

```typescript
// 1. Define team member type
interface TeamMember {
  name: string
  role: string
  bio?: string
  image?: string
}

// 2. Add to FormData
teamMembers: TeamMember[]

// 3. Initialize
teamMembers: []

// 4. Create add/remove functions
const addTeamMember = (member: TeamMember) => {
  updateField('teamMembers', [...formData.teamMembers, member])
}

const removeTeamMember = (index: number) => {
  updateField('teamMembers', formData.teamMembers.filter((_, i) => i !== index))
}

// 5. Create UI
<div>
  {formData.teamMembers.map((member, i) => (
    <div key={i}>
      <span>{member.name} - {member.role}</span>
      <button onClick={() => removeTeamMember(i)}>Remove</button>
    </div>
  ))}
  
  <button onClick={() => addTeamMember({ name: '', role: '' })}>
    Add Team Member
  </button>
</div>
```

### Scenario 3: Add Conditional Fields

```typescript
// Show domain input only if user selected "custom domain"
{formData.hostingPreference === 'custom' && (
  <input
    type="text"
    value={formData.customDomain || ''}
    onChange={e => updateField('customDomain', e.target.value)}
    placeholder="www.yourdomain.com"
  />
)}
```

## 🔌 Integration Points

### Where Form Data Goes

1. **Submit Handler** (`handleSubmit`):
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Send to API
  const response = await fetch('/api/generator/create', {
    method: 'POST',
    body: JSON.stringify(formData)  // ← All form data here
  })
}
```

2. **API Endpoint** (`app/api/generator/create/route.ts`):
```typescript
export async function POST(req: Request) {
  const formData = await req.json()  // ← Receives all data
  
  // Save to database
  await prisma.generatedSite.create({
    data: {
      businessName: formData.businessName,
      config: formData,  // Store entire config as JSON
      // ...
    }
  })
}
```

3. **Database** (Prisma model):
```prisma
model GeneratedSite {
  config Json  // ← Stores entire FormData as JSON
}
```

## 📋 Pre-Made Expansion Templates

Copy these ready-to-use templates into your form:

### Template 1: File Upload Field
```tsx
const [logoFile, setLogoFile] = useState<File | null>(null)

<input
  type="file"
  accept="image/*"
  onChange={e => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      // Upload to server or convert to base64
    }
  }}
  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg"
/>
```

### Template 2: Color Picker with Preset
```tsx
const colorPresets = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']

<div className="flex gap-2">
  {colorPresets.map(color => (
    <button
      key={color}
      onClick={() => updateField('accentColor', color)}
      className="w-8 h-8 rounded"
      style={{ backgroundColor: color }}
    />
  ))}
  <input
    type="color"
    value={formData.accentColor}
    onChange={e => updateField('accentColor', e.target.value)}
  />
</div>
```

### Template 3: Slider Input
```tsx
<div>
  <label>Animation Speed: {formData.animationSpeed}ms</label>
  <input
    type="range"
    min="0"
    max="1000"
    step="50"
    value={formData.animationSpeed}
    onChange={e => updateField('animationSpeed', parseInt(e.target.value))}
    className="w-full"
  />
</div>
```

## 🚀 Next Steps for Expansion

### Phase 1: Content Enhancement
- [ ] Add rich text editor for "About" section
- [ ] Add image upload for logo/hero
- [ ] Add video URL fields
- [ ] Add testimonials array

### Phase 2: Advanced Features
- [ ] Add A/B testing options
- [ ] Add custom CSS input
- [ ] Add JavaScript snippets field
- [ ] Add third-party integrations (Stripe, Mailchimp, etc.)

### Phase 3: AI Integration
- [ ] Auto-generate content from keywords
- [ ] Suggest color schemes from industry
- [ ] Generate meta descriptions
- [ ] Create page outlines

### Phase 4: Preview & Deploy
- [ ] Real-time preview iframe
- [ ] Component library selector
- [ ] Template marketplace
- [ ] One-click deploy to Vercel/Netlify

## 💡 Pro Tips

1. **Always update TypeScript first**: Add to interface → compiler tells you what to add
2. **Use arrays for options**: Makes adding choices trivial
3. **Leverage existing patterns**: Copy-paste similar sections and modify
4. **Test incrementally**: Add one field at a time
5. **Use defaults wisely**: Pre-fill common choices to speed up form
6. **Group related fields**: Keep sections focused and logical

## 🐛 Debugging Checklist

- [ ] Added to FormData interface?
- [ ] Initialized in useState?
- [ ] updateField() used correctly?
- [ ] TypeScript types match?
- [ ] Section ID unique?
- [ ] CSS classes applied?

## 📚 Useful References

- **Icons**: https://lucide.dev (all icons available)
- **Tailwind Classes**: https://tailwindcss.com/docs
- **React Hooks**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org/docs
