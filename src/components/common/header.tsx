'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <nav className="container-boreas">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Boreas</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-primary-600 transition-colors touch-target"
            >
              Características
            </a>
            <a
              href="#cases"
              className="text-gray-600 hover:text-primary-600 transition-colors touch-target"
            >
              Casos de Éxito
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-primary-600 transition-colors touch-target"
            >
              Precios
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-primary-600 transition-colors touch-target"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="btn-primary touch-target"
            >
              Demo Gratuita
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100 touch-target"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced with smooth animations */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col space-y-1">
              <a
                href="#features"
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2 touch-target font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                📱 Características
              </a>
              <a
                href="#cases"
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2 touch-target font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏆 Casos de Éxito
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2 touch-target font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                💰 Precios
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2 touch-target font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ❓ FAQ
              </a>
              <div className="px-2 pt-2">
                <a
                  href="#contact"
                  className="btn-primary block text-center text-lg py-4 touch-target font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🚀 Demo Gratuita
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}