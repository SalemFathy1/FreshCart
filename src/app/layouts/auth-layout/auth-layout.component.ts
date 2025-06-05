import { Component } from '@angular/core';
import { AuthNavComponent } from "../../shared/auth-nav/auth-nav.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-auth-layout',
  imports: [AuthNavComponent, RouterOutlet, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
