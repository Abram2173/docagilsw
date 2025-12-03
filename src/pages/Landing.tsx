// src/pages/Landing.tsx
"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, FileCheck, GitBranch, Shield, Lightbulb, CircleCheck } from "lucide-react"
export default function Landing() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    if (cardsRef.current) {
      cardsRef.current.querySelectorAll(".feature-card").forEach((card) => observer.observe(card))
    }
    if (heroRef.current) observer.observe(heroRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50/30 to-emerald-50/30">
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        {/* Logo + Título */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 group">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#10B981] bg-clip-text text-transparent">
              Dart
            </h1>
            <div className="relative">
              <Lightbulb className="w-16 h-16 md:w-20 md:h-20 text-[#0EA5E9] fill-[#0EA5E9] animate-pulse-slow" />
              <CircleCheck className="w-8 h-8 text-[#10B981] absolute -top-2 -right-2 " />
            </div>
          </div>
        </div>

        {/* Hero */}
        <div ref={heroRef} className="text-center mb-20 opacity-0">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Dart – Gestión Documental Inteligente
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Cumplimiento ISO automático • Flujos multinivel • 100% digital
          </p>

          {/* Ilustración central */}
          <div className="relative max-w-3xl mx-auto h-2 mb-16">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Documentos flotantes */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-10 h-14 bg-white rounded-lg shadow-lg border border-gray-200 animate-float-document"
                  style={{
                    left: `${20 + Math.cos((i * Math.PI) / 4) * 45}%`,
                    top: `${30 + Math.sin((i * Math.PI) / 4) * 40}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <div className="w-4/5 h-1 bg-gray-300 rounded mt-3 mx-auto"></div>
                  <div className="w-3/5 h-1 bg-gray-200 rounded mt-2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">   
           {/* INICIAR SESIÓN */}
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white text-2xl px-16 py-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
              Iniciar Sesión
            </Button>
          </Link>

            {/* REGISTRARSE (opcional) */}
            <Link to="/auth?tab=register">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 font-bold"
              >
                Solicitar Acceso
              </Button>
            </Link>
  </div>
        </div>

        {/* Features */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { icon: GitBranch, title: "Control de Versiones", desc: "Seguimiento automático de cada cambio" },
            { icon: CheckCircle, title: "Aprobación Multinivel", desc: "Flujos personalizados por tu estructura" },
            { icon: FileCheck, title: "Trazabilidad Total", desc: "Auditoría completa de cada acción" },
            { icon: Shield, title: "Auditoría Automática", desc: "Reportes ISO listos al instante" },
          ].map((item, i) => (
            <Card key={i} className={`feature-card opacity-0 border-gray-200 hover:border-[#10B981] transition-all hover:shadow-2xl group`} style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0EA5E9] to-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección final */}
        <div className="text-center py-16 bg-white/70 rounded-3xl backdrop-blur-sm border border-gray-100 shadow-2xl">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Transforma tu institución con Dart
          </h3>
          <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto">
            Digitaliza, automatiza y cumple con ISO 9001/27001 sin esfuerzo. Tu equipo lo amará.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-lg text-gray-600">
            <div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-[#10B981]" /> Sin instalación</div>
            <div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-[#10B981]" /> Acceso desde cualquier dispositivo</div>
            <div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-[#10B981]" /> Soporte especializado</div>
          </div>
        </div>
      </main>
    </div>
  )
}