import React, { createContext, useContext, useState } from 'react';

interface ResumeData {
  filename: string;
  content: string;
  skills: string[];
  experience: string[];
  education: string[];
  analysis?: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

interface ResumeContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  analyzeResume: (content: string) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const analyzeResume = async (content: string): Promise<void> => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis - in real app, this would be an API call to AI service
    const mockSkills = extractSkills(content);
    const mockExperience = extractExperience(content);
    const mockEducation = extractEducation(content);
    
    const analysis = {
      score: Math.floor(Math.random() * 30) + 70, // 70-99
      strengths: [
        'Strong technical background',
        'Good project experience',
        'Clear career progression'
      ],
      weaknesses: [
        'Could benefit from more quantified achievements',
        'Missing industry-specific keywords',
        'Summary section could be more compelling'
      ],
      suggestions: [
        'Add specific metrics to demonstrate impact',
        'Include more relevant technical skills',
        'Optimize for ATS compatibility',
        'Enhance professional summary'
      ]
    };

    setResumeData(prev => prev ? {
      ...prev,
      skills: mockSkills,
      experience: mockExperience,
      education: mockEducation,
      analysis
    } : null);
  };

  const extractSkills = (content: string): string[] => {
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'SQL',
      'AWS', 'Docker', 'Git', 'HTML', 'CSS', 'MongoDB', 'Express', 'Angular'
    ];
    return commonSkills.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 8);
  };

  const extractExperience = (content: string): string[] => {
    return [
      'Software Developer at Tech Corp (2022-2024)',
      'Junior Developer at StartupCo (2021-2022)',
      'Intern at DevStudio (2020-2021)'
    ];
  };

  const extractEducation = (content: string): string[] => {
    return [
      'Bachelor of Computer Science - University of Technology (2020)',
      'Full Stack Web Development Bootcamp - CodeAcademy (2019)'
    ];
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, analyzeResume }}>
      {children}
    </ResumeContext.Provider>
  );
};