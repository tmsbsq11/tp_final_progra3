import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Header, Footer],
  selector: "app-root",
  styleUrl: "./app.css",
  templateUrl: "./app.html",
})
export class App {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  get rol(): string {
    return this.authService.getUserRole()?.toLowerCase() ?? "";
  }

  get mostrarPanel(): boolean {
    return (
      this.authService.estaAutenticado() &&
      [
        "/perfil/",
        "/mis-reservas",
        "/reservas-recibidas",
        "/mis-postulaciones",
        "/mis-favoritos",
        "/notificaciones",
        "/admin/",
        "/resenias/",
      ].some((ruta) => this.router.url.startsWith(ruta))
    );
  }
}