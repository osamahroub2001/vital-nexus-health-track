
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { doctorAPI } from "@/services/api";
import { AssignPatientForm } from "@/components/AssignPatientForm";
import { ArrowLeft, UserPlus, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DoctorDetails = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [doctor, setDoctor] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return;
      
      setIsLoading(true);
      try {
        // Fetch doctor's patients
        const patientsData = await doctorAPI.getPatients(doctorId);
        setPatients(patientsData || []);
        
        // Note: The backend doesn't seem to have an endpoint to fetch doctor details
        // So we'll use mock data for demonstration
        setDoctor({
          _id: doctorId,
          name: `Dr. ${["Robert Smith", "Sarah Johnson", "Michael Brown", "Jennifer Lee", "James Wilson"][Math.floor(Math.random() * 5)]}`,
          specialization: ["Cardiology", "Neurology", "Oncology", "Pediatrics", "General Practice", "Surgery"][Math.floor(Math.random() * 6)],
          region: ["North", "South", "East", "West", "Central"][Math.floor(Math.random() * 5)]
        });
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast({
          title: "Error",
          description: "Failed to load doctor data. Using sample data instead.",
          variant: "destructive",
        });
        
        // Use sample data
        setDoctor({
          _id: doctorId,
          name: "Dr. Robert Smith",
          specialization: "Cardiology",
          region: "North"
        });
        
        setPatients([
          {
            patient_id: "p1",
            patient_name: "James Wilson",
            relationship_type: "PRIMARY_CARE",
            since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            patient_id: "p2",
            patient_name: "Emily Johnson",
            relationship_type: "PRIMARY_CARE",
            since: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            patient_id: "p3",
            patient_name: "Michael Brown",
            relationship_type: "CONSULTING",
            since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorData();
  }, [doctorId, toast]);
  
  const handleAssignPatient = async () => {
    setDialogOpen(false);
    await fetchPatients();
    toast({
      title: "Success",
      description: "Patient has been assigned to the doctor.",
    });
  };
  
  const fetchPatients = async () => {
    if (!doctorId) return;
    
    try {
      const patientsData = await doctorAPI.getPatients(doctorId);
      setPatients(patientsData || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/doctors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Doctors
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoading ? "Loading..." : doctor?.name || "Doctor Details"}
            </h1>
            <div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Patient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Patient to {doctor?.name}</DialogTitle>
                  </DialogHeader>
                  <AssignPatientForm 
                    doctorId={doctorId || ''} 
                    patients={[
                      { id: 'p4', name: 'Sarah Davis' },
                      { id: 'p5', name: 'Robert Miller' },
                      { id: 'p6', name: 'Jennifer Lee' },
                      { id: 'p7', name: 'Thomas Wang' },
                      { id: 'p8', name: 'Sophia Garcia' },
                    ]}
                    onSuccess={handleAssignPatient}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="h-64 animate-pulse bg-muted rounded-lg"></div>
            <div className="md:col-span-2 lg:col-span-3 h-64 animate-pulse bg-muted rounded-lg"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Doctor Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">{doctor?.name}</p>
                      {doctor?.specialization && (
                        <Badge variant="outline" className="mt-1 bg-medical-50 text-medical-700">
                          {doctor.specialization}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Region</p>
                      <p>{doctor?.region || "Unknown"}</p>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Patient Count</p>
                      <p>{patients?.length || 0} patients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {patients.map((patient, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div>
                                <Link 
                                  to={`/patients/${patient.patient_id}`}
                                  className="font-medium hover:text-healthcare-600"
                                >
                                  {patient.patient_name}
                                </Link>
                                <div className="flex items-center justify-between mt-1">
                                  <Badge variant="outline">
                                    {patient.relationship_type.replace('_', ' ').toLowerCase()}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(patient.since).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex justify-end mt-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/patients/${patient.patient_id}`}>
                                    View Patient
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No patients assigned to this doctor</p>
                      <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Patient
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDetails;
