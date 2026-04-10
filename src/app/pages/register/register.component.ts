import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  passwordMismatch: boolean = false;

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.registerForm.valueChanges.subscribe(() => {
      const pw = this.registerForm.get('password')?.value;
      const cpw = this.registerForm.get('confirmPassword')?.value;
      this.passwordMismatch = pw && cpw && pw !== cpw;
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

  onSubmit() {
    if (this.registerForm.valid && !this.passwordMismatch) {
      const { fullName, email, password } = this.registerForm.value;
      
      this.authService.register({ 
        name: fullName, 
        email, 
        password 
      }).subscribe({
        next: (response) => {
          this.alertService.show('Success', 'Registration successful!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.alertService.show('Error', error.error?.message || 'Registration failed');
        }
      });
    }
  }
}
