'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Zap, DollarSign, Shield } from 'lucide-react'
import { ScannableHeading, HighlightText, QuickScanSection } from '@/components/ui/scannable-text'

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))

  const faqCategories = [
    {
      title: 'Básicos sobre Boreas',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'blue',
      faqs: [
        {
          question: '¿Cómo funciona Boreas exactamente?',
          quickAnswer: 'Bot inteligente de WhatsApp que responde 24/7',
          answer: 'Boreas conecta con tu WhatsApp Business y crea un bot inteligente que responde automáticamente a tus clientes. El bot puede agendar citas, responder preguntas frecuentes, enviar tu menú o lista de precios, y mucho más. Todo se configura en 15 minutos y puedes personalizar las respuestas.'
        },
        {
          question: '¿Qué tipos de negocios usan Boreas?',
          quickAnswer: 'Salones, restaurantes, clínicas, spas',
          answer: 'Principalmente salones de belleza, restaurantes, clínicas médicas y dentales, spas, gimnasios, veterinarias y tiendas locales. Cualquier negocio que reciba muchos mensajes por WhatsApp y maneje citas o reservas es perfecto para Boreas.'
        },
        {
          question: '¿Cuánto tiempo toma ver resultados?',
          quickAnswer: 'Resultados desde el día 1',
          answer: 'Los resultados son inmediatos. Desde el día 1 el bot estará respondiendo 24/7, pero típicamente nuestros clientes ven un aumento significativo en citas y una reducción del 80% en tiempo dedicado a WhatsApp en las primeras 2 semanas.'
        },
        {
          question: '¿Puedo cancelar cuando quiera?',
          quickAnswer: 'Sin permanencia, cancela cuando quieras',
          answer: 'Sí, no hay permanencia ni penalizaciones. Puedes cancelar en cualquier momento con 30 días de aviso. Pero el 95% de nuestros clientes renuevan porque ven resultados reales desde el primer mes.'
        }
      ]
    },
    {
      title: 'Implementación & Técnico',
      icon: <Zap className="w-5 h-5" />,
      color: 'orange',
      faqs: [
        {
          question: '¿Necesito conocimientos técnicos para usar Boreas?',
          quickAnswer: 'Cero conocimiento técnico necesario',
          answer: 'Para nada. Boreas está diseñado para dueños de negocios que no son técnicos. Nosotros configuramos todo por ti en la demo, y después puedes hacer cambios desde un panel muy sencillo. Es tan fácil como usar WhatsApp normal.'
        },
        {
          question: '¿Funciona con mi WhatsApp actual?',
          quickAnswer: 'Solo necesitas WhatsApp Business',
          answer: 'Sí, Boreas funciona con WhatsApp Business (no con WhatsApp personal). Si usas WhatsApp normal, te ayudamos a migrar a WhatsApp Business en 5 minutos sin perder conversaciones. Es gratis y mucho mejor para negocios.'
        },
        {
          question: '¿El bot reemplaza completamente a una persona?',
          quickAnswer: 'Complementa a tu equipo, no lo reemplaza',
          answer: 'No, Boreas complementa a tu equipo. El bot maneja las tareas repetitivas (preguntas frecuentes, agendar citas, enviar información) pero cuando el cliente necesita algo más complejo, el bot transfiere la conversación a una persona real automáticamente.'
        }
      ]
    },
    {
      title: 'Precios & Costos',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'green',
      faqs: [
        {
          question: '¿Cuánto cuesta Boreas?',
          quickAnswer: 'Desde $99 USD/mes, sin permanencia',
          answer: 'Nuestros planes empiezan desde $99 USD mensuales sin permanencia. El precio incluye setup completo, configuración personalizada, soporte 24/7 y todas las funcionalidades. El ROI típico se recupera en las primeras 2 semanas.'
        },
        {
          question: '¿Hay costos ocultos o adicionales?',
          quickAnswer: 'Sin costos ocultos, todo incluido',
          answer: 'No hay costos ocultos. El precio mensual incluye todo: software, configuración, soporte, actualizaciones y mantenimiento. Solo pagas extra si quieres funcionalidades muy avanzadas o integraciones especiales, pero te avisamos antes.'
        }
      ]
    },
    {
      title: 'Soporte & Garantías',
      icon: <Shield className="w-5 h-5" />,
      color: 'purple',
      faqs: [
        {
          question: '¿Qué soporte recibo?',
          quickAnswer: 'Soporte 24/7 en español',
          answer: 'Soporte completo en español 24/7 por WhatsApp, email y video llamadas. Incluye setup inicial personalizado, entrenamiento de tu equipo, ajustes cuando los necesites y monitoreo proactivo del sistema.'
        }
      ]
    }
  ]

  const allFaqs = faqCategories.flatMap(category =>
    category.faqs.map(faq => ({ ...faq, category: category.title }))
  )

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
        <ScannableHeading
          level={2}
          eyebrow="Todo lo que necesitas saber"
          badge="Respuestas rápidas"
        >
          Preguntas frecuentes
        </ScannableHeading>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
          Encuentra respuestas rápidas organizadas por tema para que encuentres exactamente lo que necesitas
        </p>

        {/* Quick answers overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {faqCategories.map((category, categoryIndex) => (
            <QuickScanSection
              key={categoryIndex}
              title={category.title}
              items={category.faqs.map(faq => ({
                icon: category.icon,
                title: faq.question,
                description: faq.quickAnswer,
                highlight: categoryIndex === 0 ? 'Popular' : undefined
              }))}
              className="hover:shadow-lg transition-shadow"
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Detailed FAQ sections */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r from-${category.color}-50 to-${category.color}-100 p-4 border-b border-gray-200`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{category.title}</h3>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {category.faqs.length} preguntas
                    </div>
                  </div>
                </div>

                <div className="space-y-0">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = faqCategories.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.faqs.length, 0) + faqIndex;
                    return (
                      <div key={faqIndex} className="border-b border-gray-100 last:border-b-0">
                        <button
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors touch-target"
                          onClick={() => toggleItem(globalIndex)}
                        >
                          <div className="flex-1 pr-4">
                            <div className="font-medium text-gray-900 text-sm lg:text-base leading-relaxed mb-1">
                              {faq.question}
                            </div>
                            <div className="text-xs text-gray-500">
                              <HighlightText color={category.color as any} variant="subtle">
                                {faq.quickAnswer}
                              </HighlightText>
                            </div>
                          </div>
                          {openItems.has(globalIndex) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>

                        {openItems.has(globalIndex) && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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