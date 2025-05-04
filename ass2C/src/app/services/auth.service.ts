import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

interface User {
  username: string;
  name: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private readonly USERS_KEY = 'registered_users';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    try {
      const storedUsers = localStorage.getItem(this.USERS_KEY);
      this.users = storedUsers ? JSON.parse(storedUsers) : [];
      console.log('Loaded users:', this.users); // Debug log
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  private saveUsers(): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
      console.log('Saved users:', this.users); // Debug log
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  register(username: string, name: string, password: string): Observable<AuthResponse> {
    if (!username || !name || !password) {
      return throwError(() => ({ error: { message: 'All fields are required' } }));
    }

    // Reload users to ensure we have the latest data
    this.loadUsers();

    if (this.users.some(user => user.username === username)) {
      return throwError(() => ({ error: { message: 'Username already exists' } }));
    }

    const newUser: User = { username, name, password };
    this.users.push(newUser);
    this.saveUsers();
    
    return of({
      success: true,
      message: 'Registration successful',
      data: { username, name }
    });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    if (!username || !password) {
      return throwError(() => ({ error: { message: 'Username and password are required' } }));
    }

    // Reload users to ensure we have the latest data
    this.loadUsers();

    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const token = 'dummy-token-' + Math.random().toString(36).substr(2);
      const userData = { username: user.username, name: user.name };
      
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      
      return of({
        success: true,
        message: 'Login successful',
        data: { token, user: userData }
      });
    }
    
    return throwError(() => ({ error: { message: 'Invalid username or password' } }));
  }

  getUserData(username: string): Observable<AuthResponse> {
    if (!username) {
      return throwError(() => ({ error: { message: 'Username is required' } }));
    }

    // Reload users to ensure we have the latest data
    this.loadUsers();

    const user = this.users.find(u => u.username === username);
    if (user) {
      return of({
        success: true,
        message: 'User data retrieved',
        data: { name: user.name }
      });
    }
    return throwError(() => ({ error: { message: 'User not found' } }));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): { username: string; name: string } | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
