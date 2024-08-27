import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    this.apiService.login(username, password).subscribe({
      next: (data) => {
        window.sessionStorage.setItem('token', JSON.stringify(data));
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        alert(error.error.error_description || 'Login failed');
        this.invalidLogin = true;
      }
    });
  }

  ngOnInit() {
    window.sessionStorage.removeItem('token');
  }
}
