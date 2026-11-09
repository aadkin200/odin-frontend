import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<header class="site-header"><div class="nav-shell"><a routerLink="/" class="brand" (click)="menuOpen.set(false)"><span class="rune">ᛟ</span> ODIN'S CHOSEN</a>
<nav [class.open]="menuOpen()"><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="menuOpen.set(false)">Home</a><a routerLink="/introduction" routerLinkActive="active" (click)="menuOpen.set(false)">Introduction</a><a routerLink="/odins-law" routerLinkActive="active" (click)="menuOpen.set(false)">Odin's Law</a><a routerLink="/structure" routerLinkActive="active" (click)="menuOpen.set(false)">Structure</a><a routerLink="/cashflow" routerLinkActive="active" (click)="menuOpen.set(false)">Cashflow</a><button class="login" (click)="auth.login()">Login with Discord</button></nav>
<button class="menu-button" (click)="menuOpen.set(!menuOpen())" [attr.aria-label]="menuOpen()?'Close menu':'Open menu'">{{menuOpen()?'✕':'☰'}}</button></div></header>
<main><router-outlet /></main>
<footer class="footer"><div class="rune">ᛟ</div><h3>ODIN'S CHOSEN MC</h3><p class="eyebrow">Respect the Patch · Bound by Oath · Odin Watches Always</p><div class="ember-line"></div><p class="notice"><b>NOTICE</b> Odin's Chosen is part of a roleplay community. All club structures, ranks, and activities shown on this site exist solely for immersive roleplay and do not represent any real-world organization.</p></footer>
`})
export class AppComponent {readonly auth=inject(AuthService);readonly menuOpen=signal(false);}
