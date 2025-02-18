import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  public users: any = [];
  constructor(private auth: AuthService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  logout() {
    this.auth.signOut();
  }

  getUsers(){
    this.apiService.getUsers().subscribe( res => { this.users = res; });
  }
}
