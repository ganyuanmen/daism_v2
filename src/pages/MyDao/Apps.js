import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Uploadwin from "./Uploadwin";
import ShowAdress from '../../components/ShowAdress'
import InstallPro from "./InstallPro";
import { useSelector, useDispatch } from 'react-redux';
import {getAppsData,clearData} from '../../data/appsData'
import {setTipText,setMessageText} from '../../data/valueData'
import {store} from '../../service/Store';

/**
 * app 展示
 * user 用户信息
 * language 语言信息
 */
export default function Apps() {
  const [user, setUser] = useState(store.getState()); //钱包用户
  const [wshow, setWshow] = useState(false); //app登记窗口
  const [refresh, setRefresh] = useState(true); // 刷新
  const appData = useSelector((state) => state.appsData.data)
  const postStatus = useSelector((state) => state.appsData.status)
  const dispatch = useDispatch();
  const language = useSelector((state) => state.valueData.language)
  function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
    
  useEffect(() => { 
      //订阅
    let unstrore= store.subscribe(()=>{setUser(store.getState()) })
    return ()=>{unstrore(); }  //取消订阅
  }, []);


  useEffect(() => {
   if(user.connected!==1 || !refresh){
         if(user.connected!==1 ) {
           dispatch(clearData())
            setRefresh(true); //开启下次连接取数，恢复初始状态
            }
         return
    }
     dispatch(getAppsData({url:user.url + "getMyApp?_t="+new Date().getTime(),address:user.account}))
     setRefresh(false)
  }, [refresh, user,dispatch]);

  return (
    <>
    {/* app地址登记按钮 */}
      <Button style={{ marginBottom: "10px" }} variant="success"  disabled={user.connected !== 1} onClick={(e) => {setWshow(true);}}>
        {language.pro[17]}
      </Button>

      {(postStatus==='loading')?  
            <div style={{textAlign:'center'}} >
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </div>
        :
      
      appData.map((obj, idx) => (
        <Card className="mb-3" key={"mylogs_" + idx}>
          <Card.Body>
          <InputGroup className="mb-1">
              <InputGroup.Text className="ga">{language.pro[33]}</InputGroup.Text>
              <div className="form-control">{obj.app_index} </div>
            </InputGroup>
              <InputGroup className="mb-1">
              <InputGroup.Text className="ga">{language.pro[18]}</InputGroup.Text>
              <div className="form-control">{obj.app_name} </div>
             
            </InputGroup>
            <InputGroup className="mb-1">
              <InputGroup.Text className="ga">{language.pro[14]}</InputGroup.Text>
              <div className="form-control"><ShowAdress  language={language}  address={obj.app_address}></ShowAdress> </div>
            </InputGroup>
            <div  className="mb-2" >
              {obj.app_desc}
            </div>

            <InstallPro 
                user={user} 
                language={language} 
                showTip={showTip} 
                closeTip={closeTip}
                showError={showError} 
                item={obj}
                setRefresh={setRefresh} 
                >
            </InstallPro>
          </Card.Body>
        </Card>
      ))}

      <Uploadwin user={user} language={language} wshow={wshow} setWshow={setWshow} 
      showTip={showTip} showError={showError} closeTip={closeTip} setRefresh={setRefresh}></Uploadwin>
    </>
  );
}
