"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, AlertCircle } from "lucide-react"
import { validarCredenciales } from "../utils/autenticacion"
import type { Usuario } from "../tipos/interfaces"

interface Props {
  onLogin: (usuario: Usuario) => void
  onMostrarRegistro: () => void
}

export default function FormularioLogin({ onLogin, onMostrarRegistro }: Props) {
  const [correo, setCorreo] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError("")

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const usuario = validarCredenciales(correo, contraseña)

    if (usuario) {
      onLogin(usuario)
    } else {
      setError("Credenciales incorrectas o usuario no registrado")
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <Monitor className="w-6 h-6 text-violet-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
          <CardDescription>Sistema de Registro de Equipos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="usuario@institucion.edu"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña">Contraseña</Label>
              <Input
                id="contraseña"
                type="password"
                placeholder="••••••••"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={cargando}>
              {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button type="button" onClick={onMostrarRegistro} className="text-violet-600 hover:underline">
                Regístrate
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
