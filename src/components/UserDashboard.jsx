import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Edit, Save, Upload, History, CreditCard } from 'lucide-react';
import Skeleton from './ui/skeleton';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { User, MapPin, Calendar, Phone, Briefcase, Mail, ChevronRight } from 'lucide-react';
import ActionButton from './ActionButton';
import logo from "../assets/logo.png"
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

const MembershipCard = ({ user, className = "" }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardStyle = {
    backgroundImage: `url(${logo})`,
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

const EditProfileDialog = ({ isOpen, onClose, userData, onSave, isLoading }) => {
  const [editedData, setEditedData] = useState(userData);

  useEffect(() => {
    setEditedData(userData);
  }, [userData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex justify-center">
            <ProfilePicture 
              user={editedData} 
              size="large" 
              editable={true}
              onImageChange={(image) => setEditedData(prev => ({...prev, profilePic: image}))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "tel" },
              { label: "Region", key: "region" },
              { label: "Occupation", key: "occupation" }
            ].map(field => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type={field.type || "text"}
                  value={editedData?.[field.key] || ''}
                  onChange={e => setEditedData(prev => ({...prev, [field.key]: e.target.value}))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedData)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserDashboard = () => {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
      setIsEditDialogOpen(false);
    },
  });

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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-full">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member ID</p>
                <h1 className="text-2xl font-bold text-gray-900">{'GMM100125'}</h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              
              <ActionButton 
                icon={Edit}
                label="Edit Profile"
                onClick={() => setIsEditDialogOpen(true)}
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 w-full max-w-[400px]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <MembershipCard user={userData} className="lg:sticky lg:top-6" />
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <ActionButton 
                icon={History}
                label="Payment History"
                variant="secondary"
                onClick={() => {/* Handle payment history */}}
              />
              <ActionButton 
                icon={CreditCard}
                label="Make Payment"
              />
            </div>
            
            <EditProfileDialog 
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              userData={userData}
              onSave={(data) => {
                updateProfileMutation.mutate(data);
                setIsEditDialogOpen(false);
              }}
              isLoading={updateProfileMutation.isPending}
            />
          </>
        )}

        {updateProfileMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            Failed to update profile: {updateProfileMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;