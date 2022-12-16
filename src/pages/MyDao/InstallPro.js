
import logo from '../../logo.svg';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import {useState} from "react";
import MD5 from "../../service/MD5"
import SiweLogin from '../../components/SiweLogin';
import {getTime,checkSiwe} from '../../utils/utils'

/**
 * app对应dao列表
 * user 用户信息
 * language 语言信息
 */
export default function InstallPro({ user, language,item, ...props }) {
    const [siweLogin, setSiweLogin] = useState(false); //siwe登录窗口
    const axios = require('axios');

      //安装提案
    const handle = async (obj, currentTarget) => {
        //检测后台是否已siwe登录
        let result=await checkSiwe(axios,user,e=>{ setSiweLogin(true);})
        if(!result) { currentTarget.disabled=false; return;}

        props.showTip(language.pro[3])
        let proposal=user.daoapi.dao_org.makePro(
            obj.dao_name+' → '+language.pro[21]+' →('+item.app_name+ ')',
            item.app_address, //登记地址
            user.daoapi.dao_appInfo.address, //执行地址
            obj.dao_id,
            user.daoapi.dao_appInfo.abi,
            'install',
            JSON.stringify([obj.dao_id,item.app_index,1]));

        let _time=await getTime(axios,user.url) //后台时间
        let _sing=MD5(user.account+"-abc123-"+_time) //http请求签名
    
        axios({method: "post",url: user.url + "addPro",
            headers: {
                sing:_sing,
                token:user.token,
                address:await user.daoapi.etherProvider.getSigner().getAddress()},
            data: {
                address:user.account,
                time: _time,
                proName:proposal.name,
                daoId:obj.dao_id,
                appIndex:item.app_index,
                proType:1,
                proHash:proposal.proHash,
                logoImg:'',
                functionName:'install',
                functionPara:JSON.stringify([obj.dao_id,item.app_index,1]),
                appAddress:proposal.app,
                causeAddress:proposal.cause
        }}).then(function (response) { 
                    if(response.data==='ok')  props.setRefresh(true)
                    props.closeTip(); 
                })
                .catch(function (err) {
                    console.error(err);props.closeTip();
                    props.showError(language.tips[8] + (err.message ? err.message : err));
        });

 }
   
  const showb = (obj) => {
    if (obj.is_install === 1) return (<span>{language.pro[22]}</span>);
    else if(obj.pro_index>0) return (<span>{language.pro[23]}</span>);
    else return (<Button size="sm" variant="primary"  onClick={e=>{
       e.currentTarget.disabled=true;
        handle(obj, e.currentTarget)
    }}>{language.pro[21]} </Button>);
  };

    return (
        <>
      
        <Table striped bordered hover>
            <tbody>
                {item.prodata.map((obj, idx) => (
                    <tr key={'mytoken_0' + idx}><td>{obj.dao_name}</td><td>
                          <img alt='' src={obj.dao_logo ? obj.dao_logo : logo} style={{ width: 24, height: 24 }} ></img>
                        </td><td>{obj.dao_id}</td><td>{showb(obj)}</td></tr>
                ))}
            </tbody>
        </Table>
        <SiweLogin  user={user} language={language} showTip={props.showTip} showError={props.showError} 
                closeTip={props.closeTip}  siweLogin={siweLogin} setSiweLogin={setSiweLogin}></SiweLogin>  
        </>
    );
}
