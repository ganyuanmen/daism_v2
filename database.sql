
CREATE DATABASE  `dao_db`  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;

USE `dao_db`;

CREATE TABLE `aux_bt` (
  `d` varchar(50) NOT NULL,
  `t` varchar(2000) DEFAULT NULL,
  `f` varchar(500) DEFAULT NULL,
  `s` varchar(2000) DEFAULT NULL,
  `w` varchar(500) DEFAULT NULL,
  `rt` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`d`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

insert  into `aux_bt`(`d`,`t`,`f`,`s`,`w`,`rt`) values ('dao','v_dao','*','','1=1',''),('daotoken','v_daotoken','*',NULL,'1=1',NULL),('swap','v_swap','*',NULL,'1=1',NULL);

CREATE TABLE `aux_tree` (
  `id` varchar(20) NOT NULL,
  `sqls` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


insert  into `aux_tree`(`id`,`sqls`) values ('business_type_com','select id,type_name `text` from g5_businesstype'),('get_tl','SELECT * FROM g_location WHERE im_id=? AND  DATE_FORMAT(locate_time, \'%Y-%m-%d\')=  DATE_FORMAT(NOW(), \'%Y-%m-%d\') LIMIT 100');

CREATE TABLE `t_app` (
  `block_num` bigint NOT NULL,
  `app_name` varchar(128)  DEFAULT NULL COMMENT 'app名称',
  `app_index` int DEFAULT NULL COMMENT '编号',
  `app_index_rec` int DEFAULT NULL,
  `app_desc` varchar(4000)  DEFAULT NULL COMMENT '描述',
  `app_address` char(42)  DEFAULT NULL COMMENT '地址',
  `app_manager` char(42) DEFAULT NULL COMMENT '管理员',
  `app_time` int DEFAULT NULL COMMENT '时间戳',
  `app_version` varchar(50)  DEFAULT NULL,
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `app_index` (`app_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_appinstall` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dao_id` int DEFAULT NULL,
  `app_index` int DEFAULT NULL COMMENT 'app编号',
  `pro_index` int DEFAULT NULL COMMENT '提案编号',
  `is_install` smallint DEFAULT '0' COMMENT '是否已安装',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dao_id` (`dao_id`,`app_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_changelogo` (
  `dao_id` int NOT NULL COMMENT 'dao id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `dao_logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'svg logo',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_dao` (
  `dao_id` int NOT NULL COMMENT 'dao ID',
  `block_num` bigint DEFAULT NULL COMMENT '区块号',
  `dao_name` varchar(200)  DEFAULT NULL COMMENT '名称',
  `dao_symbol` varchar(200)  DEFAULT NULL COMMENT 'DAO 符号',
  `dao_dsc` varchar(4000) DEFAULT NULL COMMENT '描述',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `dao_manager` char(42) DEFAULT NULL COMMENT '管理员地址',
  `dao_logo` text COMMENT 'svg logo',
  `utoken_cost` decimal(18,4) DEFAULT '0.0000' COMMENT '币值',
  `dao_index` int DEFAULT '0' COMMENT '排名',
  `can_token` smallint DEFAULT '1' COMMENT '能发行token',
  `dao_address` char(42) DEFAULT NULL COMMENT 'dao地址',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dao_id`),
  UNIQUE KEY `block_num` (`block_num`),
  UNIQUE KEY `dao_name` (`dao_name`),
  UNIQUE KEY `dao_symbol` (`dao_symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_daodetail` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dao_id` int DEFAULT '0',
  `dao_vote` int DEFAULT '0' COMMENT '成员票数',
  `dao_address` char(42)  DEFAULT NULL COMMENT '成员',
  `dao_index` int DEFAULT '0' COMMENT '成员序号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`dao_id`,`dao_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_pro` (
  `pro_index` int unsigned NOT NULL AUTO_INCREMENT COMMENT '提案序号',
  `pro_hash` varchar(256)  DEFAULT NULL COMMENT 'hash号',
  `dao_id` int DEFAULT NULL,
  `app_index` int DEFAULT '0' COMMENT 'app序号',
  `pro_type` smallint DEFAULT '0' COMMENT '1安装，0：非安装',
  `pro_manager` char(42) DEFAULT NULL,
  `pro_name` varchar(128) DEFAULT NULL,
  `block_num` int DEFAULT NULL,
  `logo_img` text COMMENT 'logo 图片',
  `function_name` varchar(128) DEFAULT NULL COMMENT '函数名称',
  `function_para` text  COMMENT '函数参数',
  `app_address` char(42) DEFAULT NULL COMMENT '执行的app(安装)',
  `cause_address` char(42) DEFAULT NULL COMMENT '实际执行的app地址',
  `pro_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pro_index`),
  UNIQUE KEY `dao_id` (`dao_id`,`app_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_probak` (
  `pro_index` int NOT NULL COMMENT '提案序号',
  `pro_hash` varchar(256)  DEFAULT NULL COMMENT 'hash号',
  `dao_id` int DEFAULT NULL,
  `app_index` int DEFAULT '0' COMMENT 'app序号',
  `pro_type` smallint DEFAULT '0' COMMENT '1安装，0：非安装',
  `pro_manager` char(42) DEFAULT NULL,
  `pro_name` varchar(128) DEFAULT NULL,
  `block_num` int DEFAULT NULL,
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_proexcu` (
  `block_num` bigint NOT NULL,
  `pro_index` int DEFAULT NULL COMMENT '提案序号',
  `pro_hash` varchar(256)  DEFAULT NULL COMMENT '代理地址',
  `excu_address` char(42)  DEFAULT NULL COMMENT '执行人',
  `excu_time` int DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`block_num`),
  KEY `pro_index` (`pro_index`,`pro_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_provote` (
  `block_num` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pro_index` int DEFAULT NULL COMMENT '提案序号',
  `vote_address` char(42)  DEFAULT NULL COMMENT '投票人地址',
  `vote_power` int DEFAULT '1' COMMENT '票数',
  `vote_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `vote_singer` varchar(256) DEFAULT NULL COMMENT '签名',
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `vote_address` (`pro_index`,`vote_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_provotebak` (
  `block_num` bigint NOT NULL,
  `pro_index` int DEFAULT NULL COMMENT '提案序号',
  `vote_address` char(42) DEFAULT NULL COMMENT '投票人地址',
  `vote_power` int DEFAULT '1' COMMENT '票数',
  `vote_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `vote_singer` varchar(256) DEFAULT NULL COMMENT '签名',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_setlogo` (
  `dao_id` int NOT NULL COMMENT 'dao id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `dao_logo` text  COMMENT 'svg图片',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `dao_id` (`dao_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `t_swap` (
  `block_num` bigint NOT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `swap_address` char(42)  DEFAULT NULL,
  `swap_time` int DEFAULT NULL,
  `swap_eth` decimal(18,4) DEFAULT '0.0000',
  `swap_utoken` decimal(18,4) DEFAULT '0.0000',
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `t_swapdeth` (
  `block_num` bigint NOT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `from_address` char(42)  DEFAULT NULL,
  `swap_time` int DEFAULT NULL,
  `swap_eth` decimal(18,4) DEFAULT '0.0000',
  `swap_utoken` decimal(18,4) DEFAULT '0.0000',
  `to_address` char(42)  DEFAULT NULL,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `t_t2t` (
  `block_num` bigint NOT NULL,
  `from_dao_id` int DEFAULT NULL,
  `to_dao_id` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `from_utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `to_utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `from_address` char(42)  DEFAULT NULL,
  `to_address` char(42)  DEFAULT NULL,
  `from_token` decimal(18,4) DEFAULT '0.0000',
  `to_token` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `t_t2u` (
  `block_num` bigint NOT NULL,
  `from_dao_id` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `from_address` varchar(50) DEFAULT NULL,
  `to_address` varchar(50) DEFAULT NULL,
  `utoken_amount` decimal(18,4) DEFAULT '0.0000',
  `token_amount` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_token` (
  `dao_id` int NOT NULL COMMENT 'dao Id',
  `token_id` int DEFAULT NULL COMMENT 'token Id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dao_id`),
  UNIQUE KEY `block_num` (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_tokenuser` (
  `dao_id` int DEFAULT NULL,
  `token_id` int NOT NULL,
  `dao_manager` char(42)  NOT NULL,
  `token_cost` decimal(18,4) DEFAULT '0.0000',
  PRIMARY KEY (`token_id`,`dao_manager`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `t_u2t` (
  `block_num` bigint NOT NULL,
  `to_dao_id` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `from_address` varchar(50) DEFAULT NULL,
  `to_address` varchar(50) DEFAULT NULL,
  `utoken_amount` decimal(18,4) DEFAULT '0.0000',
  `token_amount` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DELIMITER $$

 CREATE TRIGGER `changeLogotrigger` AFTER INSERT ON `t_changelogo` FOR EACH ROW BEGIN
	update t_dao set dao_logo=new.dao_logo where dao_id=new.dao_id;
    END 
$$
DELIMITER ;


DELIMITER $$


 CREATE  TRIGGER `del_pro` AFTER DELETE ON `t_pro` FOR EACH ROW BEGIN
    delete from t_provote WHERE pro_index=old.pro_index;
	    
    END 
$$

DELIMITER ;


DELIMITER $$


 CREATE TRIGGER `setLogotrigger` AFTER INSERT ON `t_setlogo` FOR EACH ROW BEGIN
	update t_dao set dao_logo=new.dao_logo where dao_id=new.dao_id;
    END $$


DELIMITER ;


DELIMITER $$

 CREATE  TRIGGER `t2t_regisster` AFTER INSERT ON `t_t2t` FOR EACH ROW BEGIN
    
	UPDATE t_dao SET utoken_cost=new.from_utoken_cost WHERE dao_id in(select dao_id from t_token where token_id=new.from_dao_id);
	UPDATE t_dao SET utoken_cost=new.to_utoken_cost WHERE dao_id in(select dao_id from t_token where token_id=new.to_dao_id);
	CALL excuteRank();
    END 
$$


DELIMITER ;



DELIMITER $$



 CREATE  TRIGGER `t2u_regisster` AFTER INSERT ON `t_t2u` FOR EACH ROW BEGIN
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id in (select dao_id from t_token where token_id=new.from_dao_id);
	CALL excuteRank();
    END 
$$


DELIMITER ;


DELIMITER $$



 CREATE  TRIGGER `u2t_regisster` AFTER INSERT ON `t_u2t` FOR EACH ROW BEGIN
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id  in(select dao_id from t_token where token_id =new.to_dao_id);
	CALL excuteRank();
    END 
$$


DELIMITER ;


DELIMITER $$

 CREATE PROCEDURE `excuteRank`()
BEGIN
UPDATE t_dao t1 JOIN (
SELECT dao_id,  utoken_cost, yy FROM
(SELECT dao_id,  utoken_cost,
@curRank := IF(@prevRank = utoken_cost, @curRank, @incRank) AS yy, 
@incRank := @incRank + 1, 
@prevRank := utoken_cost
FROM t_dao p, (
SELECT @curRank :=0, @prevRank := NULL, @incRank := 1
) r 
ORDER BY utoken_cost DESC) s
) t2 
ON t1.dao_id = t2.dao_id
SET t1.dao_index = t2.yy;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `excuteToken`($tokenid int,$address VARCHAR(50),$cost decimal(18,4))
BEGIN
declare _daoid int;
-- set session transaction isolation level serializable;
-- START TRANSACTION;  
IF EXISTS(SELECT * FROM t_tokenuser WHERE token_id=$tokenid and dao_manager=$address) THEN 
		UPDATE t_tokenuser SET token_cost=$cost WHERE token_id=$tokenid AND dao_manager=$address;
	ELSE
		select dao_id into _daoid from t_token where token_id=$tokenid;
		INSERT INTO t_tokenuser(dao_id,token_id,dao_manager,token_cost) VALUES(_daoid,$tokenid,$address,$cost) ;
	END IF;
--	  COMMIT;  
-- set session transaction isolation level repeatable read;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `excu_pro`($blockNum bigint,$proHash varchar(256),$address char(42),$ti bigint)
BEGIN
      DECLARE _proIndex INT;
	    DECLARE _daoId INT;
	    DECLARE _appIndex INT;
	    DECLARE _proType INT;
	    
    if exists(select * from t_pro where pro_hash=$proHash) then 
	  
	    select pro_index,pro_type,dao_id,app_index into _proIndex,_proType,_daoId,_appIndex from t_pro where pro_hash=$proHash;
	    CALL i_proexec($blockNum,_proIndex,$proHash,$address,$ti);
	   -- insert into t_proexcu(block_num,pro_index,pro_hash,excu_address,excu_time) values($blockNum,_proIndex,$proHash,$address,$ti);
	    if _proType=1 then 
		call i_appinstall(_daoId,_appIndex,_proIndex);
		-- insert into t_appinstall(dao_id,app_index,pro_index,is_install) values(_daoId,_appIndex,_proIndex,1);
	    end if ;
	    INSERT INTO t_probak(pro_index,pro_hash,dao_id,app_index,pro_type,pro_manager,pro_name,block_num) 
	    select pro_index,pro_hash,dao_id,app_index,pro_type,pro_manager,pro_name,block_num from t_pro where pro_index=_proIndex;
	    delete from t_pro where pro_index=_proIndex;
	    INSERT INTO t_provotebak(block_num,pro_index,vote_address,vote_power,vote_time,vote_singer)
	    select block_num,pro_index,vote_address,vote_power,vote_time,vote_singer from t_provote where pro_index=_proIndex;
	    delete from t_provote WHERE pro_index=_proIndex;
	    
	
     else
	call i_proexec($blockNum,0,$proHash,$address,$ti);
	-- INSERT INTO t_proexcu(block_num,pro_index,pro_hash,excu_address,excu_time) VALUES($blockNum,0,$proHash,$address,$ti);
	    
    end if;
    END 
$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `get_page`($daima VARCHAR(6000),$ps INT,$i INT,$s VARCHAR(6000),$a VARCHAR(4),$w NVARCHAR(6000))
BEGIN
declare $t varchar(20);
	SELECT t INTO $t FROM aux_bt WHERE d=$daima;
	
	IF $w='' THEN 
	SELECT w INTO $w FROM aux_bt WHERE d=$daima;
	END IF;
	
	SET $w=IF($w='','',CONCAT(' where ',$w));
	
	SET @cqw=CONCAT('SELECT * FROM ',$t,$w,' order by ',$s,' ',$a,' LIMIT ',$ps,' OFFSET ',($i-1)*$ps);
	PREPARE stmt1 FROM @cqw;
	EXECUTE stmt1 ;
		
	 SET @cqw=CONCAT('SELECT count(*) as mcount FROM ',$t,$w);
	 PREPARE stmt1 FROM @cqw;
         EXECUTE stmt1 ;
	END 
$$
DELIMITER ;


DELIMITER $$

 CREATE PROCEDURE `get_pro`($daoId int,$appIndex int,$address char(42))
BEGIN
  SELECT a.app_address,a.cause_address, a.function_name,a.function_para, a.logo_img, a.pro_index,a.pro_hash,a.dao_id,a.app_index,a.pro_type,a.pro_name,IFNULL(b.`pro_index`,0) is_myVote,IFNULL(c.yvote,0) votes,IFNULL(d.total_vote,0)
   total_vote,ifnull(e.dao_index,0) dao_index FROM t_pro a
 LEFT JOIN (select * from t_provote where vote_address=$address) b ON a.`pro_index`=b.`pro_index`
 LEFT JOIN(SELECT pro_index,COUNT(*) yvote FROM t_provote GROUP BY pro_index) c ON a.pro_index=c.pro_index	
 left JOIN (SELECT dao_id,COUNT(*) total_vote FROM t_daodetail GROUP BY dao_id) d ON a.dao_id=d.dao_id
left join (select dao_index,dao_id from t_daodetail where dao_id=$daoId and dao_address=$address) e on a.dao_id=e.dao_id
  WHERE a.dao_id=$daoId AND a.app_index=$appIndex AND a.pro_manager IN(SELECT dao_address FROM t_daodetail WHERE dao_id=a.dao_id);
    END 
$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE `get_proList`($address char(42))
BEGIN
	SELECT a.app_address,a.cause_address,a.function_name,a.function_para,a.pro_index,a.dao_id,a.pro_name,a.app_index,DATE_FORMAT(pro_time,'%Y-%m-%d') pro_time,IFNULL(b.s,0) total_vote,IFNULL(c.s,0) votes  
	,IFNULL(d.dao_index,-1) dao_index ,a.pro_hash,ifnull(e.yvote,0) yvote 
	FROM t_pro a LEFT JOIN 
	(SELECT dao_id,COUNT(*) s FROM t_daodetail GROUP BY dao_id) b ON a.dao_id=b.dao_id 
	LEFT JOIN 
        (SELECT pro_index,COUNT(*) s FROM t_provote GROUP BY pro_index) c ON a.pro_index=c.pro_index 
        left join 
        (select dao_id,dao_index from t_daodetail where dao_address=$address) d on a.dao_id=d.dao_id
        left join 
        (SELECT pro_index,1 yvote FROM t_provote WHERE vote_address=$address) e on a.pro_index=e.pro_index
         WHERE a.dao_id IN (SELECT dao_id FROM t_daodetail WHERE dao_address=$address);
         
    END 
$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE `i_app`(blocknum bigint,appname varchar(200),appindex int,appindexrec int,appdesc varchar(4000)
    ,appversion varchar(50),appaddress char(42),appmanager char(42),apptime int)
BEGIN
    IF NOT EXISTS(SELECT * FROM t_app WHERE block_num=blocknum) THEN
	INSERT INTO t_app(block_num,app_name,app_index,app_index_rec,app_desc,app_version,app_address,app_manager,app_time) 
	VALUES(blocknum,appname,appindex,appindexrec,appdesc,appversion,appaddress,appmanager,apptime);
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `i_appinstall`($daoid int, $appindex int,proIndex int)
BEGIN
	if not exists(select * from t_appinstall where dao_id=$daoid and app_index=$appindex) then
		INSERT INTO t_appinstall(dao_id,app_index,pro_index,is_install) VALUES($daoid,$appindex,proIndex,1);
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `i_changelogo`(daoid int,blocknum bigint,daotime int,daologo text)
BEGIN
	if not exists(select * from t_changelogo where block_num=blocknum) then
	INSERT INTO t_changelogo (dao_id,block_num,dao_time,dao_logo) VALUES(daoid,blocknum,daotime,daologo);
	
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `i_dao`(daoid int,blocknum bigint,daoname varchar(200),daosymbol varchar(200),daodsc varchar(4000)
    ,daomanager char(42),daotime int,cantoken smallint,daoaddress char(42))
BEGIN
	if not exists(select * from t_dao where block_num=blocknum) then
		INSERT INTO t_dao(dao_id,block_num,dao_name,dao_symbol,dao_dsc,dao_manager,dao_time,can_token,dao_address) 
		valueS(daoid,blocknum,daoname,daosymbol,daodsc,daomanager,daotime,cantoken,daoaddress);
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `i_daodetail`(daoid int,daoaddress char(42),daovote int,daoindex int)
BEGIN
	if not exists(select * from t_daodetail where dao_id=daoid and dao_address=daoaddress) then
		INSERT INTO t_daodetail(dao_id,dao_address,dao_vote,dao_index) VALUES(daoid,daoaddress,daovote,daoindex);
	end if;
	
    END 
$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `i_proexec`(blocknum bigint,proindex int,prohash varchar(256),excuaddress char(42),excutime int)
BEGIN
        if not exists(select * from t_proexcu where block_num=blocknum) then
	   INSERT INTO t_proexcu(block_num,pro_index,pro_hash,excu_address,excu_time) 
	   VALUES(blocknum,proindex,prohash,excuaddress,excutime);
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE `i_setlogo`(daoid int,blocknum bigint,daotime int,daologo text)
BEGIN
	IF NOT EXISTS(SELECT * FROM t_setlogo WHERE block_num=blocknum) THEN
	INSERT INTO t_setlogo(dao_id,block_num,dao_time,dao_logo) VALUES(daoid,blocknum,daotime,daologo);
	end if;
    END 
$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE `i_swap`(blocknum bigint,swapaddress char(42),swaptime int,swapeth decimal(18,4),swaputoken decimal(18,4))
BEGIN
    IF NOT EXISTS(SELECT * FROM t_swap WHERE block_num=blocknum) THEN
	INSERT INTO t_swap(block_num,swap_address,swap_time,swap_eth,swap_utoken) 
	VALUES(blocknum,swapaddress,swaptime,swapeth,swaputoken);
	end if;
	
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `i_swapdeth`(blocknum bigint,fromaddress char(42),swaptime int,swapeth decimal(18,9)
    ,swaputoken decimal(18,4),toaddress char(42))
BEGIN
		 IF NOT EXISTS(SELECT * FROM t_swapdeth WHERE block_num=blocknum) THEN
	INSERT INTO t_swapdeth(block_num,from_address,swap_time,swap_eth,swap_utoken,to_address) 
	VALUES(blocknum,fromaddress,swaptime,swapeth,swaputoken,toaddress);
	end if;
    END 
$$
DELIMITER ;


DELIMITER $$

 CREATE PROCEDURE `i_t2t`(blocknum bigint,fromdaoid int,todaoid int,fromutokencost decimal(18,4),toutokencost DECIMAL(18,4),
    fromaddress char(42),toaddress char(42),fromtoken DECIMAL(18,4),totoken DECIMAL(18,4),swaptime int)
BEGIN
     IF NOT EXISTS(SELECT * FROM t_t2t WHERE block_num=blocknum) THEN
	INSERT INTO t_t2t(block_num,from_dao_id,to_dao_id,from_utoken_cost,to_utoken_cost,from_address,to_address,from_token,to_token,swap_time)
	 VALUES(blocknum,fromdaoid,todaoid,fromutokencost,toutokencost,fromaddress,toaddress,fromtoken,totoken,swaptime);
	 end if;
    END 
$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE `i_t2u`(blocknum bigint,fromdaoid int,utokencost decimal(18,4),fromaddress char(42)
    ,toaddress char(42),utokenamount DECIMAL(18,4),tokenamount DECIMAL(18,4),swaptime int)
BEGIN
    IF NOT EXISTS(SELECT * FROM t_t2u WHERE block_num=blocknum) THEN
	INSERT INTO t_t2u(block_num,from_dao_id,utoken_cost,from_address,to_address,utoken_amount,token_amount,swap_time)  
	VALUES(blocknum,fromdaoid,utokencost,fromaddress,toaddress,utokenamount,tokenamount,swaptime);
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `i_token`(daoid int,tokenid int,blocknum bigint,daotime int)
BEGIN
	if not exists(select * from t_token where block_num=blocknum) then
	INSERT INTO t_token(dao_id,token_id,block_num,dao_time) VALUES(daoid,tokenid,blocknum,daotime);
	end if;
    END 
$$
DELIMITER ;

DELIMITER $$

 CREATE PROCEDURE `i_u2t`(blocknum bigint,todaoid int,utokencost decimal(18,4),fromaddress char(42)
    ,toaddress char(42),utokenamount DECIMAL(18,4),tokenamount DECIMAL(18,4),swaptime int)
BEGIN
    IF NOT EXISTS(SELECT * FROM t_u2t WHERE block_num=blocknum) THEN
	INSERT INTO t_u2t(block_num,to_dao_id,utoken_cost,from_address,to_address,utoken_amount,token_amount,swap_time) 
	VALUES(blocknum,todaoid,utokencost,fromaddress,toaddress,utokenamount,tokenamount,swaptime);
	end if;
    END 
$$
DELIMITER ;


 CREATE  VIEW `v_app` AS select `t_app`.`block_num` AS `block_num`,`t_app`.`app_name` AS `app_name`,`t_app`.`app_index` AS `app_index`,`t_app`.`app_index_rec` AS `app_index_rec`,`t_app`.`app_desc` AS `app_desc`,`t_app`.`app_address` AS `app_address`,`t_app`.`app_manager` AS `app_manager`,date_format(from_unixtime(`t_app`.`app_time`),'%Y-%m-%d') AS `app_time`,`t_app`.`app_version` AS `app_version` from `t_app` ;

 CREATE  VIEW `v_dao` AS select `a`.`dao_id` AS `dao_id`,`a`.`block_num` AS `block_num`,`a`.`dao_name` AS `dao_name`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_dsc` AS `dao_dsc`,date_format(from_unixtime(`a`.`dao_time`),'%Y-%m-%d') AS `dao_time`,`a`.`dao_manager` AS `dao_manager`,`a`.`dao_logo` AS `dao_logo`,`a`.`utoken_cost` AS `utoken_cost`,`a`.`dao_index` AS `dao_index`,`a`.`can_token` AS `can_token`,`a`.`dao_address` AS `dao_address`,`a`.`_time` AS `_time`,ifnull(`b`.`token_id`,0) AS `token_id` from (`t_dao` `a` left join `t_token` `b` on((`a`.`dao_id` = `b`.`dao_id`))) ;

 CREATE  VIEW `v_daotoken` AS select -(2) AS `token_id`,-(2) AS `dao_id`,'eth' AS `dao_symbol`,NULL AS `dao_logo` union all select -(1) AS `token_id`,-(1) AS `dao_id`,'utoken' AS `dao_symbol`,NULL AS `dao_logo` union all select `a`.`token_id` AS `token_id`,`a`.`dao_id` AS `dao_id`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_logo` AS `dao_logo` from `v_dao` `a` where (`a`.`token_id` > 0) ;

 CREATE  VIEW `v_swap` AS select 'eth->utoken' AS `title`,`t_swap`.`swap_eth` AS `in_amount`,`t_swap`.`swap_utoken` AS `out_amount`,`t_swap`.`block_num` AS `block_num`,`t_swap`.`swap_address` AS `my_address`,date_format(from_unixtime(`t_swap`.`swap_time`),'%Y-%m-%d') AS `my_time` from `t_swap` union all select 'utoken->token' AS `utoken->token`,`t_u2t`.`utoken_amount` AS `utoken_amount`,`t_u2t`.`token_amount` AS `token_amount`,`t_u2t`.`block_num` AS `block_num`,`t_u2t`.`to_address` AS `to_address`,date_format(from_unixtime(`t_u2t`.`swap_time`),'%Y-%m-%d') AS `my_time` from `t_u2t` union all select 'token->utoken' AS `token->utoken`,`t_t2u`.`token_amount` AS `token_amount`,`t_t2u`.`utoken_amount` AS `utoken_amount`,`t_t2u`.`block_num` AS `block_num`,`t_t2u`.`from_address` AS `from_address`,date_format(from_unixtime(`t_t2u`.`swap_time`),'%Y-%m-%d') AS `my_time` from `t_t2u` union all select 'token->token' AS `token->token`,`t_t2t`.`from_token` AS `from_token`,`t_t2t`.`to_token` AS `to_token`,`t_t2t`.`block_num` AS `block_num`,`t_t2t`.`to_address` AS `to_address`,date_format(from_unixtime(`t_t2t`.`swap_time`),'%Y-%m-%d') AS `my_time` from `t_t2t` union all select 'DETH->utoken' AS `DETH->utoken`,`t_swapdeth`.`swap_eth` AS `swap_eth`,`t_swapdeth`.`swap_utoken` AS `swap_utoken`,`t_swapdeth`.`block_num` AS `block_num`,`t_swapdeth`.`to_address` AS `to_address`,date_format(from_unixtime(`t_swapdeth`.`swap_time`),'%Y-%m-%d') AS `my_time` from `t_swapdeth` ;

 CREATE  VIEW `v_tokenuser` AS select `a`.`dao_id` AS `dao_id`,`a`.`token_id` AS `token_id`,`a`.`dao_manager` AS `dao_manager`,`a`.`token_cost` AS `token_cost`,`b`.`dao_symbol` AS `dao_symbol` from (`t_tokenuser` `a` join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`))) ;

