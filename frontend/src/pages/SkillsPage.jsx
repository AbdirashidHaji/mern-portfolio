import React, { useState, useEffect } from 'react';
import { Filter, TrendingUp, Layers, Zap } from 'lucide-react';
import { skillAPI } from '../services/api';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Skills', icon: <Layers className="w-4 h-4" /> },
    { id: 'frontend', name: 'Frontend', icon: <Zap className="w-4 h-4" /> },
    { id: 'backend', name: 'Backend', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'database', name: 'Database', icon: <Layers className="w-4 h-4" /> },
    { id: 'devops', name: 'DevOps', icon: <Filter className="w-4 h-4" /> },
    { id: 'tool', name: 'Tools', icon: <Zap className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter(skill => skill.category === selectedCategory));
    }
  }, [selectedCategory, skills]);

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

  const getCategoryStats = () => {
    const stats = {};
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        stats[cat.id] = skills.filter(skill => skill.category === cat.id).length;
      }
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive overview of my technical expertise, from frontend frameworks to backend technologies.
            Continuously learning and adapting to new tools and methodologies.
          </p>
        </div>

        {/* Category Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Skill Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              if (category.id === 'all') return null;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg transform -translate-y-1'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      {category.icon}
                    </div>
                    <div className="text-sm font-medium mb-1">{category.name}</div>
                    <div className={`text-2xl font-bold ${
                      selectedCategory === category.id ? 'text-white' : 'text-primary-600 dark:text-primary-400'
                    }`}>
                      {categoryStats[category.id] || 0}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading skills..." />
          </div>
        ) : filteredSkills.length > 0 ? (
          <>
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredSkills.length}</span> 
                {filteredSkills.length === 1 ? ' skill' : ' skills'}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No skills found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {selectedCategory !== 'all'
                ? `No skills found in ${categories.find(c => c.id === selectedCategory)?.name}. Try another category.`
                : 'No skills have been added yet. Check back soon!'}
            </p>
          </div>
        )}

        {/* Skill Legend */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Proficiency Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">0-25% - Beginner</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Basic understanding, limited practical experience
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-primary-300 dark:bg-primary-700 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">26-50% - Intermediate</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Good understanding, can work independently
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-primary-500 dark:bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">51-75% - Advanced</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Strong expertise, can solve complex problems
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-primary-700 dark:bg-primary-300 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">76-100% - Expert</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Deep expertise, can mentor others
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;