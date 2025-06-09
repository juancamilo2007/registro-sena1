import type { Usuario, SesionGuardia, EstadisticasGuardia, Equipo } from "../tipos/interfaces"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Registro real de usuario
export const registrarUsuario = async (
  nombre: string,
  correo: string,
  contraseña: string,
  esAdministrador = false,
): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/usuarios/registrar`, {
      nombre,
      correo,
      contraseña,
      esAdministrador,
    })
    return true
  } catch (error: any) {
    return false
  }
}

// Login real de usuario
export const validarCredenciales = async (
  correo: string,
  contraseña: string,
): Promise<Usuario | null> => {
  try {
    const res = await axios.post(`${API_URL}/usuarios/login`, { correo, contraseña })
    return res.data as Usuario
  } catch (error: any) {
    return null
  }
}

// Sesiones de guardia
export const crearSesionGuardia = async (guardiaId: string, fechaIngreso: string, horaIngreso: string): Promise<any> => {
  try {
    const res = await axios.post(`${API_URL}/sesiones-guardia`, {
      guardia: guardiaId,
      fechaIngreso,
      horaIngreso,
      equiposRegistrados: [],
    })
    return res.data
  } catch (error: any) {
    return null
  }
}

export const cerrarSesionGuardia = async (sesionId: string, fechaSalida: string, horaSalida: string): Promise<any> => {
  try {
    const res = await axios.put(`${API_URL}/sesiones-guardia/${sesionId}/cerrar`, {
      fechaSalida,
      horaSalida,
    })
    return res.data
  } catch (error: any) {
    return null
  }
}

export const obtenerSesionesGuardias = async (): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_URL}/sesiones-guardia`)
    return res.data
  } catch (error: any) {
    return []
  }
}

// Movimientos de equipo
export const registrarMovimientoEquipo = async (equipoId: string, tipoMovimiento: string, fecha: string, hora: string, guardiaId: string): Promise<any> => {
  try {
    const res = await axios.post(`${API_URL}/movimientos-equipo`, {
      equipo: equipoId,
      tipoMovimiento,
      fecha,
      hora,
      guardia: guardiaId,
    })
    return res.data
  } catch (error: any) {
    return null
  }
}

export const obtenerMovimientosEquipo = async (): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_URL}/movimientos-equipo`)
    return res.data
  } catch (error: any) {
    return []
  }
}

// Estadísticas
export const crearEstadistica = async (estadistica: any): Promise<any> => {
  try {
    const res = await axios.post(`${API_URL}/estadisticas`, estadistica)
    return res.data
  } catch (error: any) {
    return null
  }
}

export const obtenerEstadisticas = async (): Promise<any[]> => {
  try {
    const res = await axios.get(`${API_URL}/estadisticas`)
    return res.data
  } catch (error: any) {
    return []
  }
}

export const obtenerEstadisticaPorFecha = async (fecha: string): Promise<any> => {
  try {
    const res = await axios.get(`${API_URL}/estadisticas/${fecha}`)
    return res.data
  } catch (error: any) {
    return null
  }
}

// Función para obtener equipos del día actual
export const esHoy = (fecha: string): boolean => {
  const hoy = new Date().toLocaleDateString("es-ES")
  return fecha === hoy
}

// Obtener todos los equipos
export const obtenerEquipos = async () => {
  try {
    const res = await axios.get(`${API_URL}/equipos`)
    return res.data
  } catch (error) {
    return []
  }
}

// Registrar un nuevo equipo
export const registrarEquipo = async (equipo: Omit<Equipo, "id">) => {
  try {
    const res = await axios.post(`${API_URL}/equipos`, equipo)
    return res.data
  } catch (error) {
    return null
  }
}

// Actualizar equipo (por ejemplo, para registrar salida o editar accesorios)
export const actualizarEquipo = async (id: string, cambios: Partial<Equipo>) => {
  try {
    const res = await axios.put(`${API_URL}/equipos/${id}`, cambios)
    return res.data
  } catch (error) {
    return null
  }
}
