"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import FormularioLogin from "../componentes/formulario-login"
import FormularioRegistro from "../componentes/formulario-registro"
import PanelGuardia from "../componentes/panel-guardia"
import PanelAdministrador from "../componentes/panel-administrador"
import SalidaEquipos from "../componentes/salida-equipos"
import GestionGuardias from "../componentes/gestion-guardias"
import type { Usuario, Equipo, EstadisticasAdmin } from "../tipos/interfaces"
import { crearSesionGuardia, cerrarSesionGuardia, obtenerEquipos, registrarEquipo, actualizarEquipo } from "../utils/autenticacion"

type Vista = "login" | "registro" | "panel-guardia" | "panel-admin" | "salida-equipos" | "gestion-guardias"

export default function SistemaRegistroEquipos() {
  const [vistaActual, setVistaActual] = useState<Vista>("login")
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [sesionActualId, setSesionActualId] = useState<string | null>(null)
  // Estados de carga y error globales
  const [cargandoEquipos, setCargandoEquipos] = useState(false)
  const [errorEquipos, setErrorEquipos] = useState("")

  // Cargar equipos desde el backend al iniciar sesión o cambiar de vista
  useEffect(() => {
    if (usuarioActual) {
      setCargandoEquipos(true)
      setErrorEquipos("")
      obtenerEquipos()
        .then((data) => setEquipos(data))
        .catch(() => setErrorEquipos("Error al cargar equipos desde el servidor"))
        .finally(() => setCargandoEquipos(false))
    }
  }, [usuarioActual, vistaActual])

  // Exponer estados globales para los componentes (temporal)
  if (typeof window !== 'undefined') {
    (window as any).cargandoEquipos = Boolean(cargandoEquipos);
    (window as any).errorEquipos = errorEquipos;
  }

  const manejarLogin = async (usuario: Usuario) => {
    setUsuarioActual(usuario)
    if (!usuario.esAdministrador) {
      // Crear sesión de guardia en backend
      const ahora = new Date()
      const sesion = await crearSesionGuardia(
        usuario.id,
        ahora.toLocaleDateString("es-ES"),
        ahora.toLocaleTimeString("es-ES")
      )
      if (sesion && sesion._id) {
        setSesionActualId(sesion._id)
      } else {
        setSesionActualId(null)
      }
    } else {
      setSesionActualId(null)
    }
    setVistaActual(usuario.esAdministrador ? "panel-admin" : "panel-guardia")
  }

  const manejarLogout = async () => {
    if (sesionActualId) {
      const ahora = new Date()
      await cerrarSesionGuardia(
        sesionActualId,
        ahora.toLocaleDateString("es-ES"),
        ahora.toLocaleTimeString("es-ES")
      )
      setSesionActualId(null)
    }
    setUsuarioActual(null)
    setVistaActual("login")
  }

  // Registrar equipo en backend
  const manejarRegistroEquipo = async (nuevoEquipo: Omit<Equipo, "id">) => {
    setCargandoEquipos(true)
    setErrorEquipos("")
    try {
      const equipoCreado = await registrarEquipo(nuevoEquipo)
      if (equipoCreado) {
        setEquipos((prev) => [...prev, equipoCreado])
      } else {
        setErrorEquipos("No se pudo registrar el equipo")
      }
    } catch {
      setErrorEquipos("Error al registrar equipo")
    } finally {
      setCargandoEquipos(false)
    }
  }

  // Registrar salida de equipo en backend
  const manejarRegistroSalida = async (id: string) => {
    setCargandoEquipos(true)
    setErrorEquipos("")
    try {
      const ahora = new Date()
      const cambios = {
        fechaSalida: ahora.toLocaleDateString("es-ES"),
        horaSalida: ahora.toLocaleTimeString("es-ES"),
      }
      const actualizado = await actualizarEquipo(id, cambios)
      if (actualizado) {
        setEquipos((prev) => prev.map((e) => (e.id === id ? { ...e, ...cambios } : e)))
      } else {
        setErrorEquipos("No se pudo registrar la salida del equipo")
      }
    } catch {
      setErrorEquipos("Error al registrar salida")
    } finally {
      setCargandoEquipos(false)
    }
  }

  // Editar equipo (accesorios, etc) en backend
  const manejarEditarEquipo = async (id: string, cambios: Partial<Equipo>) => {
    setCargandoEquipos(true)
    setErrorEquipos("")
    try {
      const actualizado = await actualizarEquipo(id, cambios)
      if (actualizado) {
        setEquipos((prev) => prev.map((e) => (e.id === id ? { ...e, ...cambios } : e)))
      } else {
        setErrorEquipos("No se pudo editar el equipo")
      }
    } catch {
      setErrorEquipos("Error al editar equipo")
    } finally {
      setCargandoEquipos(false)
    }
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

  // Determinar el título dinámico según la vista
  let tituloPagina = "RegistroNet"
  switch (vistaActual) {
    case "login":
      tituloPagina = "RegistroNet | Iniciar sesión"
      break
    case "registro":
      tituloPagina = "RegistroNet | Registro de usuario"
      break
    case "panel-guardia":
      tituloPagina = "RegistroNet | Panel de Guardia"
      break
    case "panel-admin":
      tituloPagina = "RegistroNet | Panel de Administrador"
      break
    case "salida-equipos":
      tituloPagina = "RegistroNet | Salida de Equipos"
      break
    case "gestion-guardias":
      tituloPagina = "RegistroNet | Gestión de Guardias"
      break
    default:
      tituloPagina = "RegistroNet"
  }

  return (
    <>
      <Head>
        <title>{tituloPagina}</title>
      </Head>
      {/* Renderizado condicional según la vista actual */}
      {vistaActual === "login" && <FormularioLogin onLogin={manejarLogin} onMostrarRegistro={() => setVistaActual("registro")} />}
      {vistaActual === "registro" && <FormularioRegistro onVolverLogin={() => setVistaActual("login")} />}
      {vistaActual === "panel-guardia" && usuarioActual && (
        <PanelGuardia
          usuario={usuarioActual}
          onLogout={manejarLogout}
          equipos={equipos}
          onRegistrarEquipo={manejarRegistroEquipo}
          onRegistrarSalida={manejarRegistroSalida}
          onIrSalidaEquipos={() => setVistaActual("salida-equipos")}
        />
      )}
      {vistaActual === "panel-admin" && usuarioActual && (
        <PanelAdministrador
          usuario={usuarioActual}
          onLogout={manejarLogout}
          equipos={equipos}
          estadisticas={calcularEstadisticas()}
          onIrGestionGuardias={() => setVistaActual("gestion-guardias")}
        />
      )}
      {vistaActual === "salida-equipos" && usuarioActual && (
        <SalidaEquipos
          usuario={usuarioActual}
          equipos={equipos}
          onVolver={() => setVistaActual("panel-guardia")}
          onRegistrarSalida={manejarRegistroSalida}
          onEditarEquipo={manejarEditarEquipo}
        />
      )}
      {vistaActual === "gestion-guardias" && usuarioActual && (
        <GestionGuardias usuario={usuarioActual} onVolver={() => setVistaActual("panel-admin")} />
      )}
    </>
  )
}
