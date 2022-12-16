import './index.css';
import Ilogo from './images/logo.svg';
import Iorg from './images/org.svg';
import Itoken from './images/token.svg';
import { useState,useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Alert from 'react-bootstrap/Alert';
import Dao from './Dao'
import Logo from './Logo'
import Token from './Token'
import Nav from 'react-bootstrap/Nav';
import {store} from '../../service/Store';
import {useSelector,useDispatch } from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'

/**
 * 创建dao 主界面，下有 注册，修改logo,发布token 三个二级菜单
 */
function CreateDao() {
    const [fmenuIndex, setFmenuIndex] = useState(0); // 显示哪个二级菜单
    const imgAr = [Iorg, Ilogo, Itoken]; //二级菜单图片
    const [user, setUser] = useState(store.getState()); //钱包登录用户信息
    const [refresh,setRefresh]=useState(false); //刷新dao下拉选择框
    const language = useSelector((state) => state.valueData.language)

    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    useEffect(() => { 
        //订阅钱包登录用户信息
       let unstrore= store.subscribe(()=>{setUser(store.getState())})
       return ()=>{unstrore();} //退出时取消订阅
    }, []);

    return (
        <>
            <Tab.Container id="createdao-tabs-1" defaultActiveKey="f_i0">
                {/* 选择二级菜单，显示相应模块 */}
                <Nav className="shadow-sm p-3 mb-5 bg-body rounded createdao_menu noselect">
                    {language.createDao.map((placement, idx) => (
                        <Nav.Item key={'ftab' + idx} className={fmenuIndex === idx ? 'createdao_item bg-info' : 'createdao_item'} onClick={e => { setFmenuIndex(idx) }} >
                            <Nav.Link style={{ padding: 2 }} eventKey={'f_i' + idx}>
                                <img className='createdao_img' src={imgAr[idx]} alt=''></img> <br />   {placement}
                            </Nav.Link>
                        </Nav.Item >
                    ))}
                </Nav>

                 <Tab.Content>
                    <Tab.Pane eventKey='f_i0'>
                        {/* dao 注册模块 */}
                        <Dao user={user} language={language} showError={showError} showTip={showTip} 
                            closeTip={closeTip} setRefresh={setRefresh} />
                    </Tab.Pane>
                    <Tab.Pane eventKey='f_i1'>
                        {/* logo 操作模块 */}
                        <Logo user={user} language={language} showTip={showTip} closeTip={closeTip} 
                            showError={showError} refresh={refresh} setRefresh={setRefresh}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey='f_i2'>
                        {/* 发布token 模块 */}
                        <Token user={user} language={language}  showTip={showTip} closeTip={closeTip} showError={showError} 
                             refresh={refresh} setRefresh={setRefresh} />
                    </Tab.Pane>
                </Tab.Content> 
            </Tab.Container>
            <Alert variant='danger' style={{ display: (user.connected === 1 ) ? 'none' : '',marginTop:'10px' }} >
                {language.header[8]}
            </Alert>
        </>
    );
}

export default CreateDao;