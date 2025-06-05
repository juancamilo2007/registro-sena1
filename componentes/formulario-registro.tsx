"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import { registrarUsuario } from "../utils/autenticacion"

interface Props {
  onVolverLogin: () => void
}

export default function FormularioRegistro({ onVolverLogin }: Props) {
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [confirmarContraseña, setConfirmarContraseña] = useState("")
  const [error, setError] = useState("")
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError("")
    setExito(false)

    if (contraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden")
      setCargando(false)
      return
    }

    if (contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setCargando(false)
      return
    }

    // Simular delay de registro
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const registroExitoso = registrarUsuario(nombre, correo, contraseña)

    if (registroExitoso) {
      setExito(true)
      setTimeout(() => {
        onVolverLogin()
      }, 2000)
    } else {
      setError("El correo ya está registrado")
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-violet-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Registrarse</CardTitle>
          <CardDescription>Crear nueva cuenta de guardia</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarRegistro} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {exito && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ¡Registro exitoso! Redirigiendo al login...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                placeholder="Nombre del guardia"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="guardia@institucion.edu"
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
                placeholder="Mínimo 6 caracteres"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarContraseña">Confirmar contraseña</Label>
              <Input
                id="confirmarContraseña"
                type="password"
                placeholder="Repetir contraseña"
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={cargando || exito}>
              {cargando ? "Registrando..." : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={onVolverLogin} className="text-violet-600 hover:underline">
                Iniciar sesión
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
