import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true
})
export class SortByPipe implements PipeTransform {
  transform(
    array: any[] | null,
    args: { field: string; order: 'asc' | 'desc' }
  ): any[] | null {
    if (!array || !args.field) {
      return array;
    }

    const order = args.order === 'asc' ? 1 : -1;

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
