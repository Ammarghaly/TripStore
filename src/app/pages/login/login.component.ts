import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: boolean = false;

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.noWhitespaceValidator]],
      password: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.loginError = false;
        this.alertService.show('Success', 'Login successful!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loginError = true;
        this.alertService.show('Error', 'Incorrect email or password');
      }
    });
  }

  togglePassword(field: string) {
    const input = document.getElementById(field) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
      
      const icon = input.parentElement?.querySelector('.toggle-pass');
      if (icon) {
        if (input.type === 'text') {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    }
  }
}
