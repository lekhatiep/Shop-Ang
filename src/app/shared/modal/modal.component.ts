import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalConfig } from './modal-config.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit, OnInit {

  @ViewChild('modalBody', { read: ViewContainerRef }) modalBodyRef!: ViewContainerRef;
  @Input() widthPercent: number = 50;
  @Input() component: any;
  @Input() data?: Partial<{[key: string]: any }>;
  @Input() useDefaultButtonModal = true;
  @Input() configs : ModalConfig = {
    widthPercent: this.widthPercent,
    useDefaultButtonModal: this.useDefaultButtonModal,
    height: 100,
    width: 200
  };
  @Output() close = new EventEmitter<void>();


  private contentRef: ComponentRef<any> | null = null;

  closeModal() {
    this.close.emit();
    //this.clearContent() 
  }

  ngOnInit(): void {
    if(this.data){
      this.configs.useDefaultButtonModal = this.data["useDefaultButtonModal"];
    }
    
  }

  ngAfterViewInit(): void {
    
    if(this.data){
      //this.configs.useDefaultButtonModal = this.data["useDefaultButtonModal"];
    }
    
    if (this.modalBodyRef) {
        this.addContent(this.component, this.data);

    }
  }

  addContent<T>(component: Type<T>, data?: Partial<T>) {
    if (this.modalBodyRef) {
      // Xóa nội dung cũ nếu có
      this.modalBodyRef.clear();

      // Tạo component mới trong #modalBody
      this.contentRef = this.modalBodyRef.createComponent(component);

      // if (this.contentRef?.instance instanceof LoginComponent) {
      //   this.contentRef.instance.isModal = true;
      // }

      // Truyền dữ liệu vào component động
      if (data) {  
        Object.assign(this.contentRef.instance, data);
      }
    }
  }

  clearContent() {
    if (this.contentRef) {
      this.contentRef.destroy();
      this.contentRef = null;
    }
  }
}
