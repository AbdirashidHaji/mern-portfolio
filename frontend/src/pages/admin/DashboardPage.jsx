import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  Users,
  FileText,
  Code,
  LogOut,
  Eye,
  Star,
  Tag,
  Calendar
} from 'lucide-react';
import { projectAPI, skillAPI, adminAPI, authAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalSkills: 0,
    lastLogin: ''
  });
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchAdminProfile();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, skillsRes, statsRes] = await Promise.all([
        projectAPI.getAll(),
        skillAPI.getAll(),
        adminAPI.getStats()
      ]);
      
      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setAdmin(response.admin);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectAPI.delete(id);
        setProjects(projects.filter(project => project._id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillAPI.delete(id);
        setSkills(skills.filter(skill => skill._id !== id));
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('portfolio-token');
      localStorage.removeItem('portfolio-admin');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCategoryStats = () => {
    const categoryStats = {};
    projects.forEach(project => {
      categoryStats[project.category] = (categoryStats[project.category] || 0) + 1;
    });
    return categoryStats;
  };

  const getSkillCategoryStats = () => {
    const skillCategoryStats = {};
    skills.forEach(skill => {
      skillCategoryStats[skill.category] = (skillCategoryStats[skill.category] || 0) + 1;
    });
    return skillCategoryStats;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const categoryStats = getCategoryStats();
  const skillCategoryStats = getSkillCategoryStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back{admin ? `, ${admin.name}` : ''}! Manage your portfolio content.
              </p>
              {stats.lastLogin && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Last login: {formatDate(stats.lastLogin)}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Portfolio
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex space-x-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'skills'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Skills ({skills.length})
              </button>
              <button
                onClick={() => setActiveTab('quick-actions')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'quick-actions'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Quick Actions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Projects</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalProjects}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stats.featuredProjects} featured
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Featured Projects</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.featuredProjects}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {((stats.featuredProjects / stats.totalProjects) * 100 || 0).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Skills</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalSkills}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Across {Object.keys(skillCategoryStats).length} categories
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Project Categories</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{Object.keys(categoryStats).length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Active categories
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Tag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Project Categories Chart */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Projects by Category
                </h3>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, count]) => {
                    const percentage = (count / stats.totalProjects) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {category}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills by Category Chart */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Skills by Category
                </h3>
                <div className="space-y-4">
                  {Object.entries(skillCategoryStats).map(([category, count]) => {
                    const percentage = (count / stats.totalSkills) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {category}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Projects
                </h3>
                <Link
                  to="/admin/projects/new"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                >
                  + Add New
                </Link>
              </div>
              
              {projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project._id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={project.imageUrl}
                                  alt={project.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {project.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {project.featured ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                                Regular
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/projects/${project._id}`}
                                target="_blank"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/admin/projects/edit/${project._id}`}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Get started by adding your first project
                  </p>
                  <Link
                    to="/admin/projects/new"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Project
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Projects Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage all your portfolio projects
                </p>
              </div>
              <Link
                to="/admin/projects/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Technologies
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={project.imageUrl}
                                alt={project.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {project.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {project.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {project.featured ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                              Regular
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/projects/${project._id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/projects/edit/${project._id}`}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project._id)}
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start building your portfolio by adding your first project
                </p>
                <Link
                  to="/admin/projects/new"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Project
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Skills Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your technical skills and expertise
                </p>
              </div>
              <Link
                to="/admin/skills/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Skill
              </Link>
            </div>

            {skills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Skill
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Proficiency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {skills.map((skill) => (
                      <tr key={skill._id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{skill.icon}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                            {skill.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                              <div
                                className="h-2 rounded-full bg-primary-500"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {skill.proficiency}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                            {skill.order}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/admin/skills/edit/${skill._id}`}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteSkill(skill._id)}
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No skills yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add your technical skills to showcase your expertise
                </p>
                <Link
                  to="/admin/skills/new"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Skill
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 'quick-actions' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/admin/projects/new"
                className="card group hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                    <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Add New Project
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Showcase your latest work
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/skills/new"
                className="card group hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50">
                    <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Add New Skill
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Update your technical expertise
                    </p>
                  </div>
                </div>
              </Link>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="card group hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                    <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      View Portfolio
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      See your changes live
                    </p>
                  </div>
                </div>
              </a>

              <Link
                to="/admin/dashboard"
                onClick={() => setActiveTab('projects')}
                className="card group hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50">
                    <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Manage Projects
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      View and edit all projects
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/dashboard"
                onClick={() => setActiveTab('skills')}
                className="card group hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50">
                    <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Manage Skills
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      View and edit all skills
                    </p>
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="card group hover:border-red-500 dark:hover:border-red-400 transition-all hover:shadow-lg text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50">
                    <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Logout
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Sign out of admin panel
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.totalProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total Projects
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.featuredProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Featured
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.totalSkills}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Skills
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {Object.keys(categoryStats).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Categories
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;