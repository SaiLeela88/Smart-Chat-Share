import { useState } from "react";
import { IncidentReport } from "@/types/incident";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Calendar, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface UserDashboardProps {
  incidents: IncidentReport[];
  onNewReport: () => void;
  onEditReport?: (id: string) => void;
  onWithdrawReport?: (id: string) => void;
}

export function UserDashboard({ incidents, onNewReport, onEditReport, onWithdrawReport }: UserDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

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

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    under_review: incidents.filter(i => i.status === 'under_review').length,
    resolved: incidents.filter(i => i.status === 'resolved').length
  };

  const canEdit = (incident: IncidentReport) => {
    return incident.status === 'open';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Incident Reports
          </h1>
          <p className="text-muted-foreground">Track and manage your security incident reports</p>
        </div>
        <Button onClick={onNewReport} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-500">{stats.open}</div>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-500">{stats.under_review}</div>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>View and manage your submitted incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No reports match your search criteria." : "You haven't submitted any incident reports yet."}
                </p>
                <Button onClick={onNewReport} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Report
                </Button>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <Card key={incident.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{incident.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            #{incident.id.slice(-6)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {incident.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(incident.created_at), 'MMM dd, yyyy')}
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {incident.incident_type.replace('_', ' ')}
                          </Badge>
                          <Badge className={`capitalize ${getPriorityColor(incident.priority)}`}>
                            {incident.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(incident.status)}`}>
                          {incident.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedIncident(incident)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{selectedIncident?.title}</DialogTitle>
                                <DialogDescription>
                                  Report #{selectedIncident?.id.slice(-6)} - 
                                  Submitted on {selectedIncident && format(new Date(selectedIncident.created_at), 'PPP')}
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
                                      <h4 className="font-semibold">Status</h4>
                                      <Badge className={`${getStatusColor(selectedIncident.status)}`}>
                                        {selectedIncident.status.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Date Occurred</h4>
                                      <p>{format(new Date(selectedIncident.date_occurred), 'PPp')}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Description</h4>
                                    <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                                      {selectedIncident.description}
                                    </p>
                                  </div>
                                  {selectedIncident.admin_notes && (
                                    <div>
                                      <h4 className="font-semibold">Admin Updates</h4>
                                      <div className="bg-primary/5 border border-primary/20 p-3 rounded">
                                        <p className="text-sm">{selectedIncident.admin_notes}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Last updated: {format(new Date(selectedIncident.updated_at), 'PPp')}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {canEdit(incident) && onEditReport && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditReport(incident.id)}
                            >
                              Edit
                            </Button>
                          )}
                          {canEdit(incident) && onWithdrawReport && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onWithdrawReport(incident.id)}
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}