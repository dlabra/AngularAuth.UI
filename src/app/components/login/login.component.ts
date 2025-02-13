import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import ValidateForm from '../../helpers/validators';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], //step 1: Add reactive forms module to validate the login form
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup; //step 2: Create a form group for the login form

  constructor(private formBuilder: FormBuilder) { } //step 3: Inject the form builder service

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
      console.log(this.loginForm.value);
    }else{
      //throw error
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Please fill in the required fields');
    }
  }



}
