import Link from 'next/link'
import { MessageSquare, Calendar, TrendingUp } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 min-h-screen flex items-center">
      <div className="container-boreas py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Automatiza tu WhatsApp y duplica tus citas
            </h1>
            <p className="text-xl mb-8">
              Para salones, restaurantes y clínicas que quieren crecer sin dedicar 4 horas al día a WhatsApp
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="#contact" className="btn-primary bg-white text-blue-600 hover:bg-gray-50">
                Demo Gratuita
              </Link>
              <Link href="#cases" className="btn-secondary border-white text-white hover:bg-white hover:text-blue-600">
                Ver Casos de Éxito
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Sin contratos largos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Setup en 15 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Soporte en español</span>
              </div>
            </div>
          </div>

          {/* Visual/Demo */}
          <div className="hero-media">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">WhatsApp Automático</h3>
                <p className="text-gray-600">Respuestas instantáneas 24/7</p>
              </div>

              {/* Mock conversation */}
              <div className="space-y-3 mb-6">
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  <strong>Cliente:</strong> "¿Tienen cita para mañana?"
                </div>
                <div className="bg-blue-500 text-white rounded-lg p-3 text-sm text-right">
                  <strong>Bot:</strong> "¡Hola! Sí tenemos disponibilidad. ¿Qué servicio necesitas?"
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  <strong>Cliente:</strong> "Corte de cabello"
                </div>
                <div className="bg-blue-500 text-white rounded-lg p-3 text-sm text-right">
                  <strong>Bot:</strong> "Perfecto. Tengo estas opciones disponibles mañana:"
                </div>
              </div>

              {/* Mock results */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">+40%</div>
                  <div className="text-xs text-gray-600">Más citas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-xs text-gray-600">Disponible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}