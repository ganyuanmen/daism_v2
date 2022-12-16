
import {useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import MD5 from "../service/MD5"
import {getTime,checkSiwe} from '../utils/utils'
import { useSelector, useDispatch } from 'react-redux';
import {getMyProData,clearData} from '../data/myProData'


/**
 * 投票/执行
 * user 用户信息
 * language 语言信息
 */
export default function ProVote({ user, language, ...props }) {
    const [proRefresh, setProRefresh] = useState(true); //提案刷新
    const [daoId, setDaoId] = useState(0); //dao 选择项
    const myPro = useSelector((state) => state.myProData.data)
    const dispatch = useDispatch();

    useEffect(() => {
        if(user.connected!==1 || (!proRefresh && props.daoItem.dao_id===daoId)){
              if(user.connected!==1 ) {
                 dispatch(clearData())
                 setProRefresh(true); //开启下次连接取数，恢复初始状态
                 }
              return
         }    
         dispatch(getMyProData({
            url: user.url + 'getPro?_t=' + (new Date()).getTime(),
            appIndex:2,daoId:props.daoItem.dao_id, address: user.account
        }))
        setProRefresh(false); 
        setDaoId(props.daoItem.dao_id);
     }, [user.account,props.daoItem.dao_id,user.url,proRefresh,dispatch,daoId,user.connected]);

    const axios = require('axios');
   
    //投票，本地操作，不上链
    const vote=async ()=>{
        //检测后台是否已siwe登录
        let result=await checkSiwe(axios,user,e=>{ props.setSiweLogin(true);})
        if(!result) return;

        props.showTip(language.logo[8])
        user.daoapi.dao_org.vote(user.chainId,myPro.dao_index,myPro.pro_hash).then(async (re) => {
            //获取钱包签名后操作
            let _time=await getTime(axios,user.url) //后台时间
            let _sing=MD5(user.account+"-abc123-"+_time) //生成签名

            axios({method: "post",url: user.url + "addVote",
                headers: {
                    sing:_sing,
                    token:user.token,
                    //注：这里不能用user.account
                    address:await user.daoapi.etherProvider.getSigner().getAddress()
                },
                data: {
                    address:user.account,
                    time: _time,
                    proIndex:myPro.pro_index,
                    voteSinger:re
                }}).then(function (response) { props.closeTip();
                if(response.data==='ok') { 
                    props.setSelectImg(''); setProRefresh(true); //刷新提案
                    }          
            })
            .catch(function (err) { //post 数据到后台错误处理
                console.error(err);props.closeTip();
                props.showError(language.tips[8] + (err.message ? err.message : err));
            })
            //钱包签名错误处理
            }, err => {
                console.error(err);props.closeTip();
                props.showError(language.tips[8]+(err.message?err.message:err));
            });
    }

   //执行提案
    const excu=async ()=>{
       props.showTip(language.logo[9])
        //获取签名信息
        const {data}= await axios({method: "post",url: user.url + "getVote",data: {proIndex:myPro.pro_index}})
        //执行提案
        user.daoapi.dao_org.exec(
            data,
            myPro.pro_hash,
            myPro.pro_name,
            myPro.app_address,
            myPro.cause_address,
            myPro.dao_id,
            //判定是安装扩展提案，还是修改logo提案
            myPro.cause_address===user.daoapi.dao_appInfo.address? user.daoapi.dao_appInfo.abi:user.daoapi.dao_logo.abi,
            myPro.function_name,
            myPro.function_para
            ).then(re => { //props.closeTip();
                setTimeout(() => {props.setSelectImg(''); props.setRefresh(true);}, 1000); //刷新dao下拉框
            }, err => {
                console.error(err);props.closeTip();
                props.showError(language.tips[8]+(err.message?err.message:err));
            })
    }
  
    return (
        <>
          { user.connected === 1 && <>
          {/* 提案名称 */}
            <InputGroup className="mb-2">
                <InputGroup.Text className={props.itemClass}>{language.pro[4]}</InputGroup.Text>
                <div className='form-control' >{myPro.pro_name}  </div>
            </InputGroup>
            {/* 提案描述 */}
            <InputGroup className="mb-2">
                <InputGroup.Text className={props.itemClass}>{language.pro[10]}</InputGroup.Text>
                <div className='form-control' > {myPro.pro_type===1?language.pro[11]:language.pro[27]} 
              {myPro.pro_type===0 && <img style={{ width: '32px', height: '32px' }} src={myPro.logo_img} alt='' ></img>}
              </div>
            </InputGroup>
            {/* 总票数 */}
            <InputGroup className="mb-2">
                <InputGroup.Text className={props.itemClass}>{language.pro[6]}</InputGroup.Text>
                <div className='form-control' > {myPro.total_vote} </div>
            </InputGroup>
             {/* 已投票 */}
            <InputGroup className="mb-2">
                <InputGroup.Text className={props.itemClass}>{language.pro[7]}</InputGroup.Text>
                <div className='form-control' >{myPro.votes}  </div>
            </InputGroup>

         <div className="d-grid gap-2">
                {(myPro.votes===myPro.total_vote)?<Button  variant="success" onClick={excu} >{language.pro[9]}</Button>
                :<Button onClick={vote} disabled={myPro.is_myVote!==0} > {
                    myPro.is_myVote===0?language.pro[8]:"Wait for the rest of me to vote"}</Button>
                }
         </div>
           </>}

        </>
    );
}
