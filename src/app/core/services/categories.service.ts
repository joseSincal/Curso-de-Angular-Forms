import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Category } from "./../models/category.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class CategoriesService {
    constructor(private htto: HttpClient) {}

    getAllCategories() {
        return this.htto.get<Category[]>(`${environment.url_api}/categories`);
    }

    getCategory(id: number) {
        return this.htto.get<Category>(`${environment.url_api}/categories/${id}`);
    }

    createCategory(data: Partial<Category>) {
        return this.htto.post<Category>(`${environment.url_api}/categories/`, data);
    }

    updateCategory(id: number, data: Partial<Category>) {
        return this.htto.put<Category>(`${environment.url_api}/categories/${id}`, data);
    }
}
