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

let API_KEY = "AIzaSyD9S5XQv6Ze52mZssvuDbttLUsAzopED_s";

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

    handleChange=(event)=>{
        this.setState({valueSlider:event.target.value})
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
    handleChange=(event)=>{
        this.setState({value: event.target.value});
    }
    render(){
        return(
            <select className="selectField" value={this.state.value} onChange={this.handleChange}>
                <option value="0">Высота</option>
                <option value="1">Ширина</option>
                <option value="2">Глубина</option>
                <option value="3">Угол</option>
            </select>
        );
    }
}

class FavoritesDialogView extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userAsk:""
        }
    }
    componentDidMount=()=>{
        this.setState({userAsk:this.props.ask})
    }
    handleChange=(event)=>{
        this.setState({userAsk:event.target.value})
    }
    handleSubmit=(event)=>{
        event.preventDefault()
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
                           onChange={this.handleChange}
                    />
                </form>
                <form onSubmit={this.handleSubmit} className="fieldDialogWindow">
                    <label className="labelDialogWindow">Название</label>
                    <input className="inputDialogWindow"
                           type="text" 
                           id="name" 
                    />
                </form>
                <div className="fieldDialogWindow">
                    <label className="labelDialogWindow">Сортировать по</label>
                    <SelectField />
                </div>
                <div className="fieldDialogWindow">
                    <label className="labelDialogWindow">Количество</label>
                    <RangeSlider />
                </div>
                <div className="buttonsFieldDialogWindow">
                    <button className="buttonDialogWindow"
                            onClick={this.props.handleHide}
                    >Не сохранять</button>
                    <button className="buttonDialogWindow"
                            onClick={()=>this.props.putDataInLC(this.state.userAsk,"my_search","none","25")}      ////////////////////////////////////////////////////  
                    >Сохранить</button>
                </div>
            </div>
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
            isOpened: false
        }
    }
    clickButton=(index)=>{
        this.setState({clickedButton:index})
    }

    fillVideos=(videos)=>{
        console.log(videos)
        this.setState({videos:videos})
    }

    getAsk=(term)=>{
        this.setState({userAsk:term})
    }

    handleShow=()=> { this.setState({ isOpened: true  }) }
    handleHide=()=> { this.setState({ isOpened: false }) }
    
    putDataInLC=(ask,name,sort,count)=>{ 

        let usersBuf = JSON.parse(localStorage.getItem("users"))
        usersBuf.forEach(el => {
            if(el.login==localStorage.getItem("token"))
            {
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
    
    renderItems(){
        let items = []
        this.state.videos.forEach(el => {
            items.push(<ItemContent 
                            id={el.id.videoId}
                            preview={el.snippet.thumbnails.medium.url}
                            title={el.snippet.title}
                            typeView={this.state.typeView}
                            info={el.snippet.channelTitle}
                      />)
        });
        for(let i=0;i<12;i++){
            items.push(<ItemContent
                            id={i}
                            preview={"https://i.ytimg.com/vi/u4XsdS5cRpA/hqdefault.jpg?sqp=-oaymwEjCOADEI4CSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCyTvsDcVN87g4v3vF7M9br5xFTzA"}
                            title={"УШЕЛ ОДИН жить в ДОМ ПОД ЗЕМЛЕЙ | МЕДВЕДИЦА ПРИШЛА С МЕДВЕЖОНКОМ | КРЫША НЕ ВЫДЕРЖАЛА"}
                            typeView={this.state.typeView}
                            info={"ЛЕСНЫЕ \n1 830 630 просмотров"}
                      />)
        }

        return items
    }
    renderContent=()=>{
        if(this.state.clickedButton==0){
            if(this.state.videos.length){
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
                            <FontAwesomeIcon onClick={this.handleShow} 
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
                            {this.state.isOpened ? 
                            <Dialog 
                                content={<FavoritesDialogView header="Сохранить запрос" 
                                                              ask={this.state.userAsk} 
                                                              handleHide={this.handleHide}
                                                              putDataInLC={this.putDataInLC}/>}
                            />
                            :  null }
                    </div>
                );
            }
        }
        if(this.state.clickedButton==1){
            return(
                <div>here we are</div>
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
                            <div className={this.state.clickedButton==2?"buttonClicked":"button"} onClick={(()=>{
                                                                                                                    localStorage.removeItem("token") 
                                                                                                                    this.props.isUnloggined()})}>Выйти</div>
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
        // searcherYT ({key: API_KEY, term: term, res: 12}, (videos) => { 
        //     this.props.fillVideos(videos)
        // }) 
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
  