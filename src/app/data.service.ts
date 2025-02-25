import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http' ;
import{Observable} from 'rxjs';
import { Item } from './models/item.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userLoginStatus=false;

  constructor(private hc:HttpClient) { 
    if(localStorage.getItem('username')!==null){
      this.userLoginStatus=true
    }
  }

  //create or register user
  createUser(userObj):Observable<any>{
    return this.hc.post("/user/createuser",userObj)
  }

  //login
  loginUser(credentials):Observable<any>{
    if(credentials.type==="admin"){
      return this.hc.post("/admin/login",credentials)
    }
    if(credentials.type==="user"){
      return this.hc.post("/user/login",credentials)
    }
   
  }

  //contact us
  contactus(value):Observable<any>{
    return this.hc.post("/user/contactform" ,value)
  }

  //app rating
  rating(value):Observable<any>{
    return this.hc.post("/user/apprating",value)
  }

  //get app rating
  getratings():Observable<any>{
    return this.hc.get("/user/getappratings")
  }

  //get movies data
  getMoviesData():Observable<any>{
    return this.hc.get <any>("http://localhost:3000/items")
  }

  //get movied data by id
  getMoviesDataById(id):Observable<Item>{
    return this.hc.get <Item>('http://localhost:3000/items/'+id)
  }

  //get top movies data
  getTopMoviesData():Observable<Item>{
    return this.hc.get <Item>("http://localhost:3000/topitems")
  }

  //add new movie
  createNewMovie(movieObj):Observable<any>{
    return this.hc.post("http://localhost:3000/item",movieObj)
  }


  // Submit or update movie rating
  submitReview(reviewData: any): Observable<any> {
    return this.hc.post("/user/submitreview", {
        username: reviewData.username, // Use username instead of userId
        movieId: reviewData.movieId,
        rating: reviewData.starRating,
        reviewText: reviewData.reviewText
    });
}
  // Fetch user’s existing rating for a movie
  getReviewByUserAndMovie(username: string, movieId: string): Observable<any> {
    return this.hc.get(`/user/getmoviereview/${username}/${movieId}`);
  }

  // Fetch average rating of a movie
getAverageRating(movieId: string): Observable<{ avgRating: number }> {
  return this.hc.get<{ avgRating: number }>(`/user/getaveragerating/${movieId}`);
}

// Fetch all reviews for a movie
getAllReviews(movieId: string): Observable<any[]> {
  return this.hc.get<any[]>(`/user/getallreviews/${movieId}`);
}



//send OTP
sendOTP(email: string): Observable<any> {
  return this.hc.post("/user/forgot-password", { email });
}


//verify OTP
verifyOTP(email: string, otp: string): Observable<any> {
  return this.hc.post("/user/verify-otp", { email, otp });
}


//Reset password
resetPassword(email: string, newPassword: string): Observable<any> {
  return this.hc.post("/user/reset-password", { email, newPassword });
}



}