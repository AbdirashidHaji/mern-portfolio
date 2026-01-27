import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, X, Zap, TrendingUp, Code, Database, Server, Settings } from 'lucide-react';
import { skillAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const SkillFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    proficiency: 50,
    icon: '💻',
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'frontend', label: 'Frontend', icon: <Code className="w-4 h-4" /> },
    { value: 'backend', label: 'Backend', icon: <Server className="w-4 h-4" /> },
    { value: 'database', label: 'Database', icon: <Database className="w-4 h-4" /> },
    { value: 'devops', label: 'DevOps', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'tool', label: 'Tool', icon: <Settings className="w-4 h-4" /> } // Changed from Tool to Settings
  ];

  const iconSuggestions = [
    '💻', '⚛️', '🚀', '🎨', '📱', '🔧', '⚡', '🔒', '📊', '🌐',
    '💾', '🔌', '🎯', '✨', '🔥', '💡', '🛠️', '📈', '🔍', '🎮'
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchSkill();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const response = await skillAPI.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load skill');
      console.error('Error fetching skill:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleProficiencyChange = (value) => {
    setFormData({
      ...formData,
      proficiency: parseInt(value)
    });
  };

  const handleIconSelect = (icon) => {
    setFormData({
      ...formData,
      icon
    });
  };

  const getProficiencyLabel = (value) => {
    if (value <= 25) return 'Beginner';
    if (value <= 50) return 'Intermediate';
    if (value <= 75) return 'Advanced';
    return 'Expert';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        await skillAPI.update(id, formData);
      } else {
        await skillAPI.create(formData);
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save skill');
      console.error('Error saving skill:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading skill..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Edit Skill' : 'Add New Skill'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {isEditMode ? 'Update your skill details' : 'Add a new skill to showcase your expertise'}
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
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="React"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: category.value })}
                        className={`p-4 rounded-xl text-center transition-all ${
                          formData.category === category.value
                            ? 'bg-primary-600 text-white transform scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {category.icon}
                          </div>
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Lower numbers appear first (0 = first position)
                  </p>
                </div>
              </div>
            </div>

            {/* Icon Selection */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Icon Selection
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Icon
                  </label>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-4xl">{formData.icon}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Selected Icon
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This icon will be displayed next to the skill name
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Icon Suggestions
                  </label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {iconSuggestions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleIconSelect(icon)}
                        className={`p-3 rounded-lg text-xl transition-all ${
                          formData.icon === icon
                            ? 'bg-primary-600 text-white transform scale-110'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Icon
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter any emoji"
                      maxLength="2"
                    />
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-2xl">
                      {formData.icon}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Enter any emoji character (max 2 characters)
                  </p>
                </div>
              </div>
            </div>

            {/* Proficiency */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Proficiency Level
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Skill Proficiency: {formData.proficiency}%</span>
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                        {getProficiencyLabel(formData.proficiency)}
                      </span>
                    </div>
                  </label>
                  
                  {/* Slider */}
                  <div className="py-4">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData.proficiency}
                      onChange={(e) => handleProficiencyChange(e.target.value)}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-gray-800 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  {/* Quick Set Buttons */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Quick Set
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[25, 50, 75, 100].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleProficiencyChange(value)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            formData.proficiency === value
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {value}% - {getProficiencyLabel(value)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Proficiency Preview */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preview
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{formData.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {formData.name || 'Skill Name'}
                          </h4>
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {formData.category}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {formData.proficiency}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-blue-500"
                        style={{ width: `${formData.proficiency}%` }}
                      ></div>
                    </div>
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
                    <span>{isEditMode ? 'Update Skill' : 'Create Skill'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Proficiency Guidelines
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Beginner (1-25%)</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">Basic understanding</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Familiar with basic concepts, can follow tutorials, limited practical experience
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Intermediate (26-50%)</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">Working knowledge</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Good understanding, can work independently on small to medium projects
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Advanced (51-75%)</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">Strong expertise</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deep understanding, can solve complex problems, mentor others
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Expert (76-100%)</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">Mastery level</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete mastery, can design systems, lead teams, contribute to community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillFormPage;