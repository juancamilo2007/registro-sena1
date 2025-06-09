"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Shield, BarChart3, Users, Monitor, UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import type { Usuario, Equipo, EstadisticasAdmin } from "../tipos/interfaces"
import { registrarUsuario, esHoy } from "../utils/autenticacion"

interface Props {
  usuario: Usuario
  onLogout: () => void
  equipos: Equipo[]
  estadisticas: EstadisticasAdmin
  onIrGestionGuardias: () => void
}

export default function PanelAdministrador({ usuario, onLogout, equipos, estadisticas, onIrGestionGuardias }: Props) {
  const [nombreAdmin, setNombreAdmin] = useState("")
  const [correoAdmin, setCorreoAdmin] = useState("")
  const [contraseñaAdmin, setContraseñaAdmin] = useState("")
  const [error, setError] = useState("")
  const [exito, setExito] = useState("")

  const manejarRegistroAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setExito("")

    if (contraseñaAdmin.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      const registroExitoso = await registrarUsuario(nombreAdmin, correoAdmin, contraseñaAdmin, true)
      if (registroExitoso) {
        setExito("Administrador registrado exitosamente")
        setNombreAdmin("")
        setCorreoAdmin("")
        setContraseñaAdmin("")
      } else {
        setError("El correo ya está registrado")
      }
    } catch (err) {
      setError("Error al registrar administrador")
    }
  }

  // Filtrar equipos solo del día actual
  const equiposHoy = equipos.filter((equipo) => esHoy(equipo.fechaEntrada))
  const equiposEnInstitucionHoy = equiposHoy.filter((equipo) => !equipo.fechaSalida)
  const equiposSalieronHoy = equiposHoy.filter((equipo) => equipo.fechaSalida)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Panel de Administrador</h1>
                <p className="text-sm text-gray-600">Bienvenido, {usuario.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={onIrGestionGuardias} variant="outline" size="sm" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Gestión de Guardias</span>
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Estadísticas - Solo del día actual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipos Hoy</CardTitle>
              <Monitor className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equiposHoy.length}</div>
              <p className="text-xs text-muted-foreground">Registrados hoy</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Institución</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{equiposEnInstitucionHoy.length}</div>
              <p className="text-xs text-muted-foreground">Actualmente</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salieron Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{equiposSalieronHoy.length}</div>
              <p className="text-xs text-muted-foreground">Devueltos hoy</p>
            </CardContent>
          </Card>
        </div>

        {/* Registrar Nuevo Administrador */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-violet-600" />
              <span>Registrar Nuevo Administrador</span>
            </CardTitle>
            <CardDescription>Solo los administradores pueden crear nuevas cuentas de administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={manejarRegistroAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {error && (
                <div className="md:col-span-2">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {exito && (
                <div className="md:col-span-2">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{exito}</AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombreAdmin">Nombre completo</Label>
                <Input
                  id="nombreAdmin"
                  placeholder="Nombre del administrador"
                  value={nombreAdmin}
                  onChange={(e) => setNombreAdmin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correoAdmin">Correo electrónico</Label>
                <Input
                  id="correoAdmin"
                  type="email"
                  placeholder="admin@institucion.edu"
                  value={correoAdmin}
                  onChange={(e) => setCorreoAdmin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contraseñaAdmin">Contraseña</Label>
                <Input
                  id="contraseñaAdmin"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={contraseñaAdmin}
                  onChange={(e) => setContraseñaAdmin(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-end">
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                  Registrar Administrador
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Mensajes de carga y error globales */}
        {typeof window !== 'undefined' && (window as any).cargandoEquipos && (
          <div className="text-center text-violet-600 font-semibold">Cargando equipos...</div>
        )}
        {typeof window !== 'undefined' && (window as any).errorEquipos && (
          <div className="text-center text-red-600 font-semibold">{(window as any).errorEquipos}</div>
        )}

        {/* Tabla Detallada de Equipos */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-violet-600" />
              <span>Registro Detallado de Equipos</span>
            </CardTitle>
            <CardDescription>Historial completo con información de guardias</CardDescription>
          </CardHeader>
          <CardContent>
            {equipos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay equipos registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Accesorios</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead>Guardia Registro</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipos.map((equipo) => (
                      <TableRow key={equipo.id}>
                        <TableCell className="font-medium">{equipo.nombreEstudiante}</TableCell>
                        <TableCell>{equipo.documentoEstudiante}</TableCell>
                        <TableCell>{equipo.marca}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 text-xs">
                            {equipo.traeCargador && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Cargador</span>
                            )}
                            {equipo.traeMouse && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Mouse</span>
                            )}
                            {equipo.traeTeclado && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Teclado</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{equipo.fechaEntrada}</div>
                            <div className="text-gray-500">{equipo.horaEntrada}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {equipo.fechaSalida ? (
                            <div className="text-sm text-green-600">
                              <div>{equipo.fechaSalida}</div>
                              <div>{equipo.horaSalida}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{equipo.guardiaRegistro}</TableCell>
                        <TableCell>
                          {equipo.fechaSalida ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Devuelto
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              En institución
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
