import { useState, useEffect } from "react";
import { User, IncidentReport } from "@/types/incident";
import { AuthForm } from "./AuthForm";
import { IncidentForm, IncidentFormData } from "./IncidentForm";
import { AdminDashboard } from "./AdminDashboard";
import { UserDashboard } from "./UserDashboard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Shield, User as UserIcon, Plus, Home } from "lucide-react";

type ViewMode = 'dashboard' | 'new-report' | 'admin';

export function IncidentPortalApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  // Mock data - in real app, this would come from Supabase
  const [incidents, setIncidents] = useState<IncidentReport[]>([
    {
      id: "inc-001",
      title: "Suspicious phishing email received",
      incident_type: "phishing",
      description: "I received an email claiming to be from our IT department asking for password reset. The email had a suspicious link and came from an external domain.",
      date_occurred: "2024-01-30T10:30:00Z",
      status: "open",
      reporter_id: "user-1",
      reporter_name: "John Doe",
      priority: "high",
      created_at: "2024-01-30T10:35:00Z",
      updated_at: "2024-01-30T10:35:00Z",
      file_attachments: []
    },
    {
      id: "inc-002", 
      title: "Unauthorized access attempt detected",
      incident_type: "unauthorized_access",
      description: "Our system logs show multiple failed login attempts from an unknown IP address trying to access my account between 2-3 AM.",
      date_occurred: "2024-01-29T02:15:00Z",
      status: "under_review",
      reporter_id: "user-2",
      reporter_name: "Jane Smith",
      priority: "critical",
      created_at: "2024-01-29T08:00:00Z",
      updated_at: "2024-01-30T09:00:00Z",
      admin_notes: "Investigating the source IP. Implementing additional security measures.",
      file_attachments: []
    },
    {
      id: "inc-003",
      title: "Malware detected on workstation",
      incident_type: "malware",
      description: "Antivirus software detected and quarantined a trojan on my workstation. The file was downloaded from an unknown source.",
      date_occurred: "2024-01-28T14:20:00Z",
      status: "resolved",
      reporter_id: "user-3",
      reporter_name: "Mike Johnson",
      priority: "medium",
      created_at: "2024-01-28T14:25:00Z",
      updated_at: "2024-01-29T10:00:00Z",
      admin_notes: "Malware removed and system cleaned. User educated on safe browsing practices.",
      file_attachments: []
    }
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleAuth = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    toast({
      title: "Welcome to Cyber Incident Portal",
      description: `Signed in as ${user.name} (${user.role})`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleSubmitReport = (data: IncidentFormData) => {
    const newIncident: IncidentReport = {
      id: `inc-${String(incidents.length + 1).padStart(3, '0')}`,
      title: data.title,
      incident_type: data.incident_type as any,
      description: data.description,
      date_occurred: data.date_occurred,
      status: 'open',
      reporter_id: currentUser?.id || 'current-user',
      reporter_name: currentUser?.name || 'Current User',
      priority: data.priority as any,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      file_attachments: data.files?.map(f => f.name) || []
    };

    setIncidents(prev => [newIncident, ...prev]);
    setCurrentView('dashboard');
    
    toast({
      title: "Report Submitted",
      description: `Incident report #${newIncident.id.slice(-3)} has been submitted successfully.`,
    });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === id 
        ? { ...incident, status: status as any, updated_at: new Date().toISOString() }
        : incident
    ));
  };

  const handleAddNote = (id: string, note: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === id 
        ? { ...incident, admin_notes: note, updated_at: new Date().toISOString() }
        : incident
    ));
  };

  const handleAssignUser = (id: string, userId: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === id 
        ? { ...incident, assigned_to: userId, updated_at: new Date().toISOString() }
        : incident
    ));
  };

  const userIncidents = currentUser ? incidents.filter(i => i.reporter_id === currentUser.id) : [];

  if (!currentUser) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Navigation Header */}
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-primary rounded-lg p-2">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  CyberGuard Portal
                </span>
              </div>
              
              <div className="hidden md:flex space-x-4">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('dashboard')}
                  size="sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'new-report' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('new-report')}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Button>
                {currentUser.role === 'admin' && (
                  <Button
                    variant={currentView === 'admin' ? 'default' : 'ghost'}
                    onClick={() => setCurrentView('admin')}
                    size="sm"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                  {currentUser.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <UserDashboard
            incidents={userIncidents}
            onNewReport={() => setCurrentView('new-report')}
          />
        )}
        
        {currentView === 'new-report' && (
          <IncidentForm
            onSubmit={handleSubmitReport}
          />
        )}
        
        {currentView === 'admin' && currentUser.role === 'admin' && (
          <AdminDashboard
            incidents={incidents}
            onUpdateStatus={handleUpdateStatus}
            onAddNote={handleAddNote}
            onAssignUser={handleAssignUser}
          />
        )}
      </main>
    </div>
  );
}