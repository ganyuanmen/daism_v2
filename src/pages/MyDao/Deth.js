import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import {store} from '../../service/Store';
import { useSelector, useDispatch } from 'react-redux';
import {setDethBalance, setUtokenBalance} from '../../data/valueData'
import {setTipText,setMessageText} from '../../data/valueData'

/**
 * DETH 处理模块
 * user 用户信息
 * language 语言信息
 */
export default function Deth() {
  const [user, setUser] = useState(store.getState()); //钱包用户
  const [approve, setApprove] = useState(false); //是否授权
  const [noDeth, setNoDeth] = useState("0"); //未锻造deth
  const [checkPermission,setCheckPermission]=useState(false); //查询DETH权限，用于界面显示
  const dethValue = useSelector((state) => state.valueData.dethBalance)
  const dispatch = useDispatch();
  const language = useSelector((state) => state.valueData.language)
  function showError(str){dispatch(setMessageText(str))}
  function showTip(str){dispatch(setTipText(str))}
  function closeTip(){dispatch(setTipText(''))}
   
useEffect(() => { 
    //订阅
   let unstrore= store.subscribe(()=>{setUser(store.getState()) })
   return ()=>{unstrore();  }   //取消订阅
}, []);


  //登录初始化数据
  useEffect(() => {
    if (user.connected === 1) {
      user.daoapi.dao_deth.dEth(user.account).then((e1) => {
        setNoDeth(e1.outAmount);
      });

      user.daoapi.dao_deth.allowance(user.account,user.daoapi.dao_uToken.address).then(e=>{
        setApprove(parseFloat(e.approveSum)>0)
        setCheckPermission(true)
      })      
    } else {
      setNoDeth("0");
    }
  }, [user]);


  //锻造deth
  const handleDeth = () => {
    showTip(language.my[6]);
    user.daoapi.dao_deth.takeRecord().then(
      (re) => {
        user.daoapi.dao_deth.balanceOf(user.account).then((e1) => {
          dispatch(setDethBalance(e1.outAmount));
        });
        setNoDeth("0"); closeTip();
        
      },
      (err) => {
        console.error(err);closeTip();
        showError(language.tips[8] + (err.message ? err.message : err));
      }
    );
  };

  //授权
  const fapprove = () => {
    showTip(language.header[4]);
    user.daoapi.dao_deth.approve(user.daoapi.dao_uToken.address, "9999999").then(
      (re) => {
        setApprove(true); closeTip(); },
      (err) => {
        console.error(err);closeTip();
        showError(language.tips[8] + (err.message ? err.message : err));
      }
    );
  };



  //兑换deth成utoken
  const swapDeth =async () => {
    showTip(language.my[7]);
    user.daoapi.dao_uToken.swapDETHTo(user.account, dethValue).then(
      (re) => {
        user.daoapi.dao_uToken.balanceOf(user.account).then((e1) => {
          dispatch(setUtokenBalance(e1.utoken))
          dispatch(setDethBalance('0'))
        });
       closeTip();
      },
      (err) => {
        console.error(err);closeTip();
        showError(language.tips[8] + (err.message ? err.message : err));
      }
    );
  };
  
  return (
    <>
      <InputGroup className="mb-2">
         {/* 未锻造DETH */}
        <InputGroup.Text className="gab">{language.my[0]}</InputGroup.Text>
        <div className="form-control">{noDeth} </div>
         {/* 锻造按钮 */}
        <Button
          variant="primary"
          disabled={user.connected !== 1 || !parseFloat(noDeth)}
          onClick={handleDeth}
        >
          {language.my[1]}
        </Button>
      </InputGroup>
      <InputGroup className="mb-2">
        <InputGroup.Text className="gab">{language.my[2]}</InputGroup.Text>
        {/* deth 余额 */}
        <div className="form-control">{dethValue} </div>
        {!checkPermission &&  //未查询余额前显示         
            <Button  
                disabled={true} ><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </Button>}

        {checkPermission && 
            <>   
              {approve &&  
                  <Button  variant="primary"  disabled={user.connected !== 1 || !parseFloat(dethValue)}
                   onClick={swapDeth} >{language.my[3]}
                  </Button>
              }
              {!approve &&  //授权
                  <Button  variant="success"  disabled={user.connected !== 1}
                   onClick={fapprove}> {language.swap[8]} 
                 </Button>
              }
            </>
        }
      </InputGroup>
    </>
  );
}
