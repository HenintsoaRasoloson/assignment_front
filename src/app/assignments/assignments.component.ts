import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { Subject } from '../subject/subject.model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: [
    './assignments.component.css',
    './../../assets/css/fontface.css',
    "./../../assets/vendor/icofont/icofont.min.css",
    './../../assets/vendor/boxicons/css/boxicons.min.css',
    "./../../assets/vendor/owl.carousel/assets/owl.carousel.min.css",
    './../../assets/vendor/venobox/venobox.css',
    './../../assets/vendor/aos/aos.css',
    './../../assets/css/style.css'
]

})
export class AssignmentsComponent implements OnInit {
  assignments:Assignment[];
  assignmentsRendu:Assignment[] = [];
  assignmentsNonRendu:Assignment[] = [];
  page: number=1;
  limit: number=10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;
  closeResult = '';
  // on injecte le service de gestion des assignments
  constructor(private assignmentsService:AssignmentsService,
              private modalService: NgbModal,
              private route:ActivatedRoute,
              private router:Router) {}

  ngOnInit() {
    console.log('AVANT AFFICHAGE');
    // on regarde s'il y a page= et limit = dans l'URL
    this.route.queryParams.subscribe(queryParams => {
      console.log("Dans le subscribe des queryParams")
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;

      this.getAssignments();
    });
      console.log("getAssignments() du service appelé");
  }

  getAssignments() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
    .subscribe(data => {
      this.assignments = data.docs;
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;
      this.splitRendu();
      console.log("données reçues");
    });
  }
  splitRendu(){
    this.assignmentsRendu = [];
    this.assignmentsNonRendu = [];
    this.assignments.forEach( a => {
      if(a.rendu){
        this.assignmentsRendu.push(a);
      } 
      else {
        this.assignmentsNonRendu.push(a);
      }
    });
  }

  onDeleteAssignment(event) {
    // event = l'assignment à supprimer

    //this.assignments.splice(index, 1);
    this.assignmentsService.deleteAssignment(event)
      .subscribe(message => {
        console.log(message);
      })
  }

  premierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page:1,
        limit:this.limit,
      }
    });
  }

  pageSuivante() {
    /*
    this.page = this.nextPage;
    this.getAssignments();*/
    this.router.navigate(['/home'], {
      queryParams: {
        page:this.nextPage,
        limit:this.limit,
      }
    });
  }


  pagePrecedente() {
    this.router.navigate(['/home'], {
      queryParams: {
        page:this.prevPage,
        limit:this.limit,
      }
    });
  }

  dernierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page:this.totalPages,
        limit:this.limit,
      }
    });
  }

  // Modal
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
