
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import VitalsChart from "@/components/VitalsChart";
import AlertBadge from "@/components/AlertBadge";
import { patientAPI, relationshipAPI } from "@/services/api";
import { Patient, VitalSign, Alert, PatientDoctorRelationship } from "@/types";
import { Activity, ArrowLeft, FileText, UserCircle, Users, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientDetails = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [doctors, setDoctors] = useState<PatientDoctorRelationship[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      try {
        // Fetch patient details
        const patientData = await patientAPI.getPatient(patientId);
        setPatient(patientData);
        
        // Fetch patient vitals
        const vitalsData = await patientAPI.getVitals(patientId);
        setVitals(vitalsData || []);
        
        // Fetch patient alerts
        const alertsData = await patientAPI.getAlerts(patientId);
        setAlerts(alertsData || []);
        
        // Fetch patient's doctors
        const doctorsData = await relationshipAPI.getPatientDoctors(patientId);
        setDoctors(doctorsData || []);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again later.",
          variant: "destructive",
        });
        
        // Set empty data on error
        setPatient(null);
        setVitals([]);
        setAlerts([]);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, [patientId, toast]);
  
  const handleResolveAlert = async (alertId: string) => {
    try {
      await patientAPI.resolveAlert(alertId);
      // Update alerts list by removing the resolved alert
      setAlerts(prevAlerts => prevAlerts.filter(alert => `alert-${alert.patient_id}` !== alertId));
      toast({
        title: "Alert resolved",
        description: "The patient alert has been marked as resolved."
      });
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getLatestVitals = () => {
    if (!vitals || vitals.length === 0) return null;
    
    const sortedVitals = [...vitals].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sortedVitals[0];
  };
  
  const latestVitals = getLatestVitals();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/patients">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Patients
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoading ? "Loading..." : patient?.name || "Patient Details"}
            </h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Add Medical Record
              </Button>
              <Button size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 animate-pulse bg-muted rounded-lg"></div>
            <div className="lg:col-span-2 h-64 animate-pulse bg-muted rounded-lg"></div>
          </div>
        ) : patient ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCircle className="h-5 w-5 mr-2" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">{patient?.name}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge variant="outline">
                          {patient?.gender || "Unknown"}
                        </Badge>
                        <Badge variant="outline">
                          {patient?.age} years
                        </Badge>
                        {patient?.blood_type && (
                          <Badge variant="outline" className="bg-medical-50 text-medical-700">
                            {patient.blood_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Medical History</p>
                      <div className="space-y-2">
                        {patient?.medical_history?.conditions && patient.medical_history.conditions.length > 0 ? (
                          <div>
                            <p className="text-sm text-muted-foreground">Conditions:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.medical_history.conditions.map((condition, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">No conditions recorded</p>
                        )}
                        
                        {patient?.medical_history?.allergies && patient.medical_history.allergies.length > 0 ? (
                          <div>
                            <p className="text-sm text-muted-foreground">Allergies:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.medical_history.allergies.map((allergy, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-alert-50 text-alert-800">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">No allergies recorded</p>
                        )}
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Surgeries:</p>
                          <p className="text-sm">{patient?.medical_history?.surgeries || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Region</p>
                      <p>{patient?.region || "Unknown"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Care Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {doctors.length > 0 ? (
                    <div className="space-y-4">
                      {doctors.map((doctor, index) => (
                        <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                          <p className="font-medium">
                            <Link to={`/doctors/${doctor.doctor_id}`} className="hover:text-healthcare-600">
                              {doctor.doctor_name}
                            </Link>
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="bg-medical-50 text-medical-700">
                              {doctor.specialization}
                            </Badge>
                            <span className="text-xs text-muted-foreground capitalize">
                              {doctor.relationship_type.replace('_', ' ').toLowerCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No assigned doctors</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.length > 0 ? (
                      alerts.map((alert, index) => (
                        <AlertBadge 
                          key={index}
                          alertId={`alert-${index}`}
                          patientName={alert.patient_name}
                          alerts={alert.alerts}
                          status={alert.status}
                          timestamp={alert.created_at}
                          onResolved={() => handleResolveAlert(`alert-${index}`)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No active alerts</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  {latestVitals ? (
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Heart Rate</p>
                        <p className={`text-2xl font-bold ${(latestVitals.heart_rate || 0) < 60 || (latestVitals.heart_rate || 0) > 100 ? 'text-alert-600' : 'text-healthcare-600'}`}>
                          {latestVitals.heart_rate || '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">bpm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Systolic</p>
                        <p className={`text-2xl font-bold ${(latestVitals.blood_pressure_systolic || 0) < 90 || (latestVitals.blood_pressure_systolic || 0) > 140 ? 'text-alert-600' : 'text-healthcare-600'}`}>
                          {latestVitals.blood_pressure_systolic || '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">mmHg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Diastolic</p>
                        <p className={`text-2xl font-bold ${(latestVitals.blood_pressure_diastolic || 0) < 60 || (latestVitals.blood_pressure_diastolic || 0) > 90 ? 'text-alert-600' : 'text-healthcare-600'}`}>
                          {latestVitals.blood_pressure_diastolic || '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">mmHg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Temperature</p>
                        <p className={`text-2xl font-bold ${(latestVitals.temperature || 0) < 36 || (latestVitals.temperature || 0) > 38 ? 'text-alert-600' : 'text-healthcare-600'}`}>
                          {latestVitals.temperature || '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">°C</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Oxygen</p>
                        <p className={`text-2xl font-bold ${(latestVitals.oxygen_level || 0) < 95 ? 'text-alert-600' : 'text-healthcare-600'}`}>
                          {latestVitals.oxygen_level || '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No vital signs recorded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <VitalsChart data={vitals} title="Vital Signs History (Last 24 Hours)" />
            </div>
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <UserCircle className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">Patient not found</p>
              <Button variant="outline" asChild>
                <Link to="/patients">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Patients
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PatientDetails;
