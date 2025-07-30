import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X } from "lucide-react";

interface IncidentFormProps {
  onSubmit: (data: IncidentFormData) => void;
  loading?: boolean;
}

export interface IncidentFormData {
  title: string;
  incident_type: string;
  description: string;
  date_occurred: string;
  priority: string;
  files?: File[];
}

export function IncidentForm({ onSubmit, loading }: IncidentFormProps) {
  const [formData, setFormData] = useState<IncidentFormData>({
    title: "",
    incident_type: "",
    description: "",
    date_occurred: "",
    priority: "medium"
  });
  const [files, setFiles] = useState<File[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const { toast } = useToast();

  const incidentTypes = [
    { value: "phishing", label: "Phishing Attack" },
    { value: "malware", label: "Malware/Virus" },
    { value: "data_breach", label: "Data Breach" },
    { value: "unauthorized_access", label: "Unauthorized Access" },
    { value: "suspicious_activity", label: "Suspicious Activity" },
    { value: "other", label: "Other" }
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum 5 files allowed per report.",
        variant: "destructive"
      });
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateAISuggestion = async () => {
    if (!formData.description.trim()) {
      toast({
        title: "No description",
        description: "Please provide a description first to get AI suggestions.",
      });
      return;
    }
    
    // In real implementation, this would call Gemini API via Supabase Edge Function
    setAiSuggestion("AI suggestion: Based on your description, this appears to be a phishing attempt. Consider checking email headers and reporting the sender domain.");
    toast({
      title: "AI Analysis Complete",
      description: "Threat assessment and recommendations generated.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.incident_type || !formData.description || !formData.date_occurred) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    onSubmit({ ...formData, files });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Report Security Incident
        </CardTitle>
        <CardDescription>
          Provide detailed information about the security incident you encountered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Incident Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief summary of the incident"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incident_type">Incident Type *</Label>
              <Select 
                value={formData.incident_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, incident_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_occurred">Date & Time Occurred *</Label>
              <Input
                id="date_occurred"
                type="datetime-local"
                value={formData.date_occurred}
                onChange={(e) => setFormData(prev => ({ ...prev, date_occurred: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Detailed Description *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAISuggestion}
                className="text-xs"
              >
                🤖 Get AI Analysis
              </Button>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about what happened, when it occurred, and any steps you've already taken..."
              className="min-h-[120px]"
              required
            />
            {aiSuggestion && (
              <div className="p-3 bg-gradient-primary/10 border border-primary/20 rounded-md">
                <p className="text-sm text-foreground">{aiSuggestion}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>File Attachments (Optional)</Label>
            <div className="border border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload screenshots, logs, or documents (Max 5 files, 10MB each)
              </p>
              <Input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.txt,.log,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm">
                  Choose Files
                </Button>
              </Label>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-primary">
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}