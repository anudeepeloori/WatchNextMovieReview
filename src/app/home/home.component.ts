import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ds:DataService,private router:Router, private toastr:ToastrService ) { }

  ngOnInit(): void {
  }

  onSignup(userobj){
    this.ds.createUser(userobj).subscribe(
      res=>{
        if(res.message==="User created"){
          alert("User created")
          //navigate to login component
            this.router.navigateByUrl('/login')
        }
        else{
          //alert(res.message)
          this.toastr.info(res.message,"Error")
        }
      },
      err=>{
        console.log(err)
        //alert("Something went wrong in user creation")
        this.toastr.error("Something went wrong in user creation","Error")
      }
    )
  }

  IfRegisteredUser(){
    this.router.navigateByUrl('login')
  }

}
