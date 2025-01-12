import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png";

const LandingPage = () => {
  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Member Management",
      description: "Easily manage and oversee all members of the Ghana Muslim Mission with detailed profiles and efficient workflows."
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Secure Access",
      description: "Ensure data security with role-based access tailored specifically for our mission's needs."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Monitor key metrics and insights to drive the growth and engagement of the Ghana Muslim Mission."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-10 w-10"
              />
              <span className="ml-2 text-xl font-bold text-green-600">GMM Member System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Ghana Muslim Mission
            <span className="text-green-600 block mt-2">Member Management System</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in delay-200">
            Our dedicated platform for managing Ghana Muslim Mission Members, ensuring efficiency and community growth.
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in delay-300">
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all transform hover:scale-105 flex items-center group"
            >
              Access System
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-on-scroll opacity-0">
            Key Features for Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow animate-on-scroll opacity-0"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center animate-on-scroll opacity-0">
          <h2 className="text-3xl font-bold mb-6">Empowering Islamic Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us to progressively contribute to the Deen while we empower ourselves.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all transform hover:scale-105 group"
          >
            Access Now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">© 2024 Ghana Muslim Mission. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
