
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Patient } from "@/types";
import { Activity, Heart, Thermometer, Droplet } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  lastVitals?: {
    heart_rate?: number;
    temperature?: number;
    oxygen_level?: number;
  };
  hasAlert?: boolean;
}

const PatientCard = ({ patient, lastVitals, hasAlert = false }: PatientCardProps) => {
  const getVitalClass = (vital: string, value?: number): string => {
    if (!value) return "vital-normal";
    
    switch (vital) {
      case "heart_rate":
        return (value < 60 || value > 100) ? "vital-alert" : "vital-normal";
      case "temperature":
        return (value < 36.0 || value > 38.0) ? "vital-alert" : "vital-normal";
      case "oxygen_level":
        return (value < 95) ? "vital-alert" : "vital-normal";
      default:
        return "vital-normal";
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${hasAlert ? 'border-alert-500 shadow-md' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            <Link to={`/patients/${patient._id}`} className="hover:text-healthcare-600">
              {patient.name}
            </Link>
          </CardTitle>
          <Badge variant={patient.gender === 'Male' ? 'default' : 'secondary'}>
            {patient.gender || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col gap-1 text-sm">
          <p>
            <span className="text-muted-foreground">Age:</span> {patient.age || 'N/A'}
          </p>
          {patient.blood_type && (
            <p>
              <span className="text-muted-foreground">Blood Type:</span> {patient.blood_type}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Region:</span> {patient.region || 'N/A'}
          </p>
        </div>
        
        {lastVitals && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <Heart className="h-4 w-4 mb-1" />
              <span className={getVitalClass("heart_rate", lastVitals.heart_rate)}>
                {lastVitals.heart_rate || '–'}
              </span>
              <span className="text-xs text-muted-foreground">bpm</span>
            </div>
            <div className="flex flex-col items-center">
              <Thermometer className="h-4 w-4 mb-1" />
              <span className={getVitalClass("temperature", lastVitals.temperature)}>
                {lastVitals.temperature || '–'}
              </span>
              <span className="text-xs text-muted-foreground">°C</span>
            </div>
            <div className="flex flex-col items-center">
              <Droplet className="h-4 w-4 mb-1" />
              <span className={getVitalClass("oxygen_level", lastVitals.oxygen_level)}>
                {lastVitals.oxygen_level || '–'}
              </span>
              <span className="text-xs text-muted-foreground">SpO₂</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        {hasAlert && (
          <Badge variant="destructive" className="animate-pulse-alert w-full justify-center">
            <Activity className="h-3 w-3 mr-1" />
            Abnormal Vitals
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
