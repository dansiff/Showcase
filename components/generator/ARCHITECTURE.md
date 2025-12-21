# Website Generator - System Architecture

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                    (Fills Form)                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           WebsiteGeneratorForm Component                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FormData State (useState)                          │   │
│  │  ├─ businessName: string                            │   │
│  │  ├─ siteType: SiteType[]                           │   │
│  │  ├─ colorScheme: ColorScheme                       │   │
│  │  ├─ features: { contact: bool, blog: bool, ... }   │   │
│  │  └─ ... (all form fields)                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Sections (Collapsible)                             │   │
│  │  ├─ Basic Info                                      │   │
│  │  ├─ Branding & Design                              │   │
│  │  ├─ Content & Goals                                │   │
│  │  ├─ Features & Functionality                       │   │
│  │  ├─ Pages & Structure                              │   │
│  │  ├─ SEO & Marketing                                │   │
│  │  └─ Technical Settings                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Helper Functions:                                          │
│  • updateField()     - Update any field                    │
│  • toggleFeature()   - Toggle feature on/off              │
│  • addArrayItem()    - Add to arrays                      │
│  • removeArrayItem() - Remove from arrays                 │
└─────────────────────┬───────────────────────────────────────┘
                      │ (Submit)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              API: /api/generator/create                      │
│                                                              │
│  POST Handler:                                              │
│  1. Validate required fields                               │
│  2. Save to database (GeneratedSite model)                 │
│  3. Trigger generation process                             │
│  4. Return siteId + previewUrl                            │
│                                                              │
│  GET Handler:                                               │
│  1. Check generation status                                │
│  2. Return current state                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           Database (Prisma + PostgreSQL)                     │
│                                                              │
│  GeneratedSite Model:                                       │
│  ├─ id: cuid                                               │
│  ├─ businessName: string                                   │
│  ├─ siteType: string[]                                     │
│  ├─ config: Json (entire FormData)                        │
│  ├─ status: "generating" | "completed" | "failed"         │
│  ├─ deployUrl: string?                                     │
│  └─ timestamps                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│         Preview Page: /generator/preview/[id]                │
│                                                              │
│  Tabs:                                                      │
│  ├─ Preview  - Live website preview (iframe)               │
│  ├─ Code     - View generated source code                  │
│  └─ Deploy   - Deploy to hosting platforms                 │
│                                                              │
│  Actions:                                                   │
│  ├─ Download - Get source code as .zip                    │
│  └─ Deploy   - One-click deploy to Vercel/Netlify         │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Component Hierarchy

```
app/(default)/generator/page.tsx
│
├─ PageHeader (theme="default")
│
├─ WebsiteGeneratorForm.tsx
│   │
│   ├─ SectionHeader (Basic Info)
│   │   └─ Input fields, site type buttons
│   │
│   ├─ SectionHeader (Branding & Design)
│   │   └─ Color schemes, layout styles, brand keywords
│   │
│   ├─ SectionHeader (Content & Goals)
│   │   └─ Target audience, goals, services, about text
│   │
│   ├─ SectionHeader (Features & Functionality)
│   │   └─ Feature toggles (12 features)
│   │
│   ├─ SectionHeader (Pages & Structure)
│   │   └─ Page selection, custom pages
│   │
│   ├─ SectionHeader (SEO & Marketing)
│   │   └─ Keywords, meta description, social links
│   │
│   ├─ SectionHeader (Technical Settings)
│   │   └─ Hosting, domain, analytics
│   │
│   └─ Submit Button
│       └─ Triggers API call
│
└─ PageFooter (theme="default")
```

## 🔄 State Management Pattern

```
┌─────────────────────────────────────────────────────────┐
│  Parent Component State                                 │
│                                                          │
│  const [formData, setFormData] = useState<FormData>({   │
│    businessName: '',                                    │
│    siteType: [],                                       │
│    features: { ... },                                  │
│    // ... all fields                                   │
│  })                                                     │
│                                                          │
│  const updateField = (field, value) => {               │
│    setFormData(prev => ({ ...prev, [field]: value }))  │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
         │                      │                    │
         ▼                      ▼                    ▼
    ┌────────┐          ┌────────────┐        ┌──────────┐
    │ Input  │          │  Checkbox  │        │  Select  │
    │ Field  │          │   Button   │        │ Dropdown │
    └────────┘          └────────────┘        └──────────┘
         │                      │                    │
         └──────────────────────┴────────────────────┘
                                │
                    onChange / onClick
                                │
                                ▼
                      updateField(field, value)
                                │
                                ▼
                    setFormData() updates state
                                │
                                ▼
                        React re-renders
                                │
                                ▼
                     UI shows new values
```

## 📦 Module Structure

```
components/generator/
├── WebsiteGeneratorForm.tsx  [Main form component]
│   ├── FormData interface
│   ├── Option arrays (siteTypes, colorSchemes, etc)
│   ├── State management
│   ├── Helper functions
│   └── UI sections
│
├── utils.ts  [Reusable utilities]
│   ├── useArrayField() - Array management hook
│   ├── useObjectArray() - Object array hook
│   ├── useSections() - Section management hook
│   ├── Validation utilities
│   ├── File upload helpers
│   └── Export/import helpers
│
├── examples.tsx  [Copy-paste examples]
│   ├── Team members example
│   ├── Timeline selector
│   ├── File upload
│   ├── Integrations
│   └── Typography
│
├── README.md  [Full developer guide]
├── QUICK_REFERENCE.md  [Quick lookup]
└── ARCHITECTURE.md  [This file]
```

## 🔌 Extension Points

### 1. Adding New Fields
```
FormData interface → Initialize state → Add UI component
```

### 2. Adding New Sections
```
Create section JSX → Use SectionHeader → Auto-managed
```

### 3. Adding New Features
```
Add to features object → Add to defaultFeatures array → Auto-renders
```

### 4. Adding Custom Validation
```
Create validation rule → Apply in handleSubmit
```

### 5. Integrating AI
```
Hook into form submission → Send to AI API → Generate content
```

## 🎯 Future Expansion Pathways

### Phase 1: Enhanced Input (Current + Easy Additions)
```
Current Features ────> Add Team Members
     │                 Add Budget Range
     │                 Add Timeline
     │                 Add File Uploads
     │                 Add Integrations
     └────────────────> More comprehensive data collection
```

### Phase 2: AI Integration
```
Form Data ───> AI Content Generator ───> Generated Text
    │                                     - Headlines
    │                                     - Descriptions
    │                                     - Meta tags
    └─────────> AI Design Suggestions ──> Color schemes
                                          - Layout ideas
                                          - Component picks
```

### Phase 3: Real-Time Preview
```
Form Updates ───> Preview Engine ───> Live iframe
                      │                showing changes
                      │                instantly
                      └────────────────> Interactive editing
```

### Phase 4: Code Generation
```
Form Data ───> Template Engine ───> Generate Components
    │              │                  - React/Vue/etc
    │              │                  - Styled-components
    │              │                  - Tailwind classes
    │              │
    │              └──> File Structure Generator
    │                   - package.json
    │                   - configs
    │                   - routes
    │
    └─────────> Export as ZIP or Git repo
```

### Phase 5: Deployment Pipeline
```
Generated Site ───> Build Process ───> Deploy to:
                        │               - Vercel
                        │               - Netlify
                        │               - AWS
                        └──> Domain Setup
                        └──> SSL Config
                        └──> Analytics
```

## 🎨 Design Patterns Used

### 1. Controlled Components
All inputs are controlled by React state via `value={formData.field}` and `onChange`

### 2. Single Source of Truth
All form data lives in one `formData` object

### 3. Composition
Sections are composed from smaller input components

### 4. Type Safety
TypeScript ensures all fields are properly typed

### 5. Declarative Rendering
Options arrays drive UI generation automatically

### 6. Collapsible Sections
Set-based state for O(1) lookup and toggle

## 🔧 Helper Utilities Explained

### updateField()
Generic function to update any field in FormData
```typescript
const updateField = <K extends keyof FormData>(
  field: K, 
  value: FormData[K]
) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}
```

### toggleFeature()
Specific function for feature toggles
```typescript
const toggleFeature = (feature: keyof FormData['features']) => {
  updateField('features', {
    ...formData.features,
    [feature]: !formData.features[feature]
  })
}
```

### addArrayItem() / removeArrayItem()
Generic array manipulation
```typescript
const addArrayItem = (
  field: 'brandKeywords' | 'keyServices' | ..., 
  value: string
) => {
  if (value.trim()) {
    updateField(field, [...formData[field], value.trim()])
  }
}
```

## 💡 Key Insights

1. **Interface-Driven**: FormData interface is the contract
2. **Options Arrays**: Make UI generation automatic
3. **Helper Functions**: Reduce boilerplate, increase consistency
4. **Type Safety**: Catch errors at compile time
5. **Modular Sections**: Easy to add/remove/reorganize
6. **JSON Storage**: config field stores everything for flexibility

## 🚀 Quick Start for Developers

1. Read `QUICK_REFERENCE.md` (5 min)
2. Browse `examples.tsx` (10 min)
3. Add a simple field (5 min)
4. Add a section (10 min)
5. Test and iterate (ongoing)

Total time to productivity: **~30 minutes**
