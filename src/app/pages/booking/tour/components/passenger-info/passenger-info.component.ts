import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { Country, StorageService, GlobalRepo, Passenger, Spinner } from '../../../../../common';
import { CSTORAGE } from '../../../../../app.constants';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
@Component({
    selector: 'passenger-info',
    templateUrl: './passenger-info.component.html',
    styleUrls: ['./passenger-info.component.less']
})
export class PassengerInfoComponent extends AppBase {
    @Input() data: Passenger = null;
    @Input() isInternational: boolean = true;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    formPassenger: FormGroup;
    firstName: AbstractControl;
    lastName: AbstractControl;
    passportNumber: AbstractControl;
    dateOfBirth: AbstractControl;
    passportExpiry: AbstractControl;

    titles: any[] = [];
    selectedTitle: any = {};

    countries: Country[] = [];
    selectedCountry: Country;
    selectedNationality: Country;

    constructor(private _globalRepo: GlobalRepo,
        private _storage: StorageService,
        private _spinner: Spinner,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit() {
        this.bsConfig = Object.assign(this.bsConfig, { minDate: null })
    }

    ngOnChanges() {
        this.countries = this._storage.getItem(CSTORAGE.COUNTRY) || [];
        this.selectedNationality = this.selectedCountry = this.countries[0];

        if (!this.countries.length) {
            this.getCountry();
        }
        this.initForm();
        if (!!this.data) {
            
            if (!!this.data.type && this.data.type !== 'ADT') {
                if(this.data.type == 'CHD') {
                    this.titles = [
                        { name: 'Bé trai', value: 'MSTR', type: 'CHD' },
                        { name: 'Bé gái', value: 'MISS', type: 'CHD' },
                    ]
                }
                else{
                    this.titles = [
                        { name: 'Bé trai', value: 'MSTR', type: 'INF' },
                        { name: 'Bé gái', value: 'MISS', type: 'INF' },
                    ]
                }
               
            }
            else {
                this.titles = [
                    { name: 'Ông', value: 'MR', type: 'ADT' },
                    { name: 'Bà', value: 'MRS', type: 'ADT' },
                    { name: 'Cô', value: 'MISS', type: 'ADT' },
                ]
            }
            this.selectedTitle = this.titles.filter((t: any) => _.includes(t, this.data.title))[0] || this.titles[0];
            this.selectedCountry = this.selectedNationality = this.countries.filter((country: Country) => country.name === this.data.passportCountry)[0] || this.countries[0];
            this.initFormUpdate(this.data);
        }
    }

    //fn get country
    async getCountry() {
        this._spinner.show();
        try {
            const response: any = await this._globalRepo.getCountries();
            this.countries = (response || []).map((country: Country) => new Country(country));
            this.selectedNationality = this.selectedCountry = this.countries[0];

            this._storage.setItem(CSTORAGE.COUNTRY, this.countries);
        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //fn initForm
    initForm() {
        this.formPassenger = this.fb.group({
            'firstName': [, Validators.compose([
                Validators.required,
                Validators.maxLength(20)
            ])],
            'lastName': [, Validators.compose([
                Validators.required,
                Validators.maxLength(20)
            ])],
            'passportNumber': ['', Validators.compose([
                Validators.minLength(7)
            ])],
            'dateOfBirth': [moment()],
            'passportExpiry': [moment()],
        })

        this.firstName = this.formPassenger.controls['firstName'];
        this.lastName = this.formPassenger.controls['lastName'];
        this.passportNumber = this.formPassenger.controls['passportNumber'];
        this.dateOfBirth = this.formPassenger.controls['dateOfBirth'];
        this.passportExpiry = this.formPassenger.controls['passportExpiry'];

        this.formPassenger.valueChanges.subscribe((data: any) => {
            this.data.firstName = data.firstName;
            this.data.lastName = data.lastName;
            this.data.title = this.selectedTitle.name;
            this.data.type = this.selectedTitle.type || 'ADT';
            if (this.isInternational) {
                this.data.passportNumber = data.passportNumber;
                this.data.passportCountry = this.selectedCountry.name;
                this.data.national = this.selectedNationality.name;
                this.data.passportExpiry = (!!data.passportExpiry ? moment(data.passportExpiry).format("YYYY-MM-DD") : '');
                this.data.dateOfBirth = (!!data.dateOfBirth ? moment(data.dateOfBirth,"DD/MM/YYYY").format("YYYY-MM-DD") : '');
            }
            this.onChange.emit([this.data, this.formPassenger.valid]);
        })
    }

    initFormUpdate(passenger: Passenger) {
        this.formPassenger.setValue({
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            passportNumber: passenger.passportNumber,
            passportExpiry: passenger.passportExpiry,
            dateOfBirth: moment(passenger.dateOfBirth).format("DD/MM/YYYY")
        });
    }

    //fn on change title
    onChangeTitle(title: any) {
        this.data.title = title.name;
        this.onChange.emit([this.data, this.formPassenger.valid]);
    }

    //fn on change nation or country
    onChangeNation(country: Country, type: string) {
        switch (type) {
            case 'nation':
                this.selectedNationality = country;
                this.data.national = this.selectedNationality.name;
                break;
            case 'country':
                this.selectedCountry = country;
                this.data.passportCountry = this.selectedCountry.name;
                break;
            default:
                break;
        }
        this.onChange.emit([this.data, this.formPassenger.valid]);
    }
}
