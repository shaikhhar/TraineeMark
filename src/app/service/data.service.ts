import { Injectable } from '@angular/core';
import { Mark } from '../model/mark';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  results:Mark[]=this.getResults();
  constructor() { }

  results$ = new BehaviorSubject(this.results);

  addResult(result:any){
     this.results.push(result);
    localStorage.setItem('results',JSON.stringify(this.results));
    this.results$.next(this.results)
  }

  getResults(){
    // if localstorage get that, else init empty array
    return localStorage.getItem('results')? JSON.parse(localStorage.getItem('results')): [];
  }

 editResult(id,updatedResult){
   for(let i=0;i<this.results.length;i++){
      if(this.results[i]['id']===id){
        this.results[i]=updatedResult;
        localStorage.setItem('results',JSON.stringify(this.results));
        this.results$.next(this.results);
        break;
      }
    }
  }

deleteResult(id){
  this.results.forEach((result,index)=>{
    if(result.id===id){
      this.results.splice(index,1);
      localStorage.setItem('results',JSON.stringify(this.results));
      this.results$.next(this.results);
      return;
    }
  })
}

}
