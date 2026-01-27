import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Star, Calendar } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <div className="card-hover group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <div className="h-48 bg-gray-200 dark:bg-gray-700">
          <img
            src={project.imageUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {project.featured && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </div>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(project.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            <Link
              to={`/projects/${project._id}`}
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;