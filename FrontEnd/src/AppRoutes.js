/* 

Component : App Routes

*/
/** ****************************** Import Packages *************************** */
import React, {Component } from "react";
import { Switch, Route } from "react-router-dom";

/** ****************************** Import Components And Pages *************** */
import Dashboard from './DashboardList';


class AppRoutes extends Component {
  render() {
    return (     
        <div>
            <div id="content-wrapper">           
              <Switch>
                <Route exact path='/' component={Dashboard} />
              </Switch>
            </div>
        </div>
    );
  }
}

export default AppRoutes;