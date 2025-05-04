import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(form: NgForm): void {
    if (!form.valid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/profile']);
        } else {
          this.error = res.message || 'Login failed';
        }
      },
      error: (error) => {
        this.error = error.error?.message || 'Login failed, please try again';
      }
    });
  }
}
