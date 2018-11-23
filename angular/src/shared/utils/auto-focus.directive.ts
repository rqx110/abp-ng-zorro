import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[autoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
    constructor(private _element: ElementRef) { }

    ngAfterViewInit(): void {
        this._element.nativeElement.focus();
    }
}
