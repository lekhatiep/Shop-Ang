import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../features/product/services/product.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnChanges, OnInit {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;

  @Output() pageChanged = new EventEmitter<number>();
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  private cdRef = inject(ChangeDetectorRef);

  pageArray: (number | string)[] = []; // Array of pages and ellipses

  constructor(fontLib: FaIconLibrary) {
    fontLib.addIcons(faAngleLeft, faAngleRight);
  }

  ngOnInit(): void {
    const sub = this.productService.isNextPage$.subscribe({
      next: (isNext) => {
        if (isNext) {
          this.nextPage();
          
        }else{
          this.previousPage();
        }

        this.cdRef.markForCheck();
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  goToPage(page: number) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
      this.generatePages(); // Regenerate page array when the page changes
    }
  }

  nextPage() {
    console.log('nextPage', this.totalPages);

    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generatePages();
  }

  generatePages(): void {
    const visiblePages = 5; // Number of pages to display at a time
    const pages: (number | string)[] = [];

    if (this.totalPages <= visiblePages) {
      // If total pages are within the visible limit, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first few pages, ellipsis, last page
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '…', this.totalPages);
      } else if (this.currentPage > this.totalPages - 3) {
        pages.push(
          1,
          '…',
          this.totalPages - 4,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages
        );
      } else {
        pages.push(
          1,
          '…',
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          '…',
          this.totalPages
        );
      }
    }
    this.pageArray = pages;
  }
}
