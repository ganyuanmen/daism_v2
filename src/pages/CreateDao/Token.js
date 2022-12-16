
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DaoSelect from '../../components/DaoSelect';

/**
 * 发布token
 * user 用户信息
 * language 语言信息
 */
function Token({ user, language,refresh, setRefresh, ...props }) {
   
    const [errmess, setErrmess] = useState(''); //错误，已经发布token ,注册时不允许发布token
    const [daoItem, setDaoItem] = useState(null);   //已选择dao信息
  //  const [refresh, setRefresh] = useState(false); //点击刷新按钮或自动刷新状态
 
    //发布token
    const handle = () => {
            props.showTip(language.token[1])
            user.daoapi.dao_erc20s.issue(daoItem.dao_id).then(re => {
               // props.closeTip();
                   //延迟，等待后台获取数据后再刷新dao列表
                setTimeout(() => {setRefresh(true);}, 1000);
            }, err => {
                console.error(err);props.closeTip();
                props.showError(language.tips[8]+(err.message?err.message:err));
            });

    };

      //dao 选择事件  
    const daoSelectEvent=(e)=>{
        setErrmess('');
        setDaoItem(e);
        if(e) {
        if (e.can_token===0) { setErrmess(language.token[4]) } //不允许发布token
        else if (e.token_id>0) { setErrmess(language.token[0]) } //已发布token
        }
    }

    return (
        <>
        <DaoSelect 
            user={user} 
            language={language} 
            daoSelect={daoSelectEvent} 
            itemClass='gab' 
            closeTip={props.closeTip}
            refresh={refresh} 
            setRefresh={setRefresh} 
            daoItem={daoItem} 
        />
            {errmess !== '' &&user.connected === 1 && 
                <Alert variant="danger" >
                <Alert.Heading>{language.w_tipMessage}</Alert.Heading>
                <p>
                 DAO({daoItem.dao_name})   {errmess}
                </p>
                </Alert>}

            <div className="d-grid gap-2">
                <Button disabled={user.connected !== 1 || errmess !== '' || !daoItem} onClick={handle} >{language.token[2]}</Button>
            </div>
        </>
    );
}

export default Token;