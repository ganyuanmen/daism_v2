
import {useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LogoSelect from './LogoSelect';
import Alert from 'react-bootstrap/Alert';
import MD5 from "../service/MD5"
import {getTime,checkSiwe} from '../utils/utils'

/**
 * 图片提案修改器
 * user 用户信息
 * language 语言信息
 */
export default function LogoPro({ user, language, ...props }) {
  
    const [realimg, setRealimg] = useState('');  //真实图片编码，用于提交到链上的logo编码 
    const [imgtype, setImgtype] = useState(''); //图片文件后缀名
    const [proNameError, setProNameError] = useState(false); //提案名称不符合规范
    const [proName, setProName] = useState(''); //提案名称
   
    const axios = require('axios');
   
    //断开钱包登录后，设置图片为空
    useEffect(() => {if(user.connected!==1) setRealimg('');},[user.connected]); 

    /**
     * 生成提案并提交到缓存数据库
     * @param {Object} _pro 提案内容{name,app,cause,daoId,functionName,functionPara,status,proHash,data}
     * @param {int} _type  0 修改logo提案，  1安装扩展提案
     */
    const addPro=async (_pro,_type)=>{
        let _time=await getTime(axios,user.url) //后台时间
        let _sing=MD5(user.account+"-abc123-"+_time) //http请求签名
        
        //已安装扩展，表示是修改logo,要保存图片
        let _img=props.isInstall?props.selectImg:"";            
        axios({method: "post",url: user.url + "addPro",
            headers: {
                sing:_sing, //http请求签名
                token:user.token //siwe登录返回的token
                //用户地址,注：此处地址区分大小写，而user.account不区分，不能做为验证address
                ,address:await user.daoapi.etherProvider.getSigner().getAddress() 
                },
            data: {
                address:user.account,
                time: _time,
                proName:_pro.name,
                daoId:props.daoItem.dao_id,
                appIndex:2,
                proType:_type,
                proHash:_pro.proHash,
                logoImg:_img,
                functionName:_pro.functionName,
                functionPara:_pro.functionPara,
                appAddress:_pro.app,
                causeAddress:_pro.cause
             }
        })
        .then(function (response) { 
            if(response.data==='ok')  
            {
                setProName(''); props.setSelectImg(''); props.setRefresh(true);
            }    
            else {
                props.showError('Failed to save proposal！\n'+response.data);
            }
          //  props.closeTip(); 
        })
        .catch(function (err) {
            console.error(err);props.closeTip();
            props.showError(language.tips[8] + (err.message ? err.message : err));
        });
    }

    //安装提案
    const installProClick = async () => {
        //检测后台是否已siwe登录
        let result=await checkSiwe(axios,user,e=>{ props.setSiweLogin(true);})
        if(!result) return;

        let _name = proName.trim();
        if (!_name || _name.length > 128) { setProNameError(true); return; }

        props.showTip( language.pro[3])
        //生成本地提案
        let _pro=user.daoapi.dao_org.makePro(
            _name,
            user.daoapi.dao_logo.address,
            user.daoapi.dao_appInfo.address,
            props.daoItem.dao_id,
            user.daoapi.dao_appInfo.abi,
            'install',
            JSON.stringify([props.daoItem.dao_id,2,1])
        )
        //提交提案到缓存数据
        addPro(_pro,1)
 
    }

    //修改提案
    const editProClick = async () => {
        //检测后台是否已siwe登录
        let result=await checkSiwe(axios,user,e=>{ props.setSiweLogin(true);})
        if(!result) return;

        let _name = proName.trim();
        if (!_name || _name.length > 128) { setProNameError(true); return; }

        props.showTip( language.pro[3] )
        let installInfo= await user.daoapi.dao_appInfo.getInfo(props.daoItem.dao_id,'2');
        //生成本地提案
        let _pro=user.daoapi.dao_org.makePro(
            _name,
            installInfo.delegate,
            user.daoapi.dao_logo.address,
            props.daoItem.dao_id,
            user.daoapi.dao_logo.abi,
            'changeLogo',
            JSON.stringify([props.daoItem.dao_id,realimg,imgtype]))
        addPro(_pro,0)
    }
    const showDiv = () => {
        if (!props.isInstall) return ( //安装提案
        <>
            <div className="d-grid gap-2 mb-3">
                <Button onClick={installProClick} >{language.pro[1]}</Button>
            </div>
            <Alert variant="danger" >
                <Alert.Heading>{language.w_tipMessage}</Alert.Heading>
                <p>
                    DAO({props.daoItem.dao_name})  {language.logo[7]}
                </p>

            </Alert>
        </>)
        else // 修改logo提案
            return (
                <>
                    <LogoSelect 
                        user={user} //用户信息
                        language={language} //语言信息
                        setImgtype={setImgtype}  //图片类型设置
                        setRealimg={setRealimg}  //真实保存链上的图片编码
                        itemClass='gab'  //css 样式
                        isSetLogo={false}  //是否已设置logo
                        selectImg={props.selectImg}  //选择的图片
                        setSelectImg={props.setSelectImg}  //设置选择图片
                    />
                    <div className="d-grid gap-2 mb-3">
                        <Button disabled={realimg === ''} onClick={editProClick} >{language.pro[2]}</Button>
                    </div>
                    <Alert variant="danger" >
                        <Alert.Heading>{language.w_tipMessage}</Alert.Heading>
                        <p>
                            DAO({props.daoItem.dao_name})  {language.logo[3]}
                        </p>

                    </Alert>
                </>)

    }

    return (
        <>
          { user.connected === 1 && <>
          {/* 提案名称 */}
            <InputGroup hasValidation className='mb-3' >
                <InputGroup.Text className='gab'>{language.pro[4]}</InputGroup.Text>
                <Form.Control type="text" 
                    onFocus={e => { setProNameError(false); }} 
                    value={proName} 
                    onChange={e => { setProName(e.currentTarget.value); }} 
                    //提案名称错误提示信息
                    isInvalid={proNameError ? true : false} placeholder={language.pro[4]} 
                    />
                <Form.Control.Feedback type="invalid">
                    {language.errors.pro[0]}
                </Form.Control.Feedback>
            </InputGroup>
            {showDiv()}</>}

        </>
    );
}

