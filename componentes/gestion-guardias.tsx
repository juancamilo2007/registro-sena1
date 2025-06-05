"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, Monitor, Activity } from "lucide-react"
import type { Usuario, SesionGuardia } from "../tipos/interfaces"
import { obtenerSesionesGuardias, obtenerEstadisticasGuardias } from "../utils/autenticacion"

interface Props {
  usuario: Usuario
  onVolver: () => void
}

export default function GestionGuardias({ usuario, onVolver }: Props) {
  const sesiones = obtenerSesionesGuardias()
  const estadisticas = obtenerEstadisticasGuardias()

  // Filtrar sesiones del día actual
  const hoy = new Date().toLocaleDateString("es-ES")
  const sesionesHoy = sesiones.filter((sesion) => sesion.fechaIngreso === hoy)

  // Ordenar sesiones por hora de ingreso (más reciente primero)
  const sesionesOrdenadas = [...sesiones].sort((a, b) => {
    const fechaA = new Date(`${a.fechaIngreso} ${a.horaIngreso}`)
    const fechaB = new Date(`${b.fechaIngreso} ${b.horaIngreso}`)
    return fechaB.getTime() - fechaA.getTime()
  })

  const calcularTiempoSesion = (sesion: SesionGuardia): string => {
    if (!sesion.fechaSalida || !sesion.horaSalida) {
      return "Sesión activa"
    }

    const inicio = new Date(`${sesion.fechaIngreso} ${sesion.horaIngreso}`)
    const fin = new Date(`${sesion.fechaSalida} ${sesion.horaSalida}`)
    const diferencia = fin.getTime() - inicio.getTime()

    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))

    return `${horas}h ${minutos}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button onClick={onVolver} variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Button>
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Gestión de Guardias</h1>
                <p className="text-sm text-gray-600">Control de sesiones y actividad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Estadísticas de Guardias */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-violet-600" />
              <span>Resumen de Guardias - Hoy</span>
            </CardTitle>
            <CardDescription>Estado actual de todos los guardias registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estadisticas.map((stat, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{stat.guardiaNombre}</h3>
                    <Badge variant={stat.sesionActiva ? "default" : "secondary"}>
                      {stat.sesionActiva ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4" />
                      <span>{stat.equiposRegistradosHoy} equipos hoy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Última: {stat.ultimaConexion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sesiones de Hoy */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-violet-600" />
              <span>Sesiones de Hoy ({sesionesHoy.length})</span>
            </CardTitle>
            <CardDescription>Actividad de guardias en el día actual</CardDescription>
          </CardHeader>
          <CardContent>
            {sesionesHoy.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay sesiones registradas hoy</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guardia</TableHead>
                      <TableHead>Hora Ingreso</TableHead>
                      <TableHead>Hora Salida</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Equipos Registrados</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sesionesHoy.map((sesion) => (
                      <TableRow key={sesion.id}>
                        <TableCell className="font-medium">{sesion.guardiaNombre}</TableCell>
                        <TableCell>{sesion.horaIngreso}</TableCell>
                        <TableCell>
                          {sesion.horaSalida ? (
                            <span className="text-green-600">{sesion.horaSalida}</span>
                          ) : (
                            <span className="text-orange-600">-</span>
                          )}
                        </TableCell>
                        <TableCell>{calcularTiempoSesion(sesion)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sesion.equiposRegistrados.length} equipos</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sesion.fechaSalida ? "secondary" : "default"}>
                            {sesion.fechaSalida ? "Finalizada" : "Activa"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historial Completo de Sesiones */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-violet-600" />
              <span>Historial Completo de Sesiones</span>
            </CardTitle>
            <CardDescription>Todas las sesiones registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {sesionesOrdenadas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay sesiones registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guardia</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora Ingreso</TableHead>
                      <TableHead>Hora Salida</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Equipos Registrados</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sesionesOrdenadas.map((sesion) => (
                      <TableRow key={sesion.id}>
                        <TableCell className="font-medium">{sesion.guardiaNombre}</TableCell>
                        <TableCell>{sesion.fechaIngreso}</TableCell>
                        <TableCell>{sesion.horaIngreso}</TableCell>
                        <TableCell>
                          {sesion.horaSalida ? (
                            <span className="text-green-600">{sesion.horaSalida}</span>
                          ) : (
                            <span className="text-orange-600">-</span>
                          )}
                        </TableCell>
                        <TableCell>{calcularTiempoSesion(sesion)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sesion.equiposRegistrados.length} equipos</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sesion.fechaSalida ? "secondary" : "default"}>
                            {sesion.fechaSalida ? "Finalizada" : "Activa"}
                          </Badge>
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
