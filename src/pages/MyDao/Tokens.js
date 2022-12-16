import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import {store} from '../../service/Store';
import { useSelector, useDispatch } from 'react-redux';
import {getData,clearData} from '../../data/allData'


/**
 * 我的token
 * user 用户信息
 * language 语言信息
 */
export default function Tokens() {
    const [user, setUser] = useState(store.getState()); //钱包用户
    const tokenData = useSelector((state) => state.data.data)
    const postStatus = useSelector((state) => state.data.status)
    const dispatch = useDispatch();
    const language = useSelector((state) => state.valueData.language)

    useEffect(() => { 
        //订阅
    let unstrore= store.subscribe(()=>{setUser(store.getState()) })
    return ()=>{unstrore();  }  //取消订阅
    }, []);

    //登录初始化数据
    useEffect(() => { 
        if (user.connected === 1) dispatch(getData({url:user.url + "getMyTokenList?_t="+new Date().getTime(),address:user.account}))
        else dispatch(clearData())
    }, [user,dispatch]);

    return ( <>
        {(postStatus==='loading')?  
            <div style={{textAlign:'center'}} >
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </div>
        :
        <Table striped bordered hover>
            <thead><tr><th></th><th>{language.my[8]}</th><th>{language.my[9]}</th></tr></thead>
            <tbody>
                {tokenData.map((obj, idx) => (
                    <tr key={'mytoken_2' + idx}><td>{idx + 1}</td><td>{obj.dao_symbol}</td><td>{obj.token_cost}</td></tr>
                ))}
            </tbody>
        </Table>}
        </>
    );
}
