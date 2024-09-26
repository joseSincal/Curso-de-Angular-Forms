import { Component, OnInit } from "@angular/core";

import { ActivatedRoute, Params, Router } from "@angular/router";
import { CategoriesService } from "./../../../../core/services/categories.service";

import { Category } from "./../../../../core/models/category.model";

@Component({
    selector: "app-category",
    templateUrl: "./category.component.html",
    styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
    category: Category;

    constructor(
        private categoriesService: CategoriesService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            if (params.id) {
                this.getCategory(params.id);
            }
        });
    }

    createCategory(data) {
        this.categoriesService.createCategory(data).subscribe((newCategory) => {
            console.log(newCategory);
            this.router.navigate(["./admin/categories"]);
        });
    }

    updateCategory(data) {
        this.categoriesService
            .updateCategory(this.category.id, data)
            .subscribe((newCategory) => {
                console.log(newCategory);
                this.router.navigate(["./admin/categories"]);
            });
    }

    private getCategory(id: string) {
        this.categoriesService.getCategory(Number(id)).subscribe((category) => {
            this.category = category;
        });
    }
}
