import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

/**
 * dao注册模块
 * user 用户信息
 * language 语言信息
 */
export default function Dao({ user, language, ...props }) {
    const [addAr, setAddAr] = useState([]); //dao 成员模块 DOM内容，包含名称和票权
    const [showError, setShowError] = useState( //错误信息
        { 
            manager: false,  //管理员地址错误标记
            daoName: false, //dao名称错误标记
            daosysmbl: false, //dao 符号错误标记
            firrstName:false, //第一个成员名称错误标记
            firrstVote:false, //第一个成员票权错误标记
            cause:false  //app地址错误标记
        });
        const axios = require('axios');
    //地址检测 0x开头40位数字字母
    const checkAddress=(v)=>{
        return /^0x[A-Fa-f0-9]{40}$/.test(v);
    }
    //数字检测
    const checkNum=(v)=>{
      return /^[1-9][0-9]*$/.test(v);
    }
     //表单上数据合法性检测
    const myCheck = (form) => {
        let _err = 0;
        let _temp;
        let _isErr = { manager: false, daoName: false, daosysmbl: false,firrstName:false,firrstVote:false,cause:false  };

         _temp = form.createdao_name.value.trim(); //dao名称
        if (!_temp || _temp.length > 128) { _err = _err + 1; _isErr.daoName = true; }

        _temp = form.createdao_sysmobl.value.trim(); //dao符号
        if (!_temp || _temp.length > 128) { _err = _err + 1; _isErr.daosysmbl = true; }

        _temp = form.createdao_manager.value.trim(); //管理员地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; _isErr.manager = true; }

        _temp = form.createdao_cause.value.trim(); //app地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; _isErr.cause = true; }

         _temp = form.org_firstName.value.trim(); //第一个成员地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; _isErr.firrstName = true; }

         _temp=form.org_firstvote.value.trim(); //第一个成员票权
        if(!_temp || !checkNum(_temp) ) {_err=_err+1; _isErr.firrstVote=true;}

        //第二成员开始的地址和票权检测
        addAr.forEach(v=>{
            _temp=form['org_firstName' + v.index].value.trim();
            if(!_temp || !checkAddress(_temp) ) {_err=_err+1; v.isErr1=true;}
            _temp=form['org_firstvote' + v.index].value.trim();
            if(!_temp || !checkNum(_temp)) {_err=_err+1; v.isErr2=true;}

        })

        setShowError(_isErr);
        return _err === 0;
    }

    
    //注册事件
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (!myCheck(form)) props.showError(language.errors.mess);
        else {
            // 后台检测dao名称和符号是否有重名
            axios({
                method: 'post',
                url: user.url + 'checkDao?_t=' + (new Date()).getTime(),
                data: { 
                    daoName: form.createdao_name.value.trim(), 
                    daoSymbol: form.createdao_sysmobl.value.trim() }
            }).then(function (response) {
                    if (response.data) props.showError(language.register[8]);
                    else { //注册dao 到链上
                        
                        //生成成员名称和票权的数组
                        let members = [form.org_firstName.value.trim()];
                        let votes = [form.org_firstvote.value.trim()];
                        addAr.forEach(v=>{
                            members.push(form['org_firstName' + v.index].value.trim());
                            votes.push(form['org_firstvote' + v.index].value.trim())
                        })
                        if(members.length>20)
                        {
                            props.showError(language.register[13]);
                            return;  
                        }

                        //检测地址是否有相同的成员
                        const num = new Set(members);
                        if(num.size!==members.length)
                        {
                            props.showError(language.register[14]);
                            return;   
                        }
                        //提交到链上
                        props.showTip(language.register[7])
                        user.daoapi.dao_register.createOrg(
                            form.createdao_name.value.trim(),  //dao名称
                            form.createdao_sysmobl.value.trim(), //dao符号
                            form.createdao_dsc.value.trim(), //dao 描述
                            form.createdao_manager.value.trim(), //管理员地址
                            form.createdao_isToken.checked, //是否允许发布token
                            '1', //app序号，默认1
                            '1', //app版本号 默认1
                            members, //成员列表
                            votes, //票权列表
                            [form.createdao_cause.value.trim()]).then(re => {
                                form.createdao_name.value = '';
                                form.createdao_sysmobl.value = '';
                                form.createdao_dsc.value = '';
                                props.setRefresh(true); //刷新dao下拉框数据源
                                props.closeTip();
                                props.showError(language.register[15]);
                        }, err => { //提交链上错误处理
                            console.error(err);props.closeTip();
                            props.showError(language.tips[8] + (err.message ? err.message : err));
                        });
                    }
                }) //检查重名错误处理
                .catch(function (error) {
                    console.error(error);
                })
        }
        event.preventDefault();
        event.stopPropagation();
    };
 
    //删除成员
    const delMember = (event) => {
        let _num = parseInt(event.currentTarget.getAttribute('data-key'));
        for (let i = 0; i < addAr.length; i++) {
            if (addAr[i].index === _num) {
                addAr.splice(i, 1);
                setAddAr([...addAr]);
            }
        }
    }
    
    //增加成员
    const addMember = (event) => {
        if (addAr.length)
            setAddAr([...addAr, {index:addAr[addAr.length-1].index+1,isErr1:false,isErr2:false}])
        else
            setAddAr([{index:0,isErr1:false,isErr2:false}])
    }

    return (
        <Form onSubmit={handleSubmit}>
           {/* 管理员地址 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gab'>{language.register[0]}</InputGroup.Text>
                <FormControl id='createdao_manager'  readOnly ={user.connected !== 1}  
                isInvalid={showError.manager ? true : false} type="text" 
                onFocus={e => { setShowError({ ...showError, manager: false }) }} 
                placeholder={language.register[0]} 
                defaultValue={user.account} />
                <Form.Control.Feedback type="invalid">
                    {language.errors.dao[2]}
                </Form.Control.Feedback>
            </InputGroup>
             {/* dao名称 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gab'>{language.register[1]}</InputGroup.Text>
                <FormControl id='createdao_name'  readOnly ={user.connected !== 1}  
                isInvalid={showError.daoName ? true : false} type="text" 
                onFocus={e => { setShowError({ ...showError, daoName: false }) }} 
                placeholder={language.register[1]} defaultValue='' />
                <Form.Control.Feedback type="invalid">
                    {language.errors.dao[0]}
                </Form.Control.Feedback>
            </InputGroup>
            {/* dao 符号 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gab'>{language.register[2]}</InputGroup.Text>
                <FormControl id='createdao_sysmobl'  readOnly ={user.connected !== 1} 
                isInvalid={showError.daosysmbl ? true : false} type="text" 
                onFocus={e => { setShowError({ ...showError, daosysmbl: false }) }} 
                placeholder={language.register[2]} defaultValue='' />
                <Form.Control.Feedback type="invalid">
                    {language.errors.dao[1]}
                </Form.Control.Feedback>
            </InputGroup>
            {/* 是否允许发行token */}
            <InputGroup className="mb-2">
                <InputGroup.Text className='gab'>{language.register[11]}</InputGroup.Text>
                <div className='form-control' >
                    <Form.Check id='createdao_isToken' type="checkbox" defaultChecked={true}  
                    disabled ={user.connected !== 1} label={language.register[10]} />
                </div>
            </InputGroup>
            {/* 第一个成员地址 */}
            <InputGroup hasValidation className="mb-0">
                <InputGroup.Text className='gab' >{language.org[5]}</InputGroup.Text>
                <FormControl id='org_firstName'  readOnly ={user.connected !== 1} 
                isInvalid={showError.firrstName?true: false}  type="text" placeholder="0x"  
                onFocus={e=>{setShowError({...showError,firrstName:false})}} 
                 defaultValue={user.account} />
                <Form.Control.Feedback type="invalid">
                    {language.errors.org[2]}
                </Form.Control.Feedback>
            </InputGroup>
            {/* 第一个成员票权 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gab' >{language.org[6]}</InputGroup.Text>
                <FormControl id='org_firstvote'  readOnly ={user.connected !== 1} 
                isInvalid={showError.firrstVote?true: false}  type="text" placeholder=""  
                onFocus={e=>{setShowError({...showError,firrstVote:false})}}  
                defaultValue="1" />
                <Button variant="primary" disabled={user.connected !== 1} 
                onClick={addMember}>{language.org[7]}</Button>
                <Form.Control.Feedback type="invalid">
                    {language.errors.org[1]}
                </Form.Control.Feedback>
            </InputGroup>
            {/* 动态增加删除成员 */}
            {addAr.map((placement, idx) => (
                <div key={'org_'+idx} >
                    <InputGroup hasValidation className="mb-0">
                        <InputGroup.Text className='gab' >{language.org[5]}</InputGroup.Text>
                        <FormControl id={'org_firstName' + placement.index}  readOnly ={user.connected !== 1} 
                        isInvalid={placement.isErr1?true: false} 
                        onFocus={e=>{placement.isErr1=false;setAddAr([...addAr])}}  type="text"
                        placeholder="0x" defaultValue="" />
                        <Form.Control.Feedback type="invalid">
                              {language.errors.org[2]}
                         </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup hasValidation className="mb-2">
                        <InputGroup.Text className='gab'>{language.org[6]}</InputGroup.Text>
                        <FormControl id={'org_firstvote' + placement.index}  readOnly ={user.connected !== 1} 
                        isInvalid={placement.isErr2?true: false} type="text"  
                        onFocus={e=>{placement.isErr2=false;setAddAr([...addAr])}} 
                         placeholder="" defaultValue="1" />
                        <Button variant="warning" data-key={placement.index} onClick={delMember}>{language.org[8]}</Button>
                        <Form.Control.Feedback type="invalid">
                          {language.errors.org[1]}
                         </Form.Control.Feedback>
                    </InputGroup>
                </div>
            ))}

                {/* app地址 */}
            <InputGroup hasValidation className="mb-2">
                <InputGroup.Text className='gab'>{language.register[12]}</InputGroup.Text>
                <FormControl id='createdao_cause'  readOnly ={user.connected !== 1} 
                isInvalid={showError.cause ? true : false} type="text"  
                defaultValue={user.daoapi?user.daoapi.dao_logo.address:''}  
                onFocus={e => { setShowError({ ...showError, cause: false }) }} 
                 placeholder='0x'  />
                <Form.Control.Feedback type="invalid">
                    {language.errors.dao[2]}
                </Form.Control.Feedback>
            </InputGroup>
                {/* dao描述 */}
            <FloatingLabel className="mb-2" controlId="createdao_dsc" label={language.register[3]}>
                <Form.Control as="textarea"  readOnly ={user.connected !== 1} 
                    placeholder={language.register[3]}
                    style={{ height: '160px' }} />
            </FloatingLabel>

            <div className="d-grid gap-2">
                <Button disabled={user.connected !== 1} type="submit">{language.createDao[0]}</Button>
            </div>
        </Form>
    );
}
