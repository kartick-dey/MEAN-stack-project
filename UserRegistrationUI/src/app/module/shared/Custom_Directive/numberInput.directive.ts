import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberInput]'
})
export class NumberInputDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) input(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
