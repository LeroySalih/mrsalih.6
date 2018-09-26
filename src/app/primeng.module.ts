
import { NgModule } from '@angular/core';
import { RatingModule} from 'primeng/rating';
import { ButtonModule} from 'primeng/button';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {GrowlModule} from 'primeng/growl';
import {InplaceModule} from 'primeng/inplace';
import {EditorModule} from 'primeng/editor';
import {DialogModule} from 'primeng/dialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {CheckboxModule} from 'primeng/checkbox';
import {CardModule} from 'primeng/card';
import {DragDropModule} from 'primeng/dragdrop';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import {TreeModule} from 'primeng/tree';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CarouselModule} from 'primeng/carousel';
@NgModule({

    imports: [RatingModule, ButtonModule, TriStateCheckboxModule, GrowlModule,
      InplaceModule, EditorModule, InputTextModule, DialogModule, SplitButtonModule, CheckboxModule,
      CardModule, DragDropModule, DropdownModule, RadioButtonModule, TreeModule,
      TreeTableModule, InputSwitchModule, TableModule, AccordionModule, ConfirmDialogModule, CarouselModule
    ],
    exports: [RatingModule, ButtonModule, TriStateCheckboxModule, GrowlModule,
      InplaceModule, EditorModule, InputTextModule, DialogModule, SplitButtonModule, CheckboxModule,
    CardModule, DragDropModule, DropdownModule, RadioButtonModule, TreeModule,
    TreeTableModule, InputSwitchModule, TableModule, AccordionModule, ConfirmDialogModule, CarouselModule ],
  })
  export class PrimeNGModule { }
