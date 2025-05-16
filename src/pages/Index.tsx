
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import PatientCard from '@/components/PatientCard';
import AlertBadge from '@/components/AlertBadge';
import SimulationPanel from '@/components/SimulationPanel';
import { patientAPI, simulationAPI } from '@/services/api';
import { Activity, Users, UserPlus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [criticalPatients, setCriticalPatients] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    alertsCount: 0
  });

  // Load data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Initialize mock data on the backend
        await simulationAPI.simulateData();
        
        // In a real implementation, we would fetch the dashboard data
        // For now, we'll leave the arrays empty and set stats to 0
        setAlerts([]);
        setCriticalPatients([]);
        setRecentPatients([]);
        setStats({
          totalPatients: 0,
          totalDoctors: 0,
          alertsCount: 0
        });
        
        toast({
          title: "Data loaded",
          description: "Healthcare data has been loaded."
        });
      } catch (error) {
        console.error("Failed to initialize data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only do this when the component mounts
    initializeData();
  }, [toast]);

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Resolved",
      description: "The patient alert has been marked as resolved."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Healthcare Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/patients">
                <Users className="h-4 w-4 mr-2" />
                Manage Patients
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/patients/new">
                <UserPlus className="h-4 w-4 mr-2" />
                New Patient
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="patients">Recent Patients</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalPatients}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Across all regions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-alert-600">{stats.alertsCount}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requiring attention
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Various specializations
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Critical Patients</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                      <Link to="/patients">See all</Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="h-32 animate-pulse bg-muted" />
                      ))
                    ) : criticalPatients.length > 0 ? (
                      criticalPatients.map(patient => (
                        <Link key={patient._id} to={`/patients/${patient._id}`} className="block hover:no-underline">
                          <PatientCard 
                            patient={{ 
                              _id: patient._id, 
                              name: patient.name, 
                              age: patient.age, 
                              gender: patient.gender,
                              region: patient.region,
                              blood_type: patient.blood_type
                            }} 
                            lastVitals={patient.lastVitals}
                            hasAlert={patient.hasAlert}
                          />
                        </Link>
                      ))
                    ) : (
                      <Card className="col-span-2">
                        <CardContent className="flex flex-col items-center justify-center p-8">
                          <Activity className="h-10 w-10 mb-2 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">No critical patients</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patients">
                <div className="space-y-4 mt-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recently Added Patients</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                      <Link to="/patients">See all</Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="h-40 animate-pulse bg-muted" />
                      ))
                    ) : recentPatients.length > 0 ? (
                      recentPatients.map(patient => (
                        <Link key={patient._id} to={`/patients/${patient._id}`} className="block hover:no-underline">
                          <PatientCard 
                            patient={{ 
                              _id: patient._id, 
                              name: patient.name, 
                              age: patient.age, 
                              gender: patient.gender,
                              blood_type: patient.blood_type,
                              region: patient.region
                            }} 
                            lastVitals={patient.lastVitals}
                            hasAlert={patient.hasAlert}
                          />
                        </Link>
                      ))
                    ) : (
                      <Card className="col-span-3">
                        <CardContent className="flex flex-col items-center justify-center p-8">
                          <Users className="h-10 w-10 mb-2 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">No patients found</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Alerts</CardTitle>
                    <CardDescription>
                      Patient vitals requiring attention
                    </CardDescription>
                  </div>
                  <AlertCircle className="h-5 w-5 text-alert-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-8 animate-pulse bg-muted rounded-full" />
                  ))
                ) : alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <AlertBadge 
                      key={index}
                      alertId={alert.id}
                      patientName={alert.patientName}
                      alerts={alert.alerts}
                      status={alert.status}
                      timestamp={alert.timestamp}
                      onResolved={() => handleResolveAlert(alert.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <SimulationPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
