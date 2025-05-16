
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import DoctorCard from "@/components/DoctorCard";
import { DoctorForm } from "@/components/DoctorForm";
import { simulationAPI } from "@/services/api";
import { Search, UserPlus, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageDoctors = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        // The backend doesn't seem to have a direct endpoint for listing all doctors
        await simulationAPI.simulateData();
        
        // Mock data for demonstration
        const mockDoctors = [
          { 
            _id: 'd1', 
            name: 'Dr. Robert Smith', 
            specialization: 'Cardiology',
            region: 'North',
            patientCount: 5
          },
          { 
            _id: 'd2', 
            name: 'Dr. Sarah Johnson', 
            specialization: 'Neurology',
            region: 'West',
            patientCount: 7
          },
          { 
            _id: 'd3', 
            name: 'Dr. Michael Brown', 
            specialization: 'Oncology',
            region: 'East',
            patientCount: 3
          },
          { 
            _id: 'd4', 
            name: 'Dr. Jennifer Lee', 
            specialization: 'Pediatrics',
            region: 'South',
            patientCount: 10
          },
          { 
            _id: 'd5', 
            name: 'Dr. David Wilson', 
            specialization: 'General Practice',
            region: 'Central',
            patientCount: 12
          },
          { 
            _id: 'd6', 
            name: 'Dr. Maria Garcia', 
            specialization: 'Surgery',
            region: 'North',
            patientCount: 6
          },
          { 
            _id: 'd7', 
            name: 'Dr. James Taylor', 
            specialization: 'Endocrinology',
            region: 'West',
            patientCount: 4
          },
          { 
            _id: 'd8', 
            name: 'Dr. Emily Chen', 
            specialization: 'Dermatology',
            region: 'East',
            patientCount: 8
          },
          { 
            _id: 'd9', 
            name: 'Dr. Thomas Wang', 
            specialization: 'Ophthalmology',
            region: 'South',
            patientCount: 5
          },
          { 
            _id: 'd10', 
            name: 'Dr. Amanda Miller', 
            specialization: 'Psychiatry',
            region: 'Central',
            patientCount: 9
          }
        ];
        
        setDoctors(mockDoctors);
        setFilteredDoctors(mockDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Using sample data instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDoctors(doctors);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = doctors.filter(
      doctor => 
        doctor.name.toLowerCase().includes(query) || 
        (doctor.specialization && doctor.specialization.toLowerCase().includes(query)) ||
        (doctor.region && doctor.region.toLowerCase().includes(query))
    );
    
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);
  
  const handleAddDoctor = (doctorId: string) => {
    setDialogOpen(false);
    toast({
      title: "Doctor Added",
      description: "New doctor has been successfully registered.",
    });
    // In a real application, we would fetch the new doctor data
    // For demo, just add a placeholder
    const newDoctor = {
      _id: doctorId,
      name: "Dr. New Doctor",
      specialization: "General Practice",
      region: "Central",
      patientCount: 0
    };
    
    setDoctors([newDoctor, ...doctors]);
    setFilteredDoctors([newDoctor, ...filteredDoctors]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Manage Doctors</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Doctor</DialogTitle>
              </DialogHeader>
              <DoctorForm onSuccess={handleAddDoctor} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name, specialization, or region..."
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
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDoctors.map((doctor) => (
              <Link key={doctor._id} to={`/doctors/${doctor._id}`} className="block hover:no-underline">
                <DoctorCard 
                  doctor={{
                    _id: doctor._id,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    region: doctor.region
                  }}
                  patientCount={doctor.patientCount}
                />
              </Link>
            ))}
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Stethoscope className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No doctors found matching your search</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Doctor</DialogTitle>
                  </DialogHeader>
                  <DoctorForm onSuccess={handleAddDoctor} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ManageDoctors;
