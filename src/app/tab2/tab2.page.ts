import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ThemoviedbService } from '../projects/api/service/themoviedb.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  /* Only model type is different from tab 1 */

  modelType = 'tv';
  genreSelectedValue = '';
  sliderContainer: any = [];
  genreContainerList: any = [];
  page: number = 1;
  filteredGenreId: string = '';
  appCardContainer: any = [];
  loadingCurrentEventData: any;
  voterRating: any = '';

  constructor(private movieService: ThemoviedbService) {}

  ngOnInit(): void {
      this.initializesSliderContainer();
      this.initializeGenreContainer();
      this.initializePopularContainer();
      this.initializeContainer();
  }

  initializesSliderContainer() {
    this.movieService.getTrendingList(this.modelType).subscribe(trendingMovies => {
      //console.log(trendingMovies);
      trendingMovies.results.forEach((tm:any) => {
        this.sliderContainer.push({
          id: tm.id,
          title: tm.title,
          image: tm.backdrop_path ? ('http://image.tmdb.org/t/p/original/' + tm.backdrop_path) : '../../assets/poster-holder.jpg',
          posterPath: tm.poster_path ? ('http://image.tmdb.org/t/p/original/' + tm.poster_path) : '../../assets/poster-holder.jpg',
          modelItem: tm
        });
      });
    });
  }

  initializeGenreContainer(){
    this.movieService.getGenereList(this.modelType).subscribe(genre =>{
      genre.genres.forEach((genreElement: any) => {
        this.genreContainerList.push(genreElement);
      });
    });
  }

  genreSelectionChanged(e: any){
    const genres = e.detail.value;
    if (genres > 0 || this.filteredGenreId != null){
      this.page = 1;
      this.appCardContainer = [];
      this.filteredGenreId = genres.toString();
      this.movieService.getPopularList(this.modelType, this.page, this.filteredGenreId).subscribe((popularMovies: any) => {
        popularMovies.results.forEach((pop: any) => {
          this.appCardContainer.push({
            id: pop.id,
            title: pop.title,
            description: pop.overview,
            image: pop.backdrop_path ? ('http://image.tmdb.org/t/p/original/' + pop.backdrop_path) : '../../assets/poster-holder.jpg',
            voterRating: pop.vote_average,
            modelItem: pop
          });
        });
      });
    }
  }

initializeContainer(){
  this.page = 1;
  this.filteredGenreId = '';
  this.initializePopularContainer();
}
  initializePopularContainer(){
    this.movieService.getPopularList(this.modelType, this.page, this.filteredGenreId).subscribe((popularMovies: any) => {
      popularMovies.results.forEach((pop: any) => {
        this.appCardContainer.push({
          id: pop.id,
          title: pop.original_name,
          description: pop.overview,
          image: pop.backdrop_path ? ('http://image.tmdb.org/t/p/original/' + pop.backdrop_path) : '../../assets/poster-holder.jpg',
          voterRating: pop.vote_average,
          modelItem: pop
        });
      });

      if(this.page > 1){
        this.loadingCurrentEventData.target.complete();
      if (popularMovies.results.length === 0){
        this.loadingCurrentEventData.target.disabled = true;
      }
      }
    });
  }

  loadData(event: any){
    this.page = this.page + 1;
    this.loadingCurrentEventData = event;
    this.initializePopularContainer();
  }

  cardEventListener(modelItem: any){
    forkJoin(this.movieService.getDetailList(this.modelType, modelItem.id),
    this.movieService.getCreditList(this.modelType, modelItem.id),
    this.movieService.getVideoList(this.modelType, modelItem.id)).subscribe(res => {
      modelItem.detailResponse = res[0];
      modelItem.creditResponse = res[1];
      modelItem.videos = res[2];
      this.movieService.presentModal(modelItem, this.modelType);
    });
  }

}

