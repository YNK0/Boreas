'use client'

import Link from 'next/link'
import { MessageSquare, Calendar, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'
// Temporarily disabled analytics
// import { TrackableCTA } from '@/components/analytics/tracking-components'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-primary-600 to-secondary-600 min-h-screen flex items-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
      </div>

      <div className="container-boreas py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-white order-2 lg:order-1">
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
              <Users className="w-4 h-4 text-green-300" />
              <span>+200 negocios ya automatizados</span>
            </div>

            {/* Main headline - optimized for conversion */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-balance">
                Automatiza WhatsApp y
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-100">
                  {" "}convierte más{" "}
                </span>
                visitantes en clientes
              </span>
            </h1>

            {/* Value proposition - problem-focused */}
            <p className="text-lg md:text-xl mb-8 text-blue-50 leading-relaxed">
              <strong>¿Pierdes clientes por responder WhatsApp hasta la madrugada?</strong><br />
              Boreas automatiza respuestas, agenda citas y cobra depósitos mientras duermes.
            </p>

            {/* CTAs with analytics */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="#contact" className="group">
                <button className="w-full sm:w-auto btn-primary bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform group-hover:scale-105 shadow-lg hover:shadow-xl min-h-[48px] flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Ver Demo Gratis
                </button>
              </Link>

              <Link href="#cases" className="group">
                <button className="w-full sm:w-auto btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all min-h-[48px] flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Casos de Éxito
                </button>
              </Link>
            </div>

            {/* Enhanced trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="font-medium">Setup en 15 min</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Clock className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="font-medium">Sin permanencia</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <MessageSquare className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="font-medium">Soporte 24/7</span>
              </div>
            </div>

            {/* Urgency indicator */}
            {/* <div className="mt-6 p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg">
              <p className="text-orange-100 text-sm">
                🔥 <strong>Oferta limitada:</strong> Primer mes gratis para los siguientes 50 salones que se registren
              </p>
            </div> */}
          </div>

          {/* Visual/Demo - Enhanced mobile experience */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Phone mockup */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Phone header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Salón Bella</h3>
                      <p className="text-xs text-green-600">En línea</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">WhatsApp Business</div>
                </div>

                {/* Enhanced conversation */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  <div className="bg-gray-100 rounded-xl p-3 text-sm max-w-[80%]">
                    <strong className="text-gray-600">María:</strong><br />
                    "Hola! Necesito cita para corte y color para mañana"
                  </div>
                  <div className="bg-primary-500 text-white rounded-xl p-3 text-sm max-w-[80%] ml-auto">
                    <div className="text-right">
                      <strong>Boreas Bot:</strong><br />
                      "¡Hola María! 😊 Perfecto, tengo disponibilidad mañana. ¿Prefieres por la mañana o tarde?"
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 text-sm max-w-[80%]">
                    <strong className="text-gray-600">María:</strong><br />
                    "Por la mañana"
                  </div>
                  <div className="bg-primary-500 text-white rounded-xl p-3 text-sm max-w-[80%] ml-auto">
                    <div className="text-right">
                      <strong>Boreas Bot:</strong><br />
                      "Genial! Tengo estas opciones:<br />
                      🕙 10:00 AM con Ana<br />
                      🕚 11:00 AM con Sofia<br />
                      ¿Cuál prefieres?"
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 text-sm max-w-[80%]">
                    <strong className="text-gray-600">María:</strong><br />
                    "11:00 con Sofia"
                  </div>
                  <div className="bg-green-500 text-white rounded-xl p-3 text-sm max-w-[80%] ml-auto">
                    <div className="text-right">
                      <strong>Boreas Bot:</strong><br />
                      "¡Reservado! 🎉<br />
                      📅 Mañana 11:00 AM<br />
                      💇‍♀️ Corte + Color con Sofia<br />
                      💰 Deposito: $300<br />
                      [Pagar Ahora]"
                    </div>
                  </div>
                </div>

                {/* Results metrics */}
                <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xl font-bold text-green-600">+40%</div>
                    <div className="text-xs text-gray-600">Citas</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">24/7</div>
                    <div className="text-xs text-gray-600">Disponible</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">15s</div>
                    <div className="text-xs text-gray-600">Respuesta</div>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual appeal */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-3 shadow-lg animate-bounce">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full p-3 shadow-lg animate-pulse">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-green-300">+200</div>
            <div className="text-sm opacity-90">Negocios activos</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-blue-300">95%</div>
            <div className="text-sm opacity-90">Satisfacción cliente</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-300">24/7</div>
            <div className="text-sm opacity-90">Automatización</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-300">15min</div>
            <div className="text-sm opacity-90">Setup promedio</div>
          </div>
        </div>
      </div>
    </section>
  )
}