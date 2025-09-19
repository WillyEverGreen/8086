import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Upload, FileText, Briefcase, TrendingUp, CheckCircle, Clock, Target, Users, Award } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume to get started with AI analysis',
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      path: '/upload',
      status: resumeData ? 'completed' : 'pending'
    },
    {
      title: 'Resume Analysis',
      description: 'Get detailed feedback and improvement suggestions',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      path: '/analysis',
      status: resumeData?.analysis ? 'completed' : resumeData ? 'available' : 'locked'
    },
    {
      title: 'Job Matching',
      description: 'Find jobs that match your skills and experience',
      icon: Briefcase,
      color: 'from-teal-500 to-teal-600',
      path: '/jobs',
      status: resumeData ? 'available' : 'locked'
    },
    {
      title: 'Skills Recommendations',
      description: 'Learn what skills to develop for better opportunities',
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      path: '/skills',
      status: resumeData?.analysis ? 'available' : 'locked'
    }
  ];

  const stats = [
    {
      label: 'Resume Score',
      value: resumeData?.analysis?.score || 0,
      suffix: '/100',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Skills Identified',
      value: resumeData?.skills?.length || 0,
      suffix: '',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      label: 'Job Matches',
      value: resumeData ? Math.floor(Math.random() * 25) + 15 : 0,
      suffix: '',
      icon: Briefcase,
      color: 'text-teal-600'
    },
    {
      label: 'Profile Views',
      value: Math.floor(Math.random() * 50) + 25,
      suffix: '',
      icon: Users,
      color: 'text-indigo-600'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'available':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'available':
        return 'Available';
      case 'pending':
        return 'Get Started';
      default:
        return 'Locked';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Career Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Track your progress, analyze your resume, and find your perfect job match.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                    <span className="text-sm text-gray-500">{stat.suffix}</span>
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => action.status !== 'locked' && navigate(action.path)}
                className={`bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all duration-300 ${
                  action.status !== 'locked' 
                    ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    action.status === 'completed' ? 'text-green-600' :
                    action.status === 'available' ? 'text-blue-600' :
                    action.status === 'pending' ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    {getStatusText(action.status)}
                  </span>
                  {getStatusIcon(action.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {resumeData && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Resume uploaded successfully</p>
                  <p className="text-sm text-gray-600">File: {resumeData.filename}</p>
                </div>
                <span className="text-sm text-gray-500">Just now</span>
              </div>
              
              {resumeData.analysis && (
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Resume analysis completed</p>
                    <p className="text-sm text-gray-600">Score: {resumeData.analysis.score}/100</p>
                  </div>
                  <span className="text-sm text-gray-500">2 min ago</span>
                </div>
              )}
              
              <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New job matches available</p>
                  <p className="text-sm text-gray-600">Found {Math.floor(Math.random() * 15) + 10} potential matches</p>
                </div>
                <span className="text-sm text-gray-500">5 min ago</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;