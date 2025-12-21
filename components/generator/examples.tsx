/**
 * EXPANSION EXAMPLES
 * 
 * Copy-paste these examples into WebsiteGeneratorForm.tsx to add new features
 */

// ============================================
// EXAMPLE 1: Add Team Members Section
// ============================================

/*
// 1. Add to FormData interface
interface TeamMember {
  name: string
  role: string
  bio: string
  image?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
}

interface FormData {
  // ... existing fields
  teamMembers: TeamMember[]
}

// 2. Add to initial state
const [formData, setFormData] = useState<FormData>({
  // ... existing fields
  teamMembers: []
})

// 3. Add helper state
const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
const [showMemberForm, setShowMemberForm] = useState(false)

// 4. Add helper functions
const addTeamMember = (member: TeamMember) => {
  updateField('teamMembers', [...formData.teamMembers, member])
  setShowMemberForm(false)
  setEditingMember(null)
}

const removeTeamMember = (index: number) => {
  updateField('teamMembers', formData.teamMembers.filter((_, i) => i !== index))
}

const updateTeamMember = (index: number, member: TeamMember) => {
  updateField('teamMembers', formData.teamMembers.map((m, i) => i === index ? member : m))
}

// 5. Add UI section
<div className="space-y-4">
  <SectionHeader title="Team Members" section="team" icon={Users} />
  {expandedSections.has('team') && (
    <div className="space-y-4 pl-4">
      {formData.teamMembers.map((member, i) => (
        <div key={i} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600 flex justify-between items-start">
          <div>
            <div className="font-semibold text-slate-200">{member.name}</div>
            <div className="text-sm text-slate-400">{member.role}</div>
            {member.bio && <div className="text-sm text-slate-400 mt-2">{member.bio}</div>}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditingMember(member)
                setShowMemberForm(true)
              }}
              className="px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm"
            >
              Edit
            </button>
            <button 
              onClick={() => removeTeamMember(i)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={() => setShowMemberForm(true)}
        className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-violet-500 hover:text-violet-400 transition"
      >
        + Add Team Member
      </button>
      
      {showMemberForm && (
        <div className="p-6 bg-slate-900/80 border border-slate-600 rounded-lg space-y-4">
          <h4 className="font-semibold text-slate-200">
            {editingMember ? 'Edit' : 'Add'} Team Member
          </h4>
          
          <input
            type="text"
            placeholder="Name"
            defaultValue={editingMember?.name || ''}
            id="member-name"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
          />
          
          <input
            type="text"
            placeholder="Role (e.g., CEO, Developer)"
            defaultValue={editingMember?.role || ''}
            id="member-role"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
          />
          
          <textarea
            placeholder="Bio"
            defaultValue={editingMember?.bio || ''}
            id="member-bio"
            rows={3}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                const name = (document.getElementById('member-name') as HTMLInputElement).value
                const role = (document.getElementById('member-role') as HTMLInputElement).value
                const bio = (document.getElementById('member-bio') as HTMLTextAreaElement).value
                
                if (name && role) {
                  if (editingMember) {
                    const index = formData.teamMembers.indexOf(editingMember)
                    updateTeamMember(index, { name, role, bio })
                  } else {
                    addTeamMember({ name, role, bio })
                  }
                }
              }}
              className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowMemberForm(false)
                setEditingMember(null)
              }}
              className="flex-1 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )}
</div>
*/

// ============================================
// EXAMPLE 2: Add Project Timeline Selector
// ============================================

/*
// 1. Add to FormData
type ProjectTimeline = 'rush' | '1-month' | '2-3-months' | '3-6-months' | 'flexible'

interface FormData {
  // ... existing
  projectTimeline: ProjectTimeline
  launchDate?: Date
}

// 2. Initialize
projectTimeline: '2-3-months'

// 3. Create options
const timelineOptions: Option<ProjectTimeline>[] = [
  { value: 'rush', label: 'Rush (1-2 weeks)', description: 'Fast-track delivery' },
  { value: '1-month', label: '1 Month', description: 'Standard timeline' },
  { value: '2-3-months', label: '2-3 Months', description: 'Recommended' },
  { value: '3-6-months', label: '3-6 Months', description: 'Complex projects' },
  { value: 'flexible', label: 'Flexible', description: 'No rush' },
]

// 4. Add UI
<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">Project Timeline</label>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {timelineOptions.map(option => (
      <button
        key={option.value}
        type="button"
        onClick={() => updateField('projectTimeline', option.value)}
        className={`p-4 rounded-lg border-2 transition text-left ${
          formData.projectTimeline === option.value
            ? 'border-violet-500 bg-violet-500/20'
            : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
        }`}
      >
        <div className="font-medium text-slate-200">{option.label}</div>
        <div className="text-xs text-slate-400 mt-1">{option.description}</div>
      </button>
    ))}
  </div>
  
  <div className="mt-4">
    <label className="block text-sm font-medium text-slate-300 mb-2">Target Launch Date (Optional)</label>
    <input
      type="date"
      value={formData.launchDate?.toISOString().split('T')[0] || ''}
      onChange={e => updateField('launchDate', e.target.value ? new Date(e.target.value) : undefined)}
      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
    />
  </div>
</div>
*/

// ============================================
// EXAMPLE 3: Add Content Upload Section
// ============================================

/*
// 1. Add to FormData
interface ContentAsset {
  type: 'image' | 'video' | 'document'
  url: string
  name: string
  size: number
}

interface FormData {
  // ... existing
  uploadedAssets: ContentAsset[]
  logoFile?: string  // base64 or URL
}

// 2. Initialize
uploadedAssets: []

// 3. Add upload handler
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'asset') => {
  const file = e.target.files?.[0]
  if (!file) return
  
  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File must be under 5MB')
    return
  }
  
  // Convert to base64 or upload to server
  const reader = new FileReader()
  reader.onload = () => {
    if (type === 'logo') {
      updateField('logoFile', reader.result as string)
    } else {
      const asset: ContentAsset = {
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url: reader.result as string,
        name: file.name,
        size: file.size
      }
      updateField('uploadedAssets', [...formData.uploadedAssets, asset])
    }
  }
  reader.readAsDataURL(file)
}

// 4. Add UI
<div className="space-y-4">
  <SectionHeader title="Content & Assets" section="assets" icon={Image} />
  {expandedSections.has('assets') && (
    <div className="space-y-4 pl-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
        <div className="flex items-center gap-4">
          {formData.logoFile && (
            <img src={formData.logoFile} alt="Logo" className="w-24 h-24 object-cover rounded-lg border border-slate-600" />
          )}
          <label className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileUpload(e, 'logo')}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Other Assets</label>
        <div className="space-y-2">
          {formData.uploadedAssets.map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-600">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                  asset.type === 'image' ? 'bg-blue-500/20 text-blue-400' :
                  asset.type === 'video' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎥' : '📄'}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{asset.name}</div>
                  <div className="text-xs text-slate-400">{(asset.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <button
                onClick={() => updateField('uploadedAssets', formData.uploadedAssets.filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
          
          <label className="block w-full py-8 border-2 border-dashed border-slate-600 rounded-lg text-center text-slate-400 hover:border-violet-500 hover:text-violet-400 cursor-pointer transition">
            + Upload Images, Videos, or Documents
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={e => {
                Array.from(e.target.files || []).forEach(file => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.files = new DataTransfer().files
                  Object.defineProperty(input, 'files', { value: [file] })
                  handleFileUpload({ target: input } as any, 'asset')
                })
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )}
</div>
*/

// ============================================
// EXAMPLE 4: Add Third-Party Integrations
// ============================================

/*
// 1. Add to FormData
interface Integration {
  service: string
  enabled: boolean
  apiKey?: string
  config?: Record<string, any>
}

interface FormData {
  // ... existing
  integrations: {
    stripe?: { apiKey: string; webhookSecret?: string }
    mailchimp?: { apiKey: string; listId?: string }
    googleMaps?: { apiKey: string }
    calendly?: { username: string }
    intercom?: { appId: string }
  }
}

// 2. Initialize
integrations: {}

// 3. Create integration options
const integrationOptions = [
  { 
    key: 'stripe', 
    label: 'Stripe', 
    description: 'Accept payments',
    icon: '💳',
    fields: ['apiKey', 'webhookSecret']
  },
  { 
    key: 'mailchimp', 
    label: 'Mailchimp', 
    description: 'Email marketing',
    icon: '📧',
    fields: ['apiKey', 'listId']
  },
  { 
    key: 'googleMaps', 
    label: 'Google Maps', 
    description: 'Location features',
    icon: '🗺️',
    fields: ['apiKey']
  },
  { 
    key: 'calendly', 
    label: 'Calendly', 
    description: 'Appointment booking',
    icon: '📅',
    fields: ['username']
  },
]

// 4. Add UI
<div className="space-y-4">
  <SectionHeader title="Third-Party Integrations" section="integrations" icon={Zap} />
  {expandedSections.has('integrations') && (
    <div className="space-y-4 pl-4">
      {integrationOptions.map(integration => (
        <div key={integration.key} className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{integration.icon}</span>
              <div>
                <div className="font-medium text-slate-200">{integration.label}</div>
                <div className="text-sm text-slate-400">{integration.description}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const current = formData.integrations[integration.key as keyof typeof formData.integrations]
                updateField('integrations', {
                  ...formData.integrations,
                  [integration.key]: current ? undefined : {}
                })
              }}
              className={`px-3 py-1 rounded text-sm transition ${
                formData.integrations[integration.key as keyof typeof formData.integrations]
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {formData.integrations[integration.key as keyof typeof formData.integrations] ? 'Enabled' : 'Enable'}
            </button>
          </div>
          
          {formData.integrations[integration.key as keyof typeof formData.integrations] && (
            <div className="space-y-2 mt-3 pt-3 border-t border-slate-700">
              {integration.fields.map(field => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                  value={formData.integrations[integration.key as keyof typeof formData.integrations]?.[field] || ''}
                  onChange={e => updateField('integrations', {
                    ...formData.integrations,
                    [integration.key]: {
                      ...formData.integrations[integration.key as keyof typeof formData.integrations],
                      [field]: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-sm text-slate-100"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
*/

// ============================================
// EXAMPLE 5: Add Typography & Fonts
// ============================================

/*
// 1. Add to FormData
interface FormData {
  // ... existing
  typography: {
    headingFont: string
    bodyFont: string
    fontSize: 'small' | 'medium' | 'large'
    fontWeight: 'light' | 'normal' | 'bold'
  }
}

// 2. Initialize
typography: {
  headingFont: 'Inter',
  bodyFont: 'Inter',
  fontSize: 'medium',
  fontWeight: 'normal'
}

// 3. Create font options
const fontOptions = [
  'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans',
  'Lato', 'Playfair Display', 'Merriweather', 'Source Sans Pro'
]

const fontSizes = [
  { value: 'small', label: 'Small', preview: '14px base' },
  { value: 'medium', label: 'Medium', preview: '16px base' },
  { value: 'large', label: 'Large', preview: '18px base' },
]

// 4. Add UI
<div className="space-y-4">
  <SectionHeader title="Typography" section="typography" icon={Type} />
  {expandedSections.has('typography') && (
    <div className="space-y-4 pl-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Heading Font</label>
          <select
            value={formData.typography.headingFont}
            onChange={e => updateField('typography', {
              ...formData.typography,
              headingFont: e.target.value
            })}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
          >
            {fontOptions.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Body Font</label>
          <select
            value={formData.typography.bodyFont}
            onChange={e => updateField('typography', {
              ...formData.typography,
              bodyFont: e.target.value
            })}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
          >
            {fontOptions.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
        <div className="flex gap-2">
          {fontSizes.map(size => (
            <button
              key={size.value}
              type="button"
              onClick={() => updateField('typography', {
                ...formData.typography,
                fontSize: size.value as any
              })}
              className={`flex-1 p-3 rounded-lg border transition ${
                formData.typography.fontSize === size.value
                  ? 'border-violet-500 bg-violet-500/20'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
              }`}
            >
              <div className="font-medium text-slate-200">{size.label}</div>
              <div className="text-xs text-slate-400">{size.preview}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
        <div className="text-xs text-slate-400 mb-2">Preview</div>
        <h3 className="text-2xl font-bold text-slate-200 mb-2" style={{ fontFamily: formData.typography.headingFont }}>
          Heading Example
        </h3>
        <p className="text-slate-300" style={{ fontFamily: formData.typography.bodyFont }}>
          This is how your body text will look. The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  )}
</div>
*/

export {} // Make this a module
