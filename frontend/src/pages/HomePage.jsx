import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, Server, Database, Layout, Sparkles } from 'lucide-react';
import { projectAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await projectAPI.getAll({ featured: 'true' });
      setFeaturedProjects(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Years Experience', value: '2+' },
    { label: 'Projects Completed', value: '15+' },
    { label: 'Happy Clients', value: '10+' },
    { label: 'Technologies', value: '12+' },
  ];

  const services = [
    {
      title: 'Frontend Development',
      description: 'Building responsive, user-friendly interfaces with React, Vue, or Angular',
      icon: <Code className="w-8 h-8" />,
      color: 'text-blue-500'
    },
    {
      title: 'Backend Development',
      description: 'Creating robust APIs and server-side logic with Node.js and Express',
      icon: <Server className="w-8 h-8" />,
      color: 'text-green-500'
    },
    {
      title: 'Database Design',
      description: 'Designing efficient database schemas and queries with MongoDB & SQL',
      icon: <Database className="w-8 h-8" />,
      color: 'text-purple-500'
    },
    {
      title: 'Full Stack Solutions',
      description: 'End-to-end web application development with modern architectures',
      icon: <Layout className="w-8 h-8" />,
      color: 'text-orange-500'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-gray-100/[0.02] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Full Stack Developer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-gray-900 dark:text-white">Abdirashid</span>
              <span className="block gradient-text">Mohamed Haji</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              I craft exceptional digital experiences with clean code and modern technologies. 
              Based in Kenya, building for the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/projects"
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/contact"
                className="btn-outline inline-flex items-center justify-center"
              >
                Let's Connect
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-hover">
                <div className={`mb-4 ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="section-title !text-left !mb-4">Featured Projects</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                A selection of my recent work showcasing different technologies and solutions
              </p>
            </div>
            <a
              href="/projects"
              className="btn-outline mt-4 md:mt-0 inline-flex items-center gap-2"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading projects..." />
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No featured projects yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Let's work together to create something amazing. Whether you need a website, 
              web application, or technical consultation, I'm here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary px-8 py-3 text-lg"
              >
                Start a Project
              </a>
              <a
                href="mailto:abdirashid.ke@gmail.com"
                className="btn-outline px-8 py-3 text-lg"
              >
                Email Me
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;