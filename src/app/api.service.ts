import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface Donnees {
  dataId: number;
  ipAddress: string;
  eventType: string;
  value: string;
  country: string;
  city: string;
  browser: string;
  deviceType: string;
  operatingSystem: string;
  creationDate: Date;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://localhost:8080/oauth/token'; 
  private adminApiUrl = 'http://localhost:8080/api/admin';
  private superAdminApiUrl = 'http://localhost:8080/api/superadmin';
  private allDataUrl = 'http://localhost:8080/api/data';

  private clientId = 'snrt-datacollector-api';
  private clientSecret = '9mUCVwPmoD2DwvFtLxQldikIKv4NMgJIw2J1aYVYkjqrluEDON';
  
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`));

    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }

  logout(): void {
    window.sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
  base64UrlDecode(str: string): string {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
  
  getJwtPayload(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(this.base64UrlDecode(payload));
  }

  getAllUsers(): Observable<any> {
    const tokenData = sessionStorage.getItem('token');  
    if (tokenData) {
      const token = JSON.parse(tokenData).access_token;
      const decodedToken = this.getJwtPayload(token);
      const userRole = decodedToken.authorities ? decodedToken.authorities[0] : null;
  
      let apiUrl = '';
      if (userRole === 'ROLE_SUPERADMIN') {
        apiUrl = `${this.superAdminApiUrl}/all`;
      } else if (userRole === 'ROLE_ADMIN') {
        apiUrl = `${this.adminApiUrl}/all`;
      } else {
        console.error('User role is not recognized.');
        this.router.navigate(['/unauthorized']); 
        return new Observable();
      }
      const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
  
      return this.http.get<any>(apiUrl, { headers });
    } else {
      this.router.navigate(['/login']);
      return new Observable();
    }
  }
  
  addUser(user: { email: string; password: string; role: string }): Observable<any> {
    const tokenData = sessionStorage.getItem('token');
    if (tokenData) {
      const token = JSON.parse(tokenData).access_token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.post<any>(`${this.superAdminApiUrl}/add-user`, user, { headers });
    } else {
      this.router.navigate(['/login']);
      return new Observable();
    }
  }

  deleteUser(id: number): Observable<any> {
    const tokenData = sessionStorage.getItem('token');
    if (tokenData) {
        const token = JSON.parse(tokenData).access_token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        return this.http.delete(`${this.superAdminApiUrl}/delete-user/${id}`, { headers, responseType: 'text' });
    } else {
        this.router.navigate(['/login']);
        return new Observable();
    }
}
  
  updateUser(id: number, user: { email?: string; password?: string; role?: string }): Observable<any> {
    const tokenData = sessionStorage.getItem('token');
    if (tokenData) {
      const token = JSON.parse(tokenData).access_token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      return this.http.put<any>(`${this.superAdminApiUrl}/update-user/${id}`, user, { headers });
    } else {
      this.router.navigate(['/login']);
      return new Observable();
    }
}
 
    getAllData(): Observable<Donnees[]> {
      return this.http.get<Donnees[]>(this.allDataUrl);
    }
}
