# ng-backendless — backendless Angular App

This project is an example of the Angular App with mocked backend services.
Mocked backend (based on [$httpBackend](https://docs.angularjs.org/api/ngMock/service/$httpBackend))
supports any kind of the REST services.
Mocked responses can be delayed - delay solution is based on the [angular-mocke2e-maydelay](https://github.com/popduke/angular-mocke2e-maydelay).
Application can be started in two different modes:
* `gulp build` - Runs program in the standard mode (network errors will show up)
* `gulp build --mocked` - Adds mocked mocked responses backend to the project

At the same time this project was an excuse to play with gulp task runner. Main functions handled by gulp include:
* Babel
* Babel modules (babelify)
* LESS processing
* Dynamic dependency injection
* JSHint + JSCS
* Browsersync
