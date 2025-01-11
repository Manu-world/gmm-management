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

    const membersList = useMemo(() => [
        { 
          id: 1, 
          name: 'Ali Mohammed',
          region: 'Greater Accra', 
          status: 'Active', 
          duesPaid: true,
          email: 'ali@example.com',
          phone: '+233 24 123 4567',
          occupation: 'Teacher',
          memberSince: '2022-03-15',
          profilePicture: null,
          payments: [
            { id: 1, date: '2024-01-01', amount: 50, status: 'Paid' },
            { id: 2, date: '2023-12-01', amount: 50, status: 'Paid' },
            { id: 3, date: '2023-11-01', amount: 50, status: 'Paid' },
          ]
        },
        { 
          id: 2, 
          name: 'Fatima Ibrahim',
          region: 'Ashanti', 
          status: 'Active', 
          duesPaid: false,
          email: 'fatima@example.com',
          phone: '+233 24 234 5678',
          occupation: 'Nurse',
          memberSince: '2021-05-10',
          profilePicture: null,    
          payments: [
            { id: 1, date: '2023-10-01', amount: 50, status: 'Unpaid' },
          ]
        },
        { 
          id: 3, 
          name: 'Omar Khan',
          region: 'Northern', 
          status: 'Inactive', 
          duesPaid: false,
          email: 'omar@example.com',
          phone: '+233 24 345 6789',
          occupation: 'Engineer',
          memberSince: '2020-08-20',
          profilePicture: null,
          payments: []
        },
        { 
          id: 4, 
          name: 'Aisha Abdallah',
          region: 'Volta', 
          status: 'Active', 
          duesPaid: true,
          email: 'aisha@example.com',
          phone: '+233 24 456 7890',
          occupation: 'Accountant',
          memberSince: '2022-01-15',
          profilePicture: null,
          payments: [
            { id: 1, date: '2024-01-01', amount: 50, status: 'Paid' },
          ]
        },
        { 
          id: 5, 
          name: 'Khalid Yusuf',
          region: 'Eastern', 
          status: 'Active', 
          duesPaid: true,
          email: 'khalid@example.com',
          phone: '+233 24 567 8901',
          occupation: 'Lawyer',
          memberSince: '2023-02-25',
          profilePicture: null,
          payments: [
            { id: 1, date: '2024-01-01', amount: 50, status: 'Paid' },
          ]
        },
        // ... other members
      ], []);
    const regions = ['All Regions', 'Greater Accra', 'Ashanti', 'Northern', 'Volta', 'Eastern', 'Western'];

    
    const [members, setMembers] = useState(membersList);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const handleImageChange = (file) => {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      if (formErrors.profilePicture) {
        setFormErrors(prev => ({ ...prev, profilePicture: '' }));
      }
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

      try {
        // Prepare data for API call using FormData
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append('role', formData.role);
        if (formData.profilePicture) {
          formDataToSend.append('profilePicture', formData.profilePicture);
        }

        // Get the access token from localStorage
        // const accessToken = localStorage.getItem('accessToken');
        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzdkM2QyYzZlNmUxZTQ0MDU2NGQ1YTUiLCJpYXQiOjE3MzY2MTg0MDEsImV4cCI6MTczNjYyMjAwMX0.Yr3zfeFvXc8Cqneq3HUv3rETlJtPDA19_qzQ7nhdGUo";

        // Send POST request to the API endpoint with the access token in headers
        const response = await fetch('https://ghana-muslim-mission.onrender.com/api/user/create', {
          method: 'POST',
          // credentials: "include",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            // 'Content-Type': 'multipart/form-data'
          },
          body: formDataToSend,
        });
        
        console.log("createform response: ", response)
        if (!response.ok) {
          throw new Error('Failed to create user');
        }

        const newMember = await response.json(); 

        // Add to members list (in real app, this would be an API call)
        setMembers(prev => [...prev, newMember]);
        onClose();
      } catch (error) {
        setFormErrors({ submit: 'Failed to create user. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    // Helper function to convert File to base64
    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };

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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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