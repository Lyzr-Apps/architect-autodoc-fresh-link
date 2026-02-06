'use client'

import { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Plus,
  ArrowLeft,
  ExternalLink,
  DollarSign,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  Clock,
  Building2,
  Database,
  Network,
  TrendingUp
} from 'lucide-react'

// TypeScript interfaces from test responses
interface ScalabilityTargets {
  concurrent_users: number
  requests_per_second: number
  data_volume: string
}

interface ComplianceRequirement {
  system?: string
  providers?: string[]
  type?: string
  criticality?: string
  platforms?: string[]
}

interface Requirements {
  summary?: string
  client_objectives: string[]
  business_goals?: string[]
  technical_constraints?: string[]
  scalability_targets: ScalabilityTargets
  compliance_needs: string[]
  integration_requirements: ComplianceRequirement[]
}

interface Pattern {
  name: string
  source?: string
  application?: string
  description?: string
  companies?: string[]
  use_case?: string
  implementation?: string
  benefits?: string[]
}

interface CaseStudy {
  company: string
  pattern?: string
  benefit?: string
  architecture?: string
  problem?: string
  solution?: string
  results?: string
  key_learnings?: string[]
  applicability?: string
}

interface Research {
  patterns: Pattern[]
  company_case_studies: CaseStudy[]
  fault_tolerance_strategies: any[]
  trade_offs?: any[]
  sources?: any[]
}

interface Component {
  name: string
  type: string
  purpose: string
  technologies: string[]
  scalability: string
  fault_tolerance: string
  interfaces?: any
  security?: any
  api_endpoints?: string[]
  event_driven?: any
}

interface TradeOff {
  decision: string
  chosen?: string
  alternatives: string[]
  reasoning: string
  trade_offs: string | { benefits?: string[], costs?: string[] }
  mitigation?: string
  reference?: string
}

interface Architecture {
  overview: string
  architecture_style: string
  components: Component[]
  tech_stack: any
  trade_off_decisions: TradeOff[]
  patterns_applied?: any[]
  data_flow?: any
  scalability_mechanisms?: string[]
  fault_tolerance_mechanisms?: string[]
}

interface ValidationFinding {
  aspect?: string
  status?: string
  details?: string
  capacity?: string
  recommendation?: string
  mechanism?: string
  rto?: string
  rpo?: string
  configuration?: string
  failover_time?: string
}

interface Validation {
  scalability_assessment: string | { overall_rating?: string, score?: string, findings?: ValidationFinding[] }
  fault_tolerance_review: string | { overall_rating?: string, score?: string, findings?: ValidationFinding[] }
  security_evaluation: string | { overall_rating?: string, score?: string, findings?: ValidationFinding[] }
  compliance_check: string | any
  potential_issues: any[]
  performance_bottlenecks?: any[]
  recommendations?: any[]
}

interface CostEstimation {
  monthly_estimate?: string
  breakdown?: Record<string, string>
}

interface Documentation {
  executive_summary: string | any
  architecture_overview: string | any
  component_specifications: string | any
  security_architecture: string | any
  scalability_patterns: string | any
  fault_tolerance: string | any
  cost_estimation: CostEstimation | any
  integration_apis: any[]
  references: string[] | any[]
}

interface SystemDesign {
  project_name: string
  version: string
  timestamp: string
  requirements: Requirements
  research: Research
  architecture: Architecture
  validation: Validation
  documentation: Documentation
}

interface Project {
  id: string
  system_design: SystemDesign
  created_at: string
  updated_at: string
  versions: SystemDesign[]
}

type Screen = 'dashboard' | 'design' | 'history'

const AGENT_IDS = {
  orchestrator: '69858585b90162af337b1e37',
  requirements: '698584b62237a2c55706afdc',
  research: '698584d107ec48e3dc90a152',
  designer: '698584ebc613a65b3c4193c7',
  validator: '69858519382ef8715224cf17',
  documentation: '6985854d1caa4e686dd66d90'
}

const REFERENCE_COMPANIES = [
  'Netflix', 'Uber', 'Amazon', 'Google', 'Shopify', 'Microsoft',
  'Meta', 'Twitter', 'Airbnb', 'Spotify', 'LinkedIn', 'Stripe'
]

const COMPLIANCE_OPTIONS = [
  'PCI-DSS', 'GDPR', 'SOC2', 'ISO27001', 'HIPAA', 'CCPA'
]

export default function Home() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    components: true,
    tradeoffs: true,
    security: true,
    scalability: true,
    fault_tolerance: true,
    cost: true,
    apis: true,
    references: true
  })
  const [showRevision, setShowRevision] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    clientRequirements: '',
    technicalConstraints: '',
    concurrentUsers: '',
    dataVolume: '',
    compliance: [] as string[],
    integrationNeeds: '',
    referenceCompanies: [] as string[]
  })
  const [feedback, setFeedback] = useState('')

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('design_projects')
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }, [])

  // Save projects to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('design_projects', JSON.stringify(projects))
    }
  }, [projects])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleGenerateDesign = async () => {
    if (!formData.projectName || !formData.clientRequirements) {
      alert('Please fill in project name and client requirements')
      return
    }

    setLoading(true)
    setLoadingStage('Analyzing Requirements...')

    try {
      // Build comprehensive requirements message
      const message = `
Project: ${formData.projectName}

Client Requirements:
${formData.clientRequirements}

Technical Constraints:
${formData.technicalConstraints || 'None specified'}

Scalability Targets:
- Concurrent Users: ${formData.concurrentUsers || '10,000'}
- Data Volume: ${formData.dataVolume || '1TB'}

Compliance Requirements:
${formData.compliance.length > 0 ? formData.compliance.join(', ') : 'None specified'}

Integration Needs:
${formData.integrationNeeds || 'None specified'}

${formData.referenceCompanies.length > 0 ? `Reference Companies for Patterns: ${formData.referenceCompanies.join(', ')}` : ''}

Please provide a comprehensive system design document including architecture, real-world patterns, trade-offs, security, scalability, fault tolerance, and cost estimation.
`.trim()

      setLoadingStage('Researching Real-World Patterns...')

      const result = await callAIAgent(message, AGENT_IDS.orchestrator)

      setLoadingStage('Designing Architecture...')

      if (result.success && result.response.result?.system_design) {
        setLoadingStage('Validating Against Industry Standards...')

        const systemDesign = result.response.result.system_design as SystemDesign

        setLoadingStage('Generating Documentation...')

        const project: Project = {
          id: Date.now().toString(),
          system_design: systemDesign,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          versions: [systemDesign]
        }

        setProjects(prev => [project, ...prev])
        setCurrentProject(project)
        setScreen('design')
      } else {
        alert('Failed to generate system design. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  const handleRefineDesign = async () => {
    if (!currentProject || !feedback) {
      alert('Please provide feedback')
      return
    }

    setLoading(true)
    setLoadingStage('Analyzing Feedback...')

    try {
      const message = `
Previous Design: ${currentProject.system_design.project_name}

Feedback for Refinement:
${feedback}

Please refine the system design based on this feedback while maintaining all previous context.
`.trim()

      setLoadingStage('Refining Architecture...')

      const result = await callAIAgent(message, AGENT_IDS.orchestrator)

      if (result.success && result.response.result?.system_design) {
        const systemDesign = result.response.result.system_design as SystemDesign

        const updatedProject = {
          ...currentProject,
          system_design: systemDesign,
          updated_at: new Date().toISOString(),
          versions: [...currentProject.versions, systemDesign]
        }

        setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p))
        setCurrentProject(updatedProject)
        setFeedback('')
        setShowRevision(false)
      } else {
        alert('Failed to refine design. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy')
    })
  }

  const exportDocument = () => {
    if (!currentProject) return

    const content = JSON.stringify(currentProject.system_design, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentProject.system_design.project_name}-design.json`
    a.click()
  }

  const filteredProjects = projects.filter(p =>
    p.system_design.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Dashboard Screen
  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="w-10 h-10 text-teal-400" />
              System Design Documentation Agent
            </h1>
            <p className="text-slate-400 text-lg">
              Generate enterprise-grade system designs with real-world patterns from industry leaders
            </p>
          </div>

          {/* Search and New Project */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button
              onClick={() => setScreen('design')}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Design Project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => (
              <Card
                key={project.id}
                className="bg-slate-800 border-slate-700 hover:border-teal-500 transition-colors cursor-pointer"
                onClick={() => {
                  setCurrentProject(project)
                  setScreen('design')
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    {project.system_design.project_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Version</span>
                    <span className="text-teal-400 font-semibold">{project.system_design.version}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Modified</span>
                    <span className="text-white">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Architecture</span>
                    <span className="text-white text-xs">
                      {project.system_design.architecture.architecture_style.substring(0, 30)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Research Sources</span>
                    <span className="text-teal-400 font-semibold">
                      {project.system_design.research.company_case_studies.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-4">Create your first system design project</p>
              <Button
                onClick={() => setScreen('design')}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Design Project
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Design Interface Screen
  if (screen === 'design') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-[1800px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setScreen('dashboard')}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-white">
                {currentProject ? currentProject.system_design.project_name : 'New System Design'}
              </h1>
            </div>
            {currentProject && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowRevision(!showRevision)}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refine Design
                </Button>
                <Button
                  onClick={exportDocument}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            {/* Left Panel - Requirements Form */}
            {!currentProject && (
              <div className="w-[480px] space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Project Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Project Name *
                      </label>
                      <Input
                        placeholder="E-Commerce Platform Redesign"
                        value={formData.projectName}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Client Requirements *
                      </label>
                      <Textarea
                        placeholder="High-traffic platform for payment gateway integration, real-time inventory..."
                        value={formData.clientRequirements}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientRequirements: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Technical Constraints
                      </label>
                      <Textarea
                        placeholder="Must integrate with existing systems, cloud-native, etc..."
                        value={formData.technicalConstraints}
                        onChange={(e) => setFormData(prev => ({ ...prev, technicalConstraints: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-white min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Concurrent Users
                        </label>
                        <Input
                          placeholder="100000"
                          value={formData.concurrentUsers}
                          onChange={(e) => setFormData(prev => ({ ...prev, concurrentUsers: e.target.value }))}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Data Volume
                        </label>
                        <Input
                          placeholder="10TB"
                          value={formData.dataVolume}
                          onChange={(e) => setFormData(prev => ({ ...prev, dataVolume: e.target.value }))}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Compliance Requirements
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {COMPLIANCE_OPTIONS.map(option => (
                          <label key={option} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.compliance.includes(option)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ ...prev, compliance: [...prev.compliance, option] }))
                                } else {
                                  setFormData(prev => ({ ...prev, compliance: prev.compliance.filter(c => c !== option) }))
                                }
                              }}
                              className="rounded"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Integration Needs
                      </label>
                      <Textarea
                        placeholder="Payment gateways, third-party APIs, mobile apps..."
                        value={formData.integrationNeeds}
                        onChange={(e) => setFormData(prev => ({ ...prev, integrationNeeds: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-white min-h-[80px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Reference Companies (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                        {REFERENCE_COMPANIES.map(company => (
                          <label key={company} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.referenceCompanies.includes(company)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ ...prev, referenceCompanies: [...prev.referenceCompanies, company] }))
                                } else {
                                  setFormData(prev => ({ ...prev, referenceCompanies: prev.referenceCompanies.filter(c => c !== company) }))
                                }
                              }}
                              className="rounded"
                            />
                            {company}
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateDesign}
                      disabled={loading}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {loadingStage}
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate System Design
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Right Panel - Document Viewer */}
            {currentProject && (
              <div className="flex-1 space-y-4">
                {/* Executive Summary */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-400" />
                        Executive Summary
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">
                          Version {currentProject.system_design.version}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">
                      {typeof currentProject.system_design.documentation.executive_summary === 'string'
                        ? currentProject.system_design.documentation.executive_summary
                        : currentProject.system_design.documentation.executive_summary.overview}
                    </p>
                    {currentProject.system_design.documentation.executive_summary.key_features && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {currentProject.system_design.documentation.executive_summary.key_features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Architecture Overview */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('overview')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Network className="w-5 h-5 text-teal-400" />
                        Architecture Overview
                      </CardTitle>
                      {expandedSections.overview ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.overview && (
                    <CardContent className="space-y-4">
                      <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-4">
                        <h4 className="text-teal-300 font-semibold mb-2">Architecture Style</h4>
                        <p className="text-slate-300">{currentProject.system_design.architecture.architecture_style}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Overview</h4>
                        <p className="text-slate-300 leading-relaxed">
                          {currentProject.system_design.architecture.overview}
                        </p>
                      </div>

                      {/* Real-world patterns */}
                      {currentProject.system_design.research.patterns.length > 0 && (
                        <div>
                          <h4 className="text-teal-300 font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Real-World Patterns Applied
                          </h4>
                          <div className="grid gap-3">
                            {currentProject.system_design.research.patterns.map((pattern, idx) => (
                              <div key={idx} className="bg-teal-900/10 border border-teal-800/50 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="text-white font-semibold">{pattern.name}</h5>
                                  {pattern.source && (
                                    <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded">
                                      {pattern.source}
                                    </span>
                                  )}
                                  {pattern.companies && pattern.companies.length > 0 && (
                                    <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded">
                                      {pattern.companies.join(', ')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400 mb-1">
                                  {pattern.application || pattern.description}
                                </p>
                                {pattern.use_case && (
                                  <p className="text-xs text-teal-300">Use Case: {pattern.use_case}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Company Case Studies */}
                      {currentProject.system_design.research.company_case_studies.length > 0 && (
                        <div>
                          <h4 className="text-teal-300 font-semibold mb-3">Company Case Studies</h4>
                          <div className="grid gap-3">
                            {currentProject.system_design.research.company_case_studies.map((study, idx) => (
                              <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Building2 className="w-5 h-5 text-teal-400" />
                                  <h5 className="text-white font-semibold">{study.company}</h5>
                                </div>
                                {study.pattern && (
                                  <p className="text-sm text-slate-300 mb-1">
                                    <span className="font-medium">Pattern:</span> {study.pattern}
                                  </p>
                                )}
                                {study.architecture && (
                                  <p className="text-sm text-slate-300 mb-1">
                                    <span className="font-medium">Architecture:</span> {study.architecture}
                                  </p>
                                )}
                                {study.benefit && (
                                  <p className="text-sm text-teal-300">
                                    <span className="font-medium">Benefit:</span> {study.benefit}
                                  </p>
                                )}
                                {study.results && (
                                  <p className="text-sm text-teal-300 mt-2">
                                    <span className="font-medium">Results:</span> {study.results}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Component Specifications */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('components')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Database className="w-5 h-5 text-teal-400" />
                        Component Specifications
                      </CardTitle>
                      {expandedSections.components ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.components && (
                    <CardContent className="space-y-3">
                      {currentProject.system_design.architecture.components.map((component, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="text-white font-semibold text-lg">{component.name}</h5>
                              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                {component.type}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{component.purpose}</p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400 font-medium mb-1">Technologies</p>
                              <div className="flex flex-wrap gap-1">
                                {component.technologies.map((tech, i) => (
                                  <span key={i} className="bg-teal-900/30 text-teal-300 px-2 py-0.5 rounded text-xs">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-400 font-medium mb-1">Scalability</p>
                              <p className="text-slate-300 text-xs">{component.scalability}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-700">
                            <p className="text-slate-400 font-medium mb-1 text-sm">Fault Tolerance</p>
                            <p className="text-slate-300 text-xs">{component.fault_tolerance}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>

                {/* Trade-Off Analysis */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('tradeoffs')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        Trade-Off Analysis
                      </CardTitle>
                      {expandedSections.tradeoffs ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.tradeoffs && (
                    <CardContent className="space-y-3">
                      {currentProject.system_design.architecture.trade_off_decisions.map((tradeoff, idx) => (
                        <div key={idx} className="bg-orange-900/10 border border-orange-800/50 rounded-lg p-4">
                          <h5 className="text-white font-semibold mb-2">{tradeoff.decision}</h5>
                          {tradeoff.chosen && (
                            <div className="mb-2">
                              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                                Chosen: {tradeoff.chosen}
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-slate-300 mb-3">
                            <span className="font-medium">Reasoning:</span> {tradeoff.reasoning}
                          </p>

                          {tradeoff.alternatives.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-slate-400 font-medium mb-1">Alternatives Considered:</p>
                              <div className="flex flex-wrap gap-1">
                                {tradeoff.alternatives.map((alt, i) => (
                                  <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {typeof tradeoff.trade_offs === 'object' && tradeoff.trade_offs.benefits && (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-green-400 font-medium mb-1">Benefits:</p>
                                <ul className="space-y-1">
                                  {tradeoff.trade_offs.benefits.map((benefit: string, i: number) => (
                                    <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {tradeoff.trade_offs.costs && (
                                <div>
                                  <p className="text-orange-400 font-medium mb-1">Costs:</p>
                                  <ul className="space-y-1">
                                    {tradeoff.trade_offs.costs.map((cost: string, i: number) => (
                                      <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                                        {cost}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {typeof tradeoff.trade_offs === 'string' && (
                            <p className="text-sm text-orange-300">{tradeoff.trade_offs}</p>
                          )}

                          {tradeoff.reference && (
                            <p className="text-xs text-teal-400 mt-2">
                              Reference: {tradeoff.reference}
                            </p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>

                {/* Security Architecture */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('security')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-teal-400" />
                        Security Architecture
                      </CardTitle>
                      {expandedSections.security ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.security && (
                    <CardContent className="space-y-3">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300">
                          {typeof currentProject.system_design.documentation.security_architecture === 'string'
                            ? currentProject.system_design.documentation.security_architecture
                            : 'Comprehensive security architecture with authentication, authorization, encryption, and compliance controls.'}
                        </p>
                      </div>

                      {currentProject.system_design.validation.security_evaluation &&
                       typeof currentProject.system_design.validation.security_evaluation === 'object' &&
                       currentProject.system_design.validation.security_evaluation.findings && (
                        <div className="space-y-2">
                          {currentProject.system_design.validation.security_evaluation.findings.map((finding: ValidationFinding, idx: number) => (
                            <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-white text-sm font-semibold">{finding.aspect}</h5>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  finding.status === 'Passed' ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-300'
                                }`}>
                                  {finding.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">{finding.details}</p>
                              {finding.recommendation && (
                                <p className="text-xs text-teal-400 mt-1">
                                  Recommendation: {finding.recommendation}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Scalability Patterns */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('scalability')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-teal-400" />
                        Scalability Patterns
                      </CardTitle>
                      {expandedSections.scalability ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.scalability && (
                    <CardContent>
                      <p className="text-slate-300 mb-4">
                        {typeof currentProject.system_design.documentation.scalability_patterns === 'string'
                          ? currentProject.system_design.documentation.scalability_patterns
                          : 'Horizontal scaling, database sharding, distributed caching, and event-driven processing for high throughput.'}
                      </p>

                      {currentProject.system_design.validation.scalability_assessment &&
                       typeof currentProject.system_design.validation.scalability_assessment === 'object' &&
                       currentProject.system_design.validation.scalability_assessment.findings && (
                        <div className="grid gap-2">
                          {currentProject.system_design.validation.scalability_assessment.findings.map((finding: ValidationFinding, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 bg-slate-900/50 border border-slate-700 rounded p-3">
                              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <h5 className="text-white text-sm font-semibold mb-1">{finding.aspect}</h5>
                                <p className="text-xs text-slate-400 mb-1">{finding.details}</p>
                                {finding.capacity && (
                                  <p className="text-xs text-teal-400">Capacity: {finding.capacity}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Fault Tolerance */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('fault_tolerance')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-teal-400" />
                        Fault Tolerance & Failure Handling
                      </CardTitle>
                      {expandedSections.fault_tolerance ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.fault_tolerance && (
                    <CardContent className="space-y-3">
                      <p className="text-slate-300">
                        {typeof currentProject.system_design.documentation.fault_tolerance === 'string'
                          ? currentProject.system_design.documentation.fault_tolerance
                          : 'Multi-region deployment, circuit breakers, retry policies, and saga pattern for comprehensive fault tolerance.'}
                      </p>

                      {currentProject.system_design.validation.potential_issues &&
                       currentProject.system_design.validation.potential_issues.length > 0 && (
                        <div>
                          <h5 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Potential Issues & Mitigations
                          </h5>
                          <div className="space-y-2">
                            {currentProject.system_design.validation.potential_issues.map((issue: any, idx: number) => (
                              <div key={idx} className="bg-orange-900/10 border border-orange-800/50 rounded p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <h6 className="text-white text-sm font-semibold">{issue.issue}</h6>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    issue.severity === 'High' || issue.severity === 'Critical'
                                      ? 'bg-red-900/30 text-red-300'
                                      : 'bg-yellow-900/30 text-yellow-300'
                                  }`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                {issue.mitigation && (
                                  <div className="mt-2">
                                    <p className="text-xs text-slate-400 font-medium mb-1">Mitigation:</p>
                                    <p className="text-xs text-teal-300">{issue.mitigation}</p>
                                  </div>
                                )}
                                {issue.mitigation_strategies && issue.mitigation_strategies.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-slate-400 font-medium mb-1">Mitigation Strategies:</p>
                                    <ul className="space-y-1">
                                      {issue.mitigation_strategies.map((strategy: string, i: number) => (
                                        <li key={i} className="text-xs text-teal-300 flex items-start gap-1">
                                          <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                          {strategy}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Cost Estimation */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('cost')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-teal-400" />
                        Cost Estimation
                      </CardTitle>
                      {expandedSections.cost ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.cost && (
                    <CardContent>
                      {currentProject.system_design.documentation.cost_estimation.monthly_estimate && (
                        <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-4 mb-4">
                          <p className="text-slate-400 text-sm mb-1">Monthly Operational Cost</p>
                          <p className="text-3xl font-bold text-teal-300">
                            {currentProject.system_design.documentation.cost_estimation.monthly_estimate}
                          </p>
                        </div>
                      )}

                      {currentProject.system_design.documentation.cost_estimation.breakdown && (
                        <div className="space-y-2">
                          <h5 className="text-white font-semibold mb-3">Cost Breakdown</h5>
                          {Object.entries(currentProject.system_design.documentation.cost_estimation.breakdown).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded p-2">
                              <span className="text-slate-300 text-sm capitalize">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className="text-teal-400 font-semibold">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Integration APIs */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('apis')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Network className="w-5 h-5 text-teal-400" />
                        Integration APIs
                      </CardTitle>
                      {expandedSections.apis ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.apis && (
                    <CardContent className="space-y-3">
                      {currentProject.system_design.documentation.integration_apis.map((api: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-white font-semibold">{api.name}</h5>
                            <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded">
                              {api.authentication}
                            </span>
                          </div>
                          {api.endpoints && (
                            <div className="font-mono text-xs bg-slate-950 p-2 rounded text-teal-300">
                              {api.endpoints}
                            </div>
                          )}
                          {api.endpoint && (
                            <div className="font-mono text-xs bg-slate-950 p-2 rounded text-teal-300">
                              {api.endpoint}
                            </div>
                          )}
                          {api.purpose && (
                            <p className="text-sm text-slate-400 mt-2">{api.purpose}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>

                {/* References */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader
                    className="cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => toggleSection('references')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-teal-400" />
                        References
                      </CardTitle>
                      {expandedSections.references ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </CardHeader>
                  {expandedSections.references && (
                    <CardContent>
                      <div className="space-y-2">
                        {Array.isArray(currentProject.system_design.documentation.references) &&
                         currentProject.system_design.documentation.references.map((ref: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 bg-slate-900/50 border border-slate-700 rounded p-3 hover:border-teal-600 transition-colors">
                            <ExternalLink className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              {typeof ref === 'string' ? (
                                <p className="text-sm text-slate-300">{ref}</p>
                              ) : (
                                <>
                                  <p className="text-sm text-white font-medium">{ref.title}</p>
                                  {ref.url && (
                                    <p className="text-xs text-teal-400 mt-1">{ref.url}</p>
                                  )}
                                  {ref.relevance && (
                                    <p className="text-xs text-slate-400 mt-1">{ref.relevance}</p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Revision Panel */}
                {showRevision && (
                  <Card className="bg-orange-900/10 border-orange-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-orange-400" />
                        Refine Design
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Provide feedback to refine the design (e.g., 'Add more detail on database sharding strategy' or 'Include cost optimization recommendations')..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleRefineDesign}
                          disabled={loading || !feedback}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Refining...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Refine Design
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setShowRevision(false)}
                          variant="outline"
                          className="border-slate-700 text-slate-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
