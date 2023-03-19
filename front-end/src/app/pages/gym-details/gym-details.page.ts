import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import{GymService} from './../../services/gym.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gym-details',
  templateUrl: './gym-details.page.html',
  styleUrls: ['./gym-details.page.scss'],
})
export class GymDetailsPage implements OnInit {

  gymForm!: FormGroup;
  id:any;
  submitted=false;

  isLoadingResults = false;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    public router :Router,
    private gymApi:GymService,
  ) { }

  ngOnInit() {

    let idu = this.id || this.actRoute.snapshot.paramMap.get('id');
    this.getGym(idu);
    this.gymForm = this.fb.group({
      gym_id: [localStorage.getItem('gymID'), Validators.required],
      gym_name : ['', Validators.required],
      Emergency_mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gym_gstin:['', Validators.required],
      gym_address_lat:['', Validators.required],
      gym_address_long: ['', Validators.required],
      //   email: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      //   ],
      // ],
    });
  }

  // Getter to access form control
  get myForm() {
    return this.gymForm.controls;
  }

  getGym(id) {
    this.gymApi.getGym(id).subscribe((data) => {
      this.gymForm.setValue({
      user_id: data.user_id,
      gym_name: data.gym_name,
      gym_emergency: data.gym_emergency,
      gym_mobile: data.gym_mobile,
      gym_gstin: data.gym_gstin,
      gym_address_lat: data.gym_address_lat,
      gym_address_long: data.gym_address_long
      });
    });
  }


  updateGym() {
    this.gymForm = this.fb.group({
      user_id: ['USER ID',[Validators.required]],
      gym_name: ['',[Validators.required]],
      gym_emergency: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      gym_mobile: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      gym_gstin: [''],
      gym_address_lat: [''],
      gym_address_long: ['']
    });
  }
 
  onSubmit() {
    this.submitted = true;
    if (!this.gymForm.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.gymApi.update(id, this.gymForm.value).subscribe({
          complete: () => {

            this.router.navigateByUrl('/gym-list');
            console.log('Content updated successfully!');
          },
          error: (e) => {
            console.log(e);
          },
        });
      }
    }
  }
}