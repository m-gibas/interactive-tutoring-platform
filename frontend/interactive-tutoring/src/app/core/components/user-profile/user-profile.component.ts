import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);

  username!: string;

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') ?? '';
    // You can also subscribe to paramMap changes if the component can be reused
    // this.route.paramMap.subscribe(params => {
    //   this.username = params.get('username');
    // });
  }
}
