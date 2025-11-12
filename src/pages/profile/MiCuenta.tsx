import { useState, useEffect } from "react";  // ← AGREGADO: useEffect para fetch dinámico
import { useNavigate } from "react-router-dom";  // Pa' back suave al dashboard
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, ArrowLeft, Loader2 } from "lucide-react";  // ← AGREGADO: Loader2
import { DashboardFooter } from "@/components/dashboard-footer";

export default function MiCuenta() {
  const [userName, setUserName] = useState("");  // ← VACÍO: Espera API o localStorage
  const [userRole, setUserRole] = useState("");  // ← CORREGIDO: Full state con setter
  const [email, setEmail] = useState("");  // ← VACÍO
  const [department, setDepartment] = useState("");  // ← VACÍO
  const [isEditing, setIsEditing] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);  // ← VACÍO: Removido hardcode
  const [loading, setLoading] = useState(true);  // ← NUEVO: Loader para fetch
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ← NUEVO: Fetch para datos dinámicos (perfil y historial)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ← AGREGAR AQUÍ: await axios.get('/api/user/profile'); setUserName(res.data.name); etc.
        // ← AGREGAR AQUÍ: await axios.get('/api/user/activity'); setActivityHistory(res.data);
        // Por ahora, placeholders vacíos
        setUserName("");  // ← VACÍO hasta API
        setUserRole("");  // ← VACÍO (ahora con setter)
        setEmail("");  // ← VACÍO
        setDepartment("");  // ← VACÍO
        setActivityHistory([]);  // ← VACÍO
        console.log("Datos de perfil cargados (listo para API real)");
      } catch (err) {
        setError("Error al cargar perfil: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert("Perfil actualizado correctamente");  // ← En real: API PATCH
  };

  const handleChangePassword = () => {
    alert("Se ha enviado un enlace de cambio de contraseña a tu email");  // ← En real: API POST
  };

  const handleBackToDashboard = () => {
    navigate(`/${userRole.toLowerCase()}`);  // ← Va al panel del rol (ej. /solicitante)
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-400">  {/* ← CAMBIO: bg-slate-50 (gris claro para fondo) */}
      <header className="relative border-b border-sky-200/30 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 px-6 py-6 shadow-slate-100">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Hola, {userName || 'Usuario'} (Rol: {userRole || 'Cargando...'})  // ← DINÁMICO con fallback
              </h1>
              <p className="mt-1 text-sm text-white/90">Gestiona tu información personal y actividad</p>
            </div>
            <Button
              variant="outline"
              className="gap-2 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Card className="shadow-slate-100 transition-shadow hover:shadow-slate-200 border-slate-200 bg-white">  {/* ← CAMBIO: bg-white explícito para contrastar con fondo gris */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sky-700">
                <User className="h-6 w-6" />
                Datos Personales
              </CardTitle>
              <CardDescription className="text-slate-600">Administra tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={!isEditing}
                        className="disabled:opacity-70 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                        placeholder={isEditing ? "Ingresa tu nombre" : "Cargando..."}  // ← PLACEHOLDER
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className="disabled:opacity-70 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                        placeholder={isEditing ? "Ingresa tu email" : "Cargando..."}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-slate-700">Departamento</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={!isEditing}
                        className="disabled:opacity-70 border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                        placeholder={isEditing ? "Ingresa tu departamento" : "Cargando..."}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-slate-700">Rol</Label>
                      <Input id="role" value={userRole} disabled className="opacity-70 border-slate-300" placeholder="Cargando..." />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!isEditing ? (
                      <>
                        <Button className="gap-2 bg-sky-500 hover:bg-sky-600 text-white" onClick={() => setIsEditing(true)}>
                          Editar Perfil
                        </Button>
                        <Button className="gap-2 bg-sky-500 hover:bg-sky-600 text-white" onClick={handleChangePassword}>
                          Cambiar Contraseña
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="gap-2 bg-sky-500 hover:bg-sky-600 text-white" onClick={handleSaveProfile}>
                          Guardar Cambios
                        </Button>
                        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => setIsEditing(false)}>
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-slate-100 transition-shadow hover:shadow-slate-200 border-slate-200 bg-white">  {/* ← CAMBIO: bg-white para contrastar */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sky-700">
                <FileText className="h-6 w-6" />
                Historial de Actividad
              </CardTitle>
              <CardDescription className="text-slate-600">Últimas acciones realizadas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {activityHistory.length === 0 ? (  // ← NUEVO: Mensaje vacío
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No hay actividad reciente. ¡Empieza a crear trámites!</p>
                  <Button onClick={() => { /* Recargar o navegar */ }} variant="outline">Actualizar</Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Fecha</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Acción</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Documento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityHistory.map((activity: any, index) => (
                          <tr key={index} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-600">{activity.date || 'Sin fecha'}</td>
                            <td className="px-4 py-3 text-sm text-slate-900">{activity.action || 'Sin acción'}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{activity.documentId || 'N/A'}</td>
                          </tr>
                        )) || <tr><td colSpan={3} className="text-center text-slate-500 py-8">Sin historial</td></tr>}  // ← FALLBACK
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">Mostrando {activityHistory.length} actividades recientes</p>  // ← DINÁMICO
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sky-500 hover:bg-sky-50 border-slate-300"
                    >
                      Ver Todo el Historial
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}