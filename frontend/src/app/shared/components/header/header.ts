import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  imports: [RouterLinkActive,RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(public authService: AuthService,
  ) {}
  get perfilRoute(): string {
  return `/perfil/${this.authService.getUserRole()?.toLowerCase()}`;
}
}
