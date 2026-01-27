import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Github, Tag, Users, Clock } from 'lucide-react';
import { projectAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getById(id);
      setProject(response.data);
    } catch (err) {
      setError('Project not found or failed to load');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Tags and Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {project.featured && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
                Featured Project
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Image and Details */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={project.imageUrl || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop'}
                alt={project.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>

            {/* Detailed Description */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Project Overview
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Technologies Used */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Created</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(project.updatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            {(project.githubUrl || project.liveUrl) && (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Project Links
                </h3>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Source Code
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                    </a>
                  )}
                  
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Live Demo
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;