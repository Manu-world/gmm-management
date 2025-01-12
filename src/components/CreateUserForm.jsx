import { useMemo, useState } from "react";
import validateForm from "./validateForm";
import MemberAvatar from "./MemberAvatar";
import ImageUpload from "./ImageUpload";

const CreateUserForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    occupation: '',
    status: 'Active',
    profilePicture: null,
    role: 'Member',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      profilePicture: file
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required';
    if (!data.name) errors.name = 'Name is required';
    if (!data.region) errors.region = 'Region is required';
    if (!data.occupation) errors.occupation = 'Occupation is required';
    if (!data.phone) errors.phone = 'Phone is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('region', formData.region);
    formDataToSend.append('occupation', formData.occupation);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('role', formData.role);
    
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch("https://ghana-muslim-mission.onrender.com/api/user/create", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials:"include",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setFormErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const regions = ['All Regions', 'Greater Accra', 'Ashanti', 'Northern', 'Volta', 'Eastern', 'Western'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center mb-6">
        <MemberAvatar 
          member={{ 
            name: formData.name || 'New Member',
            profilePicture: formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : null 
          }} 
          size="large" 
        />
      </div>

      <ImageUpload
        onChange={(file) => {
          setFormData(prev => ({ ...prev, profilePicture: file }));
          if (formErrors.profilePicture) {
            setFormErrors(prev => ({ ...prev, profilePicture: '' }));
          }
        }}
        error={formErrors.profilePicture}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {formErrors.name && (
            <p className="text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {formErrors.email && (
            <p className="text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+233 XX XXX XXXX"
          />
          {formErrors.phone && (
            <p className="text-sm text-red-500">{formErrors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Region <span className="text-red-500">*</span>
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.region ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Region</option>
            {regions.filter(r => r !== 'All Regions').map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {formErrors.region && (
            <p className="text-sm text-red-500">{formErrors.region}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter occupation"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          {formErrors.role && (
            <p className="text-sm text-red-500">{formErrors.role}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Member'}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;