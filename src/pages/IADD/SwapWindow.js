
import logo from '../../logo.svg';
import ethlogo from '../../eth.svg';
import findimg from '../DataList/find.svg';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import {getPageData} from '../../data/pageData'


function SwapWindow({ user, language, ...props }) {
 
    const [searchText, setSearchText] = useState(''); //模糊查询
    const [inputText, setInputText] = useState(''); //录入值

    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页


    const postStatus = useSelector((state) => state.pageData.status)
    const tokenData = useSelector((state) => state.pageData.pageData)
    const pages = useSelector((state) => state.pageData.pages)
    const records = useSelector((state) => state.pageData.records)
    const dispatch = useDispatch();
  

    const init = () => {
        setInputText('');
        setSearchText('');
      //  getData();
    }

  

    //选择 token 后处理
    const selectToken = (event) => {
        let _num = parseInt(event.currentTarget.getAttribute('data-key'));
        props.selectToken(tokenData[_num]); //调用父组件方法
    }

    //翻页，查询监听
    useEffect(() => { 
        dispatch(getPageData({
            url: user.url + "getDataToken",
            pageSize:4,
            order: 'dao_id',
            orderType:"asc",
            pageNum:currentPageNum,
            daoId: props.workIndex, //上窗口 workIndex=-2, 约定daoId >=-2 下窗口 workIndex=-1, 约定daoId >=-1
            title:searchText
          }))

    },  [currentPageNum, searchText,props.workIndex,dispatch,user.url]);

    return (
        <Modal
        show={props.show}  onHide={() => props.setShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
            onShow={init}
        >
            <Modal.Header closeButton>
                    <div className='carTop2' >
                        <OverlayTrigger placement='bottom' overlay={<Tooltip>{language.daoList[11]}</Tooltip>}>
                            <img alt='' className='fingimg' src={findimg} onClick={e => { setSearchText(inputText) }} ></img>
                        </OverlayTrigger>
                        <input style={{flex:1}} value={inputText} onChange={e => { setInputText(e.currentTarget.value); }} 
                        className="form-control form-control-sm findinput" placeholder={language.header[5]} 
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                setSearchText(e.target.value);
                                setCurrentPageNum(1);
                            }
                        }} ></input>
                        <div>
                       { (postStatus==='loading') && <div style={{textAlign:'center'}} >
                          <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
                      </div>}
                      </div>
                    </div>
            </Modal.Header>
            <Modal.Body>

                <ListGroup>
                    {tokenData.map((obj, idx) => (
                        <ListGroup.Item key={'swapwindow_' + idx} className='list-group-item-action d-flex justify-content-between align-items-center' >
                            <Button size='sm' data-key={idx} variant="outline-success" onClick={selectToken} >{language.daoList[12]}</Button>
                            <span>{obj.dao_symbol}</span> <img alt='' src={obj.dao_id === -2 ? ethlogo : (obj.dao_logo ? obj.dao_logo : logo)} style={{ width: 24, height: 24 }} ></img>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className='pagetotal' >
                    <div>{language.daoList[7]}： <span className='pageText' >{records}</span></div>
                    <div>{language.daoList[8]}： <span className='pageText' >{currentPageNum}</span></div>
                    <div>{language.daoList[9]}： <span className='pageText' >{pages}</span></div>
                </div>
                <div className='pageButton' >
                    <Pagination size="lg">
                        <Pagination.First onClick={e => { setCurrentPageNum(1) }} />
                        <Pagination.Prev onClick={e => { setCurrentPageNum(currentPageNum - 1) }} disabled={currentPageNum === 1 ? true : false} />
                        <Pagination.Next disabled={currentPageNum === pages ? true : false} onClick={e => { setCurrentPageNum(currentPageNum + 1) }} />
                        <Pagination.Last onClick={e => { setCurrentPageNum(pages) }} />
                    </Pagination>
                </div>
            </Modal.Body>

        </Modal>
    );
}

export default SwapWindow;