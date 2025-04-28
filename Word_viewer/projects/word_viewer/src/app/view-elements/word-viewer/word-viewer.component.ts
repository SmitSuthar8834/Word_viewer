import { Component, Input, ViewEncapsulation, OnInit, Output, EventEmitter } from "@angular/core";
import {
  CrtInterfaceDesignerItem,
  CrtViewElement,
  CrtInput,
  CrtOutput
} from "@creatio-devkit/common";
import * as mammoth from 'mammoth';

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
export class WordViewerComponent implements OnInit {
  @Input()
  @CrtInput()
  set documentUrl(value: string) {
    console.log('Document URL received:', value);
    this._documentUrl = value || '';
    this.loadDocument();
  }
  get documentUrl() {
    return this._documentUrl;
  }
  private _documentUrl: string = '';

  @Input()
  @CrtInput()
  set documentContent(value: string) {
    console.log('Document content received:', value);
    this._documentContent = value || '';
    this.loadDocument();
  }
  get documentContent() {
    return this._documentContent;
  }
  private _documentContent: string = '';

  @Input()
  @CrtInput()
  set attachmentId(value: string) {
    console.log('Attachment ID received:', value);
    this._attachmentId = value || '';
    if (this._attachmentId && this._schemaName) {
      this.loadAttachment();
    }
  }
  get attachmentId() {
    return this._attachmentId;
  }
  private _attachmentId: string = '';

  @Input()
  @CrtInput()
  set schemaName(value: string) {
    console.log('Schema name received:', value);
    this._schemaName = value || '';
    if (this._attachmentId && this._schemaName) {
      this.loadAttachment();
    }
  }
  get schemaName() {
    return this._schemaName;
  }
  private _schemaName: string = '';

  @Output()
  @CrtOutput()
  loadingStateChange = new EventEmitter<boolean>();

  @Output()
  @CrtOutput()
  errorChange = new EventEmitter<string>();
  
  isLoading: boolean = false;
  error: string | null = null;
  currentDate: Date = new Date();

  ngOnInit(): void {
    console.log('Component initialized with:', {
      documentUrl: this.documentUrl,
      documentContent: this.documentContent,
      attachmentId: this.attachmentId,
      schemaName: this.schemaName
    });
  }

  private setLoading(loading: boolean) {
    this.isLoading = loading;
    this.loadingStateChange.emit(loading);
  }

  private setError(error: string | null) {
    this.error = error;
    if (error) {
      this.errorChange.emit(error);
    }
  }

  async loadAttachment() {
    if (!this.attachmentId || !this.schemaName) {
      this.setError("Attachment ID or Schema Name not provided");
      return;
    }

    try {
      this.setLoading(true);
      // Here implement the attachment loading logic using Creatio services
      // This would typically involve querying the attachment and setting documentContent
      this.setLoading(false);
    } catch (err) {
      this.setError("Failed to load attachment");
      this.setLoading(false);
    }
  }

  convertedHtml: string = '';

  async loadDocument() {
    if (!this.documentUrl && !this.documentContent) {
      this.setError("No document provided");
      return;
    }

    try {
      this.setLoading(true);
      
      if (this.documentContent) {
        // Convert base64 string to ArrayBuffer
        const binaryString = window.atob(this.documentContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const result = await mammoth.convertToHtml({arrayBuffer: bytes.buffer});
        this.convertedHtml = result.value;
      } else if (this.documentUrl) {
        const response = await fetch(this.documentUrl);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({arrayBuffer});
        this.convertedHtml = result.value;
      }
      
      this.setLoading(false);
    } catch (err) {
      console.error('Document conversion error:', err);
      this.setError("Failed to load document");
      this.setLoading(false);
    }
  }
}