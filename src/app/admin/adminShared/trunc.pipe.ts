import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, chars: number): string {
    let text = value.substring(0, chars);
    if(value.length > chars) {
      text = text.concat('...');
    }
    return text;
  }

}
