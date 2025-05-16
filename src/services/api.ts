
import { toast } from 'sonner';

// Update base URL to handle possible remote deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Flag to use mock data when API is not available
const USE_MOCK_DATA = true;

/**
 * Generic fetch wrapper with error handling and mock data fallback
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
      // If we're in development mode and using mock data, don't throw an error
      if (USE_MOCK_DATA) {
        console.warn(`API endpoint ${url} failed, using mock data instead`);
        return getMockData(url) as T;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      if (USE_MOCK_DATA) {
        console.warn(`API endpoint ${url} returned unsuccessful response, using mock data instead`);
        return getMockData(url) as T;
      }
      throw new Error(data.error || 'Unknown error occurred');
    }
    
    return data;
  } catch (error) {
    // If fetch fails completely and we're using mock data, return mock data
    if (USE_MOCK_DATA && error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn(`API connection failed to ${url}, using mock data instead`);
      return getMockData(url) as T;
    }
    
    console.error('API Error:', error);
    toast.error(error instanceof Error ? error.message : 'API request failed');
    throw error;
  }
}

/**
 * Return mock data based on the requested endpoint
 */
function getMockData(url: string): any {
  // Base mock data structure
  const mockData = {
    success: true
  };
  
  // Extract the endpoint path
  const endpoint = url.replace(API_BASE_URL, '');
  
  // Patient data
  if (endpoint.match(/\/patients\/[^/]+$/)) {
    return {
      ...mockData,
      patient: generateMockPatient(endpoint.split('/').pop() || 'new')
    };
  }
  
  // Vitals data
  if (endpoint.match(/\/patients\/[^/]+\/vitals$/)) {
    return {
      ...mockData,
      vitals: generateMockVitals(endpoint.split('/')[2])
    };
  }
  
  // Alerts data
  if (endpoint.match(/\/patients\/[^/]+\/alerts$/)) {
    return {
      ...mockData,
      alerts: generateMockAlerts(endpoint.split('/')[2])
    };
  }
  
  // Patient-doctor relationships
  if (endpoint.match(/\/patients\/[^/]+\/doctors$/)) {
    return {
      ...mockData,
      doctors: generateMockDoctors()
    };
  }
  
  // Fallback for unknown endpoints
  return { ...mockData };
}

// Mock data generators
function generateMockPatient(patientId: string) {
  return {
    _id: patientId,
    name: `Test Patient ${patientId.substring(0, 5)}`,
    age: 45,
    gender: "Female",
    blood_type: "O+",
    medical_history: {
      conditions: ["Hypertension", "Diabetes"],
      allergies: ["Penicillin"],
      surgeries: 1
    },
    region: "North",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function generateMockVitals(patientId: string) {
  const now = new Date();
  const vitals = [];
  
  // Generate 24 hours of vitals, one per hour
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)).toISOString();
    vitals.push({
      timestamp,
      patient_id: patientId,
      region: "North",
      heart_rate: Math.floor(60 + Math.random() * 40), // 60-100
      blood_pressure_systolic: Math.floor(110 + Math.random() * 40), // 110-150
      blood_pressure_diastolic: Math.floor(70 + Math.random() * 20), // 70-90
      temperature: Math.round((36.5 + Math.random()) * 10) / 10, // 36.5-37.5
      oxygen_level: Math.floor(92 + Math.random() * 8) // 92-100
    });
  }
  
  return vitals;
}

function generateMockAlerts(patientId: string) {
  return [
    {
      patient_id: patientId,
      patient_name: `Test Patient ${patientId.substring(0, 5)}`,
      alerts: [
        {
          vital: "heart_rate",
          value: 130,
          threshold_min: 60,
          threshold_max: 100,
          timestamp: new Date().toISOString()
        }
      ],
      status: "new",
      created_at: new Date().toISOString()
    }
  ];
}

function generateMockDoctors() {
  return [
    {
      doctor_id: "doc1",
      doctor_name: "Dr. Smith",
      specialization: "Cardiology",
      relationship_type: "PRIMARY_CARE",
      since: new Date().toISOString()
    },
    {
      doctor_id: "doc2",
      doctor_name: "Dr. Johnson",
      specialization: "Neurology",
      relationship_type: "SPECIALIST",
      since: new Date().toISOString()
    }
  ];
}

// Patient API
export const patientAPI = {
  getPatients: async () => {
    try {
      const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/patients`);
      return response.patients || [];
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
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
    try {
      const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/simulate/data`, {
        method: 'POST',
      });
      return response.success;
    } catch (error) {
      // Don't throw error for simulation as it's optional
      console.warn("Simulation API not available:", error);
      return true;
    }
  },
  
  simulateFailure: async () => {
    try {
      const response = await fetchWithErrorHandling<any>(`${API_BASE_URL}/simulate/failure`, {
        method: 'POST',
      });
      return response.success;
    } catch (error) {
      // Don't throw error for simulation as it's optional
      console.warn("Simulation failure API not available:", error);
      return true;
    }
  },
};
