import React from 'react';

const SkillCard = ({ skill }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'frontend':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'backend':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'database':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'devops':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="card group hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{skill.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {skill.name}
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(skill.category)}`}>
          {skill.category}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {skill.proficiency}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${skill.proficiency}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Advanced</span>
          <span>Expert</span>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;