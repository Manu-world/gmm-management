import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, Users, UserCircle, DollarSign, Map, Search,
  Plus, Edit, Trash2, Calendar, CreditCard, ChevronDown,
  ArrowUp, ArrowDown, Filter, Download
} from 'lucide-react';
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
import { AnimatedStats, AnimatedCard, SkeletonLoader } from './AnimatedStats';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  const regions = ['All Regions', 'Greater Accra', 'Ashanti', 'Northern', 'Volta', 'Eastern', 'Western'];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://ghana-muslim-mission.onrender.com/api/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setMembers(formatMemberData(data.data));
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const admin_profile = JSON.parse(localStorage.getItem("user"))
  console.log("admin: ", admin_profile)
  const formatMemberData = (data) => {
    return data.map(member => ({
      id: member._id,
      name: member.name,
      region: member.region,
      status: member.status,
      duesPaid: member.isVerified,
      email: member.email,
      phone: member.phone,
      occupation: member.occupation,
      memberSince: member.createdAt?.split('T')[0] || 'N/A',
      profilePicture: member.profilePic,
      payments: member.payments || []
    }));
  };

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesRegion = selectedRegion === 'All Regions' || member.region === selectedRegion;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.phone.toLowerCase().includes(searchLower);
      return matchesRegion && matchesSearch;
    }).sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
    });
  }, [members, selectedRegion, searchTerm, sortConfig]);

  const stats = {
    totalMembers: members.length,
    activeMembersCount: members.filter(m => m.status === 'Active').length,
    totalDues: members.reduce((acc, m) => acc + (m.payments?.reduce((sum, p) => sum + p.amount, 0) || 0), 0),
    duesCollectionRate: ((members.filter(m => m.duesPaid).length / members.length) * 100) || 0
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Admin Portal
              </span>
              <div className="hidden md:flex space-x-6">
                {['Overview', 'Members', 'Analytics', 'Settings'].map(item => (
                  <button 
                    key={item}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${activeTab === item.toLowerCase() 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab(item.toLowerCase())}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
                <img 
                  src={admin_profile.profilePic}
                  alt="Admin"
                  className="w-8 h-8 rounded-full border-2 border-green-500"
                />
                <span className="font-medium text-gray-700">{admin_profile? admin_profile.name.split(" ")[0]:"Admin"}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: 'Total Members',
                value: stats.totalMembers,
                icon: Users,
                color: 'green',
                trend: '+5.2%'
              },
              {
                title: 'Active Members',
                value: stats.activeMembersCount,
                icon: UserCircle,
                color: 'green',
                trend: '+3.1%'
              },
              {
                title: 'Total Dues',
                value: `₵${stats.totalDues.toLocaleString()}`,
                icon: DollarSign,
                color: 'green',
                trend: '+12.5%'
              },
              {
                title: 'Collection Rate',
                value: `${stats.duesCollectionRate.toFixed(1)}%`,
                icon: Map,
                color: 'green',
                trend: '+2.4%'
              }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend.startsWith('+') ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Members Table Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Members Directory</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                  <button  onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>
              </div>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4">
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-3 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Region', 'Status', 'Last Payment', 'Actions'].map(header => (
                      <th 
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort(header.toLowerCase())}
                      >
                        <div className="flex items-center gap-2">
                          {header}
                          {sortConfig.key === header.toLowerCase() && (
                            sortConfig.direction === 'asc' ? 
                              <ArrowUp className="w-4 h-4" /> : 
                              <ArrowDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member, idx) => (
                    <tr 
                      key={member.id}
                      className="hover:bg-green-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={member.profilePicture || "/api/placeholder/40/40"}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{member.region}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          member.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {member.payments?.[0]?.date || 'No payments'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 rounded-lg hover:bg-green-100 transition-colors">
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                          <button className="p-1 rounded-lg hover:bg-red-100 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;