
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule} from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({

    imports: [ MatButtonModule, MatCardModule,
               MatInputModule, MatDividerModule,
               MatSelectModule, MatCheckboxModule,
               MatSidenavModule, MatIconModule, MatDialogModule,
               MatMenuModule],
    exports: [ MatButtonModule, MatCardModule,
               MatInputModule, MatDividerModule,
               MatSelectModule, MatCheckboxModule,
               MatSidenavModule, MatIconModule, MatDialogModule,
               MatMenuModule],
  })
  export class MaterialModule { }
