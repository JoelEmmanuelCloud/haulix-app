'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Users, Globe, Award, Shield, Clock, Truck, Target, TrendingUp } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Globe, number: '250+', label: 'Partner Facilities Worldwide' },
    { icon: Users, number: '500+', label: 'Logistics Professionals' },
    { icon: Truck, number: '1M+', label: 'Packages Delivered Annually' },
    { icon: Award, number: '15+', label: 'Years of Excellence' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Reliability',
      description: 'We ensure your packages reach their destination safely and on time, every time.'
    },
    {
      icon: Clock,
      title: 'Efficiency',
      description: 'Streamlined processes and advanced technology for faster, smarter shipping solutions.'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Accurate tracking, precise delivery windows, and exact handling of your valuable cargo.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Continuously evolving our services with cutting-edge logistics technology and methods.'
    },
  ];

  const timeline = [
    { year: '2008', title: 'Company Founded', description: 'Started as a small logistics company in Kiev, Ukraine with a vision for global reach.' },
    { year: '2012', title: 'European Expansion', description: 'Extended operations across Europe with strategic partnerships and new facilities.' },
    { year: '2016', title: 'Global Network', description: 'Established presence on all six continents with 100+ partner facilities.' },
    { year: '2020', title: 'Digital Innovation', description: 'Launched real-time tracking platform and AI-powered logistics optimization.' },
    { year: '2024', title: 'Industry Leadership', description: 'Recognized as logistics excellence leader with 250+ facilities and 500+ professionals.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat opacity-20"
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">About Haulix</h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Connecting the world through reliable, efficient, and innovative shipping solutions since 2008
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-cyan-700" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Founded in 2008 in Kiev, Ukraine, Haulix began with a simple mission: to revolutionize the logistics industry through technology, reliability, and exceptional customer service. What started as a small local shipping company has grown into a global logistics powerhouse.
                </p>
                <p>
                  Our founders recognized early on that the shipping industry needed a more transparent, efficient, and customer-focused approach. By combining traditional logistics expertise with cutting-edge technology, we've built a network that spans six continents and serves businesses of all sizes.
                </p>
                <p>
                  Today, Haulix is proud to be a trusted partner for multinational corporations, e-commerce businesses, and manufacturing companies worldwide. Our commitment to innovation, sustainability, and customer satisfaction drives everything we do.
                </p>
              </div>
            </div>
            <div className="relative">
            <img 
                src="https://images.pexels.com/photos/4487361/pexels-photo-4487361.jpeg" 
                alt="Warehouse workers carrying boxes" 
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every service we provide
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-cyan-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped Haulix into the global logistics leader we are today
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-0.5 w-0.5 h-full bg-cyan-200"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 w-4 h-4 bg-cyan-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 sm:ml-0 sm:w-5/12 ${index % 2 === 0 ? 'sm:mr-auto sm:pr-8' : 'sm:ml-auto sm:pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-2xl font-bold text-cyan-700 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Leadership Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the experienced professionals driving Haulix's vision and growth
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="CEO Portrait" 
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold mb-2">Alexander Petrov</h3>
              <p className="text-cyan-400 mb-3">Chief Executive Officer</p>
              <p className="text-gray-300 text-sm">15+ years in international logistics, former VP at DHL Europe</p>
            </div>
            
           <div className="text-center">
  <img
    src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400"
    alt="COO Portrait"
    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
  />
  <h3 className="text-xl font-bold mb-2">Maria Rodriguez</h3>
  <p className="text-cyan-400 mb-3">Chief Operations Officer</p>
  <p className="text-gray-300 text-sm">12+ years optimizing global supply chains and logistics networks</p>
</div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="CTO Portrait" 
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold mb-2">David Chen</h3>
              <p className="text-cyan-400 mb-3">Chief Technology Officer</p>
              <p className="text-gray-300 text-sm">Former Google engineer, specializing in logistics AI and automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Certifications & Compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to quality and security is verified by leading industry certifications
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <Shield className="w-12 h-12 text-gray-600 mx-auto" />
              </div>
              <p className="font-semibold text-gray-800">C-TPAT Certified</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <Award className="w-12 h-12 text-gray-600 mx-auto" />
              </div>
              <p className="font-semibold text-gray-800">AEO Certified</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <Globe className="w-12 h-12 text-gray-600 mx-auto" />
              </div>
              <p className="font-semibold text-gray-800">ISO 9001</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <Shield className="w-12 h-12 text-gray-600 mx-auto" />
              </div>
              <p className="font-semibold text-gray-800">IATA Certified</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <Award className="w-12 h-12 text-gray-600 mx-auto" />
              </div>
              <p className="font-semibold text-gray-800">GDPR Compliant</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-xl mb-4">
                <Users className="w-12 h-12 text-gray-600 mx-auto" />
              </div>
              <p className="font-semibold text-gray-800">SOC 2 Type II</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}