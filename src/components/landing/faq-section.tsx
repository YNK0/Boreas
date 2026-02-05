'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  const faqs = [
    {
      category: 'general',
      question: '¿Cómo funciona Boreas exactamente?',
      answer: 'Boreas conecta con tu WhatsApp Business y crea un bot inteligente que responde automáticamente a tus clientes. El bot puede agendar citas, responder preguntas frecuentes, enviar tu menú o lista de precios, y mucho más. Todo se configura en 15 minutos y puedes personalizar las respuestas.'
    },
    {
      category: 'technical',
      question: '¿Necesito conocimientos técnicos para usar Boreas?',
      answer: 'Para nada. Boreas está diseñado para dueños de negocios que no son técnicos. Nosotros configuramos todo por ti en la demo, y después puedes hacer cambios desde un panel muy sencillo. Es tan fácil como usar WhatsApp normal.'
    },
    {
      category: 'pricing',
      question: '¿Cuánto cuesta Boreas?',
      answer: 'Nuestros planes empiezan desde $99 USD mensuales sin permanencia. El precio incluye setup completo, configuración personalizada, soporte 24/7 y todas las funcionalidades. El ROI típico se recupera en las primeras 2 semanas.'
    },
    {
      category: 'general',
      question: '¿Qué tipos de negocios usan Boreas?',
      answer: 'Principalmente salones de belleza, restaurantes, clínicas médicas y dentales, spas, gimnasios, veterinarias y tiendas locales. Cualquier negocio que reciba muchos mensajes por WhatsApp y maneje citas o reservas es perfecto para Boreas.'
    },
    {
      category: 'technical',
      question: '¿El bot reemplaza completamente a una persona?',
      answer: 'No, Boreas complementa a tu equipo. El bot maneja las tareas repetitivas (preguntas frecuentes, agendar citas, enviar información) pero cuando el cliente necesita algo más complejo, el bot transfiere la conversación a una persona real automáticamente.'
    },
    {
      category: 'technical',
      question: '¿Funciona con mi WhatsApp actual?',
      answer: 'Sí, Boreas funciona con WhatsApp Business (no con WhatsApp personal). Si usas WhatsApp normal, te ayudamos a migrar a WhatsApp Business en 5 minutos sin perder conversaciones. Es gratis y mucho mejor para negocios.'
    },
    {
      category: 'support',
      question: '¿Qué soporte recibo?',
      answer: 'Soporte completo en español 24/7 por WhatsApp, email y video llamadas. Incluye setup inicial personalizado, entrenamiento de tu equipo, ajustes cuando los necesites y monitoreo proactivo del sistema.'
    },
    {
      category: 'general',
      question: '¿Puedo cancelar cuando quiera?',
      answer: 'Sí, no hay permanencia ni penalizaciones. Puedes cancelar en cualquier momento con 30 días de aviso. Pero el 95% de nuestros clientes renuevan porque ven resultados reales desde el primer mes.'
    },
    {
      category: 'pricing',
      question: '¿Hay costos ocultos o adicionales?',
      answer: 'No hay costos ocultos. El precio mensual incluye todo: software, configuración, soporte, actualizaciones y mantenimiento. Solo pagas extra si quieres funcionalidades muy avanzadas o integraciones especiales, pero te avisamos antes.'
    },
    {
      category: 'general',
      question: '¿Cuánto tiempo toma ver resultados?',
      answer: 'Los resultados son inmediatos. Desde el día 1 el bot estará respondiendo 24/7, pero típicamente nuestros clientes ven un aumento significativo en citas y una reducción del 80% en tiempo dedicado a WhatsApp en las primeras 2 semanas.'
    }
  ]

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (openItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Las respuestas a las dudas más comunes sobre Boreas
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  className="w-full px-4 lg:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors touch-target"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium text-gray-900 pr-4 text-sm lg:text-base leading-relaxed">
                    {faq.question}
                  </span>
                  {openItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openItems.has(index) && (
                  <div className="px-4 lg:px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              ¿No encontraste la respuesta que buscas?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo está listo para resolver todas tus dudas en una demo personalizada
            </p>
            <a
              href="#contact"
              className="btn-primary"
            >
              Programa tu demo gratuita
            </a>
          </div>
        </div>

        {/* Additional help section */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Demo personalizada</h3>
            <p className="text-sm text-gray-600">
              15 minutos para resolver todas tus dudas específicas
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">WhatsApp directo</h3>
            <p className="text-sm text-gray-600">
              Chatea con nosotros al +52 123 456 7890
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email soporte</h3>
            <p className="text-sm text-gray-600">
              Escríbenos a hola@boreas.mx
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}