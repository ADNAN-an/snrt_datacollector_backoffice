import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentUserRole: string = '';
  newUser = { email: '', password: '', role: 'ADMIN' }; 
  updateUserDetails = { email: '', password: '', role: 'ADMIN' };
  showModal = false;
  showUpdateModal = false;
  showDeleteModal = false;
  deleteUserId: number | null = null;
  userIdToUpdate: number | null = null;

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.currentUserRole = this.apiService.getJwtPayload(sessionStorage.getItem('token') || '').authorities[0];
      },
      (error) => {
        console.error('Failed to fetch users', error);
      }
    );
  }

  isSuperAdmin(): boolean {
    return this.currentUserRole === 'ROLE_SUPERADMIN';
  }

  openAddUserModal(): void {
    this.showModal = true;
  }

  closeAddUserModal(): void {
    this.showModal = false;
    this.newUser = { email: '', password: '', role: 'ADMIN' }; 
  }

  openUpdateUserModal(user: any): void {
    this.updateUserDetails = { email: user.email, password: '', role: user.role }; 
    this.userIdToUpdate = user.id;
    this.showUpdateModal = true;
  }

  closeUpdateUserModal(): void {
    this.showUpdateModal = false;
    this.updateUserDetails = { email: '', password: '', role: 'ADMIN' };
  }

  openDeleteModal(id: number): void {
    this.deleteUserId = id;
    this.showDeleteModal = true; 
  }
  
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteUserId = null;
  }

  addUser(): void {
    this.apiService.addUser(this.newUser).subscribe({
      next: (response) => {
        this.loadUsers();  
        this.closeAddUserModal();
        this.toastr.success('User added successfully!');
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.toastr.error('Error adding user.');
      }
    });
  }

  updateUserInfo(): void { 
    if (this.userIdToUpdate !== null) {
      this.apiService.updateUser(this.userIdToUpdate, this.updateUserDetails).subscribe({
        next: (response) => {
          this.loadUsers();
          this.closeUpdateUserModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.deleteUserId !== null) {
      this.apiService.deleteUser(this.deleteUserId).subscribe({
        next: (response) => {
          console.log('User deleted successfully', response);
          this.loadUsers(); 
          this.closeDeleteModal();
          this.toastr.success('User deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.toastr.error('Error deleting user.');
        }
      });
    }
  }

  getDisplayedColumns(): string[] {
    const columns = ['id', 'email', 'role'];
    if (this.isSuperAdmin()) {
      columns.push('actions');
    }
    return columns;
  }
}
