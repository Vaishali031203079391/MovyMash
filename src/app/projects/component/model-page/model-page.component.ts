import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ThemoviedbService } from '../../api/service/themoviedb.service';

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent  implements OnInit {
  @Input() modelItemList: any = [];
  @Input() modelType: string = '';

  isLoading: boolean = false;
  id: string = '';
  title: string = '';
  backgroundImage: string = '';
  releaseDate: string = '';
  overview: string = '';
  castItemList: any = [];
  crewItemList: any = [];
  runtime: string = '';
  voterRating: any;
  appRecommendationContainer: any = [];
  isVideoEnabled: boolean = false;
  videoUrl: any;
  dangerousVideoUrl: any;

  constructor(private movieService: ThemoviedbService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.initializeContainer();
  }

  initializeContainer(){
    this.isLoading = true;
    this.title = this.modelType === 'movie' ? this.modelItemList.detailResponse.title : this.modelItemList.detailResponse.original_name;
    this.id = this.modelItemList.detailResponse.id;
    this.backgroundImage = ('http://image.tmdb.org/t/p/original/' + this.modelItemList.detailResponse.backdrop_path);
    this.overview = this.modelItemList.detailResponse.overview;
    this.releaseDate = this.modelItemList.detailResponse.release_date;
    this.runtime = this.modelItemList.detailResponse.runtime + ' Minutes';
    this.voterRating = 'User Score : ' + (Number(this.modelItemList.vote_average * 10).toFixed(2)) + '%';
    this.modelItemList.creditResponse.cast.forEach((e: any) => {
      if(e.profile_path){
        e.profile_path = 'https://www.themoviedb.org/t/p/w138_and_h175_face/' + e.profile_path;
      }
      this.castItemList.push(e);
    });

    this.modelItemList.creditResponse.crew.forEach((e: any) => {
      if(e.profile_path){
        e.profile_path = 'https://www.themoviedb.org/t/p/w138_and_h175_face/' + e.profile_path;
      }
      this.castItemList.push(e);
    });

    if(this.modelItemList.videos.results.length > 0){
      this.dangerousVideoUrl = 'https://www/youtube.com/embed/' + this.modelItemList.videos.results[0].key;
      console.log(this.dangerousVideoUrl);
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
    }

    this.initializeRecommendationsContainer();
  }

  closeModel(){
    this.movieService.dismissModel();
  }

  initializeRecommendationsContainer(){
    this.movieService.getRecommendationList(this.modelType, this.id).subscribe(res => {
      res.results.forEach((ele: any) => {
        this.appRecommendationContainer.push({
          id: ele.id,
          title: this.modelType === 'movie' ? ele.title : ele.original_name,
          description: ele.overview,
          image: ('http://image.tmdb.org/t/p/original/' + ele.backdrop_path),
          voterRating: ele.vote_average,
          modelItem: ele
        });
      });
    });
    this.isLoading = false;
  }

  cardEventListener(modelItem: any){
    /* To avoid Video Playback in background */
    this.isVideoEnabled = false;
    forkJoin(this.movieService.getDetailList(this.modelType, modelItem.id),
    this.movieService.getCreditList(this.modelType, modelItem.id),
    this.movieService.getVideoList(this.modelType, modelItem.id)).subscribe(res => {
      modelItem.detailResponse = res[0];
      modelItem.creditResponse = res[1];
      modelItem.videos = res[2];
      this.movieService.presentModal(modelItem, this.modelType);
    });
  }

  playVideo(){
    this.isVideoEnabled = true;
  }

}
