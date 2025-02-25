import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = "";
  otp: string = "";
  newPassword: string = "";
  step: number = 1; // Step 1: Enter Email, Step 2: OTP, Step 3: Reset Password

  constructor(private ds: DataService) {}

  // ✅ Required method for OnInit
  ngOnInit(): void {
    // console.log("ForgotPasswordComponent initialized");
  }

  // ✅ Step 1: Request OTP
  requestOTP() {
    this.ds.sendOTP(this.email).subscribe(response => {
      alert(response.message);
      if (response.message.includes("OTP sent")) {
        this.step = 2; // Move to next step
      }
    });
  }

  // ✅ Step 2: Verify OTP
  verifyOTP() {
    this.ds.verifyOTP(this.email, this.otp).subscribe(response => {
      alert(response.message);
      if (response.message.includes("OTP verified")) {
        this.step = 3; // Move to next step
      }
    });
  }

  // ✅ Step 3: Reset Password
  resetPassword() {
    this.ds.resetPassword(this.email, this.newPassword).subscribe(response => {
      alert(response.message);
      if (response.message.includes("Password reset successful")) {
        this.step = 1; // Reset flow
      }
    });
  }

}
