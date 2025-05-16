
export interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  blood_type?: string;
  medical_history?: {
    conditions?: string[];
    allergies?: string[];
    surgeries?: number;
  };
  region?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization?: string;
  region?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VitalSign {
  timestamp: string;
  patient_id: string;
  region?: string;
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  temperature?: number;
  oxygen_level?: number;
}

export interface Alert {
  patient_id: string;
  patient_name: string;
  alerts: {
    vital: string;
    value: number;
    threshold_min: number;
    threshold_max: number;
    timestamp: string;
  }[];
  status: 'new' | 'resolved';
  created_at: string;
  resolved_at?: string;
}

export interface Analytics {
  region: string;
  patient_id: string;
  timestamp: string;
  heart_rate_avg?: number;
  blood_pressure_systolic_avg?: number;
  blood_pressure_diastolic_avg?: number;
  temperature_avg?: number;
  oxygen_level_avg?: number;
  analysis_period: string;
}

export interface DoctorPatientRelationship {
  patient_id: string;
  patient_name: string;
  relationship_type: string;
  since: string;
}

export interface PatientDoctorRelationship {
  doctor_id: string;
  doctor_name: string;
  specialization: string;
  relationship_type: string;
  since: string;
}

export type RelationshipType = 'PRIMARY_CARE' | 'SPECIALIST' | 'CONSULTING';
