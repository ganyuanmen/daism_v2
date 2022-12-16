import "./index.css";
import findimg from "./find.svg";
import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { store} from "../../service/Store";
import RecordItem from "./RecordItem";
import { useSelector, useDispatch } from 'react-redux';
import {getPageData} from '../../data/pageData'

/**
 * dao 列表展示
 */
export default function DataList() {
  const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
  const [orderField, setOrderField] = useState("dao_time"); //排序字段
  const [searchText, setSearchText] = useState(""); //模糊查询内容
  const [orderIndex, setOrderIndex] = useState(2); //排序项目选择
  const [orderType, setOrderType] = useState(false); //排序类型
  const [inputText, setInputText] = useState(""); //查询录入值
  const [user, setUser] = useState(store.getState()); //钱包用户信息
  const postStatus = useSelector((state) => state.pageData.status)
  const postError = useSelector((state) => state.pageData.error)
  const pageData = useSelector((state) => state.pageData.pageData)
  const pages = useSelector((state) => state.pageData.pages)
  const records = useSelector((state) => state.pageData.records)
  const language = useSelector((state) => state.valueData.language)
  const dispatch = useDispatch();
 
  useEffect(async () => { 
     dispatch(getPageData({
          url: user.url + "getDaoData",
          pageSize:4,
          order:orderField,
          orderType:orderType ? "asc" : "desc",
          pageNum:currentPageNum,
          title:searchText
        }))
  }, [currentPageNum, orderField, searchText, orderType, user.url,dispatch]);

  useEffect(() => { 
    //订阅钱包登录用户信息
   let unstrore= store.subscribe(()=>{setUser(store.getState())})
   return ()=>{unstrore();} //退出时取消订阅
 }, []);

  return (
    <>
      
        <div className="carTop2">
          {/* 搜索框 */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{language.daoList[11]}</Tooltip>}>
            <img alt="" className="fingimg" src={findimg} onClick={(e) => {setSearchText(inputText);setCurrentPageNum(1);}}></img>
          </OverlayTrigger>
        <input style={{flex:1}} value={inputText} onChange={(e) => {setInputText(e.currentTarget.value);}}
            className="form-control form-control-sm findinput" placeholder={language.daoList[0]}
            onKeyDown={(e) => {if (e.key === "Enter") { setSearchText(e.target.value);setCurrentPageNum(1);}}}>
          </input>
        
        {/* 排序选项 */}
      <div style={{paddingLeft:'10px'}}>
        {(postStatus==='loading')?  
            <div style={{textAlign:'center'}} >
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </div>
        :<div>
          <span className={orderIndex === 2 ? "morder ac" : "morder"} onClick={(e) => {
              setOrderIndex(2);
              setOrderField("dao_time");
              setOrderType(!orderType);
            }}>
            {language.daoList[1]} {orderIndex === 2?( orderType?"↓":"↑"):""}
          </span>
          <span  className={orderIndex === 1 ? "morder ac" : "morder"} onClick={(e) => {
              setOrderIndex(1);
              setOrderField("dao_name");
              setOrderType(!orderType);
            }}>
            {language.daoList[2]} {orderIndex === 1?( orderType?"↓":"↑"):""}
          </span>
          <span className={orderIndex === 0 ? "morder ac" : "morder"} onClick={(e) => {
              setOrderIndex(0);
              setOrderField("dao_index");
              setOrderType(!orderType);
            }} >
            {language.daoList[10]} {orderIndex === 0?( orderType?"↓":"↑"):""}
          </span>
        </div>}
      </div>
      </div>
      {/* dao 记录展示 */}
      {pageData.map((placement, idx) => (<RecordItem key={'alldaolist'+idx} record={placement} language={language} />))}
      {/* 页统计信息 */}
      <div className="pagetotal">
        <div>{language.daoList[7]}： <span className="pageText">{records}</span></div>
        <div>{language.daoList[8]}： <span className="pageText">{currentPageNum}</span></div>
        <div>{language.daoList[9]}： <span className="pageText">{pages}</span></div>
      </div>
        {/* 页码 */}
      <div className="pageButton">
        <Pagination size="lg">
          <Pagination.First onClick={(e)=>{setCurrentPageNum(1);}}/>
          <Pagination.Prev onClick={(e)=>{setCurrentPageNum(currentPageNum-1);}} disabled={currentPageNum === 1?true:false}/>
          <Pagination.Next onClick={(e)=>{setCurrentPageNum(currentPageNum+1);}} disabled={currentPageNum===pages?true:false}/>
          <Pagination.Last onClick={(e) =>{setCurrentPageNum(pages);}}/>
        </Pagination>
      </div>
      <div style={{color:'red'}} >{postError}</div>
    </>
  );
}
