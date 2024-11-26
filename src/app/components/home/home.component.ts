import { Component, OnInit } from '@angular/core';
import { ArticleServiceService } from '../../services/article-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {categories} from '../../models/constants'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categories = categories;
  selectedCategory: string = 'All';
  items: any[] = [];
  constructor(private articleService: ArticleServiceService, private router: Router, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.selectedCategory = 'All'
    this.getAllArticles()
  }

  editItem(item: any): void {
    this.router.navigate(['/edit-article', item.id]);
  }

  deleteItem(itemId: string): void {
    this.articleService.deteArticleById(itemId).subscribe({
      next: (response) => {
        this.snackBar.open('Article deleted successfully!', 'Close', { duration: 3000 });
        this.getAllArticles();
      },
      error: (error) => {
        this.snackBar.open('Failed to deleted article. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  getAllArticles() {
    this.articleService.getAllAdmin().subscribe((data) => {
      this.items = data.data;
    });
  }

  createnew() {
    this.router.navigate(['/create-news-article']);
  }

  getDataByCategory(category:string){
    this.articleService.getDataByCategory(category).subscribe((data) => {
      this.items = data.data;
    });
  }

  onCategoryChange() {
    if(this.selectedCategory.toLocaleLowerCase() == 'all'){
      this.getAllArticles()
    } else {
      this.getDataByCategory(this.selectedCategory);
    }
  }

  enableOrDisableitem(id: string, status: boolean ){
    let itemStatus = status ? false : true;
    this.articleService.updatestatus(id, itemStatus).subscribe({
      next: (response) =>{
        if(response.data){
          this.snackBar.open('status updated successfully!', 'Close', { duration: 3000 });
          this.getAllArticles();
        } else{
          this.snackBar.open('Failed to update status. Please try again.', 'Close', { duration: 3000 });
        }
      }
    })
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
