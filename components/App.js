import { hot } from 'react-hot-loader';
import React from 'react';
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import routes from '../routes';

const App = () => {
  return (
    <main>
      <Switch>
        {routes.map((route) => {
          return (
            <Route
              {...route}
              key={route.key}
              component={route.component}
            />
          );
        })}
      </Switch>
    </main>
  );
};

export default hot(module)(withRouter(App));
