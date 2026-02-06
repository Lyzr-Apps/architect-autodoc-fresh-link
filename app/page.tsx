'use client'

import { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Loader2,
  Sparkles,
  Database,
  Network,
  Server,
  Cloud,
  Zap,
  Shield,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  X,
  ArrowRight,
  Layers,
  Box,
  ExternalLink
} from 'lucide-react'
import { FaAws, FaDocker, FaReact, FaNode, FaPython, FaJava, FaDatabase } from 'react-icons/fa'
import { SiKubernetes, SiMongodb, SiPostgresql, SiRedis, SiGraphql, SiKafka } from 'react-icons/si'

// TypeScript interfaces
interface Component {
  name: string
  type: string
  purpose: string
  technologies: string[]
  scalability: string
  fault_tolerance: string
  interfaces?: any
  security?: any
}

interface TradeOff {
  decision: string
  chosen?: string
  reasoning?: string
  trade_offs?: string | { benefits?: string[], costs?: string[] }
  mitigation?: string
  reference?: string
}

interface Architecture {
  overview?: string
  summary?: string
  architecture_style: string
  components?: Component[]
  key_components?: string[]
  trade_off_decisions?: TradeOff[]
  details?: {
    overview?: string
    data_flow?: string
    scalability_mechanisms?: string[]
    fault_tolerance?: string[]
    tradeoff_decisions?: { decision: string }[]
  }
}

interface Validation {
  scalability_assessment?: any
  fault_tolerance_review?: any
  security_evaluation?: any
  potential_issues?: any[]
  summary?: string
  overall_assessment?: string
  critical_issues?: string[]
  details?: any
}

interface CostEstimation {
  monthly_estimate?: string
  breakdown?: Record<string, string>
}

interface SystemDesign {
  project_name: string
  version: string
  architecture: Architecture
  validation: Validation
  requirements?: any
  research?: any
  documentation?: {
    cost_estimation?: CostEstimation
    summary?: string
    executive_summary?: string
    details?: any
  }
  orchestration_notes?: string
}

const AGENT_ID = '69858585b90162af337b1e37'

const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()
  if (techLower.includes('react')) return <FaReact className="w-4 h-4" />
  if (techLower.includes('node')) return <FaNode className="w-4 h-4" />
  if (techLower.includes('python')) return <FaPython className="w-4 h-4" />
  if (techLower.includes('java')) return <FaJava className="w-4 h-4" />
  if (techLower.includes('postgres')) return <SiPostgresql className="w-4 h-4" />
  if (techLower.includes('mongo')) return <SiMongodb className="w-4 h-4" />
  if (techLower.includes('redis')) return <SiRedis className="w-4 h-4" />
  if (techLower.includes('kafka')) return <SiKafka className="w-4 h-4" />
  if (techLower.includes('graphql')) return <SiGraphql className="w-4 h-4" />
  if (techLower.includes('kubernetes') || techLower.includes('k8s')) return <SiKubernetes className="w-4 h-4" />
  if (techLower.includes('docker')) return <FaDocker className="w-4 h-4" />
  if (techLower.includes('aws')) return <FaAws className="w-4 h-4" />
  if (techLower.includes('database') || techLower.includes('db')) return <FaDatabase className="w-4 h-4" />
  return <Box className="w-4 h-4" />
}

const getComponentColor = (type: string) => {
  const typeLower = type.toLowerCase()
  if (typeLower.includes('edge') || typeLower.includes('gateway')) return 'from-purple-500 to-purple-700'
  if (typeLower.includes('microservice') || typeLower.includes('service')) return 'from-teal-500 to-teal-700'
  if (typeLower.includes('database') || typeLower.includes('data')) return 'from-blue-500 to-blue-700'
  if (typeLower.includes('cache')) return 'from-orange-500 to-orange-700'
  if (typeLower.includes('queue') || typeLower.includes('message')) return 'from-pink-500 to-pink-700'
  return 'from-slate-500 to-slate-700'
}

interface ComponentEditorProps {
  component: Component
  onSave: (component: Component) => void
  onCancel: () => void
}

function ComponentEditor({ component, onSave, onCancel }: ComponentEditorProps) {
  const [editedComponent, setEditedComponent] = useState<Component>(component)
  const [newTech, setNewTech] = useState('')

  const handleAddTechnology = () => {
    if (newTech.trim() && !editedComponent.technologies.includes(newTech.trim())) {
      setEditedComponent({
        ...editedComponent,
        technologies: [...editedComponent.technologies, newTech.trim()]
      })
      setNewTech('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setEditedComponent({
      ...editedComponent,
      technologies: editedComponent.technologies.filter(t => t !== tech)
    })
  }

  return (
    <Card className="bg-slate-800/50 border-blue-700 backdrop-blur sticky top-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            Edit Component
          </CardTitle>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Name</label>
          <input
            type="text"
            value={editedComponent.name}
            onChange={(e) => setEditedComponent({ ...editedComponent, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Type</label>
          <input
            type="text"
            value={editedComponent.type}
            onChange={(e) => setEditedComponent({ ...editedComponent, type: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Purpose</label>
          <Textarea
            value={editedComponent.purpose}
            onChange={(e) => setEditedComponent({ ...editedComponent, purpose: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Technologies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
              placeholder="Add technology..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <Button
              onClick={handleAddTechnology}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editedComponent.technologies.map((tech, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-teal-900/30 text-teal-300 px-3 py-1.5 rounded-lg text-sm">
                {getTechIcon(tech)}
                {tech}
                <button
                  onClick={() => handleRemoveTechnology(tech)}
                  className="ml-1 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Scalability
          </label>
          <Textarea
            value={editedComponent.scalability}
            onChange={(e) => setEditedComponent({ ...editedComponent, scalability: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-h-[60px]"
          />
        </div>

        <div className="border-t border-slate-700 pt-4">
          <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Fault Tolerance
          </label>
          <Textarea
            value={editedComponent.fault_tolerance}
            onChange={(e) => setEditedComponent({ ...editedComponent, fault_tolerance: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-h-[60px]"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => onSave(editedComponent)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [systemRequirements, setSystemRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [systemDesign, setSystemDesign] = useState<SystemDesign | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [showTradeOffs, setShowTradeOffs] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)
  const [exporting, setExporting] = useState(false)

  const handleGenerate = async () => {
    if (!systemRequirements.trim()) {
      alert('Please describe your system requirements')
      return
    }

    setLoading(true)
    setLoadingStage('Analyzing requirements')

    try {
      const message = `
System Requirements:
${systemRequirements}

Please analyze these requirements and provide a comprehensive system design with architecture, components, trade-offs, validation, and cost estimation.
`.trim()

      setLoadingStage('Researching patterns')

      setTimeout(() => setLoadingStage('Designing architecture'), 1000)
      setTimeout(() => setLoadingStage('Validating design'), 2000)
      setTimeout(() => setLoadingStage('Finalizing'), 3000)

      const result = await callAIAgent(message, AGENT_ID)

      console.log('=== AGENT RESPONSE DEBUG ===')
      console.log('Success:', result.success)
      console.log('Full result:', JSON.stringify(result, null, 2))
      console.log('Response:', result.response)
      console.log('Response.result:', result.response?.result)
      console.log('===========================')

      if (!result.success) {
        console.error('Agent call failed:', result.error || 'Unknown error')
        alert(`Failed to generate design: ${result.error || result.response?.message || 'Unknown error'}`)
        return
      }

      // Try different possible response structures
      let design = null

      // Option 1: result.response.result.system_design
      if (result.response?.result?.system_design) {
        design = result.response.result.system_design
        console.log('Found design at: result.response.result.system_design')
      }
      // Option 2: result.response.result (the entire result IS the system_design)
      else if (result.response?.result?.project_name) {
        design = result.response.result
        console.log('Found design at: result.response.result')
      }
      // Option 3: result.response.result.result (double nesting)
      else if (result.response?.result?.result?.system_design) {
        design = result.response.result.result.system_design
        console.log('Found design at: result.response.result.result.system_design')
      }
      // Option 4: Check if the manager returns it in 'design' or 'final_design'
      else if (result.response?.result?.design) {
        design = result.response.result.design
        console.log('Found design at: result.response.result.design')
      }
      else if (result.response?.result?.final_design) {
        design = result.response.result.final_design
        console.log('Found design at: result.response.result.final_design')
      }

      // Check if we have a valid system design structure
      const hasValidStructure = design &&
        design.project_name &&
        design.architecture &&
        (design.architecture.components || design.architecture.key_components)

      if (hasValidStructure) {
        console.log('Successfully parsed system design')

        // Transform Manager's response to match UI expectations if needed
        if (!design.architecture.components && design.architecture.key_components) {
          // Manager returns key_components as strings, create simplified Component objects
          design.architecture.components = design.architecture.key_components.map((name: string, idx: number) => ({
            name: name,
            type: 'Component',
            purpose: design.architecture.details?.overview || 'Core system component',
            technologies: [],
            scalability: design.architecture.details?.scalability_mechanisms?.[0] || 'Horizontal scaling',
            fault_tolerance: design.architecture.details?.fault_tolerance?.[0] || 'High availability'
          }))
          console.log('Transformed key_components to components array')
        }

        // Transform validation structure if needed
        if (!design.validation.potential_issues && design.validation.critical_issues) {
          design.validation.potential_issues = design.validation.critical_issues.map((issue: string) => ({
            issue: issue,
            severity: 'High',
            mitigation: 'See documentation for details'
          }))
          console.log('Transformed critical_issues to potential_issues array')
        }

        // Transform trade-off decisions if needed
        if (!design.architecture.trade_off_decisions && design.architecture.details?.tradeoff_decisions) {
          design.architecture.trade_off_decisions = design.architecture.details.tradeoff_decisions.map((td: any) => ({
            decision: td.decision,
            reasoning: 'See architecture details',
            trade_offs: ''
          }))
          console.log('Transformed tradeoff_decisions')
        }

        setSystemDesign(design as SystemDesign)
      } else {
        console.error('Could not find valid system_design structure')
        console.log('Available keys in result:', Object.keys(result.response?.result || {}))
        console.log('Design object:', design)
        alert('Failed to parse system design from agent response. The response structure does not match expected format. Check console for details.')
      }
    } catch (error) {
      console.error('Error generating design:', error)
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  const handleReset = () => {
    setSystemDesign(null)
    setSelectedComponent(null)
    setShowTradeOffs(false)
    setShowValidation(false)
    setEditMode(false)
    setEditingComponent(null)
  }

  const handleSaveComponent = (updatedComponent: Component) => {
    if (!systemDesign) return

    const updatedComponents = systemDesign.architecture.components?.map(c =>
      c.name === updatedComponent.name ? updatedComponent : c
    )

    setSystemDesign({
      ...systemDesign,
      architecture: {
        ...systemDesign.architecture,
        components: updatedComponents
      }
    })

    setEditingComponent(null)
    setSelectedComponent(updatedComponent)
  }

  const handleExport = () => {
    if (!systemDesign) return

    setExporting(true)

    // Create comprehensive report
    const report = {
      metadata: {
        project_name: systemDesign.project_name,
        architecture_style: systemDesign.architecture.architecture_style,
        version: systemDesign.version,
        generated_at: new Date().toISOString()
      },
      requirements: systemDesign.requirements,
      research: systemDesign.research,
      architecture: {
        overview: systemDesign.architecture.overview || systemDesign.architecture.summary,
        style: systemDesign.architecture.architecture_style,
        components: systemDesign.architecture.components,
        data_flow: systemDesign.architecture.details?.data_flow,
        scalability_mechanisms: systemDesign.architecture.details?.scalability_mechanisms,
        fault_tolerance: systemDesign.architecture.details?.fault_tolerance
      },
      trade_offs: systemDesign.architecture.trade_off_decisions,
      validation: {
        overall_assessment: systemDesign.validation.overall_assessment,
        summary: systemDesign.validation.summary,
        potential_issues: systemDesign.validation.potential_issues,
        critical_issues: systemDesign.validation.critical_issues,
        details: systemDesign.validation.details
      },
      cost_estimation: systemDesign.documentation?.cost_estimation,
      documentation: {
        summary: systemDesign.documentation?.summary,
        executive_summary: systemDesign.documentation?.executive_summary,
        details: systemDesign.documentation?.details
      }
    }

    // Download as JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${systemDesign.project_name.replace(/\s+/g, '_')}_System_Design_Report.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setTimeout(() => setExporting(false), 1000)
  }

  // Input Screen
  if (!systemDesign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Layers className="w-12 h-12 text-teal-400" />
              <h1 className="text-5xl font-bold text-white">System Design Agent</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Describe your system requirements and get an interactive architecture design
            </p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white text-xl">What system do you want to design?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: I need an e-commerce platform that handles 100K concurrent users with payment processing, real-time inventory, and PCI-DSS compliance..."
                value={systemRequirements}
                onChange={(e) => setSystemRequirements(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white min-h-[200px] text-lg"
                disabled={loading}
              />

              <Button
                onClick={handleGenerate}
                disabled={loading || !systemRequirements.trim()}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-14 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    {loadingStage}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Generate System Design
                  </>
                )}
              </Button>

              {!loading && (
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <button
                    onClick={() => setSystemRequirements('Social media platform with real-time messaging, 1M+ users, video streaming, and content moderation')}
                    className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-teal-600 transition-colors text-left"
                  >
                    <p className="text-sm font-medium text-white mb-1">Social Media Platform</p>
                    <p className="text-xs text-slate-400">Real-time messaging & streaming</p>
                  </button>
                  <button
                    onClick={() => setSystemRequirements('E-commerce platform handling 100K concurrent users with payment processing, inventory management, and PCI-DSS compliance')}
                    className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-teal-600 transition-colors text-left"
                  >
                    <p className="text-sm font-medium text-white mb-1">E-Commerce Platform</p>
                    <p className="text-xs text-slate-400">High traffic & compliance</p>
                  </button>
                  <button
                    onClick={() => setSystemRequirements('Healthcare system with patient records, appointment scheduling, telemedicine, and HIPAA compliance')}
                    className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-teal-600 transition-colors text-left"
                  >
                    <p className="text-sm font-medium text-white mb-1">Healthcare System</p>
                    <p className="text-xs text-slate-400">Telemedicine & HIPAA</p>
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Interactive Design Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{systemDesign.project_name}</h1>
            <p className="text-slate-400">{systemDesign.architecture.architecture_style}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowTradeOffs(!showTradeOffs)}
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-950"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Trade-Offs ({systemDesign.architecture.trade_off_decisions?.length || 0})
            </Button>
            <Button
              onClick={() => setShowValidation(!showValidation)}
              variant="outline"
              className="border-teal-600 text-teal-400 hover:bg-teal-950"
            >
              <Shield className="w-4 h-4 mr-2" />
              Validation
            </Button>
            <Button
              onClick={() => setEditMode(!editMode)}
              variant="outline"
              className={editMode ? "border-blue-600 text-blue-400 bg-blue-950" : "border-blue-600 text-blue-400 hover:bg-blue-950"}
            >
              <Server className="w-4 h-4 mr-2" />
              {editMode ? 'View Mode' : 'Edit Mode'}
            </Button>
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export Report'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <X className="w-4 h-4 mr-2" />
              New Design
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Architecture Visualization */}
          <div className="col-span-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-teal-400" />
                  Interactive Architecture Diagram
                </CardTitle>
                <p className="text-sm text-slate-400">Click on any component to view details</p>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950 rounded-lg p-6 border border-slate-700">
                  {/* Architecture Overview Badge */}
                  <div className="mb-6 p-4 bg-teal-900/20 border border-teal-800 rounded-lg">
                    <p className="text-sm text-slate-300">
                      {systemDesign.architecture.overview ||
                       systemDesign.architecture.summary ||
                       systemDesign.architecture.details?.overview ||
                       'System architecture overview'}
                    </p>
                  </div>

                  {/* Components Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {(systemDesign.architecture.components || []).map((component, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (editMode) {
                            setEditingComponent(component)
                            setSelectedComponent(null)
                          } else {
                            setSelectedComponent(component)
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left group hover:scale-105 relative ${
                          selectedComponent?.name === component.name
                            ? 'border-teal-500 shadow-lg shadow-teal-500/20'
                            : editingComponent?.name === component.name
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-slate-700 hover:border-teal-600'
                        }`}
                      >
                        {editMode && (
                          <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded">
                            <Server className="w-3 h-3" />
                          </div>
                        )}
                        <div className={`w-full h-24 bg-gradient-to-br ${getComponentColor(component.type)} rounded-lg mb-3 flex items-center justify-center`}>
                          <Server className="w-10 h-10 text-white" />
                        </div>
                        <h4 className="text-white font-semibold mb-1 group-hover:text-teal-400 transition-colors">
                          {component.name}
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">{component.type}</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          {component.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-teal-400">
                              {getTechIcon(tech)}
                            </span>
                          ))}
                          {component.technologies.length > 3 && (
                            <span className="text-xs text-slate-500">+{component.technologies.length - 3}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Connection Flow */}
                  <div className="mt-6 flex items-center justify-center gap-4 text-slate-500">
                    <span className="text-sm">Client</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm">Edge</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm">Services</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm">Data Layer</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost & Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-900/30 rounded-lg">
                      <DollarSign className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Monthly Cost</p>
                      <p className="text-lg font-bold text-white">
                        {systemDesign.documentation?.cost_estimation?.monthly_estimate || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-900/30 rounded-lg">
                      <Layers className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Components</p>
                      <p className="text-lg font-bold text-white">
                        {systemDesign.architecture.components?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-900/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Issues Found</p>
                      <p className="text-lg font-bold text-white">
                        {systemDesign.validation.potential_issues?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Component Details Panel */}
          <div className="col-span-4">
            {editingComponent ? (
              <ComponentEditor
                component={editingComponent}
                onSave={handleSaveComponent}
                onCancel={() => setEditingComponent(null)}
              />
            ) : selectedComponent ? (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{selectedComponent.name}</CardTitle>
                    <button
                      onClick={() => setSelectedComponent(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-teal-400">{selectedComponent.type}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Purpose</h4>
                    <p className="text-sm text-slate-400">{selectedComponent.purpose}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.technologies.map((tech, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-teal-900/30 text-teal-300 px-3 py-1.5 rounded-lg text-sm">
                          {getTechIcon(tech)}
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Scalability
                    </h4>
                    <p className="text-sm text-slate-400">{selectedComponent.scalability}</p>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      Fault Tolerance
                    </h4>
                    <p className="text-sm text-slate-400">{selectedComponent.fault_tolerance}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">
                      {editMode ? 'Click on a component to edit' : 'Click on a component to view details'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trade-Offs Panel */}
            {showTradeOffs && (
              <Card className="bg-orange-900/10 border-orange-800 mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      Trade-Off Analysis
                    </CardTitle>
                    <button onClick={() => setShowTradeOffs(false)} className="text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {(systemDesign.architecture.trade_off_decisions || []).map((tradeoff, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-orange-800/30 rounded-lg p-3">
                      <h5 className="text-white font-semibold mb-2 text-sm">{tradeoff.decision}</h5>
                      {tradeoff.reasoning && <p className="text-xs text-slate-400 mb-2">{tradeoff.reasoning}</p>}
                      {typeof tradeoff.trade_offs === 'object' && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {tradeoff.trade_offs.benefits && (
                            <div>
                              <p className="text-green-400 font-medium mb-1">Benefits</p>
                              {tradeoff.trade_offs.benefits.slice(0, 2).map((b: string, i: number) => (
                                <p key={i} className="text-slate-400 flex items-start gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                  {b}
                                </p>
                              ))}
                            </div>
                          )}
                          {tradeoff.trade_offs.costs && (
                            <div>
                              <p className="text-orange-400 font-medium mb-1">Costs</p>
                              {tradeoff.trade_offs.costs.slice(0, 2).map((c: string, i: number) => (
                                <p key={i} className="text-slate-400 flex items-start gap-1">
                                  <AlertTriangle className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                                  {c}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Validation Panel */}
            {showValidation && (
              <Card className="bg-teal-900/10 border-teal-800 mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-teal-400" />
                      Validation Report
                    </CardTitle>
                    <button onClick={() => setShowValidation(false)} className="text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {(systemDesign.validation.potential_issues || []).map((issue: any, idx: number) => (
                    <div key={idx} className="bg-slate-900/50 border border-teal-800/30 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold text-sm">{issue.issue}</h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          issue.severity === 'High' || issue.severity === 'Critical'
                            ? 'bg-red-900/30 text-red-300'
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      {issue.mitigation && (
                        <p className="text-xs text-teal-400">{issue.mitigation}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
