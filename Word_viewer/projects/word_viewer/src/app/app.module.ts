import {DoBootstrap, Injector, NgModule, ProviderToken} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {bootstrapCrtModule, CrtModule} from '@creatio-devkit/common';
//import { DemoComponent } from './view-elements/demo/demo.component';
import { WordViewerComponent } from './view-elements/word-viewer/word-viewer.component';
import {createCustomElement} from "@angular/elements";

@CrtModule({
  /* Specify that InputComponent is a view element. */
  //viewElements: [DemoComponent],
  viewElements:[WordViewerComponent],
})
@NgModule({
  declarations: [
    WordViewerComponent
  ],
  imports: [BrowserModule],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private _injector: Injector) {}

  ngDoBootstrap(): void {
    /* Register InputComponent as an Angular Element. */
    const cmp = createCustomElement(WordViewerComponent, {
      injector: this._injector,
    });
    customElements.define("qnovate-word-viewer", cmp);
    /* Bootstrap CrtModule definitions. */
    bootstrapCrtModule('word_viewer', AppModule, {
      resolveDependency: (token) => this._injector.get(<ProviderToken<unknown>>token)
    });
  }
}