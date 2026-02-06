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
  reasoning: string
  trade_offs: string | { benefits?: string[], costs?: string[] }
  mitigation?: string
  reference?: string
}

interface Architecture {
  overview: string
  architecture_style: string
  components: Component[]
  trade_off_decisions: TradeOff[]
}

interface Validation {
  scalability_assessment: any
  fault_tolerance_review: any
  security_evaluation: any
  potential_issues: any[]
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
  documentation: {
    cost_estimation: CostEstimation
  }
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

export default function Home() {
  const [systemRequirements, setSystemRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [systemDesign, setSystemDesign] = useState<SystemDesign | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [showTradeOffs, setShowTradeOffs] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

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

      if (result.success && result.response.result?.system_design) {
        setSystemDesign(result.response.result.system_design as SystemDesign)
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

  const handleReset = () => {
    setSystemDesign(null)
    setSelectedComponent(null)
    setShowTradeOffs(false)
    setShowValidation(false)
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
              Trade-Offs ({systemDesign.architecture.trade_off_decisions.length})
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
                    <p className="text-sm text-slate-300">{systemDesign.architecture.overview}</p>
                  </div>

                  {/* Components Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {systemDesign.architecture.components.map((component, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedComponent(component)}
                        className={`p-4 rounded-lg border-2 transition-all text-left group hover:scale-105 ${
                          selectedComponent?.name === component.name
                            ? 'border-teal-500 shadow-lg shadow-teal-500/20'
                            : 'border-slate-700 hover:border-teal-600'
                        }`}
                      >
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
                        {systemDesign.documentation.cost_estimation.monthly_estimate || 'N/A'}
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
                        {systemDesign.architecture.components.length}
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
                        {systemDesign.validation.potential_issues.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Component Details Panel */}
          <div className="col-span-4">
            {selectedComponent ? (
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
                    <p className="text-slate-400 text-sm">Click on a component to view details</p>
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
                  {systemDesign.architecture.trade_off_decisions.map((tradeoff, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-orange-800/30 rounded-lg p-3">
                      <h5 className="text-white font-semibold mb-2 text-sm">{tradeoff.decision}</h5>
                      <p className="text-xs text-slate-400 mb-2">{tradeoff.reasoning}</p>
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
                  {systemDesign.validation.potential_issues.map((issue: any, idx: number) => (
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
