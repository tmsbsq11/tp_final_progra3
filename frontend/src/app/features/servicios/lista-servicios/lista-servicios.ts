import { Component, OnInit, signal } from "@angular/core";
import { ClienteServicios } from "../client/cliente-servicios";
import { Servicio } from "../model/servicio.model";
import { finalize } from "rxjs";
import { Router, RouterLink } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { FavoritosService } from "../../favoritos/service/favoritos.service";
import { iconoCategoria, posicionCategoria } from "../../../shared/diseno";

@Component({
  imports: [RouterLink],
  selector: "app-lista-servicios",
  styleUrl: "./lista-servicios.css",
  templateUrl: "./lista-servicios.html",
})
export class ListaServicios implements OnInit {
  iconoCategoria = iconoCategoria;
  posicionCategoria = posicionCategoria;
  servicios = signal<Servicio[]>([]); //inicializo la señal con un array vacio para que no tire error
  cargado = signal(false); //inicializo la señal con false pq todavia no se cargaron los servicios
  mensaje = signal(""); //inicializo la señal con un string vacio
  categorias = signal<{ id: number; nombre: string }[]>([]); //inicializo la señal vacia
  mensajeCategoria = signal("");
  mostrarResultados = signal(false);
  idsFavoritos = signal<number[]>([]);
  mensajeFavoritos = signal("");

  constructor(
    private clienteServicios: ClienteServicios, //para poder usar los metodos del cliente de servicios
    private route: ActivatedRoute, //para poder leer los parametros de la url
    private router: Router,
    public authService: AuthService,
    private favoritosService: FavoritosService,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const texto = params.get("busqueda") ?? "";
    const id = Number(params.get("idCategoria"));
    const idCategoria = Number.isInteger(id) && id > 0 ? id : undefined;
    this.cargarCategorias();

    // Si hay texto o categoría, aplica los filtros; si faltan ambos, carga todos los servicios.

    if (texto.trim() || idCategoria !== undefined) {
      this.buscar(texto, idCategoria);
    } else {
      this.cargarServicios();
    }

    if (this.authService.getUserRole()?.toLowerCase() === "cliente") {
      try {
        this.idsFavoritos.set(
          this.favoritosService.listar().map((favorito) => favorito.idServicio),
        );
      } catch {
        this.mensajeFavoritos.set("No se pudieron leer tus favoritos.");
      }
    }
  }

  cargarServicios(busqueda = "", idCatalogo?: number): void {

    this.mensaje.set(""); //limpio el mensaje de error
    this.cargado.set(true);
    this.clienteServicios
      .buscarServicios(busqueda, idCatalogo)
      .pipe(finalize(() => this.cargado.set(false))) //cuando termina de cargar, cambia el estado de cargado a false
      .subscribe({
        next: (servicios) => {
          this.servicios.set(servicios);
        },

        error: ({ status }) => {
          if (status === 401 || status === 403) {
            this.mensaje.set(
              "Se necesita una sesión autorizada para consultar el catalogo.",
            );
          } else {
            this.mensaje.set("No se pudo cargar el catalogo.");
          }
        },
      });
  }

  cargarCategorias(): void {
    this.clienteServicios
      .obtenerCategorias()

      .subscribe({
        next: (categorias) => {
          this.categorias.set(categorias);
        },

        error: () => {
          this.mensajeCategoria.set("No se pudieron cargar las categorias.");
        },
      });
  }

  textoBuscado = signal("");
  categoriaBuscada = signal<number | undefined>(undefined);

  buscar(busqueda: string, idCategoria?: number): void {
    const texto = busqueda.trim();

    if (!texto && idCategoria === undefined) {
      this.limpiarFiltros();
      return;
    }

    this.textoBuscado.set(texto);
    this.categoriaBuscada.set(idCategoria);
    this.mostrarResultados.set(true);
    this.cargarServicios(texto, idCategoria);
  }

  limpiarFiltros(): void {
    this.textoBuscado.set("");
    this.categoriaBuscada.set(undefined);
    this.mostrarResultados.set(false);
    this.mensaje.set("");
  }

  esFavorito(servicio: Servicio): boolean {
    return this.idsFavoritos().includes(Number(servicio.id));
  }

  cambiarFavorito(servicio: Servicio): void {
    this.mensajeFavoritos.set("");

    try {
      const id = Number(servicio.id);
      const estabaGuardado = this.favoritosService
        .listar()
        .some((favorito) => favorito.idServicio === id);

      if (estabaGuardado) {
        this.favoritosService.quitar(id);
      } else {
        this.favoritosService.agregar(id);
      }

      this.idsFavoritos.set(
        this.favoritosService.listar().map((favorito) => favorito.idServicio),
      );

      this.mensajeFavoritos.set(
        estabaGuardado
          ? "Postulación quitada de favoritos."
          : "Postulación guardada en favoritos.",
      );
    } catch {
      this.mensajeFavoritos.set("No se pudieron actualizar los favoritos.");
    }
  }
}
