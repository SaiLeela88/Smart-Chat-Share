import { useState } from "react";
import { IncidentReport } from "@/types/incident";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Eye, MessageSquare, UserPlus, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AdminDashboardProps {
  incidents: IncidentReport[];
  onUpdateStatus: (id: string, status: string) => void;
  onAddNote: (id: string, note: string) => void;
  onAssignUser: (id: string, userId: string) => void;
}

export function AdminDashboard({ incidents, onUpdateStatus, onAddNote, onAssignUser }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-500/10 text-red-500 border-red-500/20",
      under_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      resolved: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-gray-500/10 text-gray-500 border-gray-500/20"
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      critical: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.reporter_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesType = typeFilter === "all" || incident.incident_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusUpdate = (incident: IncidentReport, newStatus: string) => {
    onUpdateStatus(incident.id, newStatus);
    toast({
      title: "Status Updated",
      description: `Incident #${incident.id.slice(-6)} status changed to ${newStatus}`,
    });
  };

  const handleAddNote = () => {
    if (!selectedIncident || !adminNote.trim()) return;
    
    onAddNote(selectedIncident.id, adminNote);
    setAdminNote("");
    toast({
      title: "Note Added",
      description: "Admin note has been added to the incident",
    });
  };

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    under_review: incidents.filter(i => i.status === 'under_review').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    critical: incidents.filter(i => i.priority === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">{stats.open}</div>
            <p className="text-sm text-muted-foreground">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-500">{stats.under_review}</div>
            <p className="text-sm text-muted-foreground">Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-sm text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Management</CardTitle>
          <CardDescription>View and manage all security incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="malware">Malware</SelectItem>
                <SelectItem value="data_breach">Data Breach</SelectItem>
                <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Incidents Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">
                      #{incident.id.slice(-6)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {incident.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {incident.incident_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.reporter_name}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={incident.status} 
                        onValueChange={(value) => handleStatusUpdate(incident, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={`capitalize ${getStatusColor(incident.status)}`}>
                            {incident.status.replace('_', ' ')}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(incident.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedIncident(incident)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Incident Details</DialogTitle>
                              <DialogDescription>
                                Report #{incident.id.slice(-6)} - {incident.title}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedIncident && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Type</h4>
                                    <p className="capitalize">{selectedIncident.incident_type.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Priority</h4>
                                    <Badge className={`capitalize ${getPriorityColor(selectedIncident.priority)}`}>
                                      {selectedIncident.priority}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Reporter</h4>
                                    <p>{selectedIncident.reporter_name}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Date Occurred</h4>
                                    <p>{format(new Date(selectedIncident.date_occurred), 'PPpp')}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Description</h4>
                                  <p className="text-sm bg-muted p-3 rounded">{selectedIncident.description}</p>
                                </div>
                                {selectedIncident.admin_notes && (
                                  <div>
                                    <h4 className="font-semibold">Admin Notes</h4>
                                    <p className="text-sm bg-primary/5 p-3 rounded border border-primary/20">
                                      {selectedIncident.admin_notes}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-semibold mb-2">Add Admin Note</h4>
                                  <Textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add internal notes or updates..."
                                    className="mb-2"
                                  />
                                  <Button onClick={handleAddNote} size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Add Note
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}