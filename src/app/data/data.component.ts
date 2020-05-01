import { Component, OnInit } from '@angular/core';
import { Mark } from '../model/mark';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  result:Mark = new Mark();

  detailPanelOn=false;

  removeBtnDisabled=true;

  name:string;
  results:Mark[];
  results1:Mark[];
  editMode=false;
  selectedRow:any;

  page:any=1  ;
  pageSize=10;

  sortOrder = 'asc'; //default is ascending order
  searchStr = '' //get search string from search box
  sortBy: string;

  constructor(private data:DataService) { }

  ngOnInit(): void {
    console.log("Detail panel status "+this.detailPanelOn);
    this.data.results$.subscribe(results=>{
      if(results){
        this.results=results;
        this.results1=results;

      }else{
        this.results=[];
        this.results1=[];
      }
      console.log("Results array "+JSON.stringify(this.results))
    })
  }

  toggleDetailPanelOn(){
    this.detailPanelOn=true;
  }

  addMark(){
    if(this.validate()){
      console.log("validated ? "+this.validate());
      console.log(JSON.stringify(this.result));
    this.data.addResult(this.result);
    this.result=new Mark();
    }

  }

  populateOnDetailPanel(result:any){
    this.detailPanelOn=true;
    this.editMode=true;
    this.result=result;
    this.removeBtnDisabled=false;
    this.selectedRow=result;
  }
  editMark(){
    const toEdit= this.result;
    if(this.validate()){
      this.data.editResult(toEdit.id, toEdit);
    this.result=new Mark();
    this.detailPanelOn=false;
    }
  }

  deleteMark(){
    const toEdit = this.result;
    if(confirm("Delete mark?")) {
       this.data.deleteResult(toEdit.id);
       this.removeBtnDisabled=true;
    }
  }

  test(text:string){
    console.log("Test template "+text);
  }

  validate(){
    if(this.result.id.length>0){
      if(this.result.name.length>0){
        if(this.result.grade.length>0){
          if(this.result.email.length>0){
            if(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.result.email)){
              if(this.result.date_joined.toString().length>0){
                if(this.result.subject.length>0){
                  return true;
                }else{
                  alert("Missing subject");
                }
              }
              else{
                alert("Enter joined_date");
              }
            }else{
              alert("Invalid email")
            }
          }else{
            alert("Please enter email")
          }
        }else{
          alert("Please enter grade")
        }
      }else{
        alert("Please enter name")
      }
    }else{
      alert("provide id");
    }
  }

  sortType(sort: string) {
    // if sortOrder is set to 'desc' and this.sortBy is same as 'sort'=> only then descending-sort else always do ascending
    console.log("sort by: " + sort);
    if (this.sortOrder === 'desc' && this.sortBy === sort) {
      console.log(this.sortOrder);
      this.results = [...this.results].sort((c1: Mark, c2: Mark) => {
        const c1l = c1[sort].toLowerCase();
        const c2l = c2[sort].toLowerCase();
        return c1l < c2l ? 1 : c1l > c2l ? -1 : 0;
      });
      this.sortBy = sort;
      this.sortOrder = 'asc';
    }
    else {
      console.log(this.sortOrder);
      this.results = [...this.results].sort((c1: Mark, c2: Mark) => {
        const c1l = c1[sort].toLowerCase();
        const c2l = c2[sort].toLowerCase();
        return c1l < c2l ? -1 : c1l > c2l ? 1 : 0;
      });
      this.sortBy = sort;
      this.sortOrder = 'desc';
    }
    // this.cd.detectChanges();
  }

  search() {
    let value = [...this.results1];
    if (this.searchStr === "") {
      return this.results = value
    }
    this.results = value.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(this.searchStr.toLowerCase());
    });
  }

}
