import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Briefcase, MapPin, Clock, DollarSign, Users, Star, ExternalLink, Filter, Search } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  posted: string;
  matchPercentage: number;
  description: string;
  requirements: string[];
  benefits: string[];
  qualificationLevel: 'qualified' | 'almost-qualified' | 'stretch';
}

const JobMatching: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'qualified' | 'almost-qualified' | 'stretch'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'salary'>('match');

  useEffect(() => {
    if (!resumeData) {
      navigate('/upload');
      return;
    }

    // Simulate job fetching and matching
    const fetchJobs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$120k - $160k',
          posted: '2 days ago',
          matchPercentage: 92,
          qualificationLevel: 'qualified',
          description: 'We are looking for a senior software engineer to join our growing team...',
          requirements: ['5+ years experience', 'React/Node.js', 'TypeScript', 'AWS'],
          benefits: ['Health Insurance', 'Stock Options', 'Remote Work', '401k Match']
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'Remote',
          type: 'Full-time',
          salary: '$90k - $130k',
          posted: '1 day ago',
          matchPercentage: 88,
          qualificationLevel: 'qualified',
          description: 'Join our dynamic startup as a full stack developer...',
          requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          benefits: ['Flexible Hours', 'Health Insurance', 'Learning Budget']
        },
        {
          id: '3',
          title: 'Frontend Engineer',
          company: 'Design Studio',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$85k - $120k',
          posted: '3 days ago',
          matchPercentage: 78,
          qualificationLevel: 'almost-qualified',
          description: 'We need a creative frontend engineer...',
          requirements: ['React', 'CSS/SASS', 'TypeScript', 'Design Skills'],
          benefits: ['Creative Environment', 'Health Insurance', 'Gym Membership']
        },
        {
          id: '4',
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          location: 'Austin, TX',
          type: 'Full-time',
          salary: '$100k - $140k',
          posted: '5 days ago',
          matchPercentage: 65,
          qualificationLevel: 'stretch',
          description: 'Looking for a DevOps engineer to manage our infrastructure...',
          requirements: ['AWS/Azure', 'Docker', 'Kubernetes', 'Terraform'],
          benefits: ['Remote First', 'Health Insurance', 'Professional Development']
        },
        {
          id: '5',
          title: 'Software Engineering Intern',
          company: 'BigTech Corp',
          location: 'Seattle, WA',
          type: 'Internship',
          salary: '$25/hour',
          posted: '1 week ago',
          matchPercentage: 85,
          qualificationLevel: 'qualified',
          description: 'Summer internship program for aspiring software engineers...',
          requirements: ['Computer Science Student', 'JavaScript', 'Any Framework'],
          benefits: ['Mentorship', 'Learning Opportunities', 'Networking']
        }
      ];

      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    };

    fetchJobs();
  }, [resumeData, navigate]);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by qualification level
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.qualificationLevel === filterType);
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchPercentage - a.matchPercentage;
        case 'date':
          return new Date(b.posted).getTime() - new Date(a.posted).getTime();
        case 'salary':
          const getSalaryNumber = (salary: string) => {
            const match = salary.match(/\$(\d+)k/);
            return match ? parseInt(match[1]) : 0;
          };
          return getSalaryNumber(b.salary) - getSalaryNumber(a.salary);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterType, sortBy]);

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getQualificationBadge = (level: string) => {
    switch (level) {
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'almost-qualified':
        return 'bg-yellow-100 text-yellow-800';
      case 'stretch':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualificationText = (level: string) => {
    switch (level) {
      case 'qualified':
        return 'Qualified';
      case 'almost-qualified':
        return 'Almost Qualified';
      case 'stretch':
        return 'Stretch Goal';
      default:
        return 'Unknown';
    }
  };

  if (!resumeData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Matches</h1>
          <p className="text-gray-600">Jobs matched to your skills and experience</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Qualified For</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter(j => j.qualificationLevel === 'qualified').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Almost Qualified</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {jobs.filter(j => j.qualificationLevel === 'almost-qualified').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Match</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(jobs.reduce((acc, job) => acc + job.matchPercentage, 0) / jobs.length)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Qualification Levels</option>
                <option value="qualified">Qualified</option>
                <option value="almost-qualified">Almost Qualified</option>
                <option value="stretch">Stretch Goals</option>
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="match">Sort by Match %</option>
              <option value="date">Sort by Date</option>
              <option value="salary">Sort by Salary</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding the best job matches for you...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualificationBadge(job.qualificationLevel)}`}>
                          {getQualificationText(job.qualificationLevel)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(job.matchPercentage)}`}>
                          {job.matchPercentage}% Match
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-gray-600 text-sm mb-4 space-x-6">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <span className="text-gray-500">Posted {job.posted}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {job.qualificationLevel === 'stretch' && (
                      <p>💡 Need to develop more skills for this role</p>
                    )}
                    {job.qualificationLevel === 'almost-qualified' && (
                      <p>⭐ You're close! A few more skills could help</p>
                    )}
                    {job.qualificationLevel === 'qualified' && (
                      <p>✅ You meet the requirements for this position</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2">
                      <span>Apply Now</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button className="bg-white text-gray-700 px-6 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200">
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters or criteria</p>
            <button
              onClick={() => navigate('/skills')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Improve Your Skills
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatching;