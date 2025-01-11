import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Bell, Users, UserCircle, DollarSign, Map, ChevronDown, Search, Plus, X, Calendar, CreditCard, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import RecordPaymentModal from './RecordPaymentModal';
import MemberAvatar from './MemberAvatar';
import ImageUpload from './ImageUpload';
import validateForm from './validateForm';
import UserProfileForm from './UserProfileForm';
import CreateUserForm from './CreateUserForm'
import PaymentTrackingModal from './PaymentTrackingModal';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('directory');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  

  const regions = ['All Regions', 'Greater Accra', 'Ashanti', 'Northern', 'Volta', 'Eastern', 'Western'];
  
  const addMember = (newMember) => {
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

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
    }
    
  ], []);

  const [members, setMembers] = useState(membersList);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesRegion = selectedRegion === 'All Regions' || member.region === selectedRegion;
      const matchesSearch = searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [members, selectedRegion, searchTerm]);

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">GhanaAssoc</span>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 cursor-pointer hover:text-green-200" />
              <div className="flex items-center gap-2 cursor-pointer hover:text-green-200">
                <UserCircle className="w-6 h-6" />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors w-full md:w-auto"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add New Member
        </button>

        <Tabs defaultValue="directory" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="dues">Dues Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="directory">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Members
                  </CardTitle>
                  <Users className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,534</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Dues Collection
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₵25,340</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Regions
                  </CardTitle>
                  <Map className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16</div>
                </CardContent>
              </Card>
            </div>

            {/* Members Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Members Directory</CardTitle>
                    <CardDescription>Manage association members and their dues status</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                      <select 
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-green-500"
                      >
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="relative flex-1 md:w-64">
                      <input
                        type="text"
                        placeholder="Search members..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dues</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MemberAvatar member={member} />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.region}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                                member.duesPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                              onClick={() => {
                                setSelectedUser(member);
                                setShowPaymentModal(true)
                              }}
                            >
                              {member.duesPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              className="text-green-600 hover:text-green-900"
                              onClick={() => {
                                setSelectedUser(member);
                                setShowProfileModal(true);
                            }}
                            >
                              Edit
                            </button>
                            <span className="mx-2">|</span>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dues">
            <Card>
              <CardHeader>
                <CardTitle>Dues Overview</CardTitle>
                <CardDescription>Monthly dues tracking and payment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Monthly Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-green-700">This Month</h3>
                      <div className="mt-2">
                        <p className="text-3xl font-bold text-green-800">₵4,250</p>
                        <p className="text-sm text-green-600">85 members paid</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-yellow-700">Outstanding</h3>
                      <div className="mt-2">
                        <p className="text-3xl font-bold text-yellow-800">₵750</p>
                        <p className="text-sm text-yellow-600">15 members pending</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-700">Collection Rate</h3>
                      <div className="mt-2">
                        <p className="text-3xl font-bold text-blue-800">85%</p>
                        <p className="text-sm text-blue-600">vs 82% last month</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Calendar */}
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Recent Payments</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <select className="border rounded-md px-3 py-1">
                          <option>January 2024</option>
                          <option>December 2023</option>
                          <option>November 2023</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {members[0].payments.map(payment => (
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
                            <p className="text-sm text-gray-500">Paid via Mobile Money</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create User Modal */}
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Member</DialogTitle>
                <DialogDescription>
                  Add a new member to the association
                </DialogDescription>
              </DialogHeader>
              <CreateUserForm onClose={() => setShowCreateModal(false)} />
            </DialogContent>
          </Dialog>
        </Tabs>
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update member information and preferences
            </DialogDescription>
          </DialogHeader>
          {selectedUser && <UserProfileForm user={selectedUser} onClose={() => setShowProfileModal(false)} />}
        </DialogContent>
      </Dialog>

      {/* Payment Tracking Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment History</DialogTitle>
            <DialogDescription>
              View and manage member payment history
            </DialogDescription>
          </DialogHeader>
          {selectedUser && <PaymentTrackingModal user={selectedUser} onClose={() => setShowPaymentModal(false)} />}
        </DialogContent>
      </Dialog>

      {/* Show Record Payment Modal */}
      {showRecordPaymentModal && selectedUser && (
        <RecordPaymentModal
          user={selectedUser}
          onClose={() => setShowRecordPaymentModal(false)}
          onSuccess={(paymentData) => {
            // Update the member's payment status
            setMembers(prev => prev.map(member => 
              member.id === selectedUser.id 
                ? {
                    ...member,
                    duesPaid: true,
                    payments: [...member.payments, {
                      id: Date.now(),
                      date: new Date().toISOString().split('T')[0],
                      amount: parseFloat(paymentData.amount),
                      status: 'Paid',
                      reference: paymentData.reference,
                      method: 'MTN Mobile Money'
                    }]
                  }
                : member
            ));
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;