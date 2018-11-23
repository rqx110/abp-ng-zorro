import { AppLocalizationService } from './localization/app-localization.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'no-data',
    template: `
   <span class="no-result-data">
    <i *ngIf="icon" [class]="icon"></i>
    <span>{{text}}</span>
   </span>
  `,
    styles: [
        `
      .no-result-data {
        color: rgba(0, 0, 0, 0.25);
        text-align: center;
        line-height: 64px;
        font-size: 16px;
        margin: 0 auto;
      }
      .no-result-data i {
        font-size: 24px;
        margin-right: 16px;
        position: relative;
        top: 3px;
      }
    `,
    ],
    preserveWhitespaces: false,
})
export class NoDataComponent implements OnInit {
    @Input()
    text: string;

    @Input()
    icon = 'anticon anticon-frown-o';

    constructor(private appLocalizationService: AppLocalizationService) { }

    ngOnInit() {
        if (!this.text) {
            this.text = this.appLocalizationService.l('NoData');
        }
    }
}
