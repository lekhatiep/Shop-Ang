import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faShoppingCart,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../../features/product/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule,CommonModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent implements OnInit {
  //In, Out, Others...
  @Output() searchText = new EventEmitter<string>();

  formSearch = new FormGroup({
    searchText: new FormControl(''),
  });
  //Inject
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  //Variables
  historyList : string[] = [];
  isContainText = false;
  isFocused  = false;
  searchScopeText : 'Trong shop' | 'Ngoài shop' = 'Trong shop';

  constructor(library: FaIconLibrary) {
    library.addIcons(faMagnifyingGlass,faXmark);
    console.log(library);
    
  }

  ngOnInit(){
    this.loadHistoryItemSearchLocalStore(); 
    const subSearchInput = this.formSearch.controls.searchText.valueChanges.subscribe((value)=>{
      this.isContainText = true;
    })

    this.destroyRef.onDestroy(()=>{
      subSearchInput.unsubscribe();
    })
  }

  onSubmit() {
    if (!this.formSearch.valid) return;

    var searchTextControl = this.formSearch.controls.searchText;
    if (searchTextControl.valid) {
      this.productService.filterModal.searchText = searchTextControl.value ?? '';
      this.productService.loadProductByFilter();
    }

    if(searchTextControl.value && !this.historyList.includes(searchTextControl.value)){
      this.historyList.push(searchTextControl.value)
      this.historyList.reverse();
      localStorage.setItem('history-search', JSON.stringify(this.historyList));
    }
  }

  onFocus(){
    this.isFocused  = true;
  }

  onBlur() {

    setTimeout(() => {
      this.isFocused = false;
    }, 150);
  }

  removeItemHistory(name: string){
    this.historyList = this.historyList.filter((value)=> value != name);
    const historyListData =  localStorage.getItem('history-search');

    if(historyListData){
      localStorage.setItem('history-search', JSON.stringify(this.historyList));  

      this.loadHistoryItemSearchLocalStore(); 
    }
    
  }

  searchItemHistory(name: string){
    this.formSearch.controls.searchText.setValue(name);
    // this.onSubmit();
  }

  clearTextSearch(){
    this.formSearch.controls.searchText.setValue('');
    this.isContainText = false;
  }

  onChangeSearchScope(){
    this.searchScopeText = this.searchScopeText === 'Trong shop' ? 'Ngoài shop' : 'Trong shop';
  }
  private loadHistoryItemSearchLocalStore(){
    const historyListData =  localStorage.getItem('history-search');
    if(historyListData){
      const list = JSON.parse(historyListData).reverse();
      this.historyList = [...list].slice(0,3);
    }
  }
}
