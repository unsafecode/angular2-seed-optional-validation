import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app";
import {Github} from "./github/shared/github";
import {FormsModule, ReactiveFormsModule, FormControl, ControlContainer, FormGroup, AbstractControl} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {About} from "./about/about";
import {Home} from "./home/home";
import {RepoBrowser} from "./github/repo-browser/repo-browser";
import {RepoList} from "./github/repo-list/repo-list";
import {RepoDetail} from "./github/repo-detail/repo-detail";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";

import { Directive, Input,OnInit, OnChanges, Optional, Host, SkipSelf } from "@angular/core";

@Directive({
  selector: "[formControlName][dynamicDisable]"
})
export class DynamicDisable implements OnInit, OnChanges {
  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
  ) {

  }

  @Input() formControlName: string;
  @Input() dynamicDisable: boolean;

  private ctrl: AbstractControl;

  ngOnInit() {
    if(this.parent && this.parent["form"]) {
      this.ctrl = (<FormGroup>this.parent["form"]).get(this.formControlName);
    }
  }

  ngOnChanges() {
    if (!this.ctrl) return;

    if (this.dynamicDisable) {
      this.ctrl.disable();
    }
    else {
      this.ctrl.enable();
    }
  }
}

@NgModule({
  declarations: [AppComponent, About, RepoBrowser, RepoList, RepoDetail, Home, DynamicDisable],
  imports     : [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig)],
  providers   : [Github, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule {

}
