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
import { LogOut, Monitor, User, FileText, Calendar } from "lucide-react"

interface Equipment {
  id: string
  studentName: string
  studentId: string
  equipmentType: string
  brand: string
  hasCharger: boolean
  hasMouse: boolean
  entryDate: string
  exitDate?: string
}

export default function EquipmentRegistry() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [equipments, setEquipments] = useState<Equipment[]>([])

  // Form states
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [equipmentType, setEquipmentType] = useState("")
  const [brand, setBrand] = useState("")
  const [hasCharger, setHasCharger] = useState(false)
  const [hasMouse, setHasMouse] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation - in real app, this would connect to authentication service
    if (email && password) {
      setIsLoggedIn(true)
    }
  }

  const handleRegisterEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (studentName && studentId && equipmentType && brand) {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        studentName,
        studentId,
        equipmentType,
        brand,
        hasCharger,
        hasMouse,
        entryDate: new Date().toLocaleString("es-ES"),
      }
      setEquipments([...equipments, newEquipment])

      // Reset form
      setStudentName("")
      setStudentId("")
      setEquipmentType("")
      setBrand("")
      setHasCharger(false)
      setHasMouse(false)
    }
  }

  const handleRegisterExit = (id: string) => {
    setEquipments(
      equipments.map((equipment) =>
        equipment.id === id ? { ...equipment, exitDate: new Date().toLocaleString("es-ES") } : equipment,
      ),
    )
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail("")
    setPassword("")
    setEquipments([])
  }

  if (!isLoggedIn) {
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="guardia@institucion.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                Iniciar sesión
              </Button>
              <p className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <a href="#" className="text-violet-600 hover:underline">
                  Regístrate
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-800">Registro de Equipos</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-violet-600" />
              <span>Registrar Entrada de Equipo</span>
            </CardTitle>
            <CardDescription>Complete la información del estudiante y su equipo tecnológico</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterEntry} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Nombre del estudiante</Label>
                <Input
                  id="studentName"
                  placeholder="Nombre completo"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Documento del estudiante</Label>
                <Input
                  id="studentId"
                  placeholder="Número de documento"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentType">Tipo de equipo</Label>
                <Select value={equipmentType} onValueChange={setEquipmentType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Portátil</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="desktop">Computador de escritorio</SelectItem>
                    <SelectItem value="smartphone">Teléfono inteligente</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca del equipo</Label>
                <Input
                  id="brand"
                  placeholder="Ej: HP, Dell, Apple, Samsung"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCharger"
                  checked={hasCharger}
                  onCheckedChange={(checked) => setHasCharger(checked as boolean)}
                />
                <Label htmlFor="hasCharger">¿Trae cargador?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasMouse"
                  checked={hasMouse}
                  onCheckedChange={(checked) => setHasMouse(checked as boolean)}
                />
                <Label htmlFor="hasMouse">¿Trae mouse?</Label>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                  Registrar entrada
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <span>Equipos Registrados</span>
            </CardTitle>
            <CardDescription>Lista de todos los equipos registrados hoy</CardDescription>
          </CardHeader>
          <CardContent>
            {equipments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay equipos registrados aún</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Accesorios</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Salida</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipments.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-medium">{equipment.studentName}</TableCell>
                        <TableCell>{equipment.studentId}</TableCell>
                        <TableCell className="capitalize">{equipment.equipmentType}</TableCell>
                        <TableCell>{equipment.brand}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 text-xs">
                            {equipment.hasCharger && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Cargador</span>
                            )}
                            {equipment.hasMouse && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Mouse</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{equipment.entryDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {equipment.exitDate ? (
                            <div className="flex items-center space-x-1 text-sm text-green-600">
                              <Calendar className="w-4 h-4" />
                              <span>{equipment.exitDate}</span>
                            </div>
                          ) : (
                            <span className="text-orange-600 text-sm">En la institución</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {!equipment.exitDate && (
                            <Button
                              onClick={() => handleRegisterExit(equipment.id)}
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
