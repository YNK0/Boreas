export default function ProblemSolutionSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            ¿Pasas 4 horas al día respondiendo WhatsApp?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Los dueños de pequeños negocios pierden tiempo valioso en tareas repetitivas
            que pueden automatizarse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problems */}
          <div className="problems">
            <h3 className="text-2xl font-bold mb-8 text-red-600 text-center">Sin Boreas</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100/50 transition-colors">
                <div className="text-2xl">😩</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    4+ horas diarias en WhatsApp
                  </h4>
                  <p className="text-gray-600">
                    Respondiendo lo mismo una y otra vez
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100/50 transition-colors">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Mensajes perdidos en la noche
                  </h4>
                  <p className="text-gray-600">
                    Clientes que escriben cuando no estás disponible
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100/50 transition-colors">
                <div className="text-2xl">🔄</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Información duplicada constantemente
                  </h4>
                  <p className="text-gray-600">
                    Precios, horarios, servicios... siempre lo mismo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100/50 transition-colors">
                <div className="text-2xl">📅</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Citas perdidas por mala comunicación
                  </h4>
                  <p className="text-gray-600">
                    Confusion con fechas, servicios y disponibilidad
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="solutions">
            <h3 className="text-2xl font-bold mb-8 text-green-600 text-center">Con Boreas</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100/50 transition-colors">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Respuestas automáticas 24/7
                  </h4>
                  <p className="text-gray-600">
                    El bot responde al instante, cualquier hora del día
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100/50 transition-colors">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Información exacta siempre
                  </h4>
                  <p className="text-gray-600">
                    Precios, horarios y servicios actualizados automáticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100/50 transition-colors">
                <div className="text-2xl">📋</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Agendamiento inteligente
                  </h4>
                  <p className="text-gray-600">
                    El bot agenda citas directamente en tu calendario
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100/50 transition-colors">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Más ventas, menos trabajo
                  </h4>
                  <p className="text-gray-600">
                    Convierte más prospectos mientras te enfocas en tu negocio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="btn-primary inline-flex items-center"
          >
            Ver cómo funciona - Demo gratuita
          </a>
        </div>
      </div>
    </section>
  )
}