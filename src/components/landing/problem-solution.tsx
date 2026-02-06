import { ScannableHeading, HighlightText, StatHighlight, SummaryBox } from '@/components/ui/scannable-text'

export default function ProblemSolutionSection() {
  const painPoints = [
    {
      emoji: '😩',
      title: '4+ horas diarias en WhatsApp',
      description: 'Respondiendo lo mismo una y otra vez',
      stat: '4h/día perdidas'
    },
    {
      emoji: '📱',
      title: 'Mensajes perdidos en la noche',
      description: 'Clientes que escriben cuando no estás disponible',
      stat: '30% leads perdidos'
    },
    {
      emoji: '🔄',
      title: 'Información duplicada constantemente',
      description: 'Precios, horarios, servicios... siempre lo mismo',
      stat: '80% preguntas repetitivas'
    },
    {
      emoji: '📅',
      title: 'Citas perdidas por mala comunicación',
      description: 'Confusión con fechas, servicios y disponibilidad',
      stat: '25% no-shows'
    }
  ]

  const solutions = [
    {
      emoji: '⚡',
      title: 'Respuestas automáticas 24/7',
      description: 'El bot responde al instante, cualquier hora del día',
      benefit: '15 segundos de respuesta'
    },
    {
      emoji: '🎯',
      title: 'Información exacta siempre',
      description: 'Precios, horarios y servicios actualizados automáticamente',
      benefit: '100% información correcta'
    },
    {
      emoji: '📋',
      title: 'Agendamiento inteligente',
      description: 'El bot agenda citas directamente en tu calendario',
      benefit: '40% más citas'
    },
    {
      emoji: '💰',
      title: 'Más ventas, menos trabajo',
      description: 'Convierte más prospectos mientras te enfocas en tu negocio',
      benefit: '3x ROI promedio'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-boreas">
        <ScannableHeading
          level={2}
          eyebrow="El problema real"
          badge="Demasiado tiempo perdido"
        >
          ¿Pasas <HighlightText color="orange" variant="bold">4 horas al día</HighlightText> respondiendo WhatsApp?
        </ScannableHeading>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
          Los dueños de pequeños negocios pierden <HighlightText color="orange">tiempo valioso</HighlightText> en tareas repetitivas
          que pueden automatizarse <HighlightText color="green">fácilmente</HighlightText>
        </p>

        {/* Quick stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatHighlight
            number="4h"
            label="Tiempo perdido diario"
            description="en WhatsApp manual"
            color="orange"
            size="md"
          />
          <StatHighlight
            number="80%"
            label="Preguntas repetitivas"
            description="que podrían automatizarse"
            color="orange"
            size="md"
          />
          <StatHighlight
            number="30%"
            label="Leads perdidos"
            description="por no responder rápido"
            color="orange"
            size="md"
          />
          <StatHighlight
            number="25%"
            label="Citas canceladas"
            description="por mala comunicación"
            color="orange"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Problems */}
          <div className="problems">
            <h3 className="text-2xl font-bold mb-8 text-red-600 text-center flex items-center justify-center gap-3">
              <span className="text-3xl">🚫</span>
              <span>Sin Boreas</span>
              <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">Situación actual</span>
            </h3>

            <div className="space-y-6">
              {painPoints.map((pain, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400 hover:bg-red-100/50 transition-colors relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-bold">
                    {pain.stat}
                  </div>
                  <div className="text-2xl flex-shrink-0">{pain.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      {pain.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pain.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary box for problems */}
            <SummaryBox
              title="El costo real del WhatsApp manual"
              points={[
                "Pierdes 1,460 horas al año solo respondiendo WhatsApp",
                "30% de leads potenciales se van por respuestas tardías",
                "80% de tu tiempo se gasta en preguntas repetitivas",
                "Estrés constante por estar siempre 'disponible'"
              ]}
              className="mt-8"
            />
          </div>

          {/* Solutions */}
          <div className="solutions">
            <h3 className="text-2xl font-bold mb-8 text-green-600 text-center flex items-center justify-center gap-3">
              <span className="text-3xl">✅</span>
              <span>Con Boreas</span>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">La solución</span>
            </h3>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 hover:bg-green-100/50 transition-colors relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">
                    {solution.benefit}
                  </div>
                  <div className="text-2xl flex-shrink-0">{solution.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      {solution.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary box for solutions */}
            <SummaryBox
              title="Lo que obtienes con Boreas"
              points={[
                "Recuperas 3+ horas diarias para tu negocio",
                "Respuesta instantánea 24/7 a todos los clientes",
                "40% más citas sin trabajo adicional",
                "ROI típico de 300% en el primer mes"
              ]}
              cta={{
                text: "Ver Demo en Vivo",
                href: "#contact"
              }}
              className="mt-8"
            />
          </div>
        </div>

        {/* Before/After Transformation */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-center mb-8 text-gray-900">
            La transformación típica en <HighlightText color="green" variant="bold">30 días</HighlightText>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Tiempo en WhatsApp</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-red-600 font-bold line-through">4h</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-bold">30min</span>
              </div>
              <div className="text-xs text-gray-600">-87% tiempo</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Leads perdidos</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-red-600 font-bold line-through">30%</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-bold">5%</span>
              </div>
              <div className="text-xs text-gray-600">-83% pérdidas</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Citas semanales</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-gray-600 font-bold">20</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-bold">28</span>
              </div>
              <div className="text-xs text-gray-600">+40% citas</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Satisfacción</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-gray-600 font-bold">85%</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-bold">95%</span>
              </div>
              <div className="text-xs text-gray-600">+10% felicidad</div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              ¿Listo para recuperar <HighlightText color="green" variant="bold">3+ horas diarias</HighlightText>?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Te mostramos exactamente cómo Boreas transformará tu negocio en una demo personalizada de 15 minutos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#contact"
                className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all"
              >
                Ver Demo Personalizada - Gratis
              </a>
              <div className="text-sm text-blue-200">
                ✅ Sin compromiso • ✅ 15 minutos • ✅ Casos de tu industria
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}