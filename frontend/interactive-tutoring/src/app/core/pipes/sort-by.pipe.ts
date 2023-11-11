import { Pipe, PipeTransform } from '@angular/core';
import { SortType } from '../models/announcement.model';

@Pipe({
  name: 'sortBy',
  standalone: true
})
export class SortByPipe implements PipeTransform {
  transform(
    array: any[] | null,
    args: { field: string; order: SortType }
  ): any[] | null {
    if (!array || !args.field) {
      return array;
    }

    const order = args.order === SortType.ASC ? 1 : -1;

    return array.sort((a, b) => {
      if (a[args.field] < b[args.field]) {
        return -1 * order;
      } else if (a[args.field] > b[args.field]) {
        return 1 * order;
      } else {
        return 0;
      }
    });
  }
}
