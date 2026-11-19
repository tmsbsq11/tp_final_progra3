import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  constructor(public authService: AuthService) {}
}
