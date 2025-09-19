import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TrendingUp, Star, BookOpen, Users, Award, ExternalLink, Target, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';

interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tool' | 'language';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToLearn: string;
  jobImpact: number;
  demand: number;
  resources: {
    type: 'course' | 'tutorial' | 'documentation' | 'practice';
    title: string;
    provider: string;
    url: string;
    free: boolean;
  }[];
}

interface CareerPath {
  title: string;
  description: string;
  requiredSkills: string[];
  salaryRange: string;
  growthRate: string;
  timeframe: string;
}

const SkillsRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [recommendedSkills, setRecommendedSkills] = useState<Skill[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'skills' | 'paths' | 'resources'>('skills');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'technical' | 'soft' | 'tool' | 'language'>('all');

  useEffect(() => {
    if (!resumeData) {
      navigate('/upload');
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockSkills: Skill[] = [
        {
          name: 'Machine Learning',
          category: 'technical',
          difficulty: 'intermediate',
          timeToLearn: '3-6 months',
          jobImpact: 95,
          demand: 92,
          resources: [
            { type: 'course', title: 'Machine Learning Course', provider: 'Coursera', url: '#', free: false },
            { type: 'tutorial', title: 'ML with Python', provider: 'YouTube', url: '#', free: true },
            { type: 'practice', title: 'Kaggle Competitions', provider: 'Kaggle', url: '#', free: true }
          ]
        },
        {
          name: 'Cloud Architecture (AWS)',
          category: 'technical',
          difficulty: 'advanced',
          timeToLearn: '6-12 months',
          jobImpact: 88,
          demand: 89,
          resources: [
            { type: 'course', title: 'AWS Solutions Architect', provider: 'AWS Training', url: '#', free: false },
            { type: 'documentation', title: 'AWS Documentation', provider: 'AWS', url: '#', free: true }
          ]
        },
        {
          name: 'Leadership & Team Management',
          category: 'soft',
          difficulty: 'intermediate',
          timeToLearn: '2-4 months',
          jobImpact: 85,
          demand: 78,
          resources: [
            { type: 'course', title: 'Leadership Fundamentals', provider: 'LinkedIn Learning', url: '#', free: false },
            { type: 'tutorial', title: 'Management Tips', provider: 'Harvard Business Review', url: '#', free: true }
          ]
        },
        {
          name: 'GraphQL',
          category: 'technical',
          difficulty: 'beginner',
          timeToLearn: '1-2 months',
          jobImpact: 72,
          demand: 84,
          resources: [
            { type: 'tutorial', title: 'GraphQL Tutorial', provider: 'GraphQL.org', url: '#', free: true },
            { type: 'course', title: 'Full Stack GraphQL', provider: 'Udemy', url: '#', free: false }
          ]
        },
        {
          name: 'Data Visualization',
          category: 'technical',
          difficulty: 'beginner',
          timeToLearn: '2-3 months',
          jobImpact: 76,
          demand: 81,
          resources: [
            { type: 'course', title: 'Data Visualization with D3.js', provider: 'FreeCodeCamp', url: '#', free: true },
            { type: 'practice', title: 'Observable Notebooks', provider: 'Observable', url: '#', free: true }
          ]
        }
      ];

      const mockCareerPaths: CareerPath[] = [
        {
          title: 'Senior Software Engineer',
          description: 'Lead development projects and mentor junior developers',
          requiredSkills: ['System Design', 'Leadership', 'Advanced Programming', 'Cloud Architecture'],
          salaryRange: '$130k - $180k',
          growthRate: '+15%',
          timeframe: '2-3 years'
        },
        {
          title: 'Machine Learning Engineer',
          description: 'Build and deploy ML models at scale',
          requiredSkills: ['Machine Learning', 'Python', 'Data Engineering', 'Cloud Platforms'],
          salaryRange: '$140k - $200k',
          growthRate: '+25%',
          timeframe: '1-2 years'
        },
        {
          title: 'Technical Lead',
          description: 'Guide technical decisions and architecture',
          requiredSkills: ['System Architecture', 'Team Leadership', 'Project Management', 'Strategic Thinking'],
          salaryRange: '$150k - $220k',
          growthRate: '+18%',
          timeframe: '3-4 years'
        }
      ];

      setRecommendedSkills(mockSkills);
      setCareerPaths(mockCareerPaths);
      setLoading(false);
    };

    fetchRecommendations();
  }, [resumeData, navigate]);

  const filteredSkills = selectedCategory === 'all'
    ? recommendedSkills
    : recommendedSkills.filter(skill => skill.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '💻';
      case 'soft': return '🤝';
      case 'tool': return '🔧';
      case 'language': return '🌐';
      default: return '📚';
    }
  };

  if (!resumeData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Recommendations</h1>
          <p className="text-gray-600">Personalized skill suggestions to advance your career and unlock better opportunities</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Current Skills</p>
                <p className="text-2xl font-bold text-blue-600">{resumeData.skills.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Recommended</p>
                <p className="text-2xl font-bold text-purple-600">{recommendedSkills.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Career Paths</p>
                <p className="text-2xl font-bold text-teal-600">{careerPaths.length}</p>
              </div>
              <Target className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg. Job Impact</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(recommendedSkills.reduce((acc, skill) => acc + skill.jobImpact, 0) / recommendedSkills.length)}%
                </p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 border border-white/20 inline-flex">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Recommended Skills
            </button>
            <button
              onClick={() => setActiveTab('paths')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'paths'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Career Paths
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'resources'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Learning Resources
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your profile and generating personalized recommendations...</p>
          </div>
        ) : (
          <>
            {activeTab === 'skills' && (
              <>
                {/* Category Filter */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'technical', 'soft', 'tool', 'language'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {filteredSkills.map((skill, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(skill.category)}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                            <p className="text-gray-600 capitalize">{skill.category} Skill</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(skill.difficulty)}`}>
                          {skill.difficulty}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Job Impact</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${skill.jobImpact}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">{skill.jobImpact}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 text-sm">Market Demand</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${skill.demand}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-blue-600">{skill.demand}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Time to learn: {skill.timeToLearn}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{skill.resources.length} resources</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">
                            +{Math.floor(skill.jobImpact / 10)} job opportunities
                          </span>
                        </div>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm">
                          Start Learning
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'paths' && (
              <div className="space-y-6">
                {careerPaths.map((path, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 mb-6 lg:mb-0">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.title}</h3>
                        <p className="text-gray-600 mb-4">{path.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600 text-sm font-medium">Salary Range</p>
                            <p className="text-lg font-bold text-green-600">{path.salaryRange}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm font-medium">Growth Rate</p>
                            <p className="text-lg font-bold text-blue-600">{path.growthRate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm font-medium">Timeframe</p>
                            <p className="text-lg font-bold text-purple-600">{path.timeframe}</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {path.requiredSkills.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  resumeData.skills.includes(skill)
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {resumeData.skills.includes(skill) && <CheckCircle className="inline h-3 w-3 mr-1" />}
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2">
                          <span>Create Learning Plan</span>
                          <ArrowRight className="h-5 w-5" />
                        </button>
                        <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200">
                          View Jobs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendedSkills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{skill.name}</h3>
                    <div className="space-y-3">
                      {skill.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{resource.title}</p>
                              <p className="text-gray-600 text-xs">{resource.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {resource.free && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                Free
                              </span>
                            )}
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SkillsRecommendations;