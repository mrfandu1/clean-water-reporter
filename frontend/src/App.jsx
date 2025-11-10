import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  LogIn,
  PieChart,
  List,
  MapPin,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Calendar,
  Map as MapIcon,
  Droplet,
  Users,
  XCircle,
  ChevronDown,
  CheckSquare,
  Send,
  X,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ApiService from './services/api';

// Fix Leaflet default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- MOCK DATA & HELPERS ---

const INITIAL_REPORTS = [
  {
    id: 1,
    title: 'Drought Conditions Affecting Supply',
    details:
      'Water levels in the main reservoir are critically low, affecting three major districts.',
    type: 'Drought',
    severity: 'High',
    status: 'Resolved',
    location: 'Central Valley Reservoir',
    reporter: 'Afrid',
    dateReported: '2025-10-28',
    lastUpdated: '2025-10-30',
    tags: ['Unsafe Drinking Water', 'Infrastructure Failure'],
  },
  {
    id: 2,
    title: 'Pipe Burst near High School',
    details:
      'A major water main burst, causing flooding and service interruption.',
    type: 'Infrastructure',
    severity: 'Critical',
    status: 'In Progress',
    location: '123 Main St, Sector 4',
    reporter: 'Jane Doe',
    dateReported: '2025-11-01',
    lastUpdated: '2025-11-02',
    tags: ['Water Leak', 'Road Hazard'],
  },
  {
    id: 3,
    title: 'Unusual Smell in Tap Water',
    details:
      'Tap water has a strong, chemical odor in the Western neighborhood.',
    type: 'Quality',
    severity: 'Medium',
    status: 'Pending Review',
    location: 'Western Residential Area',
    reporter: 'Mark Smith',
    dateReported: '2025-11-03',
    lastUpdated: '2025-11-03',
    tags: ['Contamination', 'Health Risk'],
  },
];

const DEMO_ACCOUNTS = [
  {
    email: 'john@citizen.com',
    role: 'citizen',
    name: 'John Citizen',
    department: 'Community Member',
  },
  {
    email: 'sarah@waterauthority.gov',
    role: 'official',
    name: 'Sarah Official',
    department: 'Water Quality Authority',
  },
];

const REPORT_TYPES = ['Quality', 'Infrastructure', 'Supply', 'Drought', 'Safety'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Pending Review', 'In Progress', 'Resolved'];

const getStatusClasses = (status) => {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-700';
    case 'In Progress':
      return 'bg-orange-100 text-orange-700';
    case 'Pending Review':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getSeverityClasses = (severity) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-500 text-white';
    case 'High':
      return 'bg-orange-500 text-white';
    case 'Medium':
      return 'bg-yellow-500 text-white';
    case 'Low':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};

// --- MODAL COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children, size = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${size} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Map Component for selecting location
const LocationPicker = ({ position, setPosition, showLocateButton = true }) => {
  const [map, setMap] = useState(null);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = [latitude, longitude];
          setPosition(newPos);
          if (map) {
            map.flyTo(newPos, 15);
          }
        },
        (error) => {
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="relative h-64 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {position && (
          <Marker position={position}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {showLocateButton && (
        <button
          type="button"
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 z-[1000] bg-white hover:bg-blue-50 text-blue-600 p-3 rounded-lg shadow-lg border border-blue-200 transition-colors flex items-center"
          title="Locate Me"
        >
          <MapPin className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const ReportIssueModal = ({ isOpen, onClose, onSubmit, reporterName }) => {
  const today = new Date().toISOString().substring(0, 10);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    type: REPORT_TYPES[0],
    severity: SEVERITIES[2], // Default to Medium
    location: '',
    tags: '',
  });
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]); // Default: London
  const [useManualLocation, setUseManualLocation] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setFormData({
        title: '',
        details: '',
        type: REPORT_TYPES[0],
        severity: SEVERITIES[2],
        location: '',
        tags: '',
      });
      setMapPosition([51.505, -0.09]);
      setUseManualLocation(true);
    } else {
      // Try to get user's location when modal opens
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapPosition([latitude, longitude]);
          },
          (error) => {
            console.log('Location access denied, using default position');
          }
        );
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const locationString = useManualLocation 
      ? formData.location 
      : (formData.location 
          ? `${formData.location} (Lat: ${mapPosition[0].toFixed(6)}, Lng: ${mapPosition[1].toFixed(6)})` 
          : `Lat: ${mapPosition[0].toFixed(6)}, Lng: ${mapPosition[1].toFixed(6)}`);
    
    const reportData = {
      title: formData.title,
      details: formData.details,
      type: formData.type,
      severity: formData.severity,
      status: 'Pending Review',
      location: locationString,
      latitude: !useManualLocation ? mapPosition[0] : null,
      longitude: !useManualLocation ? mapPosition[1] : null,
      reporterName: reporterName,
      dateReported: today,
      lastUpdated: today,
      tags: formData.tags
    };

    try {
      // Call API to save report
      const savedReport = await ApiService.createReport(reportData);
      console.log('Report saved:', savedReport);
      onSubmit(savedReport);
      onClose();
    } catch (error) {
      console.error('Failed to save report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit a New Water Issue Report"
      size="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Report Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextArea
          label="Details (What is the issue?)"
          name="details"
          value={formData.details}
          onChange={handleChange}
          required
        />
        
        {/* Location Input Method Toggle */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!useManualLocation}
              onChange={(e) => setUseManualLocation(!e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              Use map to select precise location
            </span>
          </label>
        </div>

        <Input
          label="Location (Address or Landmark)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required={useManualLocation}
          placeholder={useManualLocation ? "Enter address or landmark" : "Enter landmark name (optional - coordinates will be used)"}
        />

        {/* Map for coordinate selection */}
        {!useManualLocation && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Click on the map to select exact location
            </label>
            <LocationPicker position={mapPosition} setPosition={setMapPosition} />
            <p className="text-xs text-gray-500 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Selected: Latitude {mapPosition[0].toFixed(6)}, Longitude {mapPosition[1].toFixed(6)}
            </p>
          </div>
        )}

        <Input
          label="Tags (e.g., Water Leak, Health Risk, comma-separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Issue Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={REPORT_TYPES}
          />
          <Select
            label="Initial Severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            options={SEVERITIES}
          />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Send className="w-5 h-5 mr-2" /> Submit Report
          </button>
        </div>
      </form>
    </Modal>
  );
};

const UpdateStatusModal = ({ isOpen, onClose, report, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(report?.status || STATUSES[0]);
  const [newSeverity, setNewSeverity] = useState(
    report?.severity || SEVERITIES[0]
  );

  useEffect(() => {
    if (report) {
      setNewStatus(report.status);
      setNewSeverity(report.severity);
    }
  }, [report]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!report) return;

    const updatedReport = {
      ...report,
      status: newStatus,
      severity: newSeverity,
      lastUpdated: new Date().toISOString().substring(0, 10),
    };
    onUpdate(updatedReport);
    onClose();
  };

  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status for Report #${report.id}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="font-semibold text-slate-800 mb-1">{report.title}</p>
          <p className="text-sm text-gray-600">{report.details}</p>
          <p className="text-xs text-blue-600 mt-2">
            Current Status:{' '}
            <span
              className={`${getStatusClasses(
                report.status
              )} px-2 py-0.5 rounded-full font-medium`}
            >
              {report.status}
            </span>
          </p>
        </div>

        <Select
          label="New Status"
          name="status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={STATUSES}
          required
        />
        <Select
          label="New Severity"
          name="severity"
          value={newSeverity}
          onChange={(e) => setNewSeverity(e.target.value)}
          options={SEVERITIES}
          required
        />

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-5 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-md"
          >
            <CheckSquare className="w-5 h-5 mr-2" /> Save Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- FORM CONTROLS ---

const Input = ({ label, name, value, onChange, required = false, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows="3"
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div className="relative">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-3 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 h-full pt-6">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);

// --- DASHBOARD COMPONENTS ---

const StatCard = ({ title, value, description, icon: Icon, colorClass }) => (
  <div
    className={`p-6 rounded-xl bg-white shadow-lg border-t-4 ${colorClass} transition-shadow duration-300 hover:shadow-xl`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-4xl font-extrabold text-slate-800 mt-1">{value}</p>
      </div>
      <Icon className={`w-8 h-8 opacity-70 ${colorClass.replace('border-', 'text-')}`} />
    </div>
    {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
  </div>
);

const ReportCard = ({ report, isOfficial, onUpdateStatus }) => {
  const severityClasses = getSeverityClasses(report.severity);
  const resolvedTagClasses = getStatusClasses(report.status);

  return (
    <div className="p-5 bg-white rounded-xl shadow-md mb-4 border border-gray-100 transition-shadow duration-200 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-slate-800">{report.title}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${severityClasses} flex items-center`}>
          <AlertTriangle className="inline w-3 h-3 mr-1" />
          {report.severity}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {report.tags && (
          typeof report.tags === 'string' 
            ? report.tags.split(',').map((tag, index) => (
                <span key={index} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                  {tag.trim()}
                </span>
              ))
            : report.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                  {tag}
                </span>
              ))
        )}
        <span className={`px-2 py-0.5 rounded-full font-medium ${resolvedTagClasses}`}>
          {report.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {report.details.substring(0, 150)}
        {report.details.length > 150 ? '...' : ''}
      </p>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" /> {report.location}
        </div>
        {report.latitude && report.longitude && (
          <div className="flex items-center text-blue-600">
            <MapIcon className="w-4 h-4 mr-2" /> GPS: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
          </div>
        )}
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" /> Reported by {report.reporter || report.reporterName}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" /> Reported: {report.dateReported}
        </div>
        {isOfficial && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" /> Updated: {report.lastUpdated}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end items-center">
        {isOfficial && (
          <button
            onClick={() => onUpdateStatus(report.id)}
            className="flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-md"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Update Status
          </button>
        )}
      </div>
    </div>
  );
};

const DashboardHeader = ({ user, onLogout, onReportIssue }) => (
  <header className="bg-white shadow-sm p-4 sticky top-0 z-20">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center">
        <Droplet className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold text-slate-800">Clean Water Reporter</h1>
        <span className="ml-4 text-sm text-gray-500 hidden md:inline">Issue Tracking System</span>
      </div>
      <div className="flex items-center space-x-4">
        {user.role === 'citizen' && (
          <span className="text-sm text-gray-600 hidden sm:inline">{user.name}</span>
        )}
        <button
          onClick={onReportIssue}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          + Report Issue
        </button>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-600 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <LogIn className="w-5 h-5 mr-1 transform rotate-180" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  </header>
);

const CitizenDashboard = ({ user, reports, onReportIssue, onLogout }) => {
  const userReports = reports.filter((r) => (r.reporter === user.name || r.reporterName === user.name));

  const reportStats = useMemo(
    () => ({
      total: userReports.length,
      pending: userReports.filter((r) => r.status === 'Pending Review').length,
      inProgress: userReports.filter((r) => r.status === 'In Progress').length,
      resolved: userReports.filter((r) => r.status === 'Resolved').length,
    }),
    [userReports]
  );

  return (
    <>
      <DashboardHeader user={user} onLogout={onLogout} onReportIssue={onReportIssue} />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Welcome Banner */}
        <div className="bg-blue-50 p-6 md:p-8 rounded-xl shadow-lg flex justify-between items-center mb-8 border-l-4 border-blue-600">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user.name}</h2>
            <p className="text-blue-600 mt-1">
              Thank you for helping keep your community&apos;s water safe and clean.
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="My Reports"
            value={reportStats.total}
            description="Total submitted"
            icon={FileText}
            colorClass="border-blue-500"
          />
          <StatCard
            title="Pending Review"
            value={reportStats.pending}
            description="Awaiting official action"
            icon={Clock}
            colorClass="border-yellow-500"
          />
          <StatCard
            title="In Progress"
            value={reportStats.inProgress}
            description="Currently being addressed"
            icon={AlertTriangle}
            colorClass="border-orange-500"
          />
          <StatCard
            title="Resolved"
            value={reportStats.resolved}
            description="Successfully fixed"
            icon={CheckCircle}
            colorClass="border-green-500"
          />
        </div>

        {/* Reports Section */}
        <h2 className="text-xl font-bold text-slate-800 mb-4">My Submitted Reports</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reportStats.total > 0 ? (
            userReports.map((report) => <ReportCard key={report.id} report={report} isOfficial={false} />)
          ) : (
            <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500 shadow-inner md:col-span-2">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>
                No reports yet. Click <em>+ Report Issue</em> to submit your first report!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const OfficialDashboard = ({ user, reports, onReportIssue, onLogout, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState('allReports');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterSeverity, setFilterSeverity] = useState('All Severities');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  const reportStats = useMemo(
    () => ({
      total: reports.length,
      critical: reports.filter((r) => r.severity === 'Critical').length,
      active: reports.filter((r) => r.status === 'In Progress' || r.status === 'Pending Review').length,
      resolved: reports.filter((r) => r.status === 'Resolved').length,
    }),
    [reports]
  );

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        const query = searchQuery.toLowerCase().trim();
        const reporterName = report.reporter || report.reporterName || '';
        const matchesSearch =
          report.title?.toLowerCase().includes(query) ||
          report.details?.toLowerCase().includes(query) ||
          report.location?.toLowerCase().includes(query) ||
          reporterName.toLowerCase().includes(query);

        const matchesType = filterType === 'All Types' || report.type === filterType;
        const matchesSeverity = filterSeverity === 'All Severities' || report.severity === filterSeverity;
        const matchesStatus = filterStatus === 'All Statuses' || report.status === filterStatus;

        return matchesSearch && matchesType && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }, [reports, searchQuery, filterType, filterSeverity, filterStatus]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Reports"
              value={reportStats.total}
              icon={Droplet}
              colorClass="border-blue-500"
              description="Total community submissions"
            />
            <StatCard
              title="Critical Reports"
              value={reportStats.critical}
              description="Require immediate intervention"
              icon={XCircle}
              colorClass="border-red-500"
            />
            <StatCard
              title="Active Cases"
              value={reportStats.active}
              description="In progress or investigating"
              icon={AlertTriangle}
              colorClass="border-orange-500"
            />
            <StatCard
              title="Resolved"
              value={reportStats.resolved}
              description="Successfully closed"
              icon={CheckCircle}
              colorClass="border-green-500"
            />
            <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Report Distribution (Mock Data)
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                [Chart Placeholder: Visualizing Types/Severities]
              </div>
            </div>
          </div>
        );
      case 'allReports': {
        const allTypes = ['All Types', ...REPORT_TYPES];
        const allSeverities = ['All Severities', ...SEVERITIES];
        const allStatuses = ['All Statuses', ...STATUSES];

        const Dropdown = ({ value, setter, options }) => (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer text-sm"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        );

        return (
          <div className="space-y-6">
            {/* Search and Filter Row */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Search className="w-5 h-5 text-gray-500 ml-1 mr-3" />
                <input
                  type="text"
                  placeholder="Search reports by title, location, or reporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-gray-700 placeholder-gray-500 focus:outline-none"
                />
                <Filter className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <Dropdown value={filterType} setter={setFilterType} options={allTypes} />
                <Dropdown value={filterSeverity} setter={setFilterSeverity} options={allSeverities} />
                <Dropdown value={filterStatus} setter={setFilterStatus} options={allStatuses} />
                <span className="text-sm text-gray-500 md:text-right">
                  {filteredReports.length} of {reports.length} reports shown
                </span>
              </div>
            </div>

            {/* Report List */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    isOfficial={true}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))
              ) : (
                <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500 shadow-inner md:col-span-2">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <p>No reports match your current filters or search query.</p>
                </div>
              )}
            </div>
          </div>
        );
      }
      case 'interactiveMap': {
        // Filter reports that have coordinates
        const reportsWithCoordinates = reports.filter(r => r.latitude && r.longitude);
        
        // Calculate center position from all reports
        const centerPosition = reportsWithCoordinates.length > 0
          ? [
              reportsWithCoordinates.reduce((sum, r) => sum + r.latitude, 0) / reportsWithCoordinates.length,
              reportsWithCoordinates.reduce((sum, r) => sum + r.longitude, 0) / reportsWithCoordinates.length
            ]
          : [51.505, -0.09]; // Default center

        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <MapIcon className="w-4 h-4 inline mr-2" />
                Showing <strong>{reportsWithCoordinates.length}</strong> reports with GPS coordinates out of <strong>{reports.length}</strong> total reports
              </p>
            </div>
            
            {reportsWithCoordinates.length > 0 ? (
              <div className="h-[600px] rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
                <MapContainer
                  center={centerPosition}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {reportsWithCoordinates.map((report) => {
                    // Custom icon based on severity
                    const iconColor = 
                      report.severity === 'Critical' ? 'red' :
                      report.severity === 'High' ? 'orange' :
                      report.severity === 'Medium' ? 'yellow' : 'green';
                    
                    return (
                      <Marker 
                        key={report.id} 
                        position={[report.latitude, report.longitude]}
                      >
                        <Popup maxWidth={300}>
                          <div className="p-2">
                            <h3 className="font-bold text-lg text-slate-800 mb-2">{report.title}</h3>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">{report.details.substring(0, 100)}...</p>
                              <div className="flex items-center mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityClasses(report.severity)}`}>
                                  {report.severity}
                                </span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(report.status)}`}>
                                  {report.status}
                                </span>
                              </div>
                              <p className="text-gray-500 mt-2">
                                <User className="w-3 h-3 inline mr-1" />
                                {report.reporter || report.reporterName}
                              </p>
                              <p className="text-gray-500">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {report.dateReported}
                              </p>
                              <p className="text-blue-600 text-xs mt-1">
                                📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            ) : (
              <div className="h-96 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 shadow-inner">
                <MapIcon className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-lg font-semibold">No reports with GPS coordinates yet</p>
                <p className="text-sm mt-2">Reports submitted with map coordinates will appear here</p>
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardHeader user={user} onLogout={onLogout} onReportIssue={onReportIssue} />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sticky top-16 bg-gray-50/95 z-10 p-2 -mx-4 md:mx-0 rounded-b-lg">
          <nav className="flex space-x-8 max-w-7xl mx-auto px-4 md:px-0" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center py-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PieChart className="w-5 h-5 mr-2" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('allReports')}
              className={`flex items-center py-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'allReports'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <List className="w-5 h-5 mr-2" /> All Reports
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {reports.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('interactiveMap')}
              className={`flex items-center py-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'interactiveMap'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-5 h-5 mr-2" /> Interactive Map
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </main>
    </>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        // Call the real API
        const response = await ApiService.login(email, password);
        
        if (response.id) {
          // Successfully logged in with API
          const userData = {
            id: response.id,
            email: response.email,
            name: response.name,
            role: response.role,
            department: response.department,
          };
          onLogin(userData);
        }
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, onLogin]
  );

  const handleSignUp = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);

      // Validate inputs
      if (!name.trim()) {
        setError('Name is required');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      try {
        // Call the real API
        const userData = {
          name: name.trim(),
          email: email.toLowerCase(),
          password: password,
          role: role,
          department: department.trim() || (role === 'citizen' ? 'Community Member' : 'Water Department'),
        };

        const response = await ApiService.register(userData);

        if (response.id) {
          // Show success message
          setSuccess('Account created successfully! You can now login.');
          
          // Reset form and switch to login after 2 seconds
          setTimeout(() => {
            setIsSignUp(false);
            setPassword('');
            setSuccess('');
          }, 2000);
        }
      } catch (error) {
        console.error('Sign up error:', error);
        setError(error.message || 'Registration failed. Email may already be registered.');
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, role, department]
  );

  const handleDemoLogin = useCallback(
    (user) => {
      onLogin(user);
    },
    [onLogin]
  );

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
    setDepartment('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/70 p-4 font-inter">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Droplet className="w-12 h-12 text-blue-600 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-800">Clean Water Reporter</h1>
          <p className="text-sm text-gray-500">Community Water Issue Tracking System</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <LogIn className="w-6 h-6 mr-3 text-blue-600" /> {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>

          <form className="space-y-4" onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200">
                {success}
              </div>
            )}

            {isSignUp && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Select
                  label="Account Type"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={['citizen', 'official']}
                  required
                />
                {role === 'official' && (
                  <Input
                    label="Department"
                    name="department"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Water Quality Authority"
                  />
                )}
              </>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Demo Accounts */}
        {!isSignUp && (
          <div className="bg-white p-8 rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-500" /> Demo Accounts
            </h3>
            <p className="text-sm text-gray-500">
              Click to login (password: <strong className="font-semibold text-slate-800">demo123</strong>)
            </p>

            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800 flex items-center space-x-2">
                    <span>{account.name}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        account.role === 'citizen' ? 'bg-blue-100 text-blue-800' : 'bg-slate-800 text-white'
                      }`}
                    >
                      {account.role === 'citizen' ? 'Citizen' : 'Official'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{account.email}</p>
                </div>
                <button
                  onClick={() => handleDemoLogin(account)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Login
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main App Component.
 */
const App = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cleanWaterUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('cleanWaterUser');
      }
    }
  }, []);

  // Load reports from API when user logs in
  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized selected report for the status update modal
  const selectedReport = useMemo(() => {
    return reports.find((r) => r.id === selectedReportId);
  }, [reports, selectedReportId]);

  // --- CRUD Handlers ---

  // 1. Add New Report
  const handleAddReport = useCallback((newReport) => {
    console.log(`[CRUD] New Report Added: ${newReport.title}`);
    // Prepend new report to the list
    setReports((prev) => [newReport, ...prev]);
  }, []);

  // 2. Open Modal for Status Update
  const handleOpenUpdateStatus = useCallback(
    (reportId) => {
      if (user?.role === 'official') {
        setSelectedReportId(reportId);
        setIsStatusModalOpen(true);
      }
    },
    [user]
  );

  // 3. Update Existing Report
  const handleUpdateReport = useCallback(async (updatedReport) => {
    console.log(`[CRUD] Report Status Updated: ID ${updatedReport.id} to ${updatedReport.status}`);
    try {
      const updated = await ApiService.updateReportStatus(
        updatedReport.id,
        updatedReport.status,
        updatedReport.severity
      );
      setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedReportId(null);
    } catch (error) {
      console.error('Failed to update report:', error);
      alert('Failed to update report status');
    }
  }, []);

  // --- Auth Handlers ---

  const handleLogin = useCallback((account) => {
    setUser(account);
    localStorage.setItem('cleanWaterUser', JSON.stringify(account));
    setIsReportModalOpen(false);
    setIsStatusModalOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setReports([]);
    localStorage.removeItem('cleanWaterUser');
  }, []);

  const handleReportIssue = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  // --- Main Rendering ---

  let content;
  if (!user) {
    content = <LoginScreen onLogin={handleLogin} />;
  } else if (user.role === 'citizen') {
    content = (
      <CitizenDashboard
        user={user}
        reports={reports}
        onLogout={handleLogout}
        onReportIssue={handleReportIssue}
      />
    );
  } else if (user.role === 'official') {
    content = (
      <OfficialDashboard
        user={user}
        reports={reports}
        onLogout={handleLogout}
        onReportIssue={handleReportIssue}
        onUpdateStatus={handleOpenUpdateStatus}
      />
    );
  }

  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen">
      {/* Main Content */}
      {content}

      {/* Modals */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleAddReport}
        reporterName={user ? user.name : 'Guest'}
      />

      {selectedReport && (
        <UpdateStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          report={selectedReport}
          onUpdate={handleUpdateReport}
        />
      )}
    </div>
  );
};

export default App;