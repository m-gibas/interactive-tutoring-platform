import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs';
import {
  Announcement,
  SortType,
  Subjects
} from '../../models/announcement.model';
import { FormsModule } from '@angular/forms';
import { SortByPipe } from '../../pipes/sort-by.pipe';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-announcements',
  standalone: true,
  templateUrl: './announcements.component.html',
  providers: [DatePipe, SortByPipe],
  imports: [
    CommonModule,
    AddAnnouncementComponent,
    NgFor,
    DatePipe,
    FormsModule,
    RouterModule,
    SortByPipe,
    MultiSelectComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ]
})
export class AnnouncementsComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private activeRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private dateAdapter = inject(DateAdapter<Date>);

  currentUser!: string;
  searchText: string = '';
  priceSort: SortType = SortType.ASC;
  priceSortTypes = Object.values(SortType);
  announcements$!: Observable<Announcement[]>;
  filteredAnnouncements$!: Observable<Announcement[]>;

  private searchSubject = new BehaviorSubject<string>('');
  private subjectSortSubject = new BehaviorSubject<Subjects[]>([]);
  private dateFilterSubject = new BehaviorSubject<string>('');

  ngOnInit(): void {
    //change date format to dd/MM/yyyy
    this.dateAdapter.setLocale('en-GB');

    this.activeRoute.queryParams.subscribe((queryParams) => {
      this.currentUser = queryParams['currentUser'] ?? '';

      this.announcements$ = this.userService.getAnnouncements();

      this.filteredAnnouncements$ = combineLatest([
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
        this.subjectSortSubject.pipe(distinctUntilChanged()),
        this.dateFilterSubject.pipe(distinctUntilChanged())
      ]).pipe(
        switchMap(([searchText, subjectSort, dateFilter]) => {
          return this.announcements$.pipe(
            map((announcements) => {
              let filteredAnnouncements = announcements;

              if (searchText.length > 0) {
                filteredAnnouncements = announcements.filter((announcement) =>
                  announcement.username
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                );
              }

              if (subjectSort.length > 0) {
                filteredAnnouncements = filteredAnnouncements.filter(
                  (announcement) =>
                    subjectSort.includes(
                      announcement.subject as unknown as Subjects
                    )
                );
              }

              if (dateFilter) {
                filteredAnnouncements = filteredAnnouncements.filter(
                  (announcement) =>
                    this.datePipe.transform(
                      announcement.datePosted.replace(' ', 'T'),
                      'shortDate'
                    ) ===
                    this.datePipe.transform(
                      dateFilter.replace(' ', 'T'),
                      'shortDate'
                    )
                );
              }

              return filteredAnnouncements;
            })
          );
        })
      );
    });
  }

  openAddAnnouncementPage(): void {
    this.router.navigate(['add-announcement'], {
      queryParams: { currentUser: this.currentUser }
    });
  }

  search(searchText: string) {
    this.searchSubject.next(searchText);
  }

  sortBySubject(subjectSort: Subjects[]): void {
    this.subjectSortSubject.next(subjectSort);
  }

  onDateChange(e: any) {
    // console.log('e.value', e.value);
    // console.log(
    //   'this.datePipe.transform',
    //   this.datePipe.transform(e.value, 'd.MM.yyyy')
    // );
    this.dateFilterSubject.next(
      this.datePipe.transform(e.value, 'shortDate') || ''
    );
  }
}
