import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  personaNatural() {
    this.router.navigate(['/register/natural']);
  }

  personaJuridica() {
    this.router.navigate(['/register/juridica']);
  }
}
