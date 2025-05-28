import { Component } from '@angular/core';
import { AuthNavComponent } from "../../auth-nav/auth-nav.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-auth-layout',
  imports: [AuthNavComponent, RouterLink, RouterLinkActive, RouterOutlet, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
