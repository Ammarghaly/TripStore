import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  passwordMismatch: boolean = false;

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

  showPassword = false;

  togglePassword(field: string) {
    const input: any = document.getElementById(field);

    this.showPassword = !this.showPassword;

    if (this.showPassword) {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  onSubmit() {
    if (this.registerForm.valid && !this.passwordMismatch) {
      console.log(this.registerForm.value);
    }
  }
}
