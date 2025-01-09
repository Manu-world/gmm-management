import React, { useState } from 'react';
import { Calendar, CreditCard, Edit, Save, X, DollarSign, User, Clock, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
// import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import RecordPaymentModal from './RecordPaymentModal';

const ProfilePicture = ({ user, size = "default", editable = false, onImageChange }) => {
  const sizeClasses = {
    small: "h-10 w-10 text-base",
    default: "h-20 w-20 text-xl",
    large: "h-32 w-32 text-3xl"
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
        user.profilePicture ? '' : 'bg-green-100'
      }`}>
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-green-600">
            {getInitials(user.name)}
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

const UserDashboard = () => {
  // Sample user data - would normally come from an API
  const [userData, setUserData] = useState({
    id: 1,
    name: 'Kwame Mensah',
    email: 'kwame@example.com',
    phone: '+233 24 123 4567',
    region: 'Greater Accra',
    occupation: 'Teacher',
    memberSince: '2022-03-15',
    profilePicture: null,
    payments: [
      { id: 1, date: '2024-01-01', amount: 50, status: 'Paid', method: 'Mobile Money' },
      { id: 2, date: '2023-12-01', amount: 50, status: 'Paid', method: 'Mobile Money' },
      { id: 3, date: '2023-11-01', amount: 50, status: 'Paid', method: 'Mobile Money' },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleImageChange = (imageData) => {
    setEditedData(prev => ({
      ...prev,
      profilePicture: imageData
    }));
  };

  const handlePayment = (paymentData) => {
    // Update userData with the new payment
    const newPayment = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: paymentData.amount,
      status: 'Paid',
      method: paymentData.method
    };
    
    setUserData(prev => ({
      ...prev,
      payments: [newPayment, ...prev.payments]
    }));
    
    setShowRecordPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payments">Dues & Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>View and manage your profile information</CardDescription>
                  </div>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <ProfilePicture 
                    user={isEditing ? editedData : userData} 
                    size="large"
                    editable={isEditing}
                    onImageChange={handleImageChange}
                  />
                  {isEditing && (
                    <p className="text-sm text-gray-500 mt-2">
                      Click the upload icon to change your profile picture
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={isEditing ? editedData.name : userData.name}
                      onChange={e => setEditedData({...editedData, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={isEditing ? editedData.email : userData.email}
                      onChange={e => setEditedData({...editedData, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={isEditing ? editedData.phone : userData.phone}
                      onChange={e => setEditedData({...editedData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Region</label>
                    <input
                      type="text"
                      value={isEditing ? editedData.region : userData.region}
                      onChange={e => setEditedData({...editedData, region: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Occupation</label>
                    <input
                      type="text"
                      value={isEditing ? editedData.occupation : userData.occupation}
                      onChange={e => setEditedData({...editedData, occupation: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md disabled:bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <input
                      type="text"
                      value={userData.memberSince}
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">Current Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">₵50.00</p>
                        <p className="text-sm text-gray-500">Due: Jan 31, 2024</p>
                      </div>
                      <button
                        onClick={() => setShowRecordPaymentModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Pay Now
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600">Up to Date</p>
                      <p className="text-sm text-gray-500">Last paid: Jan 1, 2024</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">Total Paid (2024)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">₵50.00</p>
                      <p className="text-sm text-gray-500">1 payment made</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View all your past payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.payments.map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Monthly Dues</p>
                            <p className="text-sm text-gray-500">{payment.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₵{payment.amount}</p>
                          <p className="text-sm text-gray-500">Paid via {payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {showRecordPaymentModal && (
          <RecordPaymentModal
            onClose={() => setShowRecordPaymentModal(false)}
            onSuccess={handlePayment}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;