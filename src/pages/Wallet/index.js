import './index.css';
import messlogo from '../../mess.svg';
import userLogo from './user.svg';
import walletLogo from './wallet.svg';
import {useRef,useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Web3Modal from "web3modal";
import {DaoApi} from "daoapi"
import { ethers } from "ethers";
import ShowAdress from '../../components/ShowAdress'
import {store} from '../../service/Store';
import {getChai,getNetWork} from "../../utils/utils"
import { useSelector, useDispatch } from 'react-redux';
import {setUtokenBalance,setEthBalance,setDethBalance,setTipText,setMessageText,setLanguage} from '../../data/valueData'

/**
 * 钱包登录管理 
 */
function Wallet() {
    const [lang, setLang] = useState('zh');  //选择哪种语言
    const [show, setShow] = useState(false); //登录信息窗口
    const [chainId, setChainId] = useState(0); //网络ID
    const [showMetaMask, setShowMetaMask] = useState(false); //没安装metMASK提示
    const [connecting,setConnecting]=useState(false);
    const [user, setUser] = useState(store.getState()); //
    const [appoveAr,setAppoveAr]=useState([])//已授权列表
    const web3modalRef=useRef();
    const providerRef=useRef();
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const utokenBalance = useSelector((state) => state.valueData.utokenBalance)
    const language = useSelector((state) => state.valueData.language)
    const dispatch = useDispatch();
    
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function setEth(value){dispatch(setEthBalance(value))}
    function setUtoken(value){dispatch(setUtokenBalance(value))}  
    function setDeth(value){dispatch(setDethBalance(value))}
    
    const axios = require("axios");
      
    useEffect(() => { 
          web3modalRef.current= new Web3Modal({
            cacheProvider: true,
            providerOptions:{},
            disableInjectedProvider: false
          });
        
          if(window.sessionStorage.getItem("per")) { //恢复语言
            let lan_str=window.sessionStorage.getItem("per")
            dispatch(setLanguage(lan_str))
            setLang(lan_str)
          } 
          if(window.sessionStorage.getItem("isLogin")==='1') connectWallet()

          let unstore=  store.subscribe(()=>{setUser(store.getState()) })
          return ()=>{unstore();}
    }, []);

    const getWeb3Provider=async ()=>{
      providerRef.current=await web3modalRef.current.connect();
      const web3Provider= new ethers.providers.Web3Provider(providerRef.current);
    // if(needSignre) return web3Provider.getSigner();
      return  web3Provider;
    }

    const connectWallet=async()=>{//连接钱包
      // if(!web3modalRef.current.userOptions.length) {
      if (!window.ethereum) {
        setShowMetaMask(true); //提示安装metmask
        return;
      }
      setConnecting(true);
      try{
          const web3Provider= await getWeb3Provider();
          providerRef.current.on("accountsChanged", (accounts) => { fetchAccountData(web3Provider,accounts); });
          providerRef.current.on("chainChanged", (netChainId) => { fetchAccountData(web3Provider,netChainId); });
          providerRef.current.on("networkChanged", (networkId) => { fetchAccountData(web3Provider,networkId); });
          const daoapi= fetchAccountData(web3Provider);
          window.addEventListener('beforeunload', e=>{logout()})  
          window.addEventListener('pagehide', e=>{logout()})  
          setTimeout(() => {getAppove(daoapi)}, 1);    
      }catch (err)
      {
        console.error(err);
        showTip(err);
      }
    }
    //连接后处理
    const fetchAccountData =  (web3Provider) => {
        let tempChainId = parseInt(web3Provider.provider.chainId, 16);
        setChainId(tempChainId); //界面上显示 getChai 显示chainid 和网络名称
        let account= providerRef.current.selectedAddress
        web3Provider.getBalance(account).then(_balance=>{
          setEth(ethers.utils.formatEther(_balance))
        });
        let tempDaoapi = new DaoApi(ethers, web3Provider,account,getNetWork(tempChainId));
        console.log(tempDaoapi.version);
        tempDaoapi.dao_uToken.balanceOf(account).then(utokenObj=>{
          setUtoken(utokenObj.utoken)
        })
        tempDaoapi.dao_deth.balanceOf(account).then((e) => {
          setDeth(e.outAmount)
        });
        window.sessionStorage.setItem("isLogin", "1");
        let tempToken=window.sessionStorage.getItem("token")?window.sessionStorage.getItem("token"):'';
        store.dispatch({type: "login",connected: 1,account:account,chainId:tempChainId,daoapi:tempDaoapi,token:tempToken});
        setConnecting(false);
        return tempDaoapi;         
    };

    //语言选择
    const setCurlan=(event)=>{
        var lan_str=event.currentTarget.value;
        dispatch(setLanguage(lan_str))
        setLang(lan_str)
    }
    //退出siwe登录
    function logout() 
    {
        if(user && user.token) //退siwe登录
        axios({method: "post",url: user.url + "exitLogin",headers: {token:user.token}})
        .then(function (response) { console.log(response.data);})
        .catch(function (error) {console.error(error);});
    }

    //退出
    const onDisconnect = async () => {
        console.log("unconnect.........")
        logout()
        if ( providerRef.current &&  providerRef.current.close) {
            await  providerRef.current.close();
            await web3modalRef.current.clearCachedProvider();
        }
        store.dispatch({type:'logout'})
        window.sessionStorage.setItem("isLogin", "0");
    }

    //获取已授权的项目
    const getAppove=async (daoapi)=>{
        let p1 = new Promise((resolve, reject) => {
            daoapi.dao_uToken.allowance(daoapi.selectedAccount, daoapi.dao_iadd.address).then(r => {
                resolve({text:'UToken'+language.swap[8],index:0,amount:parseFloat(r.approveSum)})
            })
        });
        let p2 = new Promise((resolve, reject) => {
            daoapi.dao_erc20s.allowanceAll(daoapi.selectedAccount, daoapi.dao_iadd.address).then((r) => {
                resolve({text:'Token'+language.swap[8],index:2,amount:r.status})
            });
        });
        let p3 = new Promise((resolve, reject) => {
            daoapi.dao_deth.allowance(daoapi.selectedAccount,daoapi.dao_uToken.address).then(e=>{
                resolve({text:'DETH'+language.swap[8],index:1,amount:parseFloat(e.approveSum)})
              })
        });
        Promise.all([p1,p2,p3]).then((results) => {
            let tempAr=[];
            results.map((p,i)=>{ //index 0->utoken, 1->DETH, 2->token
                  // <2 utoken ,DETH 数值授权， 2token 授权是全局授权 
                  if(p.index<2 && p.amount>0)  tempAr.push({text:p.text,amount:p.amount.toFixed(2),index:p.index})
                  else if(p.amount)  tempAr.push({text:p.text,amount:language.swap[16],index:p.index})
                  return p
            }) 
            setAppoveAr(tempAr);
        });    
      }    

      //删除已取消授权的记录
      function delRecord(_index)
      {
        let tempAr=[];
        appoveAr.map(p=>{if(p.index!==_index) tempAr.push(p);return p; });
        setAppoveAr(tempAr);
      }

      //取消utoken授权
      function utokenAppove()
      {
        showTip(language.header[7])
        user.daoapi.dao_uToken.approve(user.daoapi.dao_iadd.address, '0').then(
            e => {closeTip();delRecord(0);}, 
            err => {
            console.error(err);
            closeTip()
            showError(language.tips[8] + (err.message ? err.message : err))
        });
      }

      //取消token授权
      function tokenAppove()
      {
        showTip(language.header[7])
        user.daoapi.dao_erc20s.approveAll(user.daoapi.dao_iadd.address, false).then(
            e => {closeTip();delRecord(2);}, 
            err => {
            console.error(err);
            closeTip()
            showError(language.tips[8] + (err.message ? err.message : err));
        });
      }

      //取消DETH 授权
      function DETHAppove()
      {
        showTip(language.header[7])
        user.daoapi.dao_deth.approve(user.daoapi.dao_uToken.address, "0").then(
          (re) => {closeTip();delRecord(1);},
          (err) => {
            console.error(err);
            closeTip()
            showError(language.tips[8] + (err.message ? err.message : err));
          }
        );
      }

    return (
        <>
            <div className='wallet_item' >
                {user.connected === 1 &&  //登录后显示用户图标
                    <img alt={language.header[6]} className='wallet_user' 
                        onClick={e=>{setShow(true)}} 
                        src={userLogo}>
                    </img>
                }
                {/* 连接/取消 钱包 */}
                <Button className='wallet_btnClass' variant={user.connected ? "warning" : "success"} size="sm" disabled={connecting}
                    onClick={e => { if (user.connected === 1) onDisconnect(); else connectWallet();}} >
                    <img alt="" src={walletLogo} ></img> {connecting?language.header[3]: language.header[user.connected]}
                </Button>  
            </div> 
            <div >
         {/* 语言选择框 */}
            <div className='wallet_item' >
            <Form.Select onChange={setCurlan}  size="sm" className='wlanguage' value={lang} >
                <option value="zh">简体中文</option>
                <option  value="en">English</option>
            </Form.Select>
            </div>
            </div>
            {/* 钱包登录信息显示窗口 */}
            <Modal show={show} onHide={e=>{setShow(false)}} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{language.header[6]}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover style={{width:'100%'}} >
                        <tbody>
                            <tr><td style={{ textAlign: 'right' }} >{language.login[0]}</td><td colSpan="2" >
                              <ShowAdress language={language} address={user.account} ></ShowAdress></td></tr>
                            <tr><td style={{ textAlign: 'right' }}>{language.login[1]}</td><td colSpan="2">{getChai(chainId)}</td></tr>
                            <tr><td style={{ textAlign: 'right' }}>{language.login[2]}</td><td colSpan="2">{ethBalance}</td></tr>
                            <tr><td style={{ textAlign: 'right' }}>{language.login[3]}</td><td colSpan="2">{utokenBalance}</td></tr>
                         
                            {appoveAr.map((placement, idx) => (
                                <tr key={'wallet_'+idx} ><td style={{ textAlign: 'right' }} >{placement.text}</td>
                                <td>{placement.amount}</td><td>
                                     <Button  size="sm" variant="info" 
                                     onClick={e=>{
                                        if(placement.index===0) utokenAppove()  //取消utoken授权
                                        else if(placement.index===2) tokenAppove()  //取消token授权
                                        else DETHAppove()  //取消DETH授权
                                     }}>{language.swap[17]}</Button></td></tr>
                             ))}
                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>

     {/* 安装metmask提示窗口 */}
    <Modal centered show={showMetaMask}  onHide={e=>{setShowMetaMask(false)}}>
    <Modal.Header closeButton>
      <Modal.Title>{language.w_tipMessage}</Modal.Title>
    </Modal.Header>
    <Modal.Body className='daotipbody' > 
          <img alt='' src={messlogo} style={{width:32,height:32}} ></img>  
      <div className='daotiptext'  >
           <div>
               {language.errors.login1} {'  '}
               <a href='https://metamask.io' target='_blank'  rel="noreferrer"  alt="metamask" >https://metamask.io</a>
           </div>
           <div>  {language.errors.login2}</div>
      </div>
    </Modal.Body>
  </Modal>
        </>
    );
}

export default Wallet;