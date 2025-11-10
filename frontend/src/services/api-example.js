// API Configuration and Service Layer
// This file demonstrates how to connect your React frontend to the Spring Boot backend

const API_BASE_URL = 'http://localhost:8080/api';

// API Service Class
class ApiService {
  // User Authentication
  static async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  }

  // Register new user
  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  }

  // Get all reports
  static async getAllReports() {
    const response = await fetch(`${API_BASE_URL}/reports`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return response.json();
  }

  // Get reports by reporter name
  static async getReportsByReporter(reporterName) {
    const response = await fetch(`${API_BASE_URL}/reports/reporter/${reporterName}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return response.json();
  }

  // Get reports by status
  static async getReportsByStatus(status) {
    const response = await fetch(`${API_BASE_URL}/reports/status/${status}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return response.json();
  }

  // Get report statistics
  static async getReportStats() {
    const response = await fetch(`${API_BASE_URL}/reports/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    return response.json();
  }

  // Create new report
  static async createReport(reportData) {
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
  }

  // Update report status (for officials)
  static async updateReportStatus(reportId, status, severity) {
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
  }

  // Update entire report
  static async updateReport(reportId, reportData) {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update report');
    }
    
    return response.json();
  }

  // Delete report
  static async deleteReport(reportId) {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete report');
    }
    
    return response.json();
  }
}

export default ApiService;

/* 
 * USAGE EXAMPLES:
 * 
 * 1. Login:
 * try {
 *   const user = await ApiService.login('john@citizen.com', 'demo123');
 *   console.log('Logged in user:', user);
 * } catch (error) {
 *   console.error('Login error:', error.message);
 * }
 * 
 * 2. Create Report:
 * try {
 *   const newReport = await ApiService.createReport({
 *     title: 'Water Quality Issue',
 *     details: 'Strange taste in water',
 *     type: 'Quality',
 *     severity: 'Medium',
 *     location: 'Downtown Area',
 *     reporter: 'John Citizen',
 *     tags: 'Quality,Health'
 *   });
 *   console.log('Created report:', newReport);
 * } catch (error) {
 *   console.error('Create report error:', error.message);
 * }
 * 
 * 3. Get All Reports:
 * try {
 *   const reports = await ApiService.getAllReports();
 *   console.log('All reports:', reports);
 * } catch (error) {
 *   console.error('Fetch reports error:', error.message);
 * }
 * 
 * 4. Update Report Status:
 * try {
 *   const updated = await ApiService.updateReportStatus(1, 'In Progress', 'High');
 *   console.log('Updated report:', updated);
 * } catch (error) {
 *   console.error('Update error:', error.message);
 * }
 */
