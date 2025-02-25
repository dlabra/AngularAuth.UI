import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  public users: any = [];
  public fullName: string = '';
  public role: string = '';
  constructor(private auth: AuthService, private apiService: ApiService, private userStore: UserStoreService) { }

  
  ngOnInit(): void {
    this.getUsers();

    this.userStore.getFullNameFromStore().subscribe( res => { 
      let fullNameFromToken = this.auth.getFullNameFromToken();
      console.log(fullNameFromToken);
      this.fullName = res || fullNameFromToken; 
    });

    this.userStore.getRoleFromStore().subscribe( res => { 
      let roleFromToken = this.auth.getRoleFromToken();
      this.role = res || roleFromToken; 
    });
  }

  logout() {
    this.auth.signOut();
  }

  getUsers(){
    this.apiService.getUsers().subscribe( res => { this.users = res; });
  }
}
