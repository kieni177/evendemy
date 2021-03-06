import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router, ActivatedRoute } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { of } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { AuthenticationServiceTestBuilder } from '../../test-utils/authentication-service-test-builder';
import { AuthenticationService } from '../../services/authentication.service';

describe('LoginComponent', () => {

  const SOME_PATH = 'some/interesting/path';
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: AuthenticationService;
  let usersService: UsersService;
  let router: Router;
  let authSpy;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = new AuthenticationServiceTestBuilder().canLogin(true).build();
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['loadAllUsers']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: { queryParams: of({'return': SOME_PATH})}},
        {provide: AuthenticationService, useValue: authSpy},
        {provide: UsersService, useValue: usersServiceSpy}
      ]
    });

    auth = TestBed.get(AuthenticationService);
    usersService = TestBed.get(UsersService);
    router = TestBed.get(Router);
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login should try to login, load users and redirect', () => {
    component.login('admin', 'password');
    expect(auth.loginUser).toHaveBeenCalledWith('admin', 'password');
    expect(usersService.loadAllUsers).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([SOME_PATH]);
    expect(component.invalidLogin).toBeFalsy();
  });

  it('login should deny because of invalid login', () => {
    authSpy.loginUser.and.returnValue(of(false));
    component.login('admin', 'password');
    expect(auth.loginUser).toHaveBeenCalledWith('admin', 'password');
    expect(usersService.loadAllUsers).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith([SOME_PATH]);
    expect(component.invalidLogin).toBeTruthy();
  });

  it('login should deny because of service failure', () => {
    authSpy.loginUser.and.returnValue(throwError('some exception'));
    component.login('admin', 'password');
    expect(auth.loginUser).toHaveBeenCalledWith('admin', 'password');
    expect(usersService.loadAllUsers).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith([SOME_PATH]);
    expect(component.invalidLogin).toBeTruthy();
  });

});
