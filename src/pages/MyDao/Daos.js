import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import logo from '../../logo.svg';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ShowAdress from '../../components/ShowAdress';
import { useSelector, useDispatch } from 'react-redux';
import {getDaoData,selectDaoData,selectGetting} from '../../data/myDaoData'
import {store} from '../../service/Store';
/**
 * 我的dao
 * user 用户信息
 * language 语言信息
 */
export default function Daos() {
    const [user, setUser] = useState(store.getState()); //钱包用户
    const [daoMember, setDaoMember] = useState({members:[]}); //dao成员
    const [show,setShow]=useState(false) //成员窗口显示
    const myDaoData = useSelector(selectDaoData);
    const postStatus = useSelector(selectGetting);
    const dispatch = useDispatch();
    const language = useSelector((state) => state.valueData.language)
    const handleClose= () => setShow(false);
    const showWindow=(obj)=>{setDaoMember(obj);setShow(true)}

    useEffect(() => { 
        //订阅
    let unstrore= store.subscribe(()=>{setUser(store.getState()) })
    return ()=>{unstrore();   }   //取消订阅
    }, []);

    //登录初始化数据
    useEffect(() => {
        if (user.connected === 1 && !myDaoData.length) {
            dispatch(getDaoData(user.url,user.account))
        }
    }, [user,dispatch,myDaoData]);

    return (
        <> {postStatus?  
        <div style={{textAlign:'center'}} >
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...
        </div>
        :
        <Table striped bordered hover>
            <thead><tr><th></th><th>ID</th><th>{language.my[10]}</th><th></th></tr></thead>
            <tbody>
                {myDaoData.map((obj, idx) => (
                    <tr key={'mydao13_' + idx}><td>
                        <img alt='' src={obj.dao_logo ? obj.dao_logo : logo} style={{ width: 24, height: 24 }} ></img></td>
                        <td>{obj.dao_id}</td><td>{obj.dao_symbol}</td><td> 
                            <Button  size="sm" variant="info" 
                              onClick={()=>{showWindow(obj)}} >{language.pro[32]}
                            </Button>
                        </td></tr>
                ))}
            </tbody>
        </Table>}

        <Modal show={show}  onHide={handleClose}>
        <Modal.Header closeButton> </Modal.Header>
        <Modal.Body>
            
        <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gb'>{language.register[1]}</InputGroup.Text>
                <FormControl readOnly ={true}  value={daoMember.dao_name}  type="text"  />
        </InputGroup>
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gb'>{language.register[2]}</InputGroup.Text>
                <FormControl readOnly ={true}  value={daoMember.dao_symbol}  type="text"  />
            </InputGroup>
            <InputGroup className="mb-2">
                <InputGroup.Text className='gb'>{language.register[11]}</InputGroup.Text>
                <div className='form-control' >
                    <Form.Check  type="checkbox" disabled={true} defaultChecked={daoMember.can_token===1}  label={language.register[10]} />
                </div>
            </InputGroup>
            <FloatingLabel className="mb-2" label={language.register[3]}>
                <Form.Control as="textarea"  readOnly ={true}  value={daoMember.dao_dsc}   style={{ height: '160px' }} />
            </FloatingLabel>

       
               <Table striped bordered hover>
               <tbody>
                   {daoMember.members.map((obj, idx) => (
                       <tr key={'members_' + idx}>
                           <td>{idx}</td><td><ShowAdress  language={language}  address={obj.dao_address}></ShowAdress>
                            </td></tr>
                   ))}
               </tbody>
           </Table>
   
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>{language.tips[10]}</Button>
        </Modal.Footer>
      </Modal>
        </>
    );
}
