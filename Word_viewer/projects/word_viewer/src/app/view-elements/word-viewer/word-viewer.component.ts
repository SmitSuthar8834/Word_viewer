import { Component, Input, ViewEncapsulation } from "@angular/core";
import {
  CrtInterfaceDesignerItem,
  CrtViewElement,
} from "@creatio-devkit/common";

@CrtViewElement({
  selector: "qnovate-word-viewer",
  type: "qnovate.WordViewer",
})
@CrtInterfaceDesignerItem({
  toolbarConfig: {
    caption: "Word Viewer",
    name: "qnovate-word-viewer",
    icon: require("!!raw-loader?{esModule:false}!./word-viewer-icon.svg"),
  },
})
@Component({
  selector: "qnovate-word-viewer",
  templateUrl: "./word-viewer.component.html",
  styleUrls: ["./word-viewer.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WordViewerComponent {
  @Input() documentUrl: string = '';
  @Input() documentContent: string = '';
  
  isLoading: boolean = false;
  error: string | null = null;
  currentDate: Date = new Date();

  async loadDocument() {
    if (!this.documentUrl && !this.documentContent) {
      this.error = "No document provided";
      return;
    }

    try {
      this.isLoading = true;
      // Here you would implement the actual document loading logic
      // This could involve calling a service to parse the Word document
      this.isLoading = false;
    } catch (err) {
      this.error = "Failed to load document";
      this.isLoading = false;
    }
  }
}