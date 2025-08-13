'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Mail, Phone, MapPin, Globe,
  Facebook, Twitter, Linkedin, Instagram,
  ChevronDown
} from 'lucide-react';

export default function Footer() {
  const sections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Track Package', href: '/track' },
        { name: 'Shipping Calculator', href: '/calculator' },
        { name: 'Service Areas', href: '/coverage' },
        { name: 'Shipping Guidelines', href: '/guidelines' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Account Portal', href: '/account' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Standard Shipping', href: '/services' },
        { name: 'Express Shipping', href: '/services' },
        { name: 'Priority Shipping', href: '/services' },
        { name: 'International Shipping', href: '/services' },
        { name: 'Freight Services', href: '/services' },
        { name: 'Package Tracking', href: '/track' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Services', href: '/services' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Releases', href: '/press' },
        { name: 'Partner Program', href: '/partners' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Shipping Terms', href: '/shipping-terms' },
        { name: 'Refund Policy', href: '/refunds' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Compliance', href: '/compliance' }
      ]
    }
  ];

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.svg"
                alt="Haulix Logo"
                width={160}
                height={60}
                className="w-auto h-14 brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
              Professional shipping and logistics solutions since 2008. Connecting businesses worldwide with reliable, efficient, and secure delivery services.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-cyan-400 mr-3" />
                support@haulix.delivery
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-cyan-400 mr-3" />
                +380 44 123-4567
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-cyan-400 mr-3" />
                Kiev, Ukraine (HQ)
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-cyan-400 mr-3" />
                Global Network - 250+ Facilities
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full hover:bg-gray-800 transition">
                  <Icon className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              {/* Mobile Accordion Header */}
              <button
                className="w-full flex items-center justify-between lg:justify-start lg:mb-6 lg:cursor-default"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="text-white font-semibold text-lg">{section.title}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 lg:hidden transition-transform ${
                    openSections[section.title] ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Collapsible Content */}
              <ul
                className={`space-y-3 mt-4 text-sm lg:mt-0 ${
                  openSections[section.title] || typeof window === 'undefined'
                    ? 'block'
                    : 'hidden lg:block'
                }`}
              >
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm">Get the latest shipping updates and logistics insights</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none transition-colors text-sm font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span>© 2025 Haulix. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <span>Professional Shipping Solutions</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-gray-300">
              Staff Login
            </Link>
            <span className="hidden sm:inline">|</span>
            <span>24/7 Support Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
