"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, Edit, CheckCircle, AlertCircle } from "lucide-react"
import type { Usuario, Equipo } from "../tipos/interfaces"

interface Props {
  usuario: Usuario
  equipos: Equipo[]
  onVolver: () => void
  onRegistrarSalida: (id: string) => void
  onEditarEquipo: (id: string, cambios: Partial<Equipo>) => void
}

export default function SalidaEquipos({ usuario, equipos, onVolver, onRegistrarSalida, onEditarEquipo }: Props) {
  const [busquedaDocumento, setBusquedaDocumento] = useState("")
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)

  // Estados para edición
  const [traeCargador, setTraeCargador] = useState(false)
  const [traeMouse, setTraeMouse] = useState(false)
  const [traeTeclado, setTraeTeclado] = useState(false)

  const equiposEnInstitucion = equipos.filter((equipo) => !equipo.fechaSalida)

  const equipoEncontrado = equiposEnInstitucion.find((equipo) => equipo.documentoEstudiante === busquedaDocumento)

  const buscarEquipo = () => {
    if (equipoEncontrado) {
      setEquipoSeleccionado(equipoEncontrado)
      setTraeCargador(equipoEncontrado.traeCargador)
      setTraeMouse(equipoEncontrado.traeMouse)
      setTraeTeclado(equipoEncontrado.traeTeclado)
      setModoEdicion(false)
    } else {
      setEquipoSeleccionado(null)
    }
  }

  const manejarEdicion = () => {
    if (equipoSeleccionado) {
      onEditarEquipo(equipoSeleccionado.id, {
        traeCargador,
        traeMouse,
        traeTeclado,
      })
      setModoEdicion(false)
      // Actualizar el equipo seleccionado con los nuevos valores
      setEquipoSeleccionado({
        ...equipoSeleccionado,
        traeCargador,
        traeMouse,
        traeTeclado,
      })
    }
  }

  const manejarSalida = () => {
    if (equipoSeleccionado) {
      onRegistrarSalida(equipoSeleccionado.id)
      setEquipoSeleccionado(null)
      setBusquedaDocumento("")
    }
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
              <div>
                <h1 className="text-xl font-bold text-gray-800">Salida de Equipos</h1>
                <p className="text-sm text-gray-600">Buscar y registrar salida de equipos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Búsqueda */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-violet-600" />
              <span>Buscar Equipo por Documento</span>
            </CardTitle>
            <CardDescription>Ingrese el documento del estudiante para buscar su equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="documento">Documento del estudiante</Label>
                <Input
                  id="documento"
                  placeholder="Número de documento"
                  value={busquedaDocumento}
                  onChange={(e) => setBusquedaDocumento(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={buscarEquipo} className="bg-violet-600 hover:bg-violet-700">
                  Buscar
                </Button>
              </div>
            </div>

            {busquedaDocumento && !equipoEncontrado && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se encontró ningún equipo en la institución con el documento: {busquedaDocumento}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Información del Equipo Encontrado */}
        {equipoSeleccionado && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Equipo Encontrado</span>
                <div className="flex space-x-2">
                  {!modoEdicion ? (
                    <Button
                      onClick={() => setModoEdicion(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={manejarEdicion} size="sm" className="bg-green-600 hover:bg-green-700">
                        Guardar
                      </Button>
                      <Button onClick={() => setModoEdicion(false)} variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Estudiante</Label>
                  <p className="font-medium">{equipoSeleccionado.nombreEstudiante}</p>
                </div>
                <div>
                  <Label>Documento</Label>
                  <p className="font-medium">{equipoSeleccionado.documentoEstudiante}</p>
                </div>
                <div>
                  <Label>Marca</Label>
                  <p className="font-medium">{equipoSeleccionado.marca}</p>
                </div>
                <div>
                  <Label>Fecha de Entrada</Label>
                  <p className="font-medium">
                    {equipoSeleccionado.fechaEntrada} - {equipoSeleccionado.horaEntrada}
                  </p>
                </div>
                <div>
                  <Label>Registrado por</Label>
                  <p className="font-medium">{equipoSeleccionado.guardiaRegistro}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-base font-medium mb-3 block">Accesorios</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editCargador"
                      checked={traeCargador}
                      onCheckedChange={(checked) => setTraeCargador(checked as boolean)}
                      disabled={!modoEdicion}
                    />
                    <Label htmlFor="editCargador">¿Trae cargador?</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editMouse"
                      checked={traeMouse}
                      onCheckedChange={(checked) => setTraeMouse(checked as boolean)}
                      disabled={!modoEdicion}
                    />
                    <Label htmlFor="editMouse">¿Trae mouse?</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editTeclado"
                      checked={traeTeclado}
                      onCheckedChange={(checked) => setTraeTeclado(checked as boolean)}
                      disabled={!modoEdicion}
                    />
                    <Label htmlFor="editTeclado">¿Trae teclado?</Label>
                  </div>
                </div>
              </div>

              {!modoEdicion && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={manejarSalida}
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Registrar Salida del Equipo</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lista de Equipos en Institución */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Equipos Actualmente en la Institución</CardTitle>
            <CardDescription>Total: {equiposEnInstitucion.length} equipos</CardDescription>
          </CardHeader>
          <CardContent>
            {equiposEnInstitucion.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay equipos en la institución</p>
            ) : (
              <div className="space-y-2">
                {equiposEnInstitucion.map((equipo) => (
                  <div
                    key={equipo.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{equipo.nombreEstudiante}</p>
                      <p className="text-sm text-gray-600">
                        Doc: {equipo.documentoEstudiante} | {equipo.marca}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setBusquedaDocumento(equipo.documentoEstudiante)
                        setEquipoSeleccionado(equipo)
                        setTraeCargador(equipo.traeCargador)
                        setTraeMouse(equipo.traeMouse)
                        setTraeTeclado(equipo.traeTeclado)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Seleccionar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
