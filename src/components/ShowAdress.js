import React, {useState, useRef } from 'react';
import clipboard from "./clipboard.svg";
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

/**
 * 地址显示，有提示，能复制
 * @returns 
 */
export default function ShowAdress({language, address }) {
   
    const [show, setShow] = useState(false); //显示提示
    const target = useRef(null);
    var delayTime; //延迟控制

    //生成地址格式
    function getAccount()
    {
      if(address)
     return address.slice(0,6)+'......'+address.slice(38,42)
     else 
     return ''
    }

    return (
       <>
       <span >{getAccount()}</span> {' '}
       <img alt='' 
          data-address={address}  
          src={clipboard} 
          ref={target} 
          onClick={(e) => { 
              if(navigator.clipboard) navigator.clipboard.writeText(e.currentTarget.getAttribute("data-address"))
              else return;
              setShow(true); //显示提示
              if(delayTime) return; //提示未到时间，不做处理
              delayTime=setTimeout(() => { setShow(false);delayTime=null;}, 1000);}
              }
        ></img>
       <Overlay target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
           {language.tips[18]}
          </Tooltip>
        )}
      </Overlay>
       
       </>
    );
}

