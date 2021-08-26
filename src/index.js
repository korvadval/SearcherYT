import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import usersData from "./data.json";
import reactDom from 'react-dom';
import searcherYT from './youTubeSearcher.js';
import YouTube from 'react-youtube';
import Dialog from './Dialog';

import { FontAwesomeIcon }      from '@fortawesome/react-fontawesome'
import { faTh, faList, faHeart, faGlassWhiskey } from '@fortawesome/free-solid-svg-icons'
import { findRenderedDOMComponentWithClass } from 'react-dom/cjs/react-dom-test-utils.production.min';
import { forEach } from 'async';

let API_KEY = "AIzaSyDNbqAYrxkk9nv7YzdHXsimoxO-w2WFnZQ";

class ItemContent extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    render()
    {
        return(
            <div className={this.props.typeView=="grid"?"itemContentGrid":"itemContentList"}>
                <img className="preview"
                     src={this.props.preview}/>
                <div className={this.props.typeView=="grid"?"textVideoGrid":"textVideoList"}>
                    <div className={this.props.typeView=="grid"?"itemTitleGrid":"itemTitleList"}>
                        {this.props.title}
                    </div>
                    <div className={this.props.typeView=="grid"?"itemInfoGrid":"itemInfoList"}>
                        {this.props.info}
                    </div>
                </div>
            </div>
        );
    }
}

class RangeSlider extends React.Component{
    constructor(props){
        super(props);
        this.state={
            valueSlider: 25, 
            label: '',
            max: 50,
            min:0
        }
    }
    componentDidMount=()=>{
        if(this.props.value){
            this.setState({valueSlider:this.props.value})
        }
    }
    handleChange=(event)=>{
        this.setState({valueSlider:event.target.value})
        this.props.onHandleChange(event.target.value)
    }

    handleSubmit=(event)=>{
        event.preventDefault()
        if(event.target.children[1].value>this.props.max){
            this.setState({valueSlider: this.props.max})
        }
    }

    render(){
        return (
                <form onSubmit={this.handleSubmit} className="rangeSliderField" >
                    <input className="rangeSlider" 
                        type="range" 
                        min={this.state.min} max={this.state.max} value={this.state.valueSlider} 
                        onChange={this.handleChange}
                        id="myRange"
                    />
                    <input pattern="[0-9]*"
                           className="sliderValue"
                           type="text"
                           value={this.state.valueSlider}
                           onChange={this.handleChange}
                           id="sliderValue"
                    />
                </form>
        );
    }
}

class SelectField extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value: "0"
        }
    }
    componentDidMount=()=>{
        if(this.props.value){
            this.setState({value:this.props.value})
        }
    }
    handleChange=(event)=>{
        this.setState({value: event.target.value})
        this.props.onHandleChange(event.target.value)
    }
    render(){
        return(
            <select className="selectField" value={this.state.value} onChange={this.handleChange}>
                <option value="0">По релевантности</option>
                <option value="1">По дате загрузки</option>
                <option value="2">По числу просмотров</option>
                <option value="3">По рейтингу</option>
            </select>
        );
    }
}

class FavoritesDialogView extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userAsk:"",
            name:"",
            count:"25",
            sort:"0"
        }
    }
    componentDidMount=()=>{
        this.setState({userAsk:this.props.ask})
        if(this.props.name){
            this.setState({name:this.props.name})
        }
    }
    handleChangeAsk=(event)=>{
        this.setState({userAsk:event.target.value})
    }
    handleChangeName=(event)=>{
        this.setState({name:event.target.value})
    }
    handleChangeSort=(e)=>{
        this.setState({sort:e})
    }
    handleChangeCount=(e)=>{
        this.setState({count:e})
    }
    handleSubmit=(event)=>{
        event.preventDefault()
    }

    handleOnClick=()=>{
        if(this.props.mode=="save"){
            this.props.putDataInLC(this.state.userAsk,this.state.name,this.state.sort,this.state.count) 
        }
        if(this.props.mode=="edit"){
            this.props.editDataInLC(this.state.userAsk,this.state.name,this.state.sort,this.state.count) 
        }
        this.props.handleHide()        
    }

    render(){
        return(
            <div className="mainDialogWindow">
                <h2 className="headerDialogWindow">{this.props.header}</h2>
                <form onSubmit={this.handleSubmit} className="fieldDialogWindow">
                    <label className="labelDialogWindow">Запрос</label>
                    <input className="inputDialogWindow"
                           type="text" 
                           id="ask"
                           value={this.state.userAsk}
                           onChange={this.props.mode=="edit"?this.handleChangeAsk:null}
                    />
                </form>
                <form onSubmit={this.handleSubmit} className="fieldDialogWindow">
                    <label className="labelDialogWindow">Название</label>
                    <input className="inputDialogWindow"
                           type="text" 
                           id="name"
                           value={this.state.name}
                           onChange={this.handleChangeName} 
                    />
                </form>
                <div className="fieldDialogWindow">
                    <label className="labelDialogWindow">Сортировать по</label>
                    <SelectField value={this.props.sort?this.props.sort:0} onHandleChange={this.handleChangeSort}/>
                </div>
                <div className="fieldDialogWindow">
                    <label className="labelDialogWindow">Количество</label>
                    <RangeSlider value={this.props.count?this.props.count:25} onHandleChange={this.handleChangeCount}/>
                </div>
                <div className="buttonsFieldDialogWindow">
                    <button className="buttonDialogWindow"
                            onClick={this.props.handleHide}
                    >Не сохранять</button>
                    <button className="buttonDialogWindow"
                            onClick={this.handleOnClick}      
                    >Сохранить</button>
                </div>
            </div>
        );
    }
}

class ItemFavorites extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isHover:false
        }
    }

    buttonFind=()=>{
        this.props.findFavoritesById(this.props.id)
    }
    buttonEdit=()=>{
        this.props.setEditingId(this.props.id)
        this.props.showDialog()
    }
    buttonDelete=()=>{
        this.props.delete(this.props.id)
    }

    render(){
        return(
            <button className={this.state.isHover?"itemFavoritesHover":"itemFavorites"}
                 onMouseEnter={()=>this.setState({isHover:true})}
                 onMouseLeave={()=>this.setState({isHover:false})}
            >   
                <div className="itemFavoritesName">{this.props.name}</div>
                <div className={this.state.isHover?"itemFavoritesPanelToDoHover":"itemFavoritesPanelToDo"}> 
                    <div onClick={this.buttonFind} className="itemFavoritesFind">Найти</div> 
                    <div onClick={this.buttonEdit} className="itemFavoritesEdit">Изменить</div>
                    <div onClick={this.buttonDelete} className="itemFavoritesDelete">Удалить</div>                 
                </div>
            </button>
        );
    }
}

class Content extends React.Component {
    constructor(props){
        super(props);
        this.state={
            clickedButton: 0,
            videos: [],
            userAsk: "",
            typeView: "grid",
            isOpenedSave: false,
            isOpenedEdit: false,
            editingFavoriteId: null,
            deleteFavoriteId:null,
            editingFavoriteAsk: null,
            editingFavoriteSort: null,
            editingFavoriteName: null,
            editingFavoriteCount: null,
        }
    }
    clickButton=(index)=>{
        this.setState({clickedButton:index,isFavoriteReFind: false})
    }

    fillVideos=(videos)=>{
        this.setState({videos:videos,isFavoriteReFind: false})
    }

    getAsk=(term)=>{
        this.setState({userAsk:term,isFavoriteReFind: false})
    }

    handleShowSave=()=> { this.setState({ isOpenedSave: true  }) }
    handleHideSave=()=> { this.setState({ isOpenedSave: false }) }
    handleShowEdit=()=>{ this.setState({ isOpenedEdit: true })}
    handleHideEdit=()=> { this.setState({ isOpenedEdit: false }) }
    
    setEditingFavoriteId=(id)=>{
        let name,ask,sort,count
        let usersBuf = JSON.parse(localStorage.getItem("users"))
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token")){
                name=el.favorites[id].name
                ask=el.favorites[id].ask
                sort=el.favorites[id].sort
                count=el.favorites[id].count
            }
        })
        this.setState({ editingFavoriteId:id,
                        editingFavoriteAsk:ask,
                        editingFavoriteName:name,
                        editingFavoriteSort:sort,
                        editingFavoriteCount:count
        })
    }
    putDataInLC=(ask,name,sort,count)=>{ 

        let usersBuf = JSON.parse(localStorage.getItem("users"))
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token")){
                let favorite={
                    name:name,
                    ask:ask,
                    sort:sort,
                    count:count
                }
                el.favorites.push(favorite)
            }
            localStorage.setItem("users",JSON.stringify(usersBuf))
        });
    }
    editDataInLC=(ask,name,sort,count)=>{ 
        let usersBuf = JSON.parse(localStorage.getItem("users"))
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token")){
                let favorite={
                    name:name,
                    ask:ask,
                    sort:sort,
                    count:count
                }
                el.favorites[this.state.editingFavoriteId]=favorite
            }
            localStorage.setItem("users",JSON.stringify(usersBuf))
        });
    }
    deleteDataInLC=(id)=>{ 
        
        let usersBuf = JSON.parse(localStorage.getItem("users"))
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token")){
                el.favorites.splice(id, 1);
                this.setState({deleteFavoriteId:null})
            }
            localStorage.setItem("users",JSON.stringify(usersBuf))
        });
    }
    findFavoritesById=(id)=>{
        let usersBuf = JSON.parse(localStorage.getItem("users"))
        let res, ask
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token")){
                this.setState({clickedButton: 0,
                               userAsk:el.favorites[id].ask})
                res=el.favorites[id].count
                ask=el.favorites[id].ask
            }
        });
        searcherYT ({key: API_KEY, term: ask, res: res}, (videos) => { 
            this.setState({videos:videos})
        })
    }
    getFavorites=()=>{
        let listOfFavorites=[]
        let usersBuf = JSON.parse(localStorage.getItem("users"))
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token")){
                    let i=0
                    el.favorites.forEach(element => {
                        let item=<ItemFavorites id={i}
                                                name={element.name}
                                                setEditingId={this.setEditingFavoriteId}
                                                showDialog={this.handleShowEdit}
                                                delete={this.deleteDataInLC}
                                                findFavoritesById={this.findFavoritesById}

                                />
                    listOfFavorites.push(item)
                    i=i+1;
                });
                
            }
        });
        return listOfFavorites
    }

    renderItems(){
        let items=[]
        console.log(this.state.videos)
        this.state.videos.forEach(el => {
            items.push(<ItemContent 
                            id={el.id.videoId}
                            preview={el.snippet.thumbnails.medium.url}
                            title={el.snippet.title}
                            typeView={this.state.typeView}
                            info={el.snippet.channelTitle}
                    />)
        });
        
        // for(let i=0;i<12;i++){
        //     items.push(<ItemContent
        //                     id={i}
        //                     preview={"https://i.ytimg.com/vi/u4XsdS5cRpA/hqdefault.jpg?sqp=-oaymwEjCOADEI4CSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCyTvsDcVN87g4v3vF7M9br5xFTzA"}
        //                     title={"УШЕЛ ОДИН жить в ДОМ ПОД ЗЕМЛЕЙ | МЕДВЕДИЦА ПРИШЛА С МЕДВЕЖОНКОМ | КРЫША НЕ ВЫДЕРЖАЛА"}
        //                     typeView={this.state.typeView}
        //                     info={"ЛЕСНЫЕ \n1 830 630 просмотров"}
        //               />)
        // }

        return items
    }
    renderContent=()=>{
        if(this.state.clickedButton==0){
            if(this.state.videos.length==0){
                return(
                    <div className="searcherPanel">
                        <h2>Поиск видео</h2>
                        <Searcher fillVideos={this.fillVideos} 
                                  getAsk={this.getAsk}
                        />
                    </div>
                );
            }else{
                return(
                    <div className="searcherPanelFill">
                            <h2>Поиск видео</h2>
                            <Searcher fillVideos={this.fillVideos} 
                                      getAsk={this.getAsk}
                            />
                            <FontAwesomeIcon onClick={this.handleShowSave} 
                                className="favoritesButton"
                                icon={faHeart} />
                            <div className="filterPanel">
                                <div className="askFor">
                                    Показаны видео по запросу "{this.state.userAsk}"
                                </div>
                                <div className="changerViewType">
                                    <div >
                                        <FontAwesomeIcon onClick={()=>this.setState({typeView:"grid"})}
                                                         className={this.state.typeView=="grid"?"buttonViewClicked":"buttonView"}
                                                         icon={faTh} />
                                    </div>
                                    <div >
                                        <FontAwesomeIcon onClick={()=>this.setState({typeView:"list"})} 
                                                         className={this.state.typeView=="list"?"buttonViewClicked":"buttonView"}
                                                         icon={faList} />
                                    </div>
                                </div>
                            </div>
                            <div className={this.state.typeView=="grid"?"videoPanelGrid":"videoPanelList"}>
                                {this.renderItems()}
                            </div>
                            {this.state.isOpenedSave ? 
                            <Dialog 
                                content={<FavoritesDialogView header="Сохранить запрос" 
                                                              ask={this.state.userAsk} 
                                                              handleHide={this.handleHideSave}
                                                              putDataInLC={this.putDataInLC}
                                                              mode="save"
                                        />}
                            />
                            :  null }
                    </div>
                );
            }
        }
        if(this.state.clickedButton==1){
            return(
                <div className="listOfFavorites">
                    <h2>Избранное</h2>
                    {this.getFavorites()}
                
                    {this.state.isOpenedEdit ? 
                        <Dialog 
                            content={<FavoritesDialogView header="Редактировать запрос" 
                                                          ask={this.state.editingFavoriteAsk}
                                                          name={this.state.editingFavoriteName}
                                                          count={this.state.editingFavoriteCount}
                                                          sort={this.state.editingFavoriteSort} 
                                                          handleHide={this.handleHideEdit}
                                                          editDataInLC={this.editDataInLC}
                                                          mode="edit"
                                    />}
                                                          
                        />
                    :  null }
                </div>
            )
        }
    }
    render() {
        return (
            <div className="contentMain">
                <div className="header">
                    <img className="logoHeader" src="./images/logo.png"/>
                    <div className="buttonsPanel">
                    <div className="leftButtons">
                            <div className={this.state.clickedButton==0?"buttonClicked":"button"} onClick={(()=>this.clickButton(0))}>Поиск</div>
                            <div className={this.state.clickedButton==1?"buttonClicked":"button"}onClick={(()=>this.clickButton(1))}>Избранное</div>
                        </div>
                        <div className="rightButtons">
                            <div className={this.state.clickedButton==2?"buttonClicked":"button"} onClick={()=>{
                                                                                                                    localStorage.removeItem("token") 
                                                                                                                    this.props.isUnloggined()}}>Выйти</div>
                        </div>
                    </div>
                </div>
                <div className="contentTable">
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}

class Searcher extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    videoSearch = (term) => {
        this.props.getAsk(term)
        searcherYT ({key: API_KEY, term: term, res: 12}, (videos) => { 
            this.props.fillVideos(videos)
        })
    } 
    
    render() {
        return (
            <SearchInput videoSearch={this.videoSearch}/>
        )
    }
}

class SearchInput extends React.Component {
    constructor(props){
        super(props);
        this.state={
        }
    }
    userInputString = event => {
        event.preventDefault()
        this.props.videoSearch(event.target.children[0].value)
        //event.target.children[0].value=""
    }

    render() {
        return (
            <div className="searchForm">
                <form onSubmit={this.userInputString}>
                    <input className="searchBar"
                           type="text" 
                           id="filter"
                           placeholder="Название видео..."
                    />
                    <button className="searchButton" type="submit">Поиск</button>
                </form>
            </div>
        )
    }
}

class LoginPass extends React.Component{
    constructor(props){
        super(props);
        this.state={    
            userLogin: "",
            userPass: "",
        }
    }

    userInputLogin = event => {
        this.setState({userLogin: event.target.value})
    }
    userInputPass = event => {
        this.setState({userPass: event.target.value})
    }
    
    checkUser = () =>{
        let users=usersData.users;
        for(let i=0;i<users.length;i++){
            if(users[i].login==this.state.userLogin &&
               users[i].password==this.state.userPass){
                this.props.isLoginned();
                localStorage.setItem("token", users[i].login)
                
                if(!localStorage.getItem("users")){
                    let users=[]
                    localStorage.setItem("users",JSON.stringify(users))
                }
                let needAddToLC=true
                let usersBuf = JSON.parse(localStorage.getItem("users"))
                
                usersBuf.forEach(el => {
                    if(el.login==users[i].login){
                        needAddToLC=false;
                    }
                });
                if(usersBuf.length==0 ||needAddToLC){
                    let user={
                        login:users[i].login,
                        favorites:[]
                    }
                    usersBuf.push(user)
                    localStorage.setItem("users",JSON.stringify(usersBuf))
                }

                this.props.getLogin(users[i].login)
                break;
            }
        }
    }

    render(){
        return(
            <div className="loginPass">
                <img className="logoImage"
                       src={"/images/logo.png"}            
                />
                <h2>Вход</h2>
                <form className="formLoginPass">
                    <input className="input"
                           type="text" 
                           id="login"
                           placeholder="Имя пользователя" 
                           onChange={this.userInputLogin}
                           
                    />
                    <input className="input"
                        type="password" 
                        id="pass"
                        placeholder="Пароль" 
                        onChange={this.userInputPass}
                    />
                    <button className="buttonLogin"
                            onClick={this.checkUser}
                    >Войти</button>
                </form>
            </div>
        );
    }
}
/*
class Searcher extends React.Component{
    constructor(props){
        super(props);
        this.state={
            videos: [],
            id:""
        }
    }
    componentDidMount(){
        this.videoSearch("коты")
    }
    videoSearch = (term) => { 
        searcherYT ({key: API_KEY, term: term, res: 20}, (videos) => { 
            this.setState({videos:videos})
            console.log(videos)
        }) 
    }
    render() {
        const opts = {
          height: '390',
          width: '640',
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
          },
        };
    
        let video
        if(this.state.videos.length){
            video=<YouTube videoId={this.state.videos[0].id.videoId} opts={opts} onReady={this._onReady} />;
        }
        else{
            video=[];
        }
        return video;
      }
    
      _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }    
}
*/
class Main extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isLogin: false, 
            login:"" 
        }
    }
    isUnloggined=()=>{
        this.setState({isLogin:false});
    }
    getLogin=(login)=>{
        this.setState({login:login});
    }
    isLoginned=()=>{
        this.setState({isLogin:true});
    }
    buttonClick=(index)=>{
        this.setState({clickedButton:index});
    }
    draw(){
        if(localStorage.getItem("token")){
            return(
                <Content isUnloggined={this.isUnloggined}/>
            );
        }else{
            if(!this.state.isLogin){
                return(
                    <div className="main">
                    <LoginPass getLogin={this.getLogin}
                               isLoginned={this.isLoginned}
                    />
                    </div>
                );
            }else{
                return(
                    <Content isUnloggined={this.isUnloggined}/>
                ); 
            }
        }
    }

    render() {
        return(
            this.draw()
        );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Main />,
    document.getElementById('root')
  );
  