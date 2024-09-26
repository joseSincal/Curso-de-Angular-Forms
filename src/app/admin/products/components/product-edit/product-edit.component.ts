import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { MyValidators } from "./../../../../utils/validators";
import { ProductsService } from "./../../../../core/services/products/products.service";
import { CategoriesService } from "src/app/core/services/categories.service";
import { Category } from "src/app/core/models/category.model";
import { state } from "@angular/animations";

@Component({
    selector: "app-product-edit",
    templateUrl: "./product-edit.component.html",
    styleUrls: ["./product-edit.component.scss"],
})
export class ProductEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    categories: Category[] = [];
    states = [
        { name: "Arizona", abbrev: "AZ" },
        { name: "California", abbrev: "CA" },
        { name: "Colorado", abbrev: "CO" },
        { name: "New York", abbrev: "NY" },
        { name: "Pennsylvania", abbrev: "PA" },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.buildForm();
    }

    ngOnInit() {
        this.getCategories();
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params.id;
            this.productsService.getProduct(this.id).subscribe((product) => {
                this.form.patchValue({
                    ...product,
                    categoryId: product?.category.id,
                    state: this.states[2]
                });
            });
        });
    }

    saveProduct(event: Event) {
        event.preventDefault();
        if (this.form.valid) {
            const product = this.form.value;
            this.productsService
                .updateProduct(this.id, product)
                .subscribe((newProduct) => {
                    console.log(newProduct);
                    this.router.navigate(["./admin/products"]);
                });
        }
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            title: ["", [Validators.required, Validators.minLength(4)]],
            price: ["", [Validators.required, MyValidators.isPriceValid]],
            images: ["", Validators.required],
            categoryId: ["", Validators.required],
            description: ["", [Validators.required, Validators.minLength(10)]],
            state: ["", Validators.required],
        });
    }

    get priceField() {
        return this.form.get("price");
    }

    get categoryIdField() {
        return this.form.get("categoryId");
    }

    private getCategories() {
        this.categoriesService.getAllCategories().subscribe((categories) => {
            this.categories = categories;
        });
    }
}
