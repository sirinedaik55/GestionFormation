import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';

import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';

// Simple Auth
import { SimpleAuthService } from './services/simple-auth.service';
import { TestComponent } from './test.component';
import { MockAuthInterceptor } from './interceptors/mock-auth.interceptor';

// Shared Module
import { SharedModule } from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent,
        TestComponent,
    ],
    imports: [
        RouterModule,
        HttpClientModule,
        AppRoutingModule,
        AppLayoutModule,
        SharedModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, SimpleAuthService,
        // Add mock auth interceptor temporarily
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockAuthInterceptor,
            multi: true
        },
        // Temporarily disabled - causing blank page
        // {
        //     provide: APP_INITIALIZER,
        //     useFactory: (appInitService: AppInitService) => () => appInitService.initializeApp(),
        //     deps: [AppInitService],
        //     multi: true
        // }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
