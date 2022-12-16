
import { useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector, useDispatch } from 'react-redux';
import {getDaoData,selectDaoData,selectGetting} from '../data/myDaoData'



/**
 * dao 下拉列表选择器
 * user 用户信息
 * language 语言信息
 */
export default function Daoselect({ user, language, ...props }) {
    const [curimg, setCurimg] = useState('');   //当前图片
    const myDao = useSelector(selectDaoData);
    const postStatus = useSelector(selectGetting);
    const dispatch = useDispatch();

     //为dao 设置显示logo
    const setImg=(_obj)=>
    {
        if (_obj.dao_logo) { setCurimg(_obj.dao_logo); }
        else  setCurimg('') 
    }

    //根据daoId 定位索引
    const findObj=(_obj,_id)=>{
        let re=0;
        for(let i=0;i<_obj.length;i++)
        {
            if(_obj[i].dao_id===_id)
            {
                re=i;
                break;
            }
        }
        return re;
    }

    useEffect(() => {
        if(!postStatus && myDao.length) //数据加载后，刷新当前选择项
        {   props.closeTip();
            if(props.daoItem) {
                let obj=myDao[findObj(myDao,props.daoItem.dao_id)]
                props.daoSelect(obj); setImg(obj);
                
            }
            else {props.daoSelect(myDao[0]); setImg(myDao[0])}
        }  
    }, [postStatus]);    

    useEffect(() => {
        if(user.connected===1)
        {
            if(props.refresh) {  
                dispatch(getDaoData(user.url,user.account));
                props.setRefresh(false);
            }
            else if(!myDao.length) dispatch(getDaoData(user.url,user.account))
        } 
           
    }, [props.refresh,user.connected,dispatch]);

   
    //根据选择daoID获dao所有信息
    const fingImg = (dao_id) => {
        let re = null;
        for (let i = 0; i < myDao.length; i++) {
            if (myDao[i].dao_id === dao_id) {
                re = myDao[i];
                //如果dao设置了图片则显示
                if (myDao[i].dao_logo) { setCurimg(myDao[i].dao_logo); }
                else { setCurimg('') }
                break;
            }
        }
        return re;
    }

    return (
        <>
            {/* dao 列表下拉框 */}
            <InputGroup className="mb-2">
                <InputGroup.Text className={props.itemClass}>{language.daoselect[0]}</InputGroup.Text>
                <select className='form-control' 
                 //触发上层组件的选择事件
                  onChange={e => { props.daoSelect(fingImg(parseInt(e.currentTarget.value))); }} 
                  disabled={user.connected !== 1} 
                >
                    {myDao.map((obj, idx) => (
                        <option key={'daoselect_' + idx} value={obj.dao_id}>{obj.dao_name}({obj.dao_symbol})</option>
                    ))}
                </select>
                <button className="btn btn-primary" type="button" disabled={user.connected!==1||props.refresh|| postStatus} 
                    onClick={e=>{props.setRefresh(true) }}>   {
                    postStatus?<><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...</>
                            : language.daoselect[1]}
                </button>
            </InputGroup>

            {/* 显示dao的logo */}
            <InputGroup className="mb-2" style={{ display: curimg === '' ? 'none' : '' }} >
                <InputGroup.Text className={props.itemClass}>{language.daoselect[2]}</InputGroup.Text>
                <div className='form-control' >
                    {/* 没有logo则不显示 */}
                    <img style={{ width: '32px', height: '32px', display: curimg === '' ? 'none' : '' }} src={curimg} alt='' ></img>
                </div>
            </InputGroup>
        </>
    );
}

