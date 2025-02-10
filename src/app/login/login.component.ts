import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //inject UserService obj
  constructor(private ds:DataService,private router:Router, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  onLogin(userCredentials){
   
    this.ds.loginUser(userCredentials).subscribe(
      res=>{
        if(res.message==="login success"){
          //save token to localstorage
          localStorage.setItem("token",res.token)
          localStorage.setItem("username",res.username)
          localStorage.setItem("userObj",JSON.stringify(res.userObj))
          //update userloginstatus
          this.ds.userLoginStatus=true;
         
          if(userCredentials.type==="user"){
          //navigate to user profile
          this.router.navigateByUrl(`userprofile`)
          }
          if(userCredentials.type==="admin"){
            //navigate to admin profile
            this.router.navigateByUrl(`admin`)
            }

        }
        else{
          //alert(res.message)
          this.toastr.error(res.message, "Error");
        }
      },
      err=>{
        console.log(err)
        alert("Something went wrong in login")
      }
    )
  }
}
