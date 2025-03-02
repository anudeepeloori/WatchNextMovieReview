import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Item} from '../models/item.model';
import {DataService} from '../data.service' ;

@Component({
  selector: 'app-topimdb',
  templateUrl: './topimdb.component.html',
  styleUrls: ['./topimdb.component.css']
})
export class TopimdbComponent implements OnInit {
// for search pipe
searchTerm:string;


myData: any[] = [];
constructor(private itemObj:DataService , private router:Router) { }

ngOnInit(): void {

  this.itemObj.getTopMoviesData().subscribe(
    response => {
      this.myData = response.results; // Assign `results` array correctly
      console.log("Fetched Top Rated Movies:", this.myData);
    },
    err=>{
      console.log("error is ",err)
    }

  )


}

onSelectId(id){
  this.router.navigateByUrl('movies/'+id)
}

}
