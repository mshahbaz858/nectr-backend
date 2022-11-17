import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {format, LoggingBindings, LoggingComponent} from '@loopback/logging';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class NectrApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // this.configure(GraphQLBindings.GRAPHQL_SERVER).to({
    //   asMiddlewareOnly: true,
    // });

    // this.component(GraphQLComponent);
    // const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    // this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    // this.bind(GraphQLBindings.GRAPHQL_AUTH_CHECKER).to(
    //   async (resolverData, roles) => {
    //     const authService = await this.get<AuthService>('services.AuthService');
    //     return authService.authenticate(resolverData, roles);
    //   },
    // );

    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false, // default to true
      enableHttpAccessLog: true, // default to true
    });

    this.configure(LoggingBindings.WINSTON_LOGGER).to({
      level: 'info',
      format: format.json(),
      defaultMeta: {framework: 'LoopBack'},
    })
    this.component(LoggingComponent);
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
