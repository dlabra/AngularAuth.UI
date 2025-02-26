import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import ValidateForm from '../../helpers/validators';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from '../../services/user-store.service';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule], //step 1: Add reactive forms module to validate the login form
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup; //step 2: Create a form group for the login form
  resetPasswordEmail!: string;
  isValidEmail!: boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private auth: AuthService, 
    private router: Router, 
    private toastr: ToastrService, 
    private userStore: UserStoreService ,
    private resetService: ResetPasswordService
  ) { } //step 3: Inject the form builder service

  ngOnInit(): void {
    //step 4: Create the login form with the form builder service
    this.loginForm = this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    });
  } 

  hideShowPassword() {   
    this.isText = !this.isText;
    this.isText ? this.type = 'text' : this.type = 'password';
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
  }

  onSubmit() {
    if(this.loginForm.valid) {      
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreeshToken);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.unique_name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.toastr.success('Login successful');
          this.router.navigate(['/dashboard']);
        },
        error:(err)=>{
          this.toastr.error('Login failed');
        }
      });
    }else{
      //throw error
      ValidateForm.validateAllFormFields(this.loginForm);
      this.toastr.error('Please fill in the required fields');
    }
  }

  checkValidEmail(event: string){
    const value = event;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(value);
    console.log(this.isValidEmail);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.isValidEmail){
      console.log(true);      
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next:(res)=>{
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
          this.toastr.success('Email sent successfully');
        },
        error:(err)=>{
          this.toastr.error('Email not sent');
        }
      });
    }else{
      this.toastr.error('Please enter a valid email address');
    }
  }
}
