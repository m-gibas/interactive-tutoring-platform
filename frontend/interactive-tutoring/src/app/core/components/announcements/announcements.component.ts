import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Announcement } from '../../models/announcement';
import { FormsModule } from '@angular/forms';
import { SortByPipe } from '../../pipes/sort-by.pipe';

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
    SortByPipe
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
  searchTerm: string = '';

  priceSort: 'asc' | 'desc' = 'asc'; // Default sorting order for price
  subjectSort: 'asc' | 'desc' = 'asc'; // Default sorting order for subject

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((queryParams) => {
      console.log('queryParams chat', queryParams);
      this.currentUser = queryParams['currentUser'] ?? '';
      console.log(this.currentUser);

      this.announcements$ = this.userService.getAnnouncements(this.currentUser);
      this.filteredAnnouncements$ = this.announcements$;

      this.announcements$.subscribe((res) => console.log(res));
    });
  }

  search() {
    this.filteredAnnouncements$ = this.announcements$.pipe(
      map((announcements) => {
        return announcements.filter((announcement) =>
          this.doesAnnouncementMatchSearchTerm(announcement, this.searchTerm)
        );
      })
    );
  }

  doesAnnouncementMatchSearchTerm(
    announcement: Announcement,
    searchTerm: string
  ): boolean {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      announcement.username.toLowerCase().includes(lowerCaseSearchTerm) ||
      announcement.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
      this.datePipe
        .transform(announcement.datePosted, "d.MM.yyyy 'at' H:mm : 'pl'")
        ?.toLowerCase()
        .includes(lowerCaseSearchTerm) ||
      announcement.price.toString().toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  sortBySubject(announcements: Announcement[]): Announcement[] {
    return announcements.sort((a, b) => {
      if (this.subjectSort === 'asc') {
        return a.subject.localeCompare(b.subject);
      } else {
        return b.subject.localeCompare(a.subject);
      }
    });
  }

  openAddAnnouncementPage(): void {
    this.router.navigate(['add-announcement'], {
      queryParams: { currentUser: this.currentUser }
    });
  }
}
