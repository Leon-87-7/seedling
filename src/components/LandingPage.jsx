import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Brain, Shield, Users, Zap } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const LandingPage = () => {
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Sector Analysis',
      description: 'Analyze stocks across Healthcare, Technology, Finance, Energy, and Retail sectors with real-time data.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Interactive Charts',
      description: 'Professional visualizations with sector mean comparisons and advanced financial metrics.'
    },
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Reports',
      description: 'Get comprehensive investment analysis combining fundamental data and executive insights.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Risk Assessment',
      description: 'Advanced undervaluation detection using multiple valuation metrics and sector comparisons.'
    },
    {
      icon: <Users size={32} />,
      title: 'Professional Tools',
      description: 'Sophisticated screening tools designed for value investors and financial analysts.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-time Updates',
      description: 'Live market data integration with automated alerts for undervalued opportunities.'
    }
  ];

  return (
    <div className="landing-page">
      <Header />
      
      <main className="landing-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Discover Undervalued Investment Opportunities</h1>
            <p>
              Advanced fundamental analysis platform that identifies "too cheap" stocks 
              through sophisticated financial analysis and AI-powered insights.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="cta-button primary">
                Start Free Analysis
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="chart-preview">
              <div className="chart-bars">
                <div className="bar" style={{height: '40%', backgroundColor: '#10b981'}}></div>
                <div className="bar" style={{height: '60%', backgroundColor: '#10b981'}}></div>
                <div className="bar" style={{height: '80%', backgroundColor: '#3b82f6'}}></div>
                <div className="bar" style={{height: '90%', backgroundColor: '#3b82f6'}}></div>
                <div className="bar" style={{height: '70%', backgroundColor: '#3b82f6'}}></div>
              </div>
              <div className="mean-line"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Powerful Investment Analysis Tools</h2>
            <p>Everything you need to identify undervalued opportunities in the market</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Users Section */}
        <section className="users-section">
          <div className="users-content">
            <h2>Built for Serious Investors</h2>
            <div className="user-types">
              <div className="user-type">
                <h3>Value Investors</h3>
                <p>Find stocks trading below intrinsic value using fundamental analysis and sector comparisons.</p>
              </div>
              <div className="user-type">
                <h3>Financial Analysts</h3>
                <p>Professional-grade tools for comprehensive investment research and client recommendations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Find Your Next Investment?</h2>
            <p>Join thousands of investors using Seedling🌱 to identify undervalued opportunities.</p>
            <Link to="/signup" className="cta-button primary large">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;