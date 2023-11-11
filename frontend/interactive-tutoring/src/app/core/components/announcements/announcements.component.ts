import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

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
    MatNativeDateModule
  ]
})
export class AnnouncementsComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private activeRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  currentUser!: string;
  announcements$!: Observable<Announcement[]>;
  filteredAnnouncements$!: Observable<Announcement[]>;
  recentFilteredAnnouncements$!: Observable<Announcement[]>;
  searchTerm: string = '';

  priceSort: SortType = SortType.ASC;
  priceSortTypes = Object.values(SortType);

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((queryParams) => {
      console.log('queryParams chat', queryParams);
      this.currentUser = queryParams['currentUser'] ?? '';
      console.log(this.currentUser);

      this.announcements$ = this.userService.getAnnouncements(this.currentUser);
      this.filteredAnnouncements$ = this.announcements$;
      this.recentFilteredAnnouncements$ = this.announcements$;

      this.announcements$.subscribe((res) => console.log(res));
    });
  }

  search(searchTerm: string) {
    // if(searchTerm.length === 0) {
    //   this.filteredAnnouncements$ = this.recentFilteredAnnouncements$;
    // }

    this.filteredAnnouncements$ = this.announcements$.pipe(
      map((announcements) => {
        return announcements.filter((announcement) =>
          this.doesAnnouncementMatchSearchTerm(announcement, searchTerm)
        );
      })
    );

    // this.filteredAnnouncements$ = this.announcements$.pipe(
    //   map((announcements) => {
    //     return announcements.filter((announcement) =>
    //       this.doesAnnouncementMatchSearchTerm(announcement, this.searchTerm)
    //     );
    //   })
    // );
  }

  doesAnnouncementMatchSearchTerm(
    announcement: Announcement,
    searchTerm: string
  ): boolean {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    if (lowerCaseSearchTerm.length === 0) {
      this.filteredAnnouncements$ = this.announcements$;
      return false;
    }
    return (
      announcement.username.toLowerCase().includes(lowerCaseSearchTerm) ||
      this.datePipe
        .transform(announcement.datePosted, "d.MM.yyyy 'at' H:mm : 'pl'")!
        .toLowerCase()
        .includes(lowerCaseSearchTerm)
    );
  }

  sortBySubject(subjectSort: Subjects[]): void {
    if (subjectSort.length === 0) {
      // this.filteredAnnouncements$ = this.announcements$;
      return;
    }

    this.filteredAnnouncements$ = this.announcements$.pipe(
      map((announcements) => {
        return announcements.filter((announcement) =>
          subjectSort.includes(announcement.subject as unknown as Subjects)
        );
      })
    );
  }

  openAddAnnouncementPage(): void {
    this.router.navigate(['add-announcement'], {
      queryParams: { currentUser: this.currentUser }
    });
  }

  onDateChange(e: any) {
    // console.log(e.value);
    this.filteredAnnouncements$ = this.announcements$.pipe(
      map((announcements) => {
        return announcements.filter(
          (announcement) =>
            this.datePipe.transform(announcement.datePosted, 'd.MM.yyyy') ===
            this.datePipe.transform(e.value, 'd.MM.yyyy')
        );
      })
    );
  }
}
