export interface Usuario {
  id: string
  nombre: string
  correo: string
  contraseña: string
  esAdministrador: boolean
}

export interface Equipo {
  id: string
  nombreEstudiante: string
  documentoEstudiante: string
  tipoEquipo: string
  marca: string
  traeCargador: boolean
  traeMouse: boolean
  traeTeclado: boolean
  fechaEntrada: string
  horaEntrada: string
  fechaSalida?: string
  horaSalida?: string
  guardiaRegistro: string
}

export interface EstadisticasAdmin {
  totalEquipos: number
  equiposEnInstitucion: number
  equiposSalieron: number
}

export interface SesionGuardia {
  id: string
  guardiaId: string
  guardiaNombre: string
  fechaIngreso: string
  horaIngreso: string
  fechaSalida?: string
  horaSalida?: string
  equiposRegistrados: string[] // IDs de equipos registrados en esta sesión
}

export interface EstadisticasGuardia {
  guardiaNombre: string
  totalSesiones: number
  equiposRegistradosHoy: number
  ultimaConexion: string
  sesionActiva: boolean
}
