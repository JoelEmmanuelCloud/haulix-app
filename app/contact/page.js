'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Mail, MapPin, Phone, Clock, MessageCircle, Send, CheckCircle, Globe, Users, Headphones } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      info: 'support@haulix.delivery',
      action: 'Send Email',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      href: 'mailto:support@haulix.delivery'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '24/7 customer service',
      info: '+380 44 123-4567',
      action: 'Call Now',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      href: 'tel:+380441234567'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant messaging support',
      info: 'Available 24/7',
      action: 'Start Chat',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: '#'
    },
    {
      icon: MapPin,
      title: 'Visit Our Office',
      description: 'Meet us in person',
      info: 'Kiev, Ukraine',
      action: 'Get Directions',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      href: 'https://maps.google.com'
    }
  ];

  const offices = [
    {
      city: 'Kiev, Ukraine',
      address: 'Khreshchatyk Street 1, Kiev 01001, Ukraine',
      phone: '+380 44 123-4567',
      email: 'ukraine@haulix.delivery',
      hours: 'Mon-Fri: 8:00 AM - 8:00 PM',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      city: 'London, UK',
      address: '123 Shipping Lane, London EC2M 7PP, UK',
      phone: '+44 20 7123 4567',
      email: 'london@haulix.delivery',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      image: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      city: 'New York, USA',
      address: '456 Logistics Ave, New York, NY 10001, USA',
      phone: '+1 212 555-0123',
      email: 'newyork@haulix.delivery',
      hours: 'Mon-Fri: 8:00 AM - 7:00 PM',
      image: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const quickLinks = [
    { name: 'Track Your Package', href: '/track' },
    { name: 'Shipping Calculator', href: '/calculator' },
    { name: 'Service Areas', href: '/coverage' },
    { name: 'Shipping Guidelines', href: '/guidelines' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Account Portal', href: '/account' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat opacity-20"
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">Contact Us</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-2">
            We're here to help with all your shipping and logistics needs. Get in touch with our expert team.
          </p>
        </div>
      </section>

      {/* Contact Methods - Mobile First Grid */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Get In Touch</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Choose your preferred way to contact us. We're available 24/7 to assist you.
            </p>
          </div>
          
          {/* Mobile-optimized contact methods grid */}
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-12 md:mb-16">
            {contactMethods.map((method, index) => (
              <a 
                key={index} 
                href={method.href}
                className={`${method.bgColor} p-4 sm:p-6 rounded-2xl text-center hover:shadow-lg transition-shadow block`}
              >
                <div className={`${method.bgColor} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-white`}>
                  <method.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${method.iconColor}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">{method.description}</p>
                <p className={`font-semibold ${method.iconColor} mb-3 sm:mb-4 text-sm sm:text-base`}>{method.info}</p>
                <span className={`${method.iconColor} hover:opacity-80 font-semibold transition-opacity text-sm sm:text-base`}>
                  {method.action}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info - Mobile Optimized Layout */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid gap-6 sm:gap-8 md:gap-12 lg:grid-cols-2">
            
            {/* Contact Form - Mobile First */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send us a Message</h3>
              
              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-green-800 text-sm sm:text-base">Thank you! Your message has been sent successfully.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name and Email - Mobile Stack */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base min-h-[48px]"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base min-h-[48px]"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                {/* Company and Phone - Mobile Stack */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base min-h-[48px]"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base min-h-[48px]"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base min-h-[48px]"
                  >
                    <option value="">Select a subject</option>
                    <option value="shipping-quote">Shipping Quote Request</option>
                    <option value="track-package">Package Tracking Issue</option>
                    <option value="business-inquiry">Business Partnership</option>
                    <option value="complaint">Complaint or Issue</option>
                    <option value="general">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-vertical text-sm sm:text-base"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white py-4 px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center justify-center min-h-[56px]"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Quick Links & Info - Mobile Optimized */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* Quick Links */}
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Links</h3>
                <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center text-gray-600 hover:text-cyan-600 transition-colors p-2 sm:p-3 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <span className="mr-2 sm:mr-3">→</span>
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Information</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Support</p>
                      <p className="text-gray-600 text-sm sm:text-base">support@haulix.delivery</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Response within 2 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Headquarters</p>
                      <p className="text-gray-600 text-sm sm:text-base">Kiev, Ukraine</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Main operations center</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Support Hours</p>
                      <p className="text-gray-600 text-sm sm:text-base">24/7 Customer Support</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Always here to help</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Live Chat</p>
                      <p className="text-gray-600 text-sm sm:text-base">Instant messaging support</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Available on all pages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices - Mobile Optimized */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Our Global Offices</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Visit us at one of our offices around the world or contact your local team
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {offices.map((office, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img 
                  src={office.image} 
                  alt={`${office.city} office`}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{office.city}</h3>
                  <div className="space-y-2 sm:space-y-3 text-gray-600">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-cyan-600 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm leading-relaxed">{office.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-cyan-600 mr-2 sm:mr-3 flex-shrink-0" />
                      <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="text-xs sm:text-sm hover:text-cyan-600 transition-colors">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-cyan-600 mr-2 sm:mr-3 flex-shrink-0" />
                      <a href={`mailto:${office.email}`} className="text-xs sm:text-sm hover:text-cyan-600 transition-colors">
                        {office.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-cyan-600 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{office.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Stats - Mobile Optimized */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">Support That Delivers</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Our commitment to exceptional customer service is reflected in our performance
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">98%</div>
              <div className="text-gray-300 text-xs sm:text-sm md:text-base">Customer Satisfaction</div>
            </div>
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">&lt;2h</div>
              <div className="text-gray-300 text-xs sm:text-sm md:text-base">Average Response Time</div>
            </div>
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">24/7</div>
              <div className="text-gray-300 text-xs sm:text-sm md:text-base">Support Availability</div>
            </div>
            <div className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">15+</div>
              <div className="text-gray-300 text-xs sm:text-sm md:text-base">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}