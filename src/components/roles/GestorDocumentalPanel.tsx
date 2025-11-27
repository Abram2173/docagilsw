// src/components/roles/GestorDocumentalPanel.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardFooter } from "@/components/dashboard-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Send, FileText, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const sidebarItems = [
  { label: "Subir Documento", href: "/gestor", icon: "Upload" },
  { label: "Catálogo Maestro", href: "/gestor/catalogo", icon: "FileText" },
  { label: "Historial", href: "/gestor/historial", icon: "History" },
];

interface GestorDocumentalPanelProps {
  userName: string;
  role: string;
}

export default function GestorDocumentalPanel({ userName, role }: GestorDocumentalPanelProps) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Formulario
  const [titulo, setTitulo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  // Protección de rol
  useEffect(() => {
    if (!token || (role !== "gestor" && role !== "admin")) {
      alert("Acceso denegado – Solo Gestor Documental o Administrador");
      navigate("/dashboard");
    }
  }, [role, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !codigo || !tipo || !file) {
      alert("Completa todos los campos y adjunta un archivo");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("codigo", codigo);
    formData.append("tipo", tipo);
    formData.append("archivo", file);

    try {
      await axios.post(`${API_BASE}/gestor/subir-documento/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Documento oficial "${codigo}" subido y enviado a aprobación multinivel`);
      setTitulo(""); setCodigo(""); setTipo(""); setFile(null);
    } catch (err) {
      alert("Error al subir el documento");
    } finally {
      setUploading(false);
    }
  };

  const handleSectionChange = (section: string) => {
    // Por ahora solo tenemos "subir", las demás se implementan después
    console.log("Navegando a:", section);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      <DashboardHeader userName={userName} role={role} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1">
        <DashboardSidebar
          items={sidebarItems.map(item => ({
            ...item,
            onClick: () => handleSectionChange(item.href)
          }))}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                <CardTitle className="text-2xl text-green-700 flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  Subir Documento Oficial – Gestor Documental
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="titulo">Título del Documento</Label>
                      <Input
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Manual de Procedimientos Académicos"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigo">Código ISO</Label>
                      <Input
                        id="codigo"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                        placeholder="Ej: PROC-001 v1.0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Tipo de Documento</Label>
                    <Select value={tipo} onValueChange={setTipo} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procedimiento">Procedimiento</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="politica">Política</SelectItem>
                        <SelectItem value="formato">Formato Oficial</SelectItem>
                        <SelectItem value="instructivo">Instructivo de Trabajo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Archivo PDF (versión controlada)</Label>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="mx-auto max-w-xs"
                        required
                      />
                      {file && <p className="mt-2 text-sm text-green-600">Archivo seleccionado: {file.name}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="submit" size="lg" disabled={uploading} className="bg-green-600 hover:bg-green-700">
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando a aprobación...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar a Aprobación Multinivel
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}