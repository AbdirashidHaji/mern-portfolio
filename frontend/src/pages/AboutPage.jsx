import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Briefcase, Globe, MapPin, Users } from 'lucide-react';
import { skillAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AboutPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillAPI.getAll();
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const experience = [
    {
      year: '2023 - Present',
      role: 'Junior Full-Stack Developer (MERN)',
      company: 'self-employed- Personal Projects',
      description: 'Built full-stack web applications using React, Node.js, Express, and MongoDB,Integrated backend services with frontend components and managed application state',
    },
  ];

  const education = [
    {
      degree: 'Certified Fiber Optic Technician',
      school: 'Institute Of Software Technologies',
      year: '2025',
      description: 'Focused on fiber optic installation, maintenance, and troubleshooting techniques',
    },

    {
      degree: 'Diploma in Software Development',
      school: 'Institute Of Software Technologies',
      year: 'Sep 2023 - Oct 2024',
      description: 'Specialized in Software Engineering and Web Technologies',
    },
    {
      degree: 'Certificate in Software Development',
      school: 'Institute Of Software Technologies',
      year: '2023',
      description: 'Focused on foundational programming and web development skills',
    },
    {
      degree: 'Certificate in Computer Applications Packages',
      school: 'Inceptor Institute Of Technologies',
      year: '2023',
      description: 'Covered essential computer applications and office productivity tools',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Passionate Full Stack Developer from Kenya, dedicated to creating impactful digital solutions
            that solve real-world problems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Introduction */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Hello, I'm Abdirashid
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  I'm a passionate Full Stack Developer based in Nairobi, Kenya, with expertise in
                  building modern web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js).
                </p>
                <p>
                  My journey into software development started with a curiosity about how technology
                  can solve real-world problems and create meaningful impact in our communities.
                  Since then, I've been on a continuous learning path, mastering new technologies
                  and best practices.
                </p>
                <p>
                  I believe in writing clean, maintainable code and following best practices in
                  software development. My approach involves thorough planning, iterative development,
                  and continuous testing to ensure high-quality results.
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 pb-8 last:pb-0">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                    <div className="absolute left-2 top-5 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-2">
                        {exp.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Education
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {edu.school}
                    </p>
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium mb-3">
                      {edu.year}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Personal Info */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Timezone</p>
                    <p className="font-medium text-gray-900 dark:text-white">EAT (UTC+3)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Availability</p>
                    <p className="font-medium text-gray-900 dark:text-white">Open for Projects</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Overview */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Skills Overview
              </h3>

              {loading ? (
                <div className="py-4">
                  <LoadingSpinner size="sm" text="" />
                </div>
              ) : (
                <div className="space-y-4">
                  {['frontend', 'backend', 'database', 'devops'].map((category) => {
                    const categorySkills = skills.filter(skill => skill.category === category);
                    if (categorySkills.length === 0) return null;

                    const avgProficiency = Math.round(
                      categorySkills.reduce((sum, skill) => sum + skill.proficiency, 0) / categorySkills.length
                    );

                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {category}
                          </span>
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {avgProficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-blue-500"
                            style={{ width: `${avgProficiency}%` }}
                          ></div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {categorySkills.slice(0, 3).map((skill) => (
                            <span
                              key={skill._id}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                            >
                              {skill.name}
                            </span>
                          ))}
                          {categorySkills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                              +{categorySkills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Values */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" />
                My Values
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Quality',
                    description: 'Commitment to writing clean, efficient, and well-tested code.',
                  },
                  {
                    title: 'Learning',
                    description: 'Continuous improvement and staying updated with latest technologies.',
                  },
                  {
                    title: 'Collaboration',
                    description: 'Working effectively in teams and communicating clearly.',
                  },
                  {
                    title: 'Impact',
                    description: 'Creating solutions that make a real difference.',
                  },
                ].map((value, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {value.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="card bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Let's Work Together
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Have a project in mind? I'd love to hear about it and discuss how we can create something amazing together.
              </p>
              <a
                href="/contact"
                className="btn-primary w-full text-center"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;