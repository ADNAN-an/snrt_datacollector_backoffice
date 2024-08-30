import { Component , OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css'
})
export class TopnavComponent implements OnInit {
  userEmail: string | null = '';
  userAvatarUrl: string | null = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.userEmail = this.apiService.getUserEmail();
    this.setUserAvatarUrl();
  }

  setUserAvatarUrl(): void {
    if (this.userEmail) {
      const name = this.userEmail.split('@')[0].replace('.', '+');
      this.userAvatarUrl = `https://ui-avatars.com/api/?name=${name}`;
    }
  }
}