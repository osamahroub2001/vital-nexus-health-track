
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { patientAPI } from "@/services/api";
import { AlertCircle, ChevronDown, Check } from "lucide-react";
import { useState } from "react";

interface AlertBadgeProps {
  alertId: string;
  patientName: string;
  alerts: {
    vital: string;
    value: number;
    threshold_min: number;
    threshold_max: number;
    timestamp: string;
  }[];
  status: 'new' | 'resolved';
  timestamp: string;
  onResolved?: () => void;
}

const AlertBadge = ({ alertId, patientName, alerts, status, timestamp, onResolved }: AlertBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const { toast } = useToast();
  
  const formatVitalName = (vital: string): string => {
    switch (vital) {
      case 'heart_rate': return 'Heart Rate';
      case 'blood_pressure_systolic': return 'Blood Pressure (Systolic)';
      case 'blood_pressure_diastolic': return 'Blood Pressure (Diastolic)';
      case 'temperature': return 'Temperature';
      case 'oxygen_level': return 'Oxygen Level';
      default: return vital;
    }
  };
  
  const formatVitalValue = (vital: string, value: number): string => {
    switch (vital) {
      case 'heart_rate': return `${value} bpm`;
      case 'blood_pressure_systolic':
      case 'blood_pressure_diastolic': 
        return `${value} mmHg`;
      case 'temperature': return `${value}°C`;
      case 'oxygen_level': return `${value}%`;
      default: return `${value}`;
    }
  };
  
  const handleResolve = async () => {
    setIsResolving(true);
    try {
      await patientAPI.resolveAlert(alertId);
      toast({
        title: "Alert resolved",
        description: `Alert for ${patientName} has been marked as resolved.`
      });
      if (onResolved) {
        onResolved();
      }
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    } finally {
      setIsResolving(false);
    }
  };
  
  const alertDate = new Date(timestamp);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center space-x-2">
        <Badge 
          variant={status === 'new' ? 'destructive' : 'outline'}
          className={`w-full ${status === 'new' ? 'animate-pulse-alert' : ''}`}
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          {patientName} - {alerts.length} abnormal reading{alerts.length > 1 ? 's' : ''}
          <span className="ml-auto text-xs opacity-70">
            {alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </Badge>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full p-1 h-7 w-7">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <Card className="mt-2">
          <CardContent className="pt-4 pb-2">
            <div className="text-sm space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{formatVitalName(alert.vital)}:</span>{' '}
                    <span className="text-alert-600 font-bold">{formatVitalValue(alert.vital, alert.value)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Normal range: {alert.threshold_min} - {alert.threshold_max}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          {status === 'new' && (
            <CardFooter className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleResolve}
                disabled={isResolving}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark as Resolved
              </Button>
            </CardFooter>
          )}
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AlertBadge;
