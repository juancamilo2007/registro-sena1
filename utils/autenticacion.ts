import type { Usuario, SesionGuardia, EstadisticasGuardia } from "../tipos/interfaces"

// Simulación de base de datos de usuarios
const usuarios: Usuario[] = [
  {
    id: "1",
    nombre: "Administrador Principal",
    correo: "admin@institucion.edu",
    contraseña: "admin123",
    esAdministrador: true,
  },
  {
    id: "2",
    nombre: "Guardia de Seguridad",
    correo: "guardia@institucion.edu",
    contraseña: "guardia123",
    esAdministrador: false,
  },
]

export const registrarUsuario = (
  nombre: string,
  correo: string,
  contraseña: string,
  esAdministrador = false,
): boolean => {
  // Verificar si el correo ya existe
  if (usuarios.find((u) => u.correo === correo)) {
    return false
  }

  const nuevoUsuario: Usuario = {
    id: Date.now().toString(),
    nombre,
    correo,
    contraseña,
    esAdministrador,
  }

  usuarios.push(nuevoUsuario)
  return true
}

export const validarCredenciales = (correo: string, contraseña: string): Usuario | null => {
  const usuario = usuarios.find((u) => u.correo === correo && u.contraseña === contraseña)
  return usuario || null
}

export const obtenerUsuarios = (): Usuario[] => {
  return usuarios
}

// Simulación de base de datos de sesiones
const sesionesGuardias: SesionGuardia[] = []

export const iniciarSesionGuardia = (usuario: Usuario): string => {
  const ahora = new Date()
  const nuevaSesion: SesionGuardia = {
    id: Date.now().toString(),
    guardiaId: usuario.id,
    guardiaNombre: usuario.nombre,
    fechaIngreso: ahora.toLocaleDateString("es-ES"),
    horaIngreso: ahora.toLocaleTimeString("es-ES"),
    equiposRegistrados: [],
  }

  sesionesGuardias.push(nuevaSesion)
  return nuevaSesion.id
}

export const cerrarSesionGuardia = (sesionId: string) => {
  const ahora = new Date()
  const sesion = sesionesGuardias.find((s) => s.id === sesionId)
  if (sesion && !sesion.fechaSalida) {
    sesion.fechaSalida = ahora.toLocaleDateString("es-ES")
    sesion.horaSalida = ahora.toLocaleTimeString("es-ES")
  }
}

export const agregarEquipoASesion = (sesionId: string, equipoId: string) => {
  const sesion = sesionesGuardias.find((s) => s.id === sesionId)
  if (sesion) {
    sesion.equiposRegistrados.push(equipoId)
  }
}

export const obtenerSesionesGuardias = (): SesionGuardia[] => {
  return sesionesGuardias
}

export const obtenerEstadisticasGuardias = (): EstadisticasGuardia[] => {
  const hoy = new Date().toLocaleDateString("es-ES")
  const guardias = usuarios.filter((u) => !u.esAdministrador)

  return guardias.map((guardia) => {
    const sesionesGuardia = sesionesGuardias.filter((s) => s.guardiaId === guardia.id)
    const sesionesHoy = sesionesGuardia.filter((s) => s.fechaIngreso === hoy)
    const equiposHoy = sesionesHoy.reduce((total, sesion) => total + sesion.equiposRegistrados.length, 0)
    const ultimaSesion = sesionesGuardia[sesionesGuardia.length - 1]
    const sesionActiva = ultimaSesion && !ultimaSesion.fechaSalida

    return {
      guardiaNombre: guardia.nombre,
      totalSesiones: sesionesGuardia.length,
      equiposRegistradosHoy: equiposHoy,
      ultimaConexion: ultimaSesion ? `${ultimaSesion.fechaIngreso} ${ultimaSesion.horaIngreso}` : "Nunca",
      sesionActiva: !!sesionActiva,
    }
  })
}

// Función para obtener equipos del día actual
export const esHoy = (fecha: string): boolean => {
  const hoy = new Date().toLocaleDateString("es-ES")
  return fecha === hoy
}
