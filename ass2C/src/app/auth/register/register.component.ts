import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  name: string = '';
  error: string = '';
  success: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.error = '';
    this.auth.register(this.username, this.password, this.name).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error = res.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.error = error.error?.message || 'Registration failed, please try again';
      }
    });
  }
}
