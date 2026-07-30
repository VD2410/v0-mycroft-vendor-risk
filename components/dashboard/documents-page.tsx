"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Trash2, Loader2, AlertCircle, File, FileSpreadsheet, FileImage } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getApiBaseUrl } from "@/lib/api"

const getBackendUrl = () => getApiBaseUrl();

interface Document {
  id: string
  document_id?: number
  filename: string
  name?: string
  file_name?: string
  file_type: string
  file_size: number
  uploaded_at: string
  created_at?: string
  status: string
}

function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return FileText
  if (fileType.includes('spreadsheet') || fileType.includes('csv') || fileType.includes('excel')) return FileSpreadsheet
  if (fileType.includes('image')) return FileImage
  return File
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) { setError("Please sign in to view documents"); setIsLoading(false); return }
      const companyId = localStorage.getItem('wisr_company_id')
      if (!companyId) { setError("No company selected"); setIsLoading(false); return }
      const response = await fetch(`${getApiBaseUrl()}/api/documents?companyId=${companyId}`, { headers: { 'Authorization': `Bearer ${session.access_token}` } })
      if (response.ok) {
        const data = await response.json()
        // Handle multiple response formats
        let docs = data.documents || data.body?.data || data.body || []
        // Normalize field names from backend
        docs = docs.map((d: any) => ({
          id: d.id || d.document_id?.toString() || '',
          document_id: d.document_id,
          filename: d.filename || d.file_name || d.name || d.pdfname || 'Unknown',
          file_type: d.file_type || 'application/pdf',
          file_size: d.file_size || 0,
          uploaded_at: d.uploaded_at || d.created_at || new Date().toISOString(),
          status: d.status || 'ready',
        }))
        setDocuments(docs)
      }
      else { const errData = await response.json().catch(() => ({})); setError(errData.error || 'Failed to load documents') }
    } catch (err) { console.error("Error fetching documents:", err); setError("Failed to load documents") }
    finally { setIsLoading(false) }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    try {
      setIsUploading(true); setError(null)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) { setError("Please sign in to upload documents"); setIsUploading(false); return }
      const companyId = localStorage.getItem('wisr_company_id')
      if (!companyId) { setError("No company selected"); setIsUploading(false); return }
      // Upload files one at a time (backend uses multer.single('file'))
      let allSuccess = true
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('companyId', companyId)
        const response = await fetch(`${getApiBaseUrl()}/api/documents/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${session.access_token}` }, body: formData })
        if (!response.ok) { const errData = await response.json().catch(() => ({})); setError(errData.error || `Upload failed for ${files[i].name}`); allSuccess = false; break }
      }
      if (allSuccess) { await fetchDocuments() }
    } catch (err) { console.error("Error uploading:", err); setError("Upload failed. Please try again.") }
    finally { setIsUploading(false); if (fileInputRef.current) { fileInputRef.current.value = '' } }
  }

  const handleDelete = async (docId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return
      const response = await fetch(`${getApiBaseUrl()}/api/documents/${docId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${session.access_token}` } })
      if (response.ok) { setDocuments(documents.filter(d => d.id !== docId)) } else { setError('Failed to delete document') }
    } catch (err) { console.error("Error deleting document:", err); setError("Failed to delete document") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Upload and manage documents for AI-powered analysis</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls" onChange={handleUpload} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="gap-2">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload Documents'}
          </Button>
        </div>
      </div>
      {error && (<Card className="bg-red-50 border-red-200"><CardContent className="pt-4 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-600" /><p className="text-red-700 text-sm">{error}</p></CardContent></Card>)}
      {isLoading && (<Card className="bg-card border-border"><CardContent className="pt-6 flex items-center justify-center gap-3"><Loader2 className="w-5 h-5 animate-spin text-primary" /><p className="text-muted-foreground">Loading documents...</p></CardContent></Card>)}
      {!isLoading && documents.length === 0 && !error && (<Card className="bg-card border-border border-dashed"><CardContent className="pt-12 pb-12 text-center"><div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-muted-foreground" /></div><h3 className="text-lg font-medium text-foreground mb-2">No documents yet</h3><p className="text-muted-foreground mb-6 max-w-sm mx-auto">Upload documents to analyze them with AI. Supported formats: PDF, DOC, DOCX, TXT, CSV, XLSX.</p><Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2"><Upload className="w-4 h-4" />Upload Your First Document</Button></CardContent></Card>)}
      {!isLoading && documents.length > 0 && (<Card className="bg-card border-border"><CardHeader><CardTitle className="text-base">{documents.length} document{documents.length !== 1 ? 's' : ''}</CardTitle></CardHeader><CardContent><div className="space-y-2">{documents.map((doc) => { const FileIcon = getFileIcon(doc.file_type); return (<div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileIcon className="w-5 h-5 text-primary" /></div><div><div className="font-medium text-foreground text-sm">{doc.filename}</div><div className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)} \u2022 Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</div></div></div><div className="flex items-center gap-3"><Badge variant="outline" className={doc.status === 'processed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : doc.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-muted text-muted-foreground'}>{doc.status || 'uploaded'}</Badge><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete(doc.id)}><Trash2 className="w-4 h-4" /></Button></div></div>) })}</div></CardContent></Card>)}
    </div>
  )
}
