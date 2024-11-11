import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef: ComponentRef<ModalComponent> | null = null;
  public viewContainerRef: any;
  

  setViewContainerRef(vcr: any) {
    this.viewContainerRef = vcr;
  }

  openModal(component: any,  data?: {}, widthPercent: number = 50 ) {
    if(this.modalRef){
        this.closeModal();
    }

    if(!this.modalRef){
        this.modalRef = this.viewContainerRef.createComponent(ModalComponent);  
    }

    if (this.modalRef) {
      this.modalRef.instance.widthPercent = widthPercent;
      this.modalRef.instance.data = data;
       // Lắng nghe sự kiện close để đóng modal
      this.modalRef.instance.close.subscribe(() => this.closeModal());
      this.modalRef.instance.component = component;

    }
   
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = null;
    }
  }

//   constructor(private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) { }

//   openModal(component: any, width: number = 50) {
//     if (!this.modalComponentRef) {
//       const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent)
//       const modalComponentRef = componentFactory.create(this.injector);
//       this.modalComponentRef = modalComponentRef;
//       this.appRef.attachView(modalComponentRef.hostView)
//       document.body.appendChild(modalComponentRef.location.nativeElement)
//       this.modalComponentRef.instance.width = width
//     }

//     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component)
//     const componentRef = componentFactory.create(this.injector);
//     if (this.modalComponentRef) {
//       setTimeout(() => { // Ensure modal component is fully initialized before appending content
//         this.modalComponentRef?.instance.modalBodyRef.nativeElement.appendChild(componentRef.location.nativeElement)
//       });
//     }
//   }
}
