import { Component, OnInit } from '@angular/core';
import { ArticleServiceService } from '../../services/article-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  items: any[] = [];
  constructor(private articleService: ArticleServiceService, private router: Router, private snackBar: MatSnackBar){

  }

ngOnInit(): void {
    this.getAllArticles()
}  

editItem(item: any): void {
  this.router.navigate(['/edit-article', item.id]);
}

deleteItem(itemId: string): void {
  // this.articleService.deteArticleById(itemId).subscribe((data) => {
  //   if(data){
  //     this.snackBar.open('Article deleted successfully!', 'Close', { duration: 3000 });
  //     this.getAllArticles();
  //   }
  // })

  this.articleService.deteArticleById(itemId).subscribe({
    next: (response) => {
      this.snackBar.open('Article deleted successfully!', 'Close', { duration: 3000 });
      this.getAllArticles();
    },
    error: (error) => {
      console.log(error)
      this.snackBar.open('Failed to deleted article. Please try again.', 'Close', { duration: 3000 });
    }
  });
}

getAllArticles(){
  this.articleService.getAllArticles().subscribe((data) => {
    this.items = data.data;
  });
}
createnew(){
  this.router.navigate(['/create-news-article']);
}

}
