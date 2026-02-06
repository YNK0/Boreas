import { OptimizedLogo } from '@/components/ui/optimized-image'

export default function CaseStudiesSection() {
  const caseStudies = [
    {
      id: 'salon-carmen',
      industry: 'salon',
      icon: '💄',
      logo: '/images/logos/salon-carmen.svg',
      company: 'Salón Carmen',
      type: 'Salón de belleza',
      results: [
        { metric: 'Citas semanales', before: '20', after: '28', improvement: '+40%' },
        { metric: 'Tiempo en WhatsApp', before: '4 horas/día', after: '30 min/día', improvement: '-87%' },
        { metric: 'Satisfacción cliente', before: '85%', after: '95%', improvement: '+10%' }
      ],
      quote: "Con Boreas automaticé mi WhatsApp y dejé de perder citas. Ahora tengo tiempo para enfocarme en mis clientas y mi negocio creció 40%",
      color: 'pink'
    },
    {
      id: 'restaurante-miguel',
      industry: 'restaurant',
      icon: '🍕',
      logo: '/images/logos/pizzeria-miguel.svg',
      company: 'Pizzería Miguel',
      type: 'Restaurante familiar',
      results: [
        { metric: 'Reservas diarias', before: '15', after: '24', improvement: '+60%' },
        { metric: 'Llamadas perdidas', before: '20/día', after: '2/día', improvement: '-90%' },
        { metric: 'Ingresos mensuales', before: '$45k', after: '$67k', improvement: '+48%' }
      ],
      quote: "Antes perdía muchas reservas porque no podía contestar el teléfono. Ahora el bot de Boreas atiende las 24 horas y mis ventas se dispararon",
      color: 'orange'
    },
    {
      id: 'clinica-lopez',
      industry: 'clinic',
      icon: '⚕️',
      logo: '/images/logos/clinica-lopez.svg',
      company: 'Clínica López',
      type: 'Clínica médica',
      results: [
        { metric: 'Citas programadas', before: '30/día', after: '45/día', improvement: '+50%' },
        { metric: 'No-shows', before: '25%', after: '8%', improvement: '-68%' },
        { metric: 'Eficiencia recepción', before: '60%', after: '95%', improvement: '+35%' }
      ],
      quote: "El sistema de recordatorios automáticos redujo drasticamente las citas perdidas. Nuestros pacientes están más satisfechos y organizados",
      color: 'blue'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'pink':
        return 'bg-pink-50 border-pink-200'
      case 'orange':
        return 'bg-orange-50 border-orange-200'
      case 'blue':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <section id="cases" className="py-20 bg-white">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Casos de éxito reales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce cómo otros negocios como el tuyo han transformado su comunicación con clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className={`case-study-card border-2 rounded-xl p-6 ${getColorClasses(study.color)}`}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mb-3 flex justify-center">
                  <OptimizedLogo
                    src={study.logo}
                    company={study.company}
                    size="md"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{study.company}</h3>
                <p className="text-gray-600">{study.type}</p>
              </div>

              {/* Results */}
              <div className="space-y-4 mb-6">
                {study.results.map((result, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {result.metric}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{result.before}</span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm font-medium text-gray-900">{result.after}</span>
                      <span className="text-sm font-bold text-green-600">{result.improvement}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-gray-700 italic mb-6 bg-white p-4 rounded-lg">
                "{study.quote}"
              </blockquote>

              {/* CTA */}
              <div className="text-center">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Ver caso completo →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-12 lg:mt-16 bg-gray-900 rounded-2xl p-6 lg:p-8 text-white text-center">
          <h3 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8">Resultados promedio de nuestros clientes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-green-400">+45%</div>
              <div className="text-gray-300 text-sm lg:text-base">Más citas/reservas</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-blue-400">-80%</div>
              <div className="text-gray-300 text-sm lg:text-base">Menos tiempo en WhatsApp</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-gray-300 text-sm lg:text-base">Atención disponible</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-400">ROI 3x</div>
              <div className="text-gray-300 text-sm lg:text-base">Retorno de inversión</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}