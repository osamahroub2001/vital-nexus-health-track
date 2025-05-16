
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

  // Simulate loading patients and alerts
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await simulationAPI.simulateData();
        toast({
          title: "Data loaded",
          description: "Sample healthcare data has been loaded."
        });
      } catch (error) {
        console.error("Failed to initialize data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only do this when the component mounts
    initializeData();
  }, [toast]);

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== alertId));
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
                      <div className="text-2xl font-bold">20</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Across 5 regions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-alert-600">{alerts.length || 3}</div>
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
                      <div className="text-2xl font-bold">10</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Various specializations
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Critical Patients</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
                      See all
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="h-32 animate-pulse bg-muted" />
                      ))
                    ) : (
                      <>
                        <PatientCard 
                          patient={{ 
                            _id: '1', 
                            name: 'James Wilson', 
                            age: 67, 
                            gender: 'Male',
                            region: 'East'
                          }} 
                          lastVitals={{ 
                            heart_rate: 45, 
                            temperature: 37.2, 
                            oxygen_level: 93 
                          }}
                          hasAlert={true}
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '2', 
                            name: 'Emily Johnson', 
                            age: 72, 
                            gender: 'Female',
                            blood_type: 'A+',
                            region: 'West'
                          }} 
                          lastVitals={{ 
                            heart_rate: 142, 
                            temperature: 39.1, 
                            oxygen_level: 90 
                          }}
                          hasAlert={true}
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '3', 
                            name: 'Michael Brown', 
                            age: 56, 
                            gender: 'Male',
                            blood_type: 'O+',
                            region: 'North'
                          }} 
                          lastVitals={{ 
                            heart_rate: 95, 
                            temperature: 38.8, 
                            oxygen_level: 87 
                          }}
                          hasAlert={true}
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '4', 
                            name: 'Sarah Davis', 
                            age: 41, 
                            gender: 'Female',
                            blood_type: 'B-',
                            region: 'Central'
                          }} 
                          lastVitals={{ 
                            heart_rate: 122, 
                            temperature: 37.9, 
                            oxygen_level: 95 
                          }}
                          hasAlert={false}
                        />
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patients">
                <div className="space-y-4 mt-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recently Added Patients</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
                      See all
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="h-40 animate-pulse bg-muted" />
                      ))
                    ) : (
                      <>
                        <PatientCard 
                          patient={{ 
                            _id: '5', 
                            name: 'Robert Miller', 
                            age: 62, 
                            gender: 'Male',
                            blood_type: 'AB+',
                            region: 'South'
                          }} 
                          lastVitals={{ 
                            heart_rate: 88, 
                            temperature: 36.9, 
                            oxygen_level: 98 
                          }}
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '6', 
                            name: 'Jennifer Lee', 
                            age: 35, 
                            gender: 'Female',
                            blood_type: 'A-',
                            region: 'Central'
                          }} 
                          lastVitals={{ 
                            heart_rate: 72, 
                            temperature: 36.5, 
                            oxygen_level: 99 
                          }}
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '7', 
                            name: 'Thomas Wang', 
                            age: 47, 
                            gender: 'Male',
                            blood_type: 'B+',
                            region: 'East'
                          }} 
                          lastVitals={{ 
                            heart_rate: 78, 
                            temperature: 36.7, 
                            oxygen_level: 97 
                          }}
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '8', 
                            name: 'Sophia Garcia', 
                            age: 29, 
                            gender: 'Female',
                            blood_type: 'O-',
                            region: 'West'
                          }} 
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '9', 
                            name: 'Daniel Kim', 
                            age: 51, 
                            gender: 'Male',
                            blood_type: 'A+',
                            region: 'North'
                          }} 
                        />
                        <PatientCard 
                          patient={{ 
                            _id: '10', 
                            name: 'Olivia Smith', 
                            age: 22, 
                            gender: 'Female',
                            blood_type: 'AB-',
                            region: 'South'
                          }} 
                        />
                      </>
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
                ) : (
                  <>
                    <AlertBadge 
                      alertId="alert1"
                      patientName="James Wilson"
                      alerts={[
                        {
                          vital: 'heart_rate',
                          value: 45,
                          threshold_min: 60,
                          threshold_max: 100,
                          timestamp: new Date().toISOString()
                        }
                      ]}
                      status="new"
                      timestamp={new Date().toISOString()}
                      onResolved={() => handleResolveAlert('alert1')}
                    />
                    <AlertBadge 
                      alertId="alert2"
                      patientName="Emily Johnson"
                      alerts={[
                        {
                          vital: 'temperature',
                          value: 39.1,
                          threshold_min: 35.0,
                          threshold_max: 38.0,
                          timestamp: new Date().toISOString()
                        },
                        {
                          vital: 'heart_rate',
                          value: 142,
                          threshold_min: 60,
                          threshold_max: 100,
                          timestamp: new Date().toISOString()
                        }
                      ]}
                      status="new"
                      timestamp={new Date().toISOString()}
                      onResolved={() => handleResolveAlert('alert2')}
                    />
                    <AlertBadge 
                      alertId="alert3"
                      patientName="Michael Brown"
                      alerts={[
                        {
                          vital: 'oxygen_level',
                          value: 87,
                          threshold_min: 95,
                          threshold_max: 100,
                          timestamp: new Date().toISOString()
                        }
                      ]}
                      status="new"
                      timestamp={new Date().toISOString()}
                      onResolved={() => handleResolveAlert('alert3')}
                    />
                  </>
                )}
                
                {!isLoading && alerts.length === 0 && (
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
