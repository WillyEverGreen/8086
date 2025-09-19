import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FileText, TrendingUp, AlertCircle, CheckCircle, Star, ArrowRight, Edit, Download } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';

const ResumeAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'suggestions'>('overview');

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Resume Found</h2>
          <p className="text-gray-600 mb-8">Please upload your resume first to get started with the analysis.</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const { analysis } = resumeData;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis</h1>
          <p className="text-gray-600">Detailed analysis of your resume with AI-powered insights and recommendations</p>
        </div>

        {/* Score Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300">
                  <div 
                    className={`w-24 h-24 rounded-full bg-gradient-to-r ${analysis ? getScoreBgColor(analysis.score) : 'from-gray-400 to-gray-500'} flex items-center justify-center`}
                    style={{ 
                      background: analysis ? `conic-gradient(from 0deg, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${analysis.score}%, rgb(229, 231, 235) ${analysis.score}%, rgb(229, 231, 235) 100%)` : undefined
                    }}
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <span className={`text-2xl font-bold ${analysis ? getScoreColor(analysis.score) : 'text-gray-500'}`}>
                        {analysis?.score || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Overall Resume Score</h2>
                <p className="text-gray-600">Based on ATS compatibility, content quality, and formatting</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        analysis && i < Math.floor(analysis.score / 20)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {analysis ? Math.floor(analysis.score / 20) : 0}/5 stars
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/jobs')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Find Jobs</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 inline-flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Optimize</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 border border-white/20 inline-flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'detailed'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Detailed Analysis
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'suggestions'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Suggestions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
              </div>
              <div className="space-y-4">
                {analysis?.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
              </div>
              <div className="space-y-4">
                {analysis?.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-8">
            {/* Skills Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Extracted Skills</h3>
              <div className="flex flex-wrap gap-3">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Experience Analysis</h3>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-800 font-medium">{exp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Education Background</h3>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="text-gray-800 font-medium">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="space-y-6">
              {analysis?.suggestions.map((suggestion, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium mb-2">{suggestion}</p>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                        Learn how to implement this →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">Ready to optimize your resume?</h4>
              <p className="text-gray-700 mb-4">
                Get personalized suggestions and learn specific skills to improve your job prospects.
              </p>
              <button
                onClick={() => navigate('/skills')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>View Skills Recommendations</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;