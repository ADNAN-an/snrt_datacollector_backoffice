import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup' 

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
  ToasterPosition = ToasterPosition;
  constructor(private apiService: ApiService, private router: Router, private toast: NgToastService) {}

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
        this.toast.danger("Failed to load users.", "ERROR", 5000);
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
        this.toast.success("User added successfully!", "SUCCESS", 5000);
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.toast.danger("Failed to add user.", "ERROR", 5000);
      }
    });
  }

  updateUserInfo(): void { 
    if (this.userIdToUpdate !== null) {
      this.apiService.updateUser(this.userIdToUpdate, this.updateUserDetails).subscribe({
        next: (response) => {
          this.loadUsers();
          this.closeUpdateUserModal();
          this.toast.success("User updated successfully!", "SUCCESS", 5000);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toast.danger("Failed to update user.", "ERROR", 5000);
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
          this.toast.success("User deleted successfully!", "SUCCESS", 5000);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.toast.danger("Failed to delete user.", "ERROR", 5000);
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
