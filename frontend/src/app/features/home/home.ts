import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  constructor(public authService: AuthService) {}
}
