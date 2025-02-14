import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import ValidateForm from '../../helpers/validators';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signupForm!: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstname:['', Validators.required],
      lastname:['', Validators.required],
      email:['', Validators.required],
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
      if(this.signupForm.valid) {
        this.auth.signUp(this.signupForm.value)
        .subscribe({
          next:(res)=>{
            console.log(res.message);
            this.signupForm.reset();
            this.toastr.success('Signup successful');
            this.router.navigate(['/login']);
          },
          error:(err)=>{
            this.toastr.error('Signup failed');	
          }
      });        
      }else{
        //throw error
        ValidateForm.validateAllFormFields(this.signupForm);
      }
    }
}
