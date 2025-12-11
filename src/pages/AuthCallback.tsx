// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AuthCallback() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
axios.post(`${API_BASE}/auth/azure-login/`, { code })        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          alert("Error de autenticación institucional");
          window.location.href = "/auth";
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-3xl font-bold text-slate-900">Verificando tu identidad institucional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-10 text-slate-900">
          ¡Confirmación de identidad!
        </h1>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 mb-10">
          <p className="text-2xl font-bold mb-8 text-emerald-800">
            Escanea este QR con tu celular
          </p>
          <div className="bg-white p-10 rounded-3xl shadow-2xl inline-block">
            <QRCodeSVG 
              value={JSON.stringify({
                name: user.full_name,
                email: user.email,
                control: user.username
              })} 
              size={280}
              level="H"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 space-y-4 text-left text-xl">
          <p><strong>Nombre:</strong> {user.full_name}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Número de control:</strong> {user.username}</p>
        </div>

        <div className="mt-10 p-8 bg-green-50 rounded-3xl">
          <p className="text-2xl font-bold text-green-800">
            ¡Todo correcto!
          </p>
          <p className="text-green-700 mt-4 text-lg">
            Tu contraseña fue enviada a tu correo institucional.<br />
            Espera la aprobación del administrador para entrar.
          </p>
        </div>
      </div>
    </div>
  );
}