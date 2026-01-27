import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, X, Upload, Image, Link as LinkIcon, Tag, Star } from 'lucide-react';
import { projectAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
    category: 'web'
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'other', label: 'Other' }
  ];

  const technologySuggestions = [
    'React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'JavaScript',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Angular',
    'Python', 'Django', 'Flask', 'PostgreSQL', 'MySQL', 'Firebase',
    'AWS', 'Docker', 'Git', 'REST API', 'GraphQL', 'JWT'
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(id);
      const project = response.data;
      setFormData({
        ...project,
        technologies: project.technologies.join(', ')
      });
    } catch (err) {
      setError('Failed to load project');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTechnologySelect = (tech) => {
    const currentTechs = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTechs.includes(tech)) {
      const newTechs = [...currentTechs, tech];
      setFormData({
        ...formData,
        technologies: newTechs.join(', ')
      });
    }
  };

  const removeTechnology = (techToRemove) => {
    const currentTechs = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
    const newTechs = currentTechs.filter(tech => tech !== techToRemove);
    setFormData({
      ...formData,
      technologies: newTechs.join(', ')
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare data
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      if (isEditMode) {
        await projectAPI.update(id, projectData);
      } else {
        await projectAPI.create(projectData);
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save project');
      console.error('Error saving project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading project..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Edit Project' : 'Add New Project'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {isEditMode ? 'Update your project details' : 'Create a new project to showcase in your portfolio'}
                </p>
              </div>
              <Link
                to="/admin/dashboard"
                className="btn-outline inline-flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="font-medium text-red-800 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="E-commerce Platform"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input-field"
                    placeholder="A brief overview of your project (max 500 characters)"
                    required
                    maxLength="500"
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Brief description displayed in project cards
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formData.description.length}/500 characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    rows="6"
                    className="input-field"
                    placeholder="Detailed description of your project including features, challenges, and solutions..."
                    required
                    maxLength="2000"
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Full description displayed on project detail page
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formData.detailedDescription.length}/2000 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Technologies
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies Used *
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="React, Node.js, MongoDB, Express"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Separate technologies with commas
                  </p>
                </div>

                {/* Technology Suggestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quick Select
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {technologySuggestions.map((tech) => {
                      const currentTechs = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
                      const isSelected = currentTechs.includes(tech);
                      
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => isSelected ? removeTechnology(tech) : handleTechnologySelect(tech)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {tech}
                          {isSelected && ' ✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Technologies Preview */}
                {formData.technologies.trim() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Selected Technologies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.split(',').map((tech, index) => {
                        const trimmedTech = tech.trim();
                        if (!trimmedTech) return null;
                        
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{trimmedTech}</span>
                            <button
                              type="button"
                              onClick={() => removeTechnology(trimmedTech)}
                              className="ml-1 text-gray-500 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Project Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      GitHub Repository URL
                    </div>
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Live Demo URL
                    </div>
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://project-demo.com"
                  />
                </div>
              </div>
            </div>

            {/* Media & Settings */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Media & Settings
              </h2>

              <div className="space-y-6">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Project Image URL *
                    </div>
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Use high-quality images from Unsplash or similar services
                  </p>
                  
                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image Preview
                      </label>
                      <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Status
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="featured" className="ml-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mark as Featured Project
                          </span>
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Featured projects are highlighted on the homepage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Link
                to="/admin/dashboard"
                className="btn-outline px-8"
                disabled={submitting}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEditMode ? 'Update Project' : 'Create Project'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tips for Great Project Listings
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                <span>Use high-quality, relevant images that showcase your project</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                <span>Be specific about the technologies used and your role in the project</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                <span>Include both GitHub links and live demos when available</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                <span>Write clear descriptions that explain the problem and your solution</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormPage;