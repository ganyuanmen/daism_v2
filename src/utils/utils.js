
export function getUrl(p_chainId){
    let urlStr
    switch(parseInt(p_chainId))
    {
       
        case 5:
            urlStr="https://u3556i1005.eicp.vip/"
            break
        case 11155111:
        case 3:
            urlStr="https://355dv61005.zicp.vip/"
            break
        case 1:
            urlStr="https://u3556i1005.eicp.vip/"  
            break
        default:
            urlStr="http://127.0.0.1:8087/"    
            break      
    }
    console.log(urlStr+": start")
  return urlStr;
 }

export function getNetWork(p_chainId){
    let netStr
    switch(parseInt(p_chainId))
    {
        case 3:
            netStr="ropsten";
            break;
        case 5:
            netStr="goerli"
            break
        case 11155111:
            netStr="sepolia"
            break
        case 1:
            netStr="mainnet"  
            break
        default:
            netStr="local"    
            break      
    }
  return netStr;
 }

  export  function getChai(id)
  {
      let re='';
      switch(id)
      {
          case 0:
              re='(Olympic)'; break;
          case 1:
              re='(Ethereum Mainnet)'; break;
          case 2:
              re='(Morden Classic)'; break;
          case 3:
              re='(Ropsten)'; break;
          case 4:
              re='(Rinkeby)'; break;
          case 5:
              re='(Goerli)'; break;
          case 6:
              re='(Kotti Classic)'; break;
          case 11155111:
                re='(sepolia test)'; break;
          case 7:
              re='(Mordor Classic)'; break;
          case 8:
              re='(Ubiq)';break;
          case 10:
              re='(Optimism)';break;
          case 42:
              re='(Kovan)';break;
          case 56:
              re='(Binance)';break;
          case 60:
              re='(GoChain)';break;
          case 69:
              re='(Optimism Kovan)';break;
          case 77:
              re='(Sokol)';break;
          case 97:
              re='(Binance)';break;
          case 99:
              re='(Core)';break;
          case 100:
              re='(xDai)';break;
          case 128:
          case 256:
              re='(HECO)';break;
          case 31337:
              re='(GoChain testnet)';break;
          case 42161:
              re='(Arbitrum One)';break;
          case 401697:
              re='(Tobalaba)';break;
          case 421611:
              re='(Arbitrum Testnet)';break;
          case 7762959:
              re='(Musicoin)';break;
          case 61717561:
              re='(Aquachain)';break;
          default:
              re='Could indicate that your connected to a local development test network.';break;
      }
      return id+re;
  }


  export async function  getTime(axios,url)
  {
      let {data}=await axios.get(url + "getTime?_t="+new Date().getTime());
      return data
  }
  export async function checkSiwe(axios,user,callback)
  {
      if(!user.token)  //没有登录
      {
          callback.call(this) //显示登录窗口
          return false;
      } else 
      {
          const {data}=await axios.get( user.url + "getToken?t="+(new Date()).getTime(),{headers: {token:user.token,address:await user.daoapi.etherProvider.getSigner().getAddress()}});
          if(data!=='ok')  //登录不成功
          {
              callback.call(this) //显示登录窗口
              return false;
          }
      }
      return true;
  }
