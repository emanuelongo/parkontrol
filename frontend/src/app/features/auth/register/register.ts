import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  loading = false;
  error = '';
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      organization: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9()+\-\s]{6,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.passwordsMatchValidator()] });
  }

  // Password rules for UI
  get passwordValue(): string { return this.form.get('password')?.value || ''; }
  get ruleLength() { return this.passwordValue.length >= 6; }
  get ruleNumber() { return /\d/.test(this.passwordValue); }
  get ruleUpper() { return /[A-Z]/.test(this.passwordValue); }
  get ruleSpecial() { return /[^A-Za-z0-9]/.test(this.passwordValue); }

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v: string = control.value || '';
      const ok = v.length >= 6 && /\d/.test(v) && /[A-Z]/.test(v) && /[^A-Za-z0-9]/.test(v);
      return ok ? null : { weakPassword: true };
    };
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const p = group.get('password')?.value;
      const c = group.get('confirmPassword')?.value;
      if (!p || !c) return null;
      return p === c ? null : { passwordMismatch: true };
    };
  }

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { organization, email, address, phone, password } = this.form.value as any;
    const payload = {
      nombreOrganizacion: organization,
      correo: email,
      direccion: address,
      telefono: phone,
      contrasena: password
    };

    this.loading = true;
    this.auth.register(payload).subscribe({
      next: (res: any) => {
        const token = res.token || res.access_token || res.data?.token;
        const user = res.user || res.data?.user || null;
        if (token) this.auth.storeToken(token, user, true);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudo completar el registro';
        this.loading = false;
      }
    });
  }
}
