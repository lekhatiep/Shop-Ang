import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    private currentPageSubject = new BehaviorSubject<number>(1);
    currentPage$ = this.currentPageSubject.asObservable();

    setCurrentPage(pageNumber: number){
        this.currentPageSubject.next(pageNumber);
    }
}