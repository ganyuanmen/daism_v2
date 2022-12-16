
import { HashRouter,Switch,Route,Redirect } from 'react-router-dom';
import DataList from './pages/DataList';
import Iadd from './pages/IADD';
import CreateDao from './pages/CreateDao';
import My from './pages/MyDao'
import Proposal from './pages/Proposal'
// import Nohtml from './Nohtml'

export default function DaoRouter() {


    return (
        <HashRouter>
            <Switch>
                <Route path='/daolist' component={DataList}  ></Route>
                <Route path='/iadd' component={Iadd} ></Route>
                <Route path='/createdao' component={CreateDao} ></Route>
                <Route path='/my' component={My} ></Route>
                <Route path='/prosoal' component={Proposal} ></Route>
                {/* <Route path='/' component={Nohtml} ></Route> */}
                <Redirect from="/" to="/daolist" exact></Redirect> 

                {/* <Route   component={Nohtml} ></Route> */}
            </Switch>
           
        </HashRouter>

    );
}