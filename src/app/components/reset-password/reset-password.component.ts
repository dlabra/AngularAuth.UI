import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { confirmPasswordValidator } from '../../helpers/confirm-password.validator';
import Validations from '../../helpers/validators';
import { ResetPassword } from '../../models/reset-password.model';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  resetForm!: FormGroup; //step 2: Create a form group for the login form
  emailToReset!: string;
  emailToken!: string;
  isValidEmail!: boolean;
  resetPasswordObj = new ResetPassword();

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetPasswordService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      newPassword:['', Validators.required],
      confirmNewPassword:['', Validators.required]
    },{
      validator: confirmPasswordValidator("newPassword", "confirmNewPassword")
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['token'];
      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  hideShowPassword() {   
    this.isText = !this.isText;
    this.isText ? this.type = 'text' : this.type = 'password';
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
  }

  reset() {
    if (this.resetForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetForm.value.newPassword;
      this.resetPasswordObj.confirmPassword = this.resetForm.value.confirmNewPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next: (res) =>{
          this.toastr.success("Password reset successfully");
          this.router.navigate(['/login'])
        },
        error:(err) => {
          this.toastr.error("Something went wrong!");
        }
      });

    }else{
      Validations.validateAllFormFields(this.resetForm);
    }
  }

}
