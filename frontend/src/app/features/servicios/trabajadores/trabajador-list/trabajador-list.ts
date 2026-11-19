import { Component, DestroyRef, OnInit, computed, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, finalize, of, switchMap } from "rxjs";
import { ClienteServicios } from "../../client/cliente-servicios";
import { Servicio } from "../../model/servicio.model";

@Component({
  selector: "app-trabajador-list",
  imports: [RouterLink],
  templateUrl: "./trabajador-list.html",
  styleUrl: "./trabajador-list.css",
})
export class TrabajadorList implements OnInit {
  servicios = signal<Servicio[]>([]);
  cargando = signal(false);
  mensaje = signal("");
  texto = signal("");
  categoriaFiltro = signal("");
  puntajeMinimo = signal(0);
  categoriaVolver = signal<string | null>(null);

  categorias = computed(() => {
    const categorias = new Map<number, string>();
    for (const servicio of this.servicios()) {
      categorias.set(servicio.categoria.id, servicio.categoria.nombre);
    }
    return Array.from(categorias, ([id, nombre]) => ({ id, nombre })).sort(
      (a, b) => a.nombre.localeCompare(b.nombre),
    );
  });

  trabajadores = computed(() => {
    const grupos = new Map<
      number,
      { trabajador: Servicio["trabajador"]; publicaciones: Servicio[] }
    >();
    for (const servicio of this.servicios()) {
      const grupo = grupos.get(servicio.trabajador.id);
      if (grupo) grupo.publicaciones.push(servicio);
      else
        grupos.set(servicio.trabajador.id, {
          trabajador: servicio.trabajador,
          publicaciones: [servicio],
        });
    }
    return Array.from(grupos.values()).filter((grupo) => {
      const datos = [
        grupo.trabajador.nombre,
        grupo.trabajador.apellido,
        grupo.trabajador.descripcion,
      ]
        .join(" ")
        .toLowerCase();
      const coincideTexto = datos.includes(this.texto().trim().toLowerCase());
      const coincideCategoria =
        !this.categoriaFiltro() ||
        grupo.publicaciones.some(
          (servicio) =>
            String(servicio.categoria.id) === this.categoriaFiltro(),
        );
      return (
        coincideTexto &&
        coincideCategoria &&
        (grupo.trabajador.puntaje ?? 0) >= this.puntajeMinimo()
      );
    });
  });

  constructor(
    private route: ActivatedRoute,
    private clienteServicios: ClienteServicios,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          this.mensaje.set("");
          this.categoriaVolver.set(params.get("idCategoria"));
          this.categoriaFiltro.set(params.get("idCategoria") ?? "");
          this.cargando.set(true);
          return this.clienteServicios.buscarServicios().pipe(
            catchError(() => {
              this.mensaje.set("No se pudieron cargar los trabajadores.");
              return of<Servicio[]>([]);
            }),
            finalize(() => this.cargando.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((servicios) => this.servicios.set(servicios));
  }

  limpiarFiltros(): void {
    this.texto.set("");
    this.categoriaFiltro.set("");
    this.puntajeMinimo.set(0);
  }
}