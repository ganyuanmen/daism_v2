import './index.css';
import logo from '../../logo.svg';
import ethlogo from '../../eth.svg';
import splitimg from './split.svg'
import downimg from './down.svg'
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import SwapWindow from './SwapWindow'
import {store} from '../../service/Store';
import { useSelector, useDispatch } from 'react-redux';
import {setUtokenBalance,setEthBalance,setTipText,setMessageText} from '../../data/valueData'
/**
 * IADD 网络交易
 * 约定： (eth:tokenId=-2), (utoken:tokenId=-1),(未选择:tokenId=0)  其它tokenId 从缓存数据库读取，本约定 方便从数据库取数
 */
function IADD() {
    const language = useSelector((state) => state.valueData.language)
    const [user, setUser] = useState(store.getState()); //钱包用户信息
    const [jin, setJin] = useState({ inBalance: '0', outBalance: '0' }); //余额，上下
    const [inobj, setInobj] = useState({ btext: 'eth', blogo: ethlogo, token_id: -2 }) //上选择对象，输入对象 btext:显示文本， blogo:logo图片
    const [outobj, setOutobj] = useState({ btext: language.swap[2], blogo: '', token_id: 0 }) //下选择对象，输出对象
    const [errstr, setErrstr] = useState(''); //错误提示信息
    const [show, setShow] = useState(false); //窗口打开
    const [bili, setBili] = useState({ str: '', value: 0 }); //兑换比例
    const [inputError, setInputError] = useState(false);//录入错误
    const [sucessmess, setSucessmess] = useState(''); //预兑换提示
    const [ininput, setIninput] = useState(''); //输入框
    const [outinput, setOutinput] = useState(''); //输出框
    const [workIndex, setWorkIndex] = useState(-2); //选择从哪里打开窗口（-2：上、-1：下），默认上窗口
    const [isallow, setIsallow] = useState(true); //是否授权
    const ethBalance = useSelector((state) => state.valueData.ethBalance)
    const utokenBalance = useSelector((state) => state.valueData.utokenBalance)
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function setEth(value){dispatch(setEthBalance(value))}
    function setUtoken(value){dispatch(setUtokenBalance(value))}  

    useEffect(() => { 
       let unstrore=store.subscribe(()=>{setUser(store.getState()) }) //钱包用户订阅
       return ()=>{unstrore();} //退出取消订阅
    }, []);

    //登录监听
    useEffect(() => {
        init();
        if (user.connected === 1) {
            setJin({ outBalance: '', inBalance: ethBalance }) //eth余额
            setInobj({ btext: 'eth', blogo: ethlogo, token_id: -2 }); //选择eth
            if (parseFloat(ethBalance) === 0) { setErrstr(language.swap[14]) } //eth余额不足
            else setErrstr("")
        }else 
        {
            setIninput('');
            setOutinput('');
            setErrstr(language.header[8]) //请连接钱包
            setJin({ inBalance: '', outBalance: '' });
            setOutobj({ btext: language.swap[2], blogo: '', token_id: 0 });
            setInobj({ btext: 'eth', blogo: ethlogo, token_id: -2 });
        }
    }, [user.connected,ethBalance,language]);

    //兑换比率生成，选择后获兑换比率
    useEffect(() => {
        async function fetchData() {
            //符合兑换条件
            if (inobj.token_id && outobj.token_id && inobj.token_id !== outobj.token_id && user.connected === 1) {
                if (inobj.token_id === -2) { //上窗口eth
                    let ethToutokenPrice = await user.daoapi.dao_uToken.getPrice();
                    if (outobj.token_id === -1) { //eth to utoken
                        setBili({ value: ethToutokenPrice.price, str: "1 eth ≈" + ethToutokenPrice.price + " utoken" })
                    } else {  // eth to token
                        if (outobj.token_id) { 
                            user.daoapi.dao_commulate.utokenToToken(ethToutokenPrice.price, outobj.token_id).then(e => {
                                setBili({ value: e.outAmount, str: "1 eth ≈" + e.outAmount + ' ' + outobj.btext })
                            })
                        }
                    }
                } else if (inobj.token_id === -1) { //utoken to token
                    if (outobj.token_id) {
                        user.daoapi.dao_commulate.utokenToToken(1, outobj.token_id).then(e => {
                            setBili({ value: e.outAmount, str: "1 utoken ≈" + e.outAmount + ' ' + outobj.btext })
                        })
                    }
                } else if (inobj.token_id) {
                    if (outobj.token_id === -1) {  //token to utoken
                        user.daoapi.dao_commulate.tokenToUtoken(1, inobj.token_id).then(e => {
                            setBili({ value: e.outAmount, str: "1 " + inobj.btext + " ≈" + e.outAmount + ' utoken' })
                        })
                    } else {  //token to token
                        if (inobj.token_id && outobj.token_id) {
                            user.daoapi.dao_commulate.tokenToToken(1, inobj.token_id, outobj.token_id).then(e => {
                                console.log(e)
                                setBili({ value: e.outAmount, str: "1 " + inobj.btext + " ≈" + e.outAmount + ' ' + outobj.btext })
                            })
                        }
                    }
                }
            }else  setBili({value:0, str: '' })
        }
        fetchData();
    }, [inobj, outobj,user]);

    //录入,选择改变监听 生成预兑换信息
    useEffect(() => {
        if (inobj.token_id && outobj.token_id && inobj.token_id !== outobj.token_id) {
            let inputValue = parseFloat(ininput);
            let _bili = parseFloat(bili.value);
            if (_bili > 0 && inputValue > 0) {
                setSucessmess(language.swap[10] + inputValue + " " + inobj.btext + "，"
                    + language.swap[11] + (inputValue * _bili) + ' ' + outobj.btext + language.swap[12]);
                setOutinput((inputValue * _bili));
            } else {
                setOutinput('');
                setSucessmess('');
            }
        }else 
        {
            setOutinput('');
            setSucessmess(''); 
        }
    }, [ininput, inobj, outobj,bili,language]) 

    //界面初始化
    const init = () => {
        setSucessmess('');
        setErrstr('');
        setInputError(false);
        setBili({ str: '', value: 0 });
    }

    //token选择处理 obj->被选择的token对象
    const selectToken = async (obj) => {
        //除eth外，其它默认非授权
        if(obj.token_id===-2){setIsallow(true);}  
        setShow(false);
        //重复选择不处理
        if ((workIndex === -2 && obj.token_id === inobj.token_id) || (workIndex === -1 && obj.token_id === outobj.token_id)) return; 
        init();
        let logoImage = obj.dao_logo; //logo 图片
        let selectTokenBalance = '0'; //选择token的余额
        if (obj.token_id === -2) { //eth
            logoImage = ethlogo;
            selectTokenBalance =ethBalance; 
        }
        else if (obj.token_id === -1) {  //utoken
            logoImage = logo;
            selectTokenBalance = utokenBalance; // currentUtoken.utoken;  //余额
        }
        else {
            logoImage = obj.dao_logo ? obj.dao_logo : logo;
           const {token}= await user.daoapi.dao_erc20s.balanceOf(obj.token_id, user.account);
           console.log(token)
            selectTokenBalance = token; //余额
        }
        
        if (workIndex === -2) //上, 输入窗口选择
        {
            if (parseFloat(selectTokenBalance) <= 0) setErrstr(language.swap[14]) //显示余额不足
            if (obj.token_id === -1) //utoken授权
            {
                user.daoapi.dao_uToken.allowance(user.account, user.daoapi.dao_iadd.address).then(r => {
                    if (parseFloat(r.approveSum) > 0)  setIsallow(true);  else  setIsallow(false); 
                });
            } else if (obj.token_id !== -2) { //普通token
                user.daoapi.dao_erc20s.allowanceAll(user.account, user.daoapi.dao_iadd.address)
                  .then((r) => {if (r.status) setIsallow(true); else setIsallow(false);
                });
            }
            setInobj({ btext: obj.dao_symbol, blogo: logoImage, token_id: obj.token_id });
            if (obj.token_id === outobj.token_id) { //与输出token相同
                setJin({ inBalance: selectTokenBalance, outBalance: '' });
                setOutobj({ btext: language.swap[2], blogo: '', token_id: 0 });
            } else {
                setJin({ ...jin, inBalance: selectTokenBalance });
            }

            let inputValue=parseFloat(ininput)
            if (!inputValue) {
                setErrstr(language.swap[13]); //兑换数不能为0
                return;
            }
            else
                if (inputValue > parseFloat(selectTokenBalance)) {
                    setErrstr(language.swap[14]); //余额不足
                    setInputError(true);
                } else {
                    setErrstr('');
                    setInputError(false);
                }
    
        }
        else  //下
        {
            
            setOutobj({ btext: obj.dao_symbol, blogo: logoImage, token_id: obj.token_id })
            if (obj.token_id === inobj.token_id) { //与输入token相同
                setIsallow(true); 
                setJin({ outBalance: selectTokenBalance, inBalance: '' });
                setInobj({ btext: language.swap[2], blogo: '', token_id: 0 });
            } else {
                setJin({ ...jin, outBalance: selectTokenBalance });
            }
        }
    }

    //授权处理
    const handleapprove = () => {
        if (inobj.token_id === -1) { //utoken 授权
           showTip(language.header[4])
            user.daoapi.dao_uToken.approve(user.daoapi.dao_iadd.address, '99999999').then(e => {
               closeTip(); setIsallow(true);
            }, err => {
                console.error(err);closeTip();
               showError(language.tips[8] + (err.message ? err.message : err));
            });
        } else {//token授权
            showTip(language.header[4])
            user.daoapi.dao_erc20s.approveAll(user.daoapi.dao_iadd.address, true).then(e => {
                closeTip(); setIsallow(true);
            }, err => {
                console.error(err);closeTip();
                showError(language.tips[8] + (err.message ? err.message : err));
            });
        }
    }

    //兑换操作完成后清理
    const resulthandle = (b1, b2) => { setJin({ inBalance: b1, outBalance: b2 }); setIninput(''); setOutinput('') }

    //eth 兑换 utoken
    const eth_utoken = async () => {
        showTip(language.swap[15]);
        user.daoapi.dao_uToken.swap(parseFloat(ininput)).then(re => {
            closeTip();
            user.daoapi.etherProvider.getBalance(user.account).then(e1 => {
                const _b1 = user.daoapi.ether.utils.formatEther(e1)
                setEth(_b1)
                user.daoapi.dao_uToken.balanceOf(user.account).then(e2 => {
                    const _b2 = e2.utoken;
                   setUtoken(_b2)
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err); closeTip();
            showError(language.tips[8] + (err.message ? err.message : err));
        });
    }

   
    const eth_token = () => { 
        showTip(language.swap[15]);
        user.daoapi.dao_ethToken.ethToToken(parseFloat(ininput), outobj.token_id).then(e => {
            closeTip();
            user.daoapi.etherProvider.getBalance(user.account).then(e1 => {
                const _b1 = user.daoapi.ether.utils.formatEther(e1);
                setEth(_b1)
                user.daoapi.dao_erc20s.balanceOf(outobj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showError(language.tips[8] + (err.message ? err.message : err));
        })
    }

    const utoken_token = () => {
        showTip(language.swap[15]);
        user.daoapi.dao_iadd.utokenToToken(parseFloat(ininput), outobj.token_id).then(e => {
            closeTip();
            user.daoapi.dao_uToken.balanceOf(user.account).then(e1 => {
                const _b1 = e1.utoken;
                setUtoken(_b1)
                user.daoapi.dao_erc20s.balanceOf(outobj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showError(language.tips[8] + (err.message ? err.message : err));
        })
    }

    const token_utoken = () => {
        showTip(language.swap[15]);
        user.daoapi.dao_iadd.tokenToUtoken(parseFloat(ininput), inobj.token_id).then(e => {
           closeTip();
            user.daoapi.dao_uToken.balanceOf(user.account).then(e1 => {
                const _b1 = e1.utoken;
                setUtoken(_b1)
                user.daoapi.dao_erc20s.balanceOf(inobj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b2, _b1);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showError(language.tips[8] + (err.message ? err.message : err));
        })

    }

    const token_token = () => {
        showTip(language.swap[15]);
        user.daoapi.dao_iadd.tokenToToken(parseFloat(ininput), inobj.token_id, outobj.token_id).then(e => {
           closeTip();
            user.daoapi.dao_erc20s.balanceOf(inobj.token_id, user.account).then(e1 => {
                const _b1 = e1.token;
                user.daoapi.dao_erc20s.balanceOf(outobj.token_id, user.account).then(e2 => {
                    const _b2 = e2.token;
                    resulthandle(_b1, _b2);
                })
            })
        }, err => {
            console.error(err);closeTip();
            showError(language.tips[8] + (err.message ? err.message : err));
        })
    }

    //兑换处理
    const handleswap = () => {
        if (!parseFloat(ininput)) { setErrstr(language.swap[13]); return; } //0 或非数字
        if (parseFloat(ininput) > parseFloat(jin.inBalance)) { setErrstr(language.swap[14]); setInputError(true); return; } //余额是足
        if (inobj.token_id === -2 && outobj.token_id === -1) { eth_utoken(); }
        else if (inobj.token_id === -2 && outobj.token_id > 0) { eth_token(); }
        else if (inobj.token_id === -1 && outobj.token_id > 0) { utoken_token(); }
        else if (inobj.token_id > 0 && outobj.token_id === -1) { token_utoken(); }
        else if (inobj.token_id > 0 && outobj.token_id > 0) { token_token(); }
    }

    //输出值改变
    const outchange = (event) => { setOutinput(event.currentTarget.value) }

    //输入值改变
    const inputChange = (event) => { //录入事件
        setInputError(false);
        let _preValue=ininput; //保存的值
        let _curValue=event.currentTarget.value //当前值
        if(!_curValue) _preValue="";
        else { 
            if(_curValue.slice(0,1)==="0" && _curValue.slice(1,2)!==".") _preValue="0"; //0开头，第二位必须是小数点
            else { 
                if(!isNaN(parseFloat(_curValue)) && isFinite(_curValue)) _preValue=_curValue   //是数值，当前值保存
                }
        }
        let inputValue = parseFloat(_preValue);
        if (!inputValue) inputValue = 0;
       
        setIninput(_preValue)

        if (!inputValue) {
            setErrstr(language.swap[13]);
            return;
        }
        else
            if (inputValue > parseFloat(jin.inBalance)) {
                setErrstr(language.swap[14]);
                setInputError(true);
            } else {
                setErrstr('');
                setInputError(false);
            }

    }

    //按钮上的文本和余额
    function RecordItem({ title, balance, bText }) {
        return (
            <div className="d-flex justify-content-between align-content-center" style={{ paddingBottom: '16px' }}>
                <div  >{title}</div>
                <div style={{ color: '#984c0c' }}>{bText}:<span style={{ display: 'inline-block', minWidth: 100 }} >{balance}</span></div>
            </div>
        );
    }

    return (
        <>
            <Card className='mb-3' >
                <Card.Body>
                    <RecordItem title={language.swap[0]} balance={jin.inBalance} bText={language.swap[6]} ></RecordItem>
                    {/* 文本框和按钮 */}
                    <div className="d-flex justify-content-between align-content-center">
                        <input disabled={user.connected !== 1}  type="text" value={ininput} className='iadd_input' 
                        placeholder="0.0" onChange={inputChange} style={{ color: inputError ? 'red' : 'black' }} />
                        <div style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
                          {!isallow &&  //授权按钮
                             <button className="btn btn-info" style={{ borderRadius: '20px' }} 
                                 onClick={handleapprove}  >{language.swap[8]}
                          </button>}{'  '}
                          {/* 选择按钮 */}
                            <button className="btn btn-lg btn-outline-secondary " style={{ borderRadius: '26px' }} 
                            onClick={e => { setWorkIndex(-2); setShow(true) }} disabled={user.connected !== 1}  >
                                <img alt='' style={{ width: '24px', height: '24px', display: inobj.blogo === '' ? 'none' : '' }} src={inobj.blogo} />
                                <span style={{ display: 'inline-block', padding: '0 4px' }} >{inobj.btext}</span>
                                <img alt='' src={downimg} ></img>
                            </button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <div className='iadd_splitdiv' >
                <img className='iadd_splitimg' alt='' src={splitimg}></img>
            </div>
            <Card className='mb-0'>
                <Card.Body>
                    <RecordItem title={language.swap[1]} balance={jin.outBalance} bText={language.swap[6]} ></RecordItem>
                      {/* 文本框和按钮 */}
                    <div className="d-flex justify-content-between align-content-center">
                        <input readOnly={true} id='iadd_out_input' type="text" className='iadd_input' placeholder="0.0" 
                        value={outinput} onChange={outchange} />
                        <div style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
                            <button className="btn btn-lg btn-outline-secondary " style={{ borderRadius: '26px' }} 
                            onClick={e => { setWorkIndex(-1); setShow(true) }} disabled={user.connected !== 1}>
                                <img alt='' style={{ width: '24px', height: '24px', display: outobj.blogo === '' ? 'none' : '' }} 
                                src={outobj.blogo} />
                                <span style={{ display: 'inline-block', padding: '0 4px' }} >{outobj.btext}</span>
                                <img alt='' src={downimg} ></img>
                            </button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            {/* 比率 */}
            <div className="d-flex justify-content-between align-content-center text-black-50" style={{ padding: '6px 10px' }} >
                <div>{language.swap[3]}</div>
                <div>{bili.str}</div>
            </div>
            <Alert variant='danger' style={{ display:  isallow? 'none' : '' }} >
                {language.swap[7]}
            </Alert>
            <Alert variant='danger' style={{ display: (errstr === '') ? 'none' : '' }} >
                {errstr}
            </Alert>
            <Alert variant='success' style={{ display: (sucessmess === '' || errstr !== '') ? 'none' : '' }} >
                {sucessmess}
            </Alert>
            <div className="d-grid gap-2">
                <Button disabled={user.connected !== 1 || !isallow || errstr !== ''} onClick={handleswap} 
                type="button">{language.swap[4]}</Button>
            </div>
            {/* 弹出窗口 */}
            <SwapWindow
                user={user} language={language} selectToken={selectToken} workIndex={workIndex} 
                show={show} setShow={setShow}
                onHide={() => setShow(false)}>
            </SwapWindow>
        </>
    );
}

export default IADD;