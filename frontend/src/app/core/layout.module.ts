import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {SidenavComponent} from "../sidenav/sidenav.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";

@NgModule({
  declarations: [SidenavComponent, ToolbarComponent],
  imports: [SharedModule],
  exports: [SidenavComponent, ToolbarComponent],
})
export class LayoutModule {
}
