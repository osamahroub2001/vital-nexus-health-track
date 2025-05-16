
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    toast.error(error instanceof Error ? error.message : 'API request failed');
    throw error;
  }
}

// Patient API
export const patientAPI = {
  getPatients: async () => {
    // The backend doesn't seem to have an endpoint to fetch all patients
    // You might need to simulate data to test this feature
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/simulate/data`, {
      method: 'POST',
    });
    // For now, return an empty array as we can't fetch patients directly
    return [];
  },
  
  getPatient: async (patientId: string) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients/${patientId}`);
    return response.patient;
  },
  
  createPatient: async (patientData: any) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients`, {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
    return response.patient_id;
  },
  
  updatePatient: async (patientId: string, patientData: any) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
    return response.success;
  },
  
  getVitals: async (patientId: string, startTime?: string, endTime?: string) => {
    let url = `${API_BASE_URL}/patients/${patientId}/vitals`;
    
    const params = new URLSearchParams();
    if (startTime) params.append('start_time', startTime);
    if (endTime) params.append('end_time', endTime);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetchWithErrorHandling<any>(url);
    return response.vitals;
  },
  
  recordVitals: async (patientId: string, vitalsData: any) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients/${patientId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(vitalsData),
    });
    return response.success;
  },
  
  getAnalytics: async (patientId: string, region?: string, period?: string, limit?: number) => {
    let url = `${API_BASE_URL}/patients/${patientId}/analytics`;
    
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (period) params.append('period', period);
    if (limit) params.append('limit', limit.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetchWithErrorHandling<any>(url);
    return response.analytics;
  },
  
  getAlerts: async (patientId: string) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients/${patientId}/alerts`);
    return response.alerts;
  },
  
  resolveAlert: async (alertId: string) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
      method: 'POST',
    });
    return response.success;
  },
};

// Doctor API
export const doctorAPI = {
  createDoctor: async (doctorData: any) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/doctors`, {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
    return response.doctor_id;
  },
  
  getPatients: async (doctorId: string) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/doctors/${doctorId}/patients`);
    return response.patients;
  },
  
  assignPatient: async (doctorId: string, patientId: string, relationshipType: string) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/doctors/${doctorId}/patients/${patientId}`, {
      method: 'POST',
      body: JSON.stringify({ relationship_type: relationshipType }),
    });
    return response.success;
  },
};

// Patient-Doctor Relationship API
export const relationshipAPI = {
  getPatientDoctors: async (patientId: string) => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients/${patientId}/doctors`);
    return response.doctors;
  },
};

// Simulation API
export const simulationAPI = {
  simulateData: async () => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/simulate/data`, {
      method: 'POST',
    });
    return response.success;
  },
  
  simulateFailure: async () => {
    const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/simulate/failure`, {
      method: 'POST',
    });
    return response.success;
  },
};
