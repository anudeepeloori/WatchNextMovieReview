// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from '../data.service';


// @Component({
//   selector: 'app-reset-password',
//   templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.css']
// })
// export class ResetPasswordComponent implements OnInit {

//   newPassword = '';
//   token: string;

//   constructor(private route: ActivatedRoute, private ds: DataService, private router: Router) { 
//     this.token = this.route.snapshot.params['token'];
//   }

//   ngOnInit(): void {
//   }
//   resetPassword() {
//     if (!this.newPassword) {
//       alert('Please enter a new password.');
//       return;
//     }

//     this.ds.resetPassword(this.token, this.newPassword).subscribe(
//       (res) => {
//         alert('Password reset successful!');
//         this.router.navigate(['/login']); // ✅ Redirect after reset
//       },
//       (err) => {
//         console.error('Password Reset Error:', err); // ✅ Debugging log
//         alert('Error: ' + (err.error?.message || 'Something went wrong'));
//       }
//     );
// }


// }
