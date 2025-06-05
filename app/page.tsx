"use client"

import { useState } from "react"
import FormularioLogin from "../componentes/formulario-login"
import FormularioRegistro from "../componentes/formulario-registro"
import PanelGuardia from "../componentes/panel-guardia"
import PanelAdministrador from "../componentes/panel-administrador"
import SalidaEquipos from "../componentes/salida-equipos"
import GestionGuardias from "../componentes/gestion-guardias"
import type { Usuario, Equipo, EstadisticasAdmin } from "../tipos/interfaces"
import { iniciarSesionGuardia, cerrarSesionGuardia, agregarEquipoASesion } from "../utils/autenticacion"

type Vista = "login" | "registro" | "panel-guardia" | "panel-admin" | "salida-equipos" | "gestion-guardias"

export default function SistemaRegistroEquipos() {
  const [vistaActual, setVistaActual] = useState<Vista>("login")
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [sesionActualId, setSesionActualId] = useState<string | null>(null)

  const manejarLogin = (usuario: Usuario) => {
    setUsuarioActual(usuario)

    // Iniciar sesión de guardia si no es administrador
    if (!usuario.esAdministrador) {
      const sesionId = iniciarSesionGuardia(usuario)
      setSesionActualId(sesionId)
    }

    if (usuario.esAdministrador) {
      setVistaActual("panel-admin")
    } else {
      setVistaActual("panel-guardia")
    }
  }

  const manejarLogout = () => {
    // Cerrar sesión de guardia si existe
    if (sesionActualId) {
      cerrarSesionGuardia(sesionActualId)
      setSesionActualId(null)
    }

    setUsuarioActual(null)
    setVistaActual("login")
  }

  const manejarRegistroEquipo = (nuevoEquipo: Omit<Equipo, "id">) => {
    const equipoConId: Equipo = {
      ...nuevoEquipo,
      id: Date.now().toString(),
    }
    setEquipos([...equipos, equipoConId])

    // Agregar equipo a la sesión actual del guardia
    if (sesionActualId) {
      agregarEquipoASesion(sesionActualId, equipoConId.id)
    }
  }

  const manejarRegistroSalida = (id: string) => {
    const ahora = new Date()
    setEquipos((equiposPrevios) =>
      equiposPrevios.map((equipo) =>
        equipo.id === id
          ? {
              ...equipo,
              fechaSalida: ahora.toLocaleDateString("es-ES"),
              horaSalida: ahora.toLocaleTimeString("es-ES"),
            }
          : equipo,
      ),
    )
  }

  const manejarEditarEquipo = (id: string, cambios: Partial<Equipo>) => {
    setEquipos((equiposPrevios) =>
      equiposPrevios.map((equipo) =>
        equipo.id === id ? { ...equipo, ...cambios } : equipo,
      ),
    )
  }

  const calcularEstadisticas = (): EstadisticasAdmin => {
    const hoy = new Date().toLocaleDateString("es-ES")
    const equiposHoy = equipos.filter((e) => e.fechaEntrada === hoy)
    const equiposEnInstitucion = equiposHoy.filter((e) => !e.fechaSalida).length
    const equiposSalieron = equiposHoy.filter((e) => e.fechaSalida).length

    return {
      totalEquipos: equiposHoy.length,
      equiposEnInstitucion,
      equiposSalieron,
    }
  }

  // Renderizado condicional según la vista actual
  switch (vistaActual) {
    case "login":
      return <FormularioLogin onLogin={manejarLogin} onMostrarRegistro={() => setVistaActual("registro")} />

    case "registro":
      return <FormularioRegistro onVolverLogin={() => setVistaActual("login")} />

    case "panel-guardia":
      return usuarioActual ? (
        <PanelGuardia
          usuario={usuarioActual}
          onLogout={manejarLogout}
          equipos={equipos}
          onRegistrarEquipo={manejarRegistroEquipo}
          onRegistrarSalida={manejarRegistroSalida}
          onIrSalidaEquipos={() => setVistaActual("salida-equipos")}
        />
      ) : null

    case "panel-admin":
      return usuarioActual ? (
        <PanelAdministrador
          usuario={usuarioActual}
          onLogout={manejarLogout}
          equipos={equipos}
          estadisticas={calcularEstadisticas()}
          onIrGestionGuardias={() => setVistaActual("gestion-guardias")}
        />
      ) : null

    case "salida-equipos":
      return usuarioActual ? (
        <SalidaEquipos
          usuario={usuarioActual}
          equipos={equipos}
          onVolver={() => setVistaActual("panel-guardia")}
          onRegistrarSalida={manejarRegistroSalida}
          onEditarEquipo={manejarEditarEquipo}
        />
      ) : null

    case "gestion-guardias":
      return usuarioActual ? (
        <GestionGuardias usuario={usuarioActual} onVolver={() => setVistaActual("panel-admin")} />
      ) : null

    default:
      return null
  }
}
