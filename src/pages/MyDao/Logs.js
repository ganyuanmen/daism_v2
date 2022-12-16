import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { useSelector, useDispatch } from 'react-redux';
import {getPageData,clearData} from '../../data/pageData'
import {store} from '../../service/Store';
/**
 * 兑换记录
 * user 用户信息
 * language 语言信息
 */
export default function Logs() {
  const [user, setUser] = useState(store.getState()); //钱包用户
  const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
  const postStatus = useSelector((state) => state.pageData.status)
  const logData = useSelector((state) => state.pageData.pageData)
  const pages = useSelector((state) => state.pageData.pages)
  const records = useSelector((state) => state.pageData.records)
  const dispatch = useDispatch();
  const language = useSelector((state) => state.valueData.language)
 

  useEffect(() => { 
    //订阅
   let unstrore= store.subscribe(()=>{setUser(store.getState()) })
   return ()=>{unstrore();   }  //取消订阅
  }, []);

  // const axios = require("axios");
  // 监听翻页
  useEffect(() => {
     if (user.connected === 1)
        dispatch(getPageData({
          url: user.url + "getIaddLogs",
          pageSize:5,
          pageNum:currentPageNum,
          address: user.account
        }))
    else 
       dispatch(clearData())
  }, [currentPageNum, user,dispatch]);

  return (
    <>
      {(postStatus==='loading')?  
            <div style={{textAlign:'center'}} >
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
            </div>
        :
      
      logData.map((obj, idx) => (
        <Card className="mb-2" key={"mylogs_" + idx}>
          <Card.Body>
            <Container>
              <Row><Col>{obj.title}</Col><Col>{language.my[4]}{obj.in_amount}</Col></Row>
              <Row><Col>{obj.my_time}</Col><Col>{language.my[5]}{obj.out_amount}</Col></Row>
            </Container>
          </Card.Body>
        </Card>
      ))}
      {logData.length > 0 && (
        <>
          <div className="pagetotal">
            <div>{language.daoList[7]}：{" "}<span className="pageText">{records}</span></div>
            <div>{language.daoList[8]}：{" "}<span className="pageText">{currentPageNum}</span></div>
            <div>{language.daoList[9]}：{" "}<span className="pageText">{pages}</span></div>
          </div>
          <div className="pageButton">
            <Pagination size="lg">
              <Pagination.First onClick={(e) => {setCurrentPageNum(1);}}/>
              <Pagination.Prev onClick={(e)=>{setCurrentPageNum(currentPageNum-1);}} disabled={currentPageNum===1?true:false}/>
              <Pagination.Next disabled={currentPageNum===pages?true:false} onClick={(e)=>{setCurrentPageNum(currentPageNum+1);}}/>
              <Pagination.Last onClick={(e) => {setCurrentPageNum(pages);}} />
            </Pagination>
          </div>
        </>
      )}
    </>
  );
}
