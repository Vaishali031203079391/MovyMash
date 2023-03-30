import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ThemoviedbService } from '../projects/api/service/themoviedb.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  searchValue: string;
  selectedValue: any;
  page: number = 1;
  searchCardContainer: any = [];
  loadingCurrentEventData: any;

  constructor(private service: ThemoviedbService) {
    this.searchValue = '';
    this.selectedValue = 'movie';
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  filterList() {
    this.page = 1;
    this.searchCardContainer = [];

    if (this.searchValue.length > 2) {
      this.loadSearchContainer();
    }

  }

  loadSearchContainer() {
    this.service.getSearchList(this.selectedValue, this.page, this.searchValue).subscribe((searchResponseEl: any) => {
      searchResponseEl.results.forEach((element: any) => {
        this.searchCardContainer.push({
          id: element.id,
          title: this.selectedValue === 'movie' ? element.title : element.original_name,
          descriptoin: element.overview,
          image: element.poster_path ? ('http://image.tmdb.org/t/p/original/' + element.poster_path) : '../../assets/poster-holder.jpg',
          voterRating: element.vote_average,
          modelItem: element
        });
      });

      if (this.page > 1) {
        this.loadingCurrentEventData.target.complete();
        if (searchResponseEl.results.length === 0) {
          this.loadingCurrentEventData.target.disabled = true;
        }
      }

    });
  }

  loadData(event: any) {
    this.page = this.page + 1;
    this.loadingCurrentEventData = event;
    this.loadSearchContainer();
  }

  selectionChanged() {
    this.searchCardContainer = [];
    this.searchValue = '';
    this.page = 1;
  }

  cardEventListener(modelItem: any) {
    /** To avoid video playing in background */
    forkJoin(this.service.getDetailList(this.selectedValue, modelItem.id),
      this.service.getCreditList(this.selectedValue, modelItem.id),
      this.service.getVideoList(this.selectedValue, modelItem.id)).subscribe(responseEl => {
        modelItem.detailResponseEl = responseEl[0];
        modelItem.creditsResponseEl = responseEl[1];
        modelItem.videos = responseEl[2];
        this.service.presentModal(modelItem, this.selectedValue);
      });
  }

}
