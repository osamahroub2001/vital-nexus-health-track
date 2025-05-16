
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientCard";
import { PatientForm } from "@/components/PatientForm";
import { patientAPI, simulationAPI } from "@/services/api";
import { Search, UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManagePatients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        // Initialize data if needed
        await simulationAPI.simulateData();
        
        // In a real implementation, we would fetch patients from the API
        // For now, we'll leave patients as an empty array since the API isn't connected
        setPatients([]);
        setFilteredPatients([]);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = patients.filter(
      patient => 
        patient.name.toLowerCase().includes(query) || 
        (patient.region && patient.region.toLowerCase().includes(query)) ||
        (patient.blood_type && patient.blood_type.toLowerCase().includes(query))
    );
    
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);
  
  const handleAddPatient = (patientId: string) => {
    setDialogOpen(false);
    toast({
      title: "Patient Added",
      description: "New patient has been successfully registered.",
    });
    
    // In a real implementation, we would fetch the new patient data
    // For now, we'll just refresh the patients list
    fetchPatients();
  };
  
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      // Initialize data if needed
      await simulationAPI.simulateData();
      
      // In a real implementation, we would fetch patients from the API
      // For now, we'll leave patients as an empty array
      setPatients([]);
      setFilteredPatients([]);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Manage Patients</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
              </DialogHeader>
              <PatientForm onSuccess={handleAddPatient} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, region, or blood type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="h-40 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPatients.map((patient) => (
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
            ))}
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Users className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No patients found</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Patient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                  </DialogHeader>
                  <PatientForm onSuccess={handleAddPatient} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ManagePatients;
