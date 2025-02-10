import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

  constructor(private ds:DataService , private router:Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  contactform(value){
    this.ds.contactus(value).subscribe(
      res=>{
        if(res.message==="your query successfully submitted"){
          //alert("your query will be evaluated")
          this.toastr.success("Your query will be evaluated", "Success");        
        }
      },
      err=>{
        console.log(err)
        //alert("Something went wrong ")
        this.toastr.error("Something went wrong", "Error")
      }
    )
  }


  
  

}
