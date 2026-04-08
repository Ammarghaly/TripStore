import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: boolean = false;

  private mockEmail = 'admin@test.com';
  private mockPassword = '123456';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    const { email, password } = this.loginForm.value;

    if (email === this.mockEmail && password === this.mockPassword) {
      this.loginError = false;
      console.log('Login Successful!');

      // this.router.navigate(['/home']);
    } else {
      this.loginError = true;
    }
  }
}
