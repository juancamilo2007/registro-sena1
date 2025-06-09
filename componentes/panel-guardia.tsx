"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LogOut, Monitor, User, FileText, Search, ArrowRight } from "lucide-react"
import type { Usuario, Equipo } from "../tipos/interfaces"

interface Props {
  usuario: Usuario
  onLogout: () => void
  equipos: Equipo[]
  onRegistrarEquipo: (equipo: Omit<Equipo, "id">) => void
  onRegistrarSalida: (id: string) => void
  onIrSalidaEquipos: () => void
}

export default function PanelGuardia({
  usuario,
  onLogout,
  equipos,
  onRegistrarEquipo,
  onRegistrarSalida,
  onIrSalidaEquipos,
}: Props) {
  // Estados del formulario
  const [nombreEstudiante, setNombreEstudiante] = useState("")
  const [documentoEstudiante, setDocumentoEstudiante] = useState("")
  const [tipoEquipo, setTipoEquipo] = useState("")
  const [marca, setMarca] = useState("")
  const [traeCargador, setTraeCargador] = useState(false)
  const [traeMouse, setTraeMouse] = useState(false)
  const [traeTeclado, setTraeTeclado] = useState(false)
  const [busqueda, setBusqueda] = useState("")

  const manejarRegistroEntrada = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombreEstudiante && documentoEstudiante && tipoEquipo && marca) {
      const ahora = new Date()
      const nuevoEquipo: Omit<Equipo, "id"> = {
        nombreEstudiante,
        documentoEstudiante,
        tipoEquipo,
        marca,
        traeCargador,
        traeMouse,
        traeTeclado,
        fechaEntrada: ahora.toLocaleDateString("es-ES"),
        horaEntrada: ahora.toLocaleTimeString("es-ES"),
        guardiaRegistro: usuario.nombre,
      }

      onRegistrarEquipo(nuevoEquipo)

      // Limpiar formulario
      setNombreEstudiante("")
      setDocumentoEstudiante("")
      setTipoEquipo("")
      setMarca("")
      setTraeCargador(false)
      setTraeMouse(false)
      setTraeTeclado(false)
    }
  }

  const equiposFiltrados = equipos.filter(
    (equipo) =>
      equipo.documentoEstudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
      equipo.nombreEstudiante.toLowerCase().includes(busqueda.toLowerCase()),
  )

  // Mostrar estados de carga y error
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Panel de Guardia</h1>
                <p className="text-sm text-gray-600">Bienvenido, {usuario.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={onIrSalidaEquipos} variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4" />
                <span>Salida de Equipos</span>
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
        {/* Mensajes de carga y error */}
        {typeof window !== 'undefined' && (window as any).cargandoEquipos && (
          <div className="text-center text-violet-600 font-semibold">Cargando equipos...</div>
        )}
        {typeof window !== 'undefined' && (window as any).errorEquipos && (
          <div className="text-center text-red-600 font-semibold">{(window as any).errorEquipos}</div>
        )}

        {/* Formulario de Registro */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-violet-600" />
              <span>Registrar Entrada de Equipo</span>
            </CardTitle>
            <CardDescription>Complete la información del estudiante y su equipo tecnológico</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={manejarRegistroEntrada} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreEstudiante">Nombre del estudiante</Label>
                <Input
                  id="nombreEstudiante"
                  placeholder="Nombre completo"
                  value={nombreEstudiante}
                  onChange={(e) => setNombreEstudiante(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentoEstudiante">Documento del estudiante</Label>
                <Input
                  id="documentoEstudiante"
                  placeholder="Número de documento"
                  value={documentoEstudiante}
                  onChange={(e) => setDocumentoEstudiante(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoEquipo">Tipo de equipo</Label>
                <Select value={tipoEquipo} onValueChange={setTipoEquipo} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portatil">Portátil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca">Marca del equipo</Label>
                <Input
                  id="marca"
                  placeholder="Ej: HP, Dell, Lenovo, Asus"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="traeCargador"
                  checked={traeCargador}
                  onCheckedChange={(checked) => setTraeCargador(checked as boolean)}
                />
                <Label htmlFor="traeCargador">¿Trae cargador?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="traeMouse"
                  checked={traeMouse}
                  onCheckedChange={(checked) => setTraeMouse(checked as boolean)}
                />
                <Label htmlFor="traeMouse">¿Trae mouse?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="traeTeclado"
                  checked={traeTeclado}
                  onCheckedChange={(checked) => setTraeTeclado(checked as boolean)}
                />
                <Label htmlFor="traeTeclado">¿Trae teclado?</Label>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                  Registrar entrada
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabla de Equipos */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <span>Equipos Registrados</span>
            </CardTitle>
            <CardDescription>Lista de todos los equipos registrados</CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar por documento o nombre del estudiante..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {equiposFiltrados.length === 0 ? (
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
                      <TableHead>Fecha/Hora Entrada</TableHead>
                      <TableHead>Guardia</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equiposFiltrados.map((equipo) => (
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
                        <TableCell className="text-sm">{equipo.guardiaRegistro}</TableCell>
                        <TableCell>
                          {equipo.fechaSalida ? (
                            <div className="text-sm text-green-600">
                              <div>{equipo.fechaSalida}</div>
                              <div>{equipo.horaSalida}</div>
                            </div>
                          ) : (
                            <span className="text-orange-600 text-sm">En institución</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {!equipo.fechaSalida && (
                            <Button
                              onClick={() => onRegistrarSalida(equipo.id)}
                              size="sm"
                              variant="outline"
                              className="text-violet-600 border-violet-600 hover:bg-violet-50"
                            >
                              Registrar salida
                            </Button>
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
