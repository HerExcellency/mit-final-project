import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, User, Mail, Lock, Phone, Building, Briefcase, AlertCircle, ChevronDown } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    employeeId: '',
    jobTitle: '',
    department: '',
    licenseNumber: '',
    facilityName: 'TranqBleu General Hospital',
    facilityType: 'Private Healthcare Facility',
    userRole: 'healthcare_provider',
    trainingStatus: false,
    termsAccepted: false,
    ndprConsent: false
  });

  const [loading, setLoading] = useState(false);
  const { signup, error, setError } = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Administration',
    'Cardiology',
    'Emergency',
    'Finance',
    'IT Department',
    'Laboratory',
    'Nursing',
    'Pediatrics',
    'Pharmacy',
    'Radiology',
    'Surgery'
  ];

  const jobTitles = [
    'Doctor',
    'Nurse',
    'Lab Technician',
    'Pharmacist',
    'Administrator',
    'Compliance Officer',
    'IT Staff',
    'Finance Officer',
    'Department Head',
    'Medical Officer'
  ];

  const userRoles = [
    { value: 'compliance_officer', label: 'Compliance Officer', description: 'Full system access' },
    { value: 'healthcare_provider', label: 'Healthcare Provider', description: 'Patient data access' },
    { value: 'financial_staff', label: 'Financial Staff', description: 'Payment processing access' },
    { value: 'administrator', label: 'Administrator', description: 'System settings access' },
    { value: 'auditor', label: 'Auditor', description: 'Read-only reports access' }
  ];

  const facilities = [
    'Lagos General Hospital',
    'Victoria Island Clinic',
    'Ikeja Medical Centre',
    'Lekki Health Centre',
    'Surulere General Hospital'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the terms of service');
      return false;
    }
    if (!formData.ndprConsent) {
      setError('You must provide NDPR consent for data processing');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);
      await signup(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TrustCare Healthcare Compliance</h1>
          <p className="text-gray-600 mt-2">Create your account to access the compliance dashboard</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Register</h2>
          
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dele Ara"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="dele.ara@hospital.com"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee/Staff ID *
                  </label>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="EMP001234"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <select
                    id="jobTitle"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Job Title</option>
                    {jobTitles.map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* License Number (Optional) */}
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional License Number (Optional)
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="For medical staff"
                  />
                </div>

                {/* User Role */}
                <div>
                  <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
                    Access Role *
                  </label>
                  <select
                    id="userRole"
                    name="userRole"
                    required
                    value={formData.userRole}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {userRoles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Facility Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facility Name */}
                <div>
                  <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Name *
                  </label>
                  <select
                    id="facilityName"
                    name="facilityName"
                    required
                    value={formData.facilityName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {facilities.map(facility => (
                      <option key={facility} value={facility}>{facility}</option>
                    ))}
                  </select>
                </div>

                {/* Facility Type */}
                <div>
                  <label htmlFor="facilityType" className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Type *
                  </label>
                  <select
                    id="facilityType"
                    name="facilityType"
                    required
                    value={formData.facilityType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Public Healthcare Facility">Public Healthcare Facility</option>
                    <option value="Private Healthcare Facility">Private Healthcare Facility</option>
                    <option value="Specialist Hospital">Specialist Hospital</option>
                    <option value="Primary Healthcare Centre">Primary Healthcare Centre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance & Agreements */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance & Agreements</h3>
              <div className="space-y-3">
                {/* Data Protection Training */}
                <div className="flex items-center">
                  <input
                    id="trainingStatus"
                    name="trainingStatus"
                    type="checkbox"
                    checked={formData.trainingStatus}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trainingStatus" className="ml-2 block text-sm text-gray-700">
                    I have completed data protection training
                  </label>
                </div>

                {/* Terms of Service */}
                <div className="flex items-center">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                    I accept the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> *
                  </label>
                </div>

                {/* NDPR Consent */}
                <div className="flex items-center">
                  <input
                    id="ndprConsent"
                    name="ndprConsent"
                    type="checkbox"
                    required
                    checked={formData.ndprConsent}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ndprConsent" className="ml-2 block text-sm text-gray-700">
                    I consent to data processing under NDPR guidelines *
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to comply with all healthcare data protection regulations
          </p>
        </div>
      </div>
    </div>
  );
}