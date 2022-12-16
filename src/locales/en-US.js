export const propertis_en={
  version:'en',
  
  menu:[{name:' DAO list ',link:'#/daolist'},
  {name:' Iadd transaction ',link:'#/iadd'},
  {name:' Create Dao ',link:'#/createdao'},
  {name:' proposal management ',link:'#/prosoal'},
  {name:' my ',link:'#/my'},
  {name:' document ',link:'./dist/index.html',target:'_blank'}
  ],
  header:['connect wallet', 'exit wallet', 'install metamask', 'connecting...', ' Authorizing, please wait... ',' Search token ',' login information ','Please wait while the authorization is cancelled','Please connect the wallet'],
  w_tipMessage:'Tips',
  daoList:['Search project name/administrator address', 'by time', 'by name', 'DAF address',' creation time ',' currency price ',' market value ranking ',' total ',' current page '
  ,' total pages', 'by ranking', 'click to search', 'select'],
  siwe:['Sign in with Ethereum to the app.','Sign in, please confirm','This operation needs to log in DAISM','log in DAISM'],
  swap:['input', 'output', 'select pass',' swap rate ',' swap ',' no wallet connected ',' balance ',' unauthorized! ',' Authorization '
  ,' submitting Authorization... ',' You are selling ',' you will receive ',' or the transaction fails', 'the swap amount cannot be 0', 'the balance is insufficient!'
  , ' Submitting request using wallet... ','Global authorization','revoke'],
  noConnect:'No wallet connected, unable to operate',
  createDao:[' register Dao ',' set logo ', 'issue token'],
  mymenu:['deth ',' swap record ',' my token ',' my Dao ','my app'],
  my:['unwrought deth', 'forged', 'deth balance', 'swap', 'input:', 'output:', 'forging...', ' Generating utoken... '
  ,' Name ',' balance ',' symbol '],
  register:['admin address',' Dao name ',' Dao symbol ',' Dao description ',' registration '
  ,' logo supported file types: zip, SVG, JPG,JPEG, PNG, GIF, webp pictures! (Note: you can zip SVG, JPG, JPEG, PNG, GIF and webp and upload them,only western languages are allowed for svg files) '
  ,' the image file cannot be larger than 10k! ',' Registering Dao, please wait... ',' The name of the Dao or the symbol of the Dao has already been registered. '
  ,' Refresh ',' issue token ',' token ','app address','The number of members cannot exceed 20','Members cannot be duplicate!','The request for registration information has been successfully submitted through wallet'],
//  daoselect:['选择DAO'],
//  dian:['提案','提案方式'],
promenu:['proposal', 'vote/execute'],  
pro:["Submit", "Installation extension proposal", "modify logo proposal", "submitting proposal...", ' Proposal name ',' proposal date '
,' total votes', 'voted', 'voted', 'implemented', 'proposal type','Logo extension app installation','voting...', ' Implementing proposal... '
,'address','app describe','Uploading app......','Register App Information','name','app Id','app verson'
,'install','installed','Installation in progress...','store','appset name','describe','Modify logo==>'
,"revoke","Are you sure you want to cancel?","You cannot restore after cancellation. Please confirm!","confirm","details","app id"],//33
  
logo: ['set logo', 'current logo', 'selected logo', ' already set logo, need to change logo through proposal!', 'submitting logo, please wait...'
, 'select Dao', 'not selected LOGO!',' already set logo, You need to install the modified extension first, and then use the extension to modify it!','Signatures submitting votes......','The proposal is being implemented......'],
org: ['register org', 'address ratio', 'voting ratio', 'unit: 1/10000', 'update ratio', 'initial member', 'voting right'
, 'add member', 'delete member', "Dao has created OS, can't create any more!", 'register org, please wait...', 'org name'
, 'org name has been registered.'],
oss: ['create OS',' internal voter ',' external voter ',' internal voting weight ',' external voting weight ',' initial member '
,' voting right ',' add member ',' delete member ',' OS has been created! ',' OS is being created, please be patient... '],
token: ['issued token, cannot be re issued!', 'issuing token, please be patient...', 'issuing token', 'no OS created, cannot publish token!'
, 'setting not allowed to publish token during registration', 'unit:'],
login: ['login account', 'network number', 'eth balance', 'utoken balance'],
daoselect: ['select my Dao', 'refresh', 'Dao logo'],
logoselect: ['select logo', 'select logo image file', 'selected logo'],
orgselect: ['select my org', 'refresh data'],
  errors:{
    mess: 'data detection failed, please correct before submitting!',
    login1: '1. Computer: the browser does not have the metamask plug-in installed. It is recommended to use metamask Link: ',
    login2: '2. Mobile phone: access directly using metamask app.',
    pro: ['the name of the proposal cannot be empty and cannot be greater than 128 characters!', 'the Dao has not created an OS and cannot make a proposal!'
    , 'the Dao has no logo, just set the logo directly, and there is no need for the proposal to modify the logo.'
    , 'the name already exists, please change another name.', 'if there is no app with the logo, please install it through the proposal.'
    , 'it has been voted and cannot be voted again.','OS not created, APP cannot be installed!',"Dao has already installed the app, so you don't need to install it again."],
    org: ['org name cannot be empty and cannot be greater than 128 characters!'
    , 'value range: an integer of 1-10000', 'Member Address: starting with 0x, 40 characters (composed of numbers and A-F)'],
    dao: ['The name cannot be empty, cannot be greater than 128 characters!', 'Dao symbol cannot be empty, cannot be greater than 128 characters!'
    , 'The address: starts with 0x, 40 characters(composed of numbers and A-F)',' no org selected! ']
  },
  tips:['rule address ratio:'
  , 'rule address: the rule contract is responsible for reading and writing various data (including checking data boundary and data validity). \r\n rule address proportion: when the number of votes reaches this proportion, the rule contract can be modified. '
  ,' Voting right proportion of members: '
  ,' when the number of votes reaches this proportion, the voting right of members can be changed. (after the rule contract is replaced by a third-party contract, this parameter may be discarded by the third party) '
  , 'update proportion:'
  , 'when the percentage of votes reaches this proportion, the whole org version can be updated.'
  , 'create OS:'
  , "create OS is to deploy Dao contract. Each Dao has a series of contracts within it. The deployment contract costs a lot of gas. Therefore, in the previous steps, set Dao parameters and logo icons. The deployment of OS here belongs to the creation of Dao, but it must be separated. If you merge, it's easy to fail because gas is too high. "
,'There is an error in submitting the request. Please check and handle it in your wallet \r\n'
,'app install'
,'close'
,'app Address registration'
,'app update'
,'Store'
,"Blockchain is slow. Don't worry"
,'Sometimes blockchains are slow and wait for a long time, which is normal'
,"It's in the chain. Please wait patiently"
,'The logo has been set, but the OS has not been created. It cannot be modified!'
,'Copied'
]

}
