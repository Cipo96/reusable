import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TestAllService {

    constructor(private http: HttpClient) { }

    getUsers(): Promise<any> {
        return this.http.get<any[]>('https://dummyjson.com/users').toPromise();
    }
}

export enum GenderEnumDemo {
    male = 1,
    female = 2
}

export class User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    birthDate: Date;
    hired: boolean;
    externalField: string;
    gender: GenderEnumDemo;
}