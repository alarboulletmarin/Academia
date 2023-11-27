import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {SidenavComponent} from "../sidenav/sidenav.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [SidenavComponent, ToolbarComponent],
  imports: [SharedModule, TranslateModule],
  exports: [SidenavComponent, ToolbarComponent],
})
export class LayoutModule {}
