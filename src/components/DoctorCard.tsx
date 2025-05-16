
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Doctor } from "@/types";
import { Users } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
  patientCount?: number;
}

const DoctorCard = ({ doctor, patientCount = 0 }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            <Link to={`/doctors/${doctor._id}`} className="hover:text-healthcare-600">
              {doctor.name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-1 text-sm">
          {doctor.specialization && (
            <div className="mb-2">
              <Badge variant="outline" className="bg-medical-50 text-medical-700">
                {doctor.specialization}
              </Badge>
            </div>
          )}
          
          <p>
            <span className="text-muted-foreground">Region:</span> {doctor.region || 'N/A'}
          </p>
          
          <div className="mt-3 flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{patientCount} Patient{patientCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
