'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer.js';
import { Truck, Zap, Star, Package, Clock, Shield, Globe, Plane, Ship, Search, CheckCircle, Users } from 'lucide-react';

export default function Services() {
  const mainServices = [
    {
      icon: Truck,
      title: 'Standard Shipping',
      description: 'Reliable, cost-effective shipping for non-urgent deliveries',
      features: [
        '3-7 business days delivery',
        'Real-time tracking included',
        'Insurance coverage up to $1000',
        'Door-to-door service',
        'Signature confirmation'
      ],
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: Zap,
      title: 'Express Shipping',
      description: 'Fast delivery for time-sensitive packages',
      features: [
        '1-3 business days delivery',
        'Priority handling',
        'SMS & email notifications',
        'Insurance up to $2500',
        'Weekend delivery available'
      ],
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      icon: Star,
      title: 'Priority Shipping',
      description: 'Premium overnight and same-day delivery options',
      features: [
        'Next day or same-day delivery',
        'Dedicated logistics coordinator',
        'White glove service',
        'Full insurance coverage',
        'Real-time GPS tracking'
      ],
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      icon: Search,
      title: 'Package Tracking',
      description: 'Advanced tracking system with real-time updates',
      features: [
        'Live GPS location tracking',
        'Automated status notifications',
        'Delivery photo confirmation',
        'Historical tracking data',
        'API integration available'
      ],
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
  ];

  const additionalServices = [
    {
      icon: Globe,
      title: 'International Shipping',
      description: 'Global delivery to over 190 countries worldwide',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Package,
      title: 'Freight Services',
      description: 'Heavy cargo and bulk shipping solutions',
      image: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Plane,
      title: 'Air Freight',
      description: 'Fast international shipping via air transport',
      image: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Ship,
      title: 'Ocean Freight',
      description: 'Cost-effective shipping for large volume cargo',
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
  ];

  const industries = [
    { name: 'E-commerce', icon: Package, description: 'Specialized solutions for online retailers' },
    { name: 'Manufacturing', icon: Truck, description: 'Supply chain logistics for manufacturers' },
    { name: 'Healthcare', icon: Shield, description: 'Temperature-controlled medical shipments' },
    { name: 'Technology', icon: Zap, description: 'Secure transport for sensitive electronics' },
    { name: 'Fashion', icon: Star, description: 'Fast delivery for fashion and apparel brands' },
    { name: 'Automotive', icon: Globe, description: 'Parts and components logistics' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat opacity-20"
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Comprehensive shipping and logistics solutions tailored to your business needs
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Shipping Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of shipping options designed to meet different delivery requirements and budgets
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <div key={index} className={`${service.bgColor} ${service.borderColor} border-2 rounded-2xl p-8 hover:shadow-xl transition-shadow`}>
                <div className="flex items-center mb-6">
                  <div className={`${service.bgColor} p-3 rounded-full mr-4`}>
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className={`w-5 h-5 ${service.iconColor} mr-3`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end items-center">
                  <button className={`bg-white ${service.iconColor} px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow`}>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Specialized Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced logistics solutions for specific shipping requirements
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <service.icon className="w-6 h-6 text-cyan-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="text-cyan-600 font-semibold hover:text-cyan-800 transition-colors">
                    Get Quote →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Industries We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored logistics solutions for diverse industries and business sectors
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <industry.icon className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{industry.name}</h3>
                <p className="text-gray-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose Our Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the difference with our comprehensive logistics solutions
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-300">Round-the-clock customer service and tracking assistance</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Secure Handling</h3>
              <p className="text-gray-300">Advanced security protocols for your valuable packages</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Global Reach</h3>
              <p className="text-gray-300">Delivery to over 190 countries with local expertise</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Expert Team</h3>
              <p className="text-gray-300">500+ logistics professionals ensuring smooth operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-cyan-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to Ship?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get started with our shipping services today. Our team is ready to help you find the perfect solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Get Quote Now
            </button>
            <button className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}