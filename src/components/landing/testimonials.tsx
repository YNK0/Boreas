export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Carmen Rodríguez",
      company: "Salón Carmen",
      industry: "Salón de belleza",
      quote: "Boreas transformó completamente mi negocio. Antes pasaba horas respondiendo WhatsApp, ahora el bot lo hace por mí las 24 horas. Mis citas aumentaron 40% en solo 2 meses.",
      avatar: "CR",
      rating: 5,
      result: "40% más citas"
    },
    {
      id: 2,
      name: "Miguel Hernández",
      company: "Pizzería Miguel",
      industry: "Restaurante",
      quote: "Increíble cómo algo tan simple puede cambiar tanto. Ya no pierdo reservas porque no puedo contestar el teléfono. El sistema de Boreas es una maravilla.",
      avatar: "MH",
      rating: 5,
      result: "60% más reservas"
    },
    {
      id: 3,
      name: "Dra. Patricia López",
      company: "Clínica López",
      industry: "Clínica médica",
      quote: "Los recordatorios automáticos redujeron nuestras citas perdidas de 25% a solo 8%. Nuestros pacientes están más organizados y nosotros más eficientes.",
      avatar: "PL",
      rating: 5,
      result: "68% menos no-shows"
    },
    {
      id: 4,
      name: "Ana García",
      company: "Nails Ana",
      industry: "Salón de uñas",
      quote: "Como trabajo sola, no podía estar contestando WhatsApp todo el día. Boreas me permite enfocarme en mis clientes mientras el bot agenda las nuevas citas.",
      avatar: "AG",
      rating: 5,
      result: "3x más tiempo libre"
    },
    {
      id: 5,
      name: "Roberto Silva",
      company: "Gym Mendoza",
      industry: "Gimnasio",
      quote: "El seguimiento automático de prospectos es genial. Muchas personas que antes se perdían ahora se convierten en miembros gracias a los mensajes de seguimiento.",
      avatar: "RS",
      rating: 5,
      result: "50% más conversiones"
    },
    {
      id: 6,
      name: "María Jiménez",
      company: "Spa Relax",
      industry: "Spa",
      quote: "Mis clientas aman poder agendar a cualquier hora. El sistema es tan fácil de usar que hasta las señoras mayores lo entienden perfecto.",
      avatar: "MJ",
      rating: 5,
      result: "95% satisfacción"
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-boreas">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 150 negocios confían en Boreas para automatizar su comunicación
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              {testimonials[0].avatar}
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic">
              "{testimonials[0].quote}"
            </blockquote>
            <div className="flex justify-center mb-4">
              {renderStars(testimonials[0].rating)}
            </div>
            <cite className="not-italic">
              <div className="font-semibold text-gray-900">{testimonials[0].name}</div>
              <div className="text-gray-600">{testimonials[0].company} • {testimonials[0].industry}</div>
              <div className="text-primary-600 font-medium mt-2">{testimonials[0].result}</div>
            </cite>
          </div>
        </div>

        {/* Grid of testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(1).map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-gray-900">
                    {testimonial.name}
                  </cite>
                  <div className="text-sm text-gray-600">
                    {testimonial.company}
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary-600">150+</div>
              <div className="text-gray-600">Negocios activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">4.9/5</div>
              <div className="text-gray-600">Calificación promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-600">Soporte incluido</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">15 min</div>
              <div className="text-gray-600">Setup promedio</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#contact" className="btn-primary">
            Únete a nuestros clientes exitosos
          </a>
        </div>
      </div>
    </section>
  )
}