import { MessageSquare, Calendar, Clock, BarChart3, Zap, Shield } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Respuestas Automáticas 24/7',
      description: 'Tu bot contesta al instante preguntas frecuentes, precios, horarios y servicios disponibles, incluso de madrugada.',
      benefits: [
        'Sin perder clientes fuera de horario',
        'Respuestas consistentes siempre',
        'Reduce 80% mensajes repetitivos'
      ]
    },
    {
      icon: Calendar,
      title: 'Agendado Automático',
      description: 'Los clientes pueden agendar, cancelar y reagendar citas directamente por WhatsApp sin intervención humana.',
      benefits: [
        'Agenda actualizada en tiempo real',
        'Recordatorios automáticos',
        'Reduce no-shows 60%'
      ]
    },
    {
      icon: Clock,
      title: 'Gestión de Tiempo Inteligente',
      description: 'El sistema conoce tu disponibilidad, servicios y duración para ofrecer horarios reales disponibles.',
      benefits: [
        'No más doble reservas',
        'Optimización automática',
        'Buffer entre citas'
      ]
    },
    {
      icon: BarChart3,
      title: 'Métricas y Seguimiento',
      description: 'Dashboard completo con estadísticas de conversaciones, citas agendadas y satisfacción del cliente.',
      benefits: [
        'ROI visible y medible',
        'Insights de comportamiento',
        'Reportes automáticos'
      ]
    },
    {
      icon: Zap,
      title: 'Configuración en 15 Minutos',
      description: 'Setup completo incluido. Solo conectas tu WhatsApp Business y personalizas las respuestas a tu negocio.',
      benefits: [
        'No requiere conocimiento técnico',
        'Soporte en configuración',
        'Funcional el mismo día'
      ]
    },
    {
      icon: Shield,
      title: 'Transferencia Humana Inteligente',
      description: 'Cuando el bot no puede ayudar, transfiere seamlessly a una persona real con todo el contexto.',
      benefits: [
        'Experiencia sin interrupciones',
        'Contexto preservado',
        'Clientes nunca frustrados'
      ]
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Todo lo que necesitas para automatizar WhatsApp
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solución completa diseñada específicamente para pequeños negocios que quieren crecer sin complicaciones
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3 flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para ver estas features en acción?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Te mostramos cómo funciona Boreas específicamente para tu negocio en una demo de 15 minutos
          </p>
          <a
            href="#contact"
            className="btn-primary text-lg px-8 py-4"
          >
            Ver Demo Personalizada
          </a>
        </div>
      </div>
    </section>
  )
}