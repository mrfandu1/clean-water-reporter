// API Configuration and Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// API Service Class
class ApiService {
  // User Authentication
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  // Register new user
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  }

  // Get all reports
  static async getAllReports() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      return response.json();
    } catch (error) {
      console.error('Get reports API error:', error);
      throw error;
    }
  }

  // Get reports by reporter name
  static async getReportsByReporter(reporterName) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/reporter/${encodeURIComponent(reporterName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      return response.json();
    } catch (error) {
      console.error('Get reports by reporter API error:', error);
      throw error;
    }
  }

  // Create new report
  static async createReport(reportData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create report');
      }
      
      return response.json();
    } catch (error) {
      console.error('Create report API error:', error);
      throw error;
    }
  }

  // Update report status (for officials)
  static async updateReportStatus(reportId, status, severity) {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, severity }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update report');
      }
      
      return response.json();
    } catch (error) {
      console.error('Update report status API error:', error);
      throw error;
    }
  }
}

export default ApiService;
