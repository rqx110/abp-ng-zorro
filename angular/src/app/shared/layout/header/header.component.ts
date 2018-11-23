import { Component, ViewEncapsulation } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  searchToggleStatus: boolean;

  constructor(public settings: SettingsService) { }

  toggleCollapsedSidebar() {
    const collapsed = !this.settings.layout.collapsed;
    this.settings.setLayout('collapsed', collapsed);
    abp.event.trigger('abp.theme-setting.collapsed', collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
}
