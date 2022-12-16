
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import {store} from '../service/Store';
import MD5 from "../service/MD5";
import { SiweMessage } from 'siwe';
import {getTime} from '../utils/utils'
import { useState } from "react";

/**
 * siwe登录窗口
 * user 用户信息
 * language 语言信息
 */
export default function SiweLogin({ user, language, ...props }) {
    const [singering,setSingering]=useState(false); //正在签名
    const handleClose = () =>props.setSiweLogin(false);
  
    const axios = require('axios');
    // 调用siwe包，生成钱包签名登录需要的数据
    async function createSiweMessage() {
       
        let _time=await getTime(axios,user.url) //取后台时间戳
        let _sing=MD5(user.account+"-abc123-"+_time)  //网页签名

        //后台生成token
        let {data}=await axios({method: "post",url: user.url + "nonce",
            headers: {sing:_sing},
            data:{
                domain:window.location.host, 
                address: user.account,
                time: _time}});

        //更新登录状态
        store.dispatch({type: "siwe",token:data});
        window.sessionStorage.setItem("token",data);
        
        //生成钱包签名所需信息
        const message = new SiweMessage({
            domain:window.location.host,
            address: await user.daoapi.etherProvider.getSigner().getAddress(),
            statement:'Sign in with Ethereum to the app.',
            uri: window.location.origin,
            version: '1',
            chainId: user.chainId,
            nonce: data
        });
       // return message.prepareMessage();
       return message;
    }
    
    //钱包签名登录后台认证
async function signInWithEthereum() {
    setSingering(true)
    const messageObj = await createSiweMessage();
    const message=messageObj.prepareMessage()
    props.showTip(language.siwe[1]) 
    //签名登录
    user.daoapi.etherProvider.getSigner().signMessage(message).then(async (signature)=>{
        //钱包签名后操作
        let _time=await getTime(axios,user.url) //后台时间
        let _sing=MD5(user.account+"-abc123-"+_time) //生成http请求签名
        //提交后台验证
        await axios({method: "post",url: user.url + "verify",
            headers: {
                sing:_sing,
                token:messageObj.nonce
            },
            data:{
                message,
                signature,
                address: user.account,
                time: _time
            }
        })

       // console.log("login:"+data)
        props.closeTip();setSingering(false);
        props.setSiweLogin(false); //关闭窗口
      // console.log(data)
    },err=>{ //钱包签名错误处理
        console.error(err);
        props.closeTip();setSingering(false)
        props.showError(language.tips[8]+(err.message?err.message:err));
    })
  
}


    return (
       
        <Modal
            show={props.siweLogin}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{language.siwe[2]}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <div style={{textAlign:'center'}} >
                {singering? <div style={{textAlign:'center'}} >
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </div>
                :
          <Button  size="lg" onClick={signInWithEthereum} variant="primary">{language.siwe[3]}</Button>
                }
                </div>
        </Modal.Body>
      </Modal>
    );
}

