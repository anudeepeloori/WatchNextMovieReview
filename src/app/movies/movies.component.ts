import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../models/item.model';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  // For search pipe
  searchTerm: string;
  p = 1;
  
  // Movie data
  movieData: Item[];  //Array of Items
  
  // User ID
  username: string | null;

  // Review data object
  reviewData = {
    username: "", // Retrieve from authentication
    movieId: null, // Set dynamically when a movie is selected
    starRating: 0,
    reviewText: ''
  };


// Stores average ratings
avgRatings: { [movieId: string]: number } = {};
// Stores reviews for selected movie
selectedMovieReviews: any[] = [];
selectedMovieAvgRating: number = 0;
selectedMovieTitle: string = '';


//TMDB API
movies: any[] = []; // To store movies


  constructor(private ds: DataService, private router: Router, private hc: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    // Fetch movie data
    this.ds.getMoviesData().subscribe(
      (items) => {
        this.movieData = items;
      },
      (err) => {
        console.log("Error fetching movies", err);
      }
    );

    // Retrieve username from local storage
     this.username = localStorage.getItem("username");

    if (this.username) {
        this.reviewData.username = this.username; // Assign correct value
        //console.log("Username retrieved:", this.username);
    } else {
        console.error("Please login to continue..");
    }


    //TMDB 
    this.loadMovies();
  }


  //TMDB Movies
  loadMovies() {
    this.ds.getMoviesData().subscribe((response: any[]) => {
      this.movies = response; // ✅ Directly assign response since it's already an array
      //console.log(`Total Movies Fetched: ${this.movies.length}`, this.movies);
    });
  }


  // Navigate to specific movie details page
  onSelectId(id: string) {
    this.router.navigateByUrl('movies/' + id);
  }

  // Open Review Modal and Fetch Existing Review
  openReviewModal(movieId: string) {
    //console.log("Opening review modal for movieId:", movieId);

    if (!movieId) {
      //console.error("Movie ID is missing. Aborting modal open.");
      alert("Error: Unable to open review modal. Movie ID is missing.");
      return;
    }

    // Retrieve username before opening modal
    this.username = localStorage.getItem("username");

    if (!this.username) {
        //alert("User not logged in. Please log in to rate movies.");
        this.toastr.warning("User not logged in. Please log in to rate movies.", "Warning");
        //console.error("Username is null. Cannot proceed.");
        return;
    }

    this.reviewData.movieId = movieId;
    this.reviewData.username = this.username; 

    // console.log("Setting movieId:", this.reviewData.movieId);
    // console.log("Setting username:", this.reviewData.username);

    // Fetch existing review if available
    this.ds.getReviewByUserAndMovie(this.username, movieId).subscribe(
        (res) => {
            if (res) {
                console.log("Found existing review:", res);
                this.reviewData.starRating = res.rating;
                this.reviewData.reviewText = res.reviewText;
            } else {
                console.log("No existing review found, starting fresh.");
                this.reviewData.starRating = 0;
                this.reviewData.reviewText = "";
            }
        },
        (err) => {
            console.log("No existing rating found.");
        }
    );
}


  // Submit Review -Update if Exists,Otherwise Insert

  onSubmitReview() {
    console.log("Submitting Review with Data:", this.reviewData);
    if (!this.reviewData.movieId || !this.reviewData.username) {
      //alert("Error: Missing movie or user information.");
      this.toastr.warning("Error: Missing movie or user information.", "Warning");
      return;
    }

    //console.log("Submitting review for movieId:", this.reviewData.movieId);

    this.ds.submitReview(this.reviewData).subscribe(
      (res) => {
        console.log("Review submitted successfully", res);
        //alert(res.message);
        this.toastr.success(res.message, "Success");

        // Close modal manually after successful submission
        let modal = document.getElementById('mdl');
        if (modal) {
          (modal as HTMLElement).setAttribute("data-bs-dismiss", "modal");
          modal.classList.remove("show");
        }
       // Allow UI interaction by removing modal backdrop manually
       let backdrop = document.querySelector('.modal-backdrop');
       if (backdrop) {
           backdrop.remove();
       }

       setTimeout(() => {
        window.location.reload(); // Reloads the current route 
    }, 500);
       
      },
      (err) => {
        console.error("Error saving review", err);
      }
    );
  }

  
  
  

//Fetch average ratings for each movie
fetchAverageRatings() {
  this.movieData.forEach((movie) => {
    this.ds.getAverageRating(movie.id).subscribe(
      (rating) => {
        this.avgRatings[movie.id] = rating.avgRating;
      },
      (err) => {
        this.avgRatings[movie.id] = 0;
      }
    );
  });
}

//Fetch all reviews and average rating for selected movie
openRatingsModal(movieId: string, title: string) {
  this.selectedMovieTitle = title;
  this.ds.getAllReviews(movieId).subscribe(
    (reviews) => {
      this.selectedMovieReviews = reviews;
    },
    (err) => {}
  );

  this.ds.getAverageRating(movieId).subscribe(
    (rating) => {
      this.selectedMovieAvgRating = rating.avgRating;
    },
    (err) => {
      this.selectedMovieAvgRating = 0;
    }
  );
}





}