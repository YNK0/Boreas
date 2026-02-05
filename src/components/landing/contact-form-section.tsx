'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema } from '@/lib/utils/validation'
import { businessTypeOptions } from '@/types/landing'
import { CheckCircle, Loader2 } from 'lucide-react'
import type { ContactFormData } from '@/types/landing'

export default function ContactFormSection() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      company: '',
      business_type: 'salon',
      city: '',
      message: ''
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Error al enviar formulario')
      }

      setIsSuccess(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Error al enviar formulario'
      )
    }
  }

  if (isSuccess) {
    return (
      <section id="contact" className="py-20 bg-primary-600">
        <div className="container-boreas">
          <div className="max-w-2xl mx-auto text-center text-white">
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-300" />
            <h2 className="text-3xl font-bold mb-4">¡Solicitud enviada!</h2>
            <p className="text-xl mb-6">
              Te contactaremos por WhatsApp en las próximas 2 horas
            </p>

            <div className="bg-white/10 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-4">Mientras tanto:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Revisa tu email para la confirmación
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Guarda nuestro WhatsApp: +52 123 456 7890
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  Prepara 3 preguntas sobre automatización para tu demo
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 text-white hover:text-gray-200 underline"
            >
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-primary-600">
      <div className="container-boreas">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Solicita tu demo gratuita
            </h2>
            <p className="text-xl">
              Te contactamos en menos de 2 horas para mostrarte cómo Boreas puede transformar tu negocio
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      form.formState.errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Juan Pérez"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* WhatsApp Field */}
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      form.formState.errors.whatsapp ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+52 123 456 7890"
                    {...form.register('whatsapp')}
                  />
                  {form.formState.errors.whatsapp && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.whatsapp.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      form.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="juan@empresa.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Business Type Field */}
                <div>
                  <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de negocio *
                  </label>
                  <select
                    id="business_type"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      form.formState.errors.business_type ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...form.register('business_type')}
                  >
                    {businessTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.business_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.business_type.message}
                    </p>
                  )}
                </div>

                {/* City Field */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      form.formState.errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ciudad de México"
                    {...form.register('city')}
                  />
                  {form.formState.errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                {/* Company Field */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del negocio
                  </label>
                  <input
                    id="company"
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                      form.formState.errors.company ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mi Empresa"
                    {...form.register('company')}
                  />
                  {form.formState.errors.company && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.company.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje (opcional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    form.formState.errors.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Cuéntanos sobre tu negocio y qué quieres automatizar..."
                  {...form.register('message')}
                />
                {form.formState.errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-700 text-sm">{submitError}</div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando solicitud...
                    </>
                  ) : (
                    'Solicitar Demo Gratuita'
                  )}
                </button>

                <p className="text-sm text-gray-600 mt-4">
                  Al enviar aceptas nuestros{' '}
                  <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                    términos de privacidad
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}