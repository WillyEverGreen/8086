import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';

const ResumeUpload: React.FC = () => {
  const navigate = useNavigate();
  const { setResumeData, analyzeResume } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobType, setJobType] = useState<'job' | 'internship'>('job');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().match(/\.(pdf|doc|docx|txt)$/)) {
      setUploadStatus('error');
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');

    // Simulate file upload
    setTimeout(async () => {
      setUploadStatus('processing');
      
      // Simulate file reading
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        // Clean the resume content (remove extra whitespaces, format properly)
        const cleanedContent = content
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .trim();

        // Set initial resume data
        const resumeData = {
          filename: file.name,
          content: cleanedContent,
          skills: [],
          experience: [],
          education: []
        };
        
        setResumeData(resumeData);
        
        // Start AI analysis
        await analyzeResume(cleanedContent);
        
        setUploadStatus('success');
      };
      
      reader.readAsText(file);
    }, 1500);
  };

  const handleContinue = () => {
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Resume</h1>
          <p className="text-gray-600 text-lg">
            Upload your resume to get AI-powered analysis, job matching, and career recommendations
          </p>
        </div>

        {/* Job Type Selection */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 border border-white/20">
              <div className="flex space-x-2">
                <button
                  onClick={() => setJobType('job')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    jobType === 'job'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Full-time Jobs
                </button>
                <button
                  onClick={() => setJobType('internship')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    jobType === 'internship'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Internships
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          {uploadStatus === 'idle' && (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop your resume here
              </h3>
              <p className="text-gray-600 mb-6">
                Supports PDF, DOC, DOCX, and TXT files up to 10MB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Uploading your resume...</h3>
              <p className="text-gray-600">Please wait while we process your file</p>
            </div>
          )}

          {uploadStatus === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your resume...</h3>
              <p className="text-gray-600">Our AI is extracting skills and analyzing your experience</p>
              <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto mt-4">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && uploadedFile && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume uploaded successfully!</h3>
              <p className="text-gray-600 mb-2">File: {uploadedFile.name}</p>
              <p className="text-gray-600 mb-6">Your resume has been analyzed and is ready for review</p>
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>View Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload failed</h3>
              <p className="text-gray-600 mb-6">Please make sure your file is in PDF, DOC, DOCX, or TXT format</p>
              <button
                onClick={() => setUploadStatus('idle')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Analysis</h3>
            <p className="text-gray-600 text-sm">
              Our AI analyzes your resume structure, content, and formatting to provide actionable feedback
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Skills Extraction</h3>
            <p className="text-gray-600 text-sm">
              Automatically identifies your technical and soft skills to match with relevant opportunities
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="bg-teal-100 rounded-lg p-3 w-fit mb-4">
              <ArrowRight className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Job Matching</h3>
            <p className="text-gray-600 text-sm">
              Find jobs you qualify for and discover opportunities you're almost ready for
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;