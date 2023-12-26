import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { APP_CONSTANTS } from '../../../app.constant';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  public loginForm!: FormGroup;
  public message: string = '';
  public hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.signin(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          window.location.href = APP_CONSTANTS.routerLinks.home;
        },
        error: () => {
          this.message = 'Email ou mot de passe incorrect.';
        },
      });
    }
  }
}
