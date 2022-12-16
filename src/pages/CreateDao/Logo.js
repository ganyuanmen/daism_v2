import './logo.css';
import { useState } from 'react';
import DaoSelect from '../../components/DaoSelect';
import LogoSelect from '../../components/LogoSelect';
import LogoPro from '../../components/LogoPro';
import ProVote from '../../components/ProVote';
import Button from 'react-bootstrap/Button';
import SiweLogin from '../../components/SiweLogin';
/**
 * logo 操作模块
 * user 用户信息
 * language 语言信息
 */
function Logo({ user, language,refresh, setRefresh, ...props }) {
    const [isSetLogo, setIsSetLogo] = useState(false); //是否已设置logo
    const [isPro, setIsPro] = useState(false); //是否已进入提案
    const [isInstall, setIsInstall] = useState(false); //已安装扩展
    const [imgtype, setImgtype] = useState(''); //图片后缀
    const [realimg, setRealimg] = useState('');  //图片的logo 16进制编码
    const [daoItem, setDaoItem] = useState(null);  //被选择dao信息
    const [selectImg, setSelectImg] = useState(''); //选择图片
 //  const [refresh, setRefresh] = useState(false); //点击刷新按钮或自动刷新状态
    const [siweLogin, setSiweLogin] = useState(false);  //显示siwe登录窗口
        
    //首次设置logo提交链上，修改logo需要经过提案执行
    const handle = () => {
        props.showTip(language.logo[4]); 
        user.daoapi.dao_logo.setLogo(daoItem.dao_id, realimg, imgtype).then(re => {
            //延迟,等待后台获取数据后再刷新dao列表
            // props.closeTip();
            setTimeout(() => {setRealimg('');setRefresh(true);}, 1000);
        }, err => {
            console.error(err);props.closeTip();
            props.showError(language.tips[8]+(err.message?err.message:err));
        });
    }

    //dao选择事件
    const daoSelectEvent = async (e) => {
        setDaoItem(e);
        if (e && e.dao_logo) setIsSetLogo(true); else  setIsSetLogo(false); 
        if (e && e.is_install) setIsInstall(true); else  setIsInstall(false); 
        if (e && e.pro_index) setIsPro(true); else    setIsPro(false);;
        
    }

    return (
        <>
          <DaoSelect  //dao 选择器
                user={user}  //用户信息
                language={language}  //语言信息
                daoSelect={daoSelectEvent}  //dao选择事件
                refresh={refresh} //刷新状态
                closeTip={props.closeTip}
                setRefresh={setRefresh} //刷新状态设置
                itemClass='gab'  //css 样式
                daoItem={daoItem}  //选择的dao 信息
            />

         {!isSetLogo && !isPro && user.connected === 1 &&  //没有设置过logo && 非进入提案 && 已钱包登录
            <LogoSelect  //logo 选择器
                user={user} //用户信息
                language={language} //语言信息
                setImgtype={setImgtype}  //图片类型设置
                setRealimg={setRealimg}  //真实保存链上的图片编码
                itemClass='gab'  //css 样式
                isSetLogo={isSetLogo}  //是否已设置logo
                selectImg={selectImg}  //选择的图片
                setSelectImg={setSelectImg}  //设置选择图片
         />}

         {isSetLogo && !isPro && user.connected === 1 &&  
            <LogoPro //发起提案  安装/修改logo 两种提案
                user={user}  //用户信息
                language={language} //语言信息
                isInstall={isInstall}  //是否已安装扩展，优先显示 安装提案
                daoItem={daoItem} //选择的dao 信息
                showTip={props.showTip} 
                showError={props.ShowError}  
                closeTip={props.closeTip}
                selectImg={selectImg} //选择的图片
                setSelectImg={setSelectImg}  //设置选择图片
                setRefresh={setRefresh} //刷新状态设置
                setSiweLogin={setSiweLogin} //siwe登录状态设置
        />}   

            <div className="d-grid gap-2">
            <Button  //首次设置图片按钮
                style={{ display: (isSetLogo||isPro ) ? 'none' : '' }}  //已设置 或已进入提案 不显示
                disabled={user.connected !== 1 || realimg === '' || daoItem === null} //钱包没登录 && 没有选择图片 && 没有选择道 禁止点击
                onClick={handle} 
             >
                {language.logo[0]}
            </Button>
            </div> 

        {isPro &&  user.connected === 1 && 
            <ProVote  //投票，执行提案
                user={user} //用户信息
                language={language}  //语言信息
                daoItem={daoItem}  //选择的dao 信息
                itemClass='gab' //css 样式
                showTip={props.showTip} 
                showError={props.ShowError}  
                closeTip={props.closeTip}
                refresh={refresh}
                setRefresh={setRefresh} //刷新状态设置
                selectImg={selectImg} //选择的图片
                setSelectImg={setSelectImg} //设置选择图片
                setSiweLogin={setSiweLogin} //siwe登录状态设置
        />}     
         <SiweLogin  //siwe登录
            user={user} //用户信息
            showError={props.showError}
            showTip={props.showTip}
            closeTip={props.closeTip}
            language={language} //语言信息
            siweLogin={siweLogin} //siwe登录状态
            setSiweLogin={setSiweLogin} //siwe登录状态设置
            >
        </SiweLogin>   
        </>
    );
}

export default Logo;