import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {store} from '../../service/Store';
import MD5 from "../../service/MD5"
import Alert from 'react-bootstrap/Alert';
import Modal from "react-bootstrap/Modal";
import SiweLogin from '../../components/SiweLogin';
import Card from "react-bootstrap/Card";
import {getTime,checkSiwe} from '../../utils/utils'
import { useSelector, useDispatch } from 'react-redux';
import {getData,clearData} from '../../data/allData'
import {setTipText,setMessageText} from '../../data/valueData'


/**
 * 提案管理
 */
function Proposal() {
    const [proIndex, setProIndex] = useState(0); // 单个提案序号，唯一
    const [refresh, setRefresh] = useState(true); // 表格刷新
    const [siweLogin, setSiweLogin] = useState(false); //显示siwe登录窗口
    const [user, setUser] = useState(store.getState()); //钱包用户
    const proData = useSelector((state) => state.data.data)
    const postStatus=useSelector((state) => state.data.status)
    const dispatch = useDispatch();
    const language = useSelector((state) => state.valueData.language)
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
   
    const axios = require('axios');
    const handleClose = () => setProIndex(0);

    useEffect(() => { 
       let unstrore= store.subscribe(()=>{setUser(store.getState()) }) //订阅
       return ()=>{unstrore();  }  //取消订阅
    }, []);

  useEffect(() => {
    if(user.connected!==1 || !refresh){
          if(user.connected!==1 ) {
             dispatch(clearData())
             setRefresh(true); //开启下次连接取数，恢复初始状态
             }
          return
     }    
     dispatch(getData({url: user.url + "getPro1?_t="+new Date().getTime(),address: user.account}))
     setRefresh(false); 
 }, [refresh, user,dispatch]);


  //投票
  const vote=async (myPro)=>{
    // 检查siwe登录
    let result=await checkSiwe(axios,user,e=>{ setSiweLogin(true);})
    if(!result) return;

    showTip(language.pro[12]); 
    user.daoapi.dao_org.vote(user.chainId,myPro.dao_index,myPro.pro_hash).then(async (re) => {

        let _time=await getTime(axios,user.url) //后台时间
        let _sing=MD5(user.account+"-abc123-"+_time) //http请求签名

        axios({method: "post",url: user.url + "addVote",
            headers: {
                sing:_sing,
                token:user.token,
                address:await user.daoapi.etherProvider.getSigner().getAddress()
            },
            data: {
                address:user.account,
                time: _time,
                proIndex:myPro.pro_index,
                voteSinger:re
            }
        })
        .then(function (response) { 
            closeTip();
            if(response.data==='ok') setRefresh(true);     // 刷新表格
        })
        .catch(function (err) {
            console.error(err);closeTip();
            showError(language.tips[8] + (err.message ? err.message : err));
        })
        }, err => { //钱包签名出错处理
            console.error(err);closeTip();
            showError(language.tips[8]+(err.message?err.message:err));
    });
}

//执行提案
const exec=async (myPro)=>{
    showTip(language.pro[13])
    //从缓存数据库获取签名信息
    const {data}= await axios({method: "post",url: user.url + "getVote",data: {proIndex:myPro.pro_index}})
    user.daoapi.dao_org.exec(
        data,
        myPro.pro_hash,
        myPro.pro_name,
        myPro.app_address,
        myPro.cause_address,
        myPro.dao_id,
        myPro.cause_address===user.daoapi.dao_appInfo.address? user.daoapi.dao_appInfo.abi:user.daoapi.dao_logo.abi,
        myPro.function_name,
        myPro.function_para
        ).then(re => {closeTip();
            // 延迟2秒，等待后台接收数据
            setTimeout(() => {setRefresh(true); // 刷新表格
            }, 2000);
        }, err => {
            console.error(err);closeTip();
            showError(language.tips[8]+(err.message?err.message:err));
    })
}
//界面显示
const showb = (obj) => {
    if (obj.votes === obj.total_vote) 
    return (<Button  size="sm" variant="success" onClick={()=>{exec(obj)}} >{language.pro[9]}</Button>); //执行提案
    else if (obj.yvote) return (<span>{language.pro[20]}</span>); //已投票
    else return (<Button  size="sm" variant="info" onClick={()=>{vote(obj)}} >{language.pro[8]}</Button>); //投票
  };

  //显示删除确认窗口
const showDelWindow=(obj)=>{ setProIndex(obj.pro_index)}

//删除提案
const delPro=async ()=>{
    // 检查siwe登录
    let result=await checkSiwe(axios,user,e=>{ setSiweLogin(true);})
    if(!result) return;

    let _time=await getTime(axios,user.url) //后台时间
    let _sing=MD5(user.account+"-abc123-"+_time) //http 请求签名

    axios({method: "post",url: user.url + "delPro",
        headers: {
            sing:_sing,
            token:user.token,
            address:await user.daoapi.etherProvider.getSigner().getAddress()
        },
        data: {address:user.account,time: _time,proIndex:proIndex}})
    .then(function () { 
        setProIndex(0) //关闭窗口
        setRefresh(true);    //刷新表格
    })
    .catch(function (err) {
        showError(language.tips[8] + (err.message ? err.message : err));
    })
}

    return (
        <>
            {(postStatus==='loading')?  
            <div style={{textAlign:'center'}} >
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </div>
            :proData.map((obj, idx) => (
                    <Card key={'proexcu_' + idx} className="cardItem">
                    <Card.Body>
                    <div style={{fontWeight:'bold' }} className="md-3"  > {obj.pro_name} </div>
                    <div className='row md-3' >
                    {/* <div className='col-4' >{language.pro[5]}:{obj.pro_time} </div> */}
                    <div style={{textAlign:'center' }} className= 'col-6' >{language.pro[6]}:{obj.total_vote} </div>
                    <div style={{textAlign:'center' }} className='col-6' >{language.pro[7]}:{obj.votes} </div>
                    </div>
                    <div style={{textAlign:'right'}} >  {showb(obj)}{'  '}
                    <Button  size="sm" variant="danger" onClick={()=>{showDelWindow(obj)}} >{language.pro[28]}</Button>
                    </div>
                    </Card.Body>
                </Card>
            ))}
        {/* 删除确认窗口 */}
        <Modal show={proIndex>0}  onHide={handleClose}  backdrop="static"  keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{language.pro[29]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         {language.pro[30]}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {language.tips[10]}
          </Button>
          <Button onClick={delPro}  variant="primary">{language.pro[31]}</Button>
        </Modal.Footer>
      </Modal>

      <SiweLogin  user={user} language={language} siweLogin={siweLogin} showTip={showTip}
                showError={showError} closeTip={closeTip} setSiweLogin={setSiweLogin}></SiweLogin>   
      <Alert variant='danger' style={{ display: (user.connected === 1 ) ? 'none' : '',marginTop:'10px' }} >
                {language.header[8]}
            </Alert>

            {(!proData.length && user.connected===1 && postStatus!=='loading') &&
            <div style={{textAlign:'center',color:'red'}} >No proposal!</div>}
        </>

    );
}

export default Proposal;