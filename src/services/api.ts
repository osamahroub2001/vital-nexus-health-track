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
        return getMockData(url, options) as T;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      if (USE_MOCK_DATA) {
        console.warn(`API endpoint ${url} returned unsuccessful response, using mock data instead`);
        return getMockData(url, options) as T;
      }
      throw new Error(data.error || 'Unknown error occurred');
    }
    
    return data;
  } catch (error) {
    // If fetch fails completely and we're using mock data, return mock data
    if (USE_MOCK_DATA && error instanceof Error && 
        (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.warn(`API connection failed to ${url}, using mock data instead`);
      return getMockData(url, options) as T;
    }
    
    console.error('API Error:', error);
    toast.error(error instanceof Error ? error.message : 'API request failed');
    throw error;
  }
}

/**
 * Return mock data based on the requested endpoint and HTTP method
 */
function getMockData(url: string, options?: RequestInit): any {
  // Base mock data structure
  const mockData = {
    success: true
  };
  
  // Extract the endpoint path
  const endpoint = url.replace(API_BASE_URL, '');
  const method = options?.method || 'GET';
  
  // Get list of patients
  if (endpoint === '/patients' && method === 'GET') {
    return {
      ...mockData,
      patients: generateMockPatientsList(10)
    };
  }
  
  // Create a new patient
  if (endpoint === '/patients' && method === 'POST') {
    const patientId = 'mock_' + Math.random().toString(36).substring(2, 9);
    return {
      ...mockData,
      patient_id: patientId
    };
  }
  
  // Patient data
  if (endpoint.match(/\/patients\/[^/]+$/) && method === 'GET') {
    const patientId = endpoint.split('/').pop() || 'new';
    return {
      ...mockData,
      patient: generateMockPatient(patientId)
    };
  }
  
  // Update patient
  if (endpoint.match(/\/patients\/[^/]+$/) && method === 'PUT') {
    return {
      ...mockData
    };
  }
  
  // Vitals data
  if (endpoint.match(/\/patients\/[^/]+\/vitals$/)) {
    if (method === 'GET') {
      return {
        ...mockData,
        vitals: generateMockVitals(endpoint.split('/')[2])
      };
    }
    if (method === 'POST') {
      return {
        ...mockData
      };
    }
  }
  
  // Alerts data
  if (endpoint.match(/\/patients\/[^/]+\/alerts$/) && method === 'GET') {
    return {
      ...mockData,
      alerts: generateMockAlerts(endpoint.split('/')[2])
    };
  }
  
  // Patient-doctor relationships
  if (endpoint.match(/\/patients\/[^/]+\/doctors$/) && method === 'GET') {
    return {
      ...mockData,
      doctors: generateMockDoctors()
    };
  }
  
  // Analytics data
  if (endpoint.match(/\/patients\/[^/]+\/analytics$/) && method === 'GET') {
    return {
      ...mockData,
      analytics: generateMockAnalytics(endpoint.split('/')[2])
    };
  }
  
  // Simulate data
  if (endpoint === '/simulate/data' && method === 'POST') {
    return {
      ...mockData
    };
  }
  
  // Fallback for unknown endpoints
  return { ...mockData };
}

// Generate a list of mock patients
function generateMockPatientsList(count: number) {
  const patients = [];
  
  for (let i = 0; i < count; i++) {
    const patientId = 'mock_' + Math.random().toString(36).substring(2, 9);
    const gender = Math.random() > 0.5 ? "Male" : "Female";
    const firstName = gender === "Male" ? 
      ["John", "James", "Robert", "Michael", "William"][Math.floor(Math.random() * 5)] : 
      ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth"][Math.floor(Math.random() * 5)];
    
    const lastName = ["Smith", "Johnson", "Williams", "Jones", "Brown"][Math.floor(Math.random() * 5)];
    
    patients.push({
      _id: patientId,
      name: `${firstName} ${lastName}`,
      age: Math.floor(Math.random() * 50) + 20,
      gender: gender,
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][Math.floor(Math.random() * 8)],
      region: ["North", "South", "East", "West", "Central"][Math.floor(Math.random() * 5)],
      medical_history: {
        conditions: Math.random() > 0.5 ? ["Hypertension", "Diabetes"] : ["Asthma"],
        allergies: Math.random() > 0.5 ? ["Penicillin"] : ["Dust", "Pollen"],
        surgeries: Math.floor(Math.random() * 3)
      },
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updated_at: new Date().toISOString(),
      hasAlert: Math.random() > 0.8 // 20% chance of having alert
    });
  }
  
  return patients;
}

// Mock data generators
function generateMockPatient(patientId: string) {
  const gender = Math.random() > 0.5 ? "Male" : "Female";
  const firstName = gender === "Male" ? 
    ["John", "James", "Robert", "Michael", "William"][Math.floor(Math.random() * 5)] : 
    ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth"][Math.floor(Math.random() * 5)];
  
  const lastName = ["Smith", "Johnson", "Williams", "Jones", "Brown"][Math.floor(Math.random() * 5)];
  
  return {
    _id: patientId,
    name: `${firstName} ${lastName}`,
    age: Math.floor(Math.random() * 50) + 20,
    gender: gender,
    blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][Math.floor(Math.random() * 8)],
    region: ["North", "South", "East", "West", "Central"][Math.floor(Math.random() * 5)],
    medical_history: {
      conditions: Math.random() > 0.5 ? ["Hypertension", "Diabetes"] : ["Asthma"],
      allergies: Math.random() > 0.5 ? ["Penicillin"] : ["Dust", "Pollen"],
      surgeries: Math.floor(Math.random() * 3)
    },
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
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

function generateMockAnalytics(patientId: string) {
  const analytics = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    
    analytics.push({
      timestamp: timestamp.toISOString(),
      heart_rate_avg: Math.floor(60 + Math.random() * 40),
      blood_pressure_systolic_avg: Math.floor(110 + Math.random() * 40),
      blood_pressure_diastolic_avg: Math.floor(70 + Math.random() * 20),
      temperature_avg: Math.round((36.5 + Math.random()) * 10) / 10,
      oxygen_level_avg: Math.floor(92 + Math.random() * 8)
    });
  }
  
  return analytics;
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
