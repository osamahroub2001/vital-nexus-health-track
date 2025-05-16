
import { Link } from "react-router-dom";
import { Activity, UserCircle, UserCog, Settings, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { toast } = useToast();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-healthcare-600" />
          <Link to="/" className="text-xl font-bold text-healthcare-800">
            HealthMonitor
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium hover:text-healthcare-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/patients" className="text-sm font-medium hover:text-healthcare-600 transition-colors">
            Patients
          </Link>
          <Link to="/doctors" className="text-sm font-medium hover:text-healthcare-600 transition-colors">
            Doctors
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              toast({
                title: "Data Simulation",
                description: "Generating sample data..."
              });
              
              simulationAPI.simulateData()
                .then(() => {
                  toast({
                    title: "Data Simulation Complete",
                    description: "Sample data has been generated successfully."
                  });
                })
                .catch((error) => {
                  console.error("Simulation error:", error);
                });
            }}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Simulate Data
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { simulationAPI } from "@/services/api";
