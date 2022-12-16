import './index.css';
import { HashRouter,Switch,Route,Redirect } from 'react-router-dom';
import Ideth from './images/deth.svg';
import Iswap from './images/swap.svg';
import Idao from '../CreateDao/images/dao.svg'
import Iapp from '../CreateDao/images/menu-app.svg'
import Itoken from '../CreateDao/images/token.svg'
import { useState,useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Tokens from './Tokens';
import Daos from './Daos';
import Deth from './Deth';
import Logs from './Logs';
import Apps from './Apps';
import {store} from '../../service/Store';
import { useSelector } from 'react-redux';


 /**
  * 我的信息
  */
export default function MyDao() {
    const [fmenuIndex, setFmenuIndex] = useState(0); //次菜单
    const imgAr = [Ideth, Iswap, Itoken, Idao, Iapp]; //菜单logo
    const [user, setUser] = useState(store.getState()); //钱包用户信息
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const utokenBalance = useSelector((state) => state.valueData.utokenBalance)
    const dethValue = useSelector((state) => state.valueData.dethBalance)
    const language = useSelector((state) => state.valueData.language)
    const myLink=["#/my/deth","#/my/logs","#/my/tokens","#/my/daos","#/my/apps"];
   
    
    useEffect(() => { 
        let unstrore= store.subscribe(()=>{setUser(store.getState()) }) //订阅
        return ()=>{unstrore();}//取消订阅
     }, []);

    function useGetIndex(menuItem,myLink){
        let i=0;
        for (; i < menuItem.length; i++) {
            if (myLink[i] === window.location.hash) break;
        }
        return i;
      }
      
    const tempidx=useGetIndex(language.mymenu,myLink)
    useEffect(() => {setFmenuIndex(tempidx);}, [tempidx]);


    return (
        <>
        {/* 余额显示 */}
            <Container className='mydao_top'>
                <Row className='mydao_top1' >
                    <Col>{parseFloat(ethBalance).toFixed(4)}&nbsp;ETH</Col>
                    <Col>{parseFloat(utokenBalance).toFixed(4)}&nbsp;UTOKEN</Col>
                    <Col>{parseFloat(dethValue).toFixed(4)}&nbsp;DETH</Col>
                </Row>
            </Container>
            <Nav className="shadow-sm p-3 mb-5 bg-body rounded createdao_menu noselect">
                    {language.mymenu.map((placement, idx) => (
                        <Nav.Item key={'mydaoftab_' + idx} className={fmenuIndex === idx ? 'createdao_item bg-info' : 'createdao_item'} onClick={e => { setFmenuIndex(idx) }} >
                            <Nav.Link href={myLink[idx]} style={{ padding: 2 }} eventKey={'mydaof_i' + idx}> 
                                <img className='createdao_img' src={imgAr[idx]} alt=''></img> <br />   {placement}
                            </Nav.Link>
                        </Nav.Item >
                    ))}
            </Nav>
            <HashRouter>
                <Switch>
                    <Route path="/my/deth" component={Deth}></Route>
                    <Route path="/my/logs" component={Logs}></Route>
                    <Route path="/my/tokens" component={Tokens}></Route>
                    <Route path="/my/daos" component={Daos}></Route>
                    <Route path="/my/apps" component={Apps}></Route>
                    <Redirect from="/my" to="/my/deth"></Redirect>
                </Switch>
           </HashRouter>            
            <Alert variant='danger' style={{ display: (user.connected === 1 ) ? 'none' : '',marginTop:'10px' }} >
                {language.header[8]}
            </Alert>
        </>
    );
}
