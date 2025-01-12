import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Edit, Save, Upload } from 'lucide-react';
import Skeleton from './ui/skeleton';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Phone, Briefcase, Mail, ChevronRight } from 'lucide-react';

const ProfilePicture = ({ user, size = "default", editable = false, onImageChange, isLoading }) => {
  const sizeClasses = {
    small: "h-10 w-10 text-base",
    default: "h-20 w-20 text-xl",
    large: "h-32 w-32 text-3xl"
  };

  if (isLoading) {
    return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
  }

  const getInitials = (name = '') => {
    return name.split(' ').map(n => n?.[0]).join('').toUpperCase() || '?';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <div className={`relative rounded-full flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${
        user?.profilePic ? '' : 'bg-green-100'
      }`}>
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user?.name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-green-600">
            {getInitials(user?.name)}
          </span>
        )}
      </div>
      
      {editable && (
        <label className="absolute bottom-0 right-0 p-1 bg-green-600 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
          <Upload className="w-4 h-4 text-white" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};

const MembershipCard = ({ user }) => {
  // import logo from "../assets/logo.png"
  const [isFlipped, setIsFlipped] = useState(false);
  const cardStyle = {
    backgroundImage: 'url(../assets/logo.png)',
    backgroundSize: '80%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundOpacity: 0.1
  };

  return (
    <div className="perspective-1000 w-96 h-56 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-2xl text-white relative overflow-hidden">
            {/* Background Logo */}
            <div className="absolute inset-0 opacity-5" style={cardStyle}></div>
            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Ghana Muslim Mission</h3>
                  <p className="text-xs opacity-75">Member Card</p>
                </div>
                <div className="w-16 h-16">
                  <ProfilePicture user={user} size="small" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 opacity-75" />
                  <span>{user?.region}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 opacity-75" />
                  <span>Member since: {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-mono">GMM100125</span>
                  <div className="flex items-center text-xs opacity-75">
                    <span>Flip card</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-white rounded-xl p-6 shadow-2xl">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <QRCodeSVG 
                  value={`GMM-MEMBER-${user?._id || 'GMM100125'}`}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
                <p className="mt-2 text-sm text-gray-600">Scan to verify membership</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDetails = ({ label, value, icon: Icon }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-green-100 rounded-full">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const UserDashboard = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://ghana-muslim-mission.onrender.com/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    },
  });

  // Set editedData whenever userData changes
  useEffect(() => {
    if (userData) {
      setEditedData(userData);
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`https://ghana-muslim-mission.onrender.com/api/user/${userData._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
      setIsEditing(false);
    },
  });

  const handleSaveProfile = () => {
    if (editedData) {
      updateProfileMutation.mutate(editedData);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Failed to load user data: {error.message}. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-56 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Membership Card Section */}
              <div className="md:w-96">
                <MembershipCard user={userData} />
              </div>

              {/* User Details Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <UserDetails 
                    label="Email"
                    value={userData?.email}
                    icon={Mail}
                  />
                  <UserDetails 
                    label="Phone"
                    value={userData?.phone}
                    icon={Phone}
                  />
                  <UserDetails 
                    label="Occupation"
                    value={userData?.occupation}
                    icon={Briefcase}
                  />
                  <UserDetails 
                    label="Region"
                    value={userData?.region}
                    icon={MapPin}
                  />
                  <UserDetails 
                    label="Member Since"
                    value={new Date(userData?.createdAt).toLocaleDateString()}
                    icon={Calendar}
                  />
                  <UserDetails 
                    label="Member ID"
                    value="GMM100125"
                    icon={User}
                  />
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            {!isLoading && (
              <button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="mt-8 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={updateProfileMutation.isPending}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            )}
          </>
        )}

        {updateProfileMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Failed to update profile: {updateProfileMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;