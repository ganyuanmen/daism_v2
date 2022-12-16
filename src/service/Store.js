import {createStore} from 'redux'
// import { propertis_zh } from './locales/zh-CN';
// import { propertis_en } from './locales/en-US';
import {getUrl} from "../utils/utils"

// const p=(prevState={propertis:propertis_zh},action)=>{
//     let newState={...prevState}
//     if(window.sessionStorage.getItem("per")==='zh')
//     newState={propertis:propertis_zh};
//     else if(window.sessionStorage.getItem("per")==='en')
//    newState={propertis:propertis_en};
//     switch(action.type)
//     {
//         case 'setproperty':
//             if(action.language==='zh') 
//             newState.propertis=propertis_zh
//             else if(action.language==='en')
//             newState.propertis=propertis_en     

//             window.sessionStorage.setItem("per",action.language)
//             break
//             default:
//                 break;
//     }
    
//     return newState 
// }

// const e=(prevState={ethBalance:'0',utokenBalance:'0'},action)=>{
//     let newState={...prevState}
//     switch(action.type)
//     {
//         case 'seteth':
//             newState.ethBalance=action.value;
//             break
//         case 'setutoken':
//             newState.utokenBalance=action.value;
//             break
//             default:
//                 break;
//     }
//     return newState 
// }


// const w=(prevState={type:'nowin'},action)=>{
//     let newState={}
//     switch(action.type)
//     {
//         case 'tip':
//             newState.type='tip';
//             newState.tipText=action.tipText;
//             newState.show=action.show;
//             break
//         case 'loadding':
//             newState.type='loadding';
//             newState.tipText=action.tipText;
//             newState.show=action.show;
//             break
//             default:
//                 break;
//     }
//     return newState 
// }


// const login=(prevState={type:'noLogin'},action)=>{
//     let newState={}
//     switch(action.type)
//     {
//         case 'login':
//             newState.type='login';
//             break
     
//     }
//     return newState 
// }

    const reducer=(prevState={connected:0,account:'',token:null,chainId:null,daoapi:null,url:'https://u3556i1005.eicp.vip/'},action)=>{
        let newState={...prevState};
        switch(action.type)
        {
            case "login":
                newState.connected=action.connected;
                newState.account=action.account;
                newState.chainId=action.chainId;
                newState.url=getUrl(action.chainId)
                newState.daoapi=action.daoapi;
                newState.token=action.token;
            //  console.log("login",newState)
                break
            
            case "logout":
                newState.connected=0;
                newState.account='';
                newState.chainId=null;
                newState.daoapi=null;
            //   console.log("logout",newState)
            break
            case "siwe":
                newState.token=action.token;
                break;  
            default:
                break;
        
        
        }
    
        return newState 
    
}

const store=createStore(reducer)
// const property=createStore(p)
// const ethutoken=createStore(e)
// const wintip=createStore(w)
//const mlogin=createStore(login)
export {store};
