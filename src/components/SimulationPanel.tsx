
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { simulationAPI } from "@/services/api";
import { BarChart2, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

const SimulationPanel = () => {
  const [isSimulatingData, setIsSimulatingData] = useState(false);
  const [isSimulatingFailure, setIsSimulatingFailure] = useState(false);
  const { toast } = useToast();

  const handleSimulateData = async () => {
    setIsSimulatingData(true);
    try {
      toast({
        title: "Data Simulation",
        description: "Generating sample data..."
      });
      
      await simulationAPI.simulateData();
      
      toast({
        title: "Data Simulation Complete",
        description: "Sample patient data has been generated successfully."
      });
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsSimulatingData(false);
    }
  };

  const handleSimulateFailure = async () => {
    setIsSimulatingFailure(true);
    try {
      toast({
        title: "Failure Simulation",
        description: "Simulating database node failure..."
      });
      
      await simulationAPI.simulateFailure();
      
      toast({
        title: "Failure Simulation Complete",
        description: "Database node failure and recovery has been simulated."
      });
    } catch (error) {
      console.error("Failure simulation error:", error);
    } finally {
      setIsSimulatingFailure(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Simulation Controls</CardTitle>
        <CardDescription>
          Generate test data and simulate system behaviors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Data Generation</h4>
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleSimulateData}
            disabled={isSimulatingData}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            {isSimulatingData ? "Generating..." : "Generate Sample Data"}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">System Testing</h4>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSimulateFailure}
            disabled={isSimulatingFailure}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {isSimulatingFailure ? "Simulating..." : "Simulate Node Failure"}
          </Button>
          
          <Button variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Connection Resiliency
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationPanel;
