import React, { Component } from 'react';
import { connect } from 'react-redux';


export class App extends Component {

  getQuery = url => {
    return new Promise((succeed, fail)=>{
      const request = new XMLHttpRequest();
      request.open('GET', url);
      request.addEventListener('load', () => {
        (request.status < 400) ? succeed(request.responseText) : fail(new Error('Error '+request.statusText))
      });
      request.addEventListener('error', ()=>{
        fail(new Error('Error'));
      });
      request.send();
    });
  };

  componentDidMount(){
    this.getQuery('https://api.hh.ru/vacancies/').then(text=>{
      this.props.onGetData(JSON.parse(text));
      console.log(this.props);
    }, error=>{
      console.log('error');
    });
    this.getQuery('https://api.hh.ru/areas/113').then(text=>{
      console.log(JSON.parse(text));
      this.props.onGetCities(JSON.parse(text));
    }, error=>{
      console.log('error');
    });
  }

  onSelectCity(id){
   console.log(id)

  }
  // renderData = () =>{
  //   const { items } = this.props.appStore.data;
  //   return(
  //     <div>{items.forEach((index, item)=><p key="index">{item}</p>}</div>
  //   )
  // };


  render(){
    if (this.props.list&&!this.props.list.length) return <ul>нет данных</ul>

    let list = this.props.list.map(item =>
      <div className="vacWrap">
        <p className="title">{item.name}</p>
        <label>Требования: </label>
        <span className="vacRequirment">{item.snippet.requirement}</span><br/>
        <label>Обязанности: </label>
        <span className="vacResponsibility">
          <span dangerouslySetInnerHTML={(() => {return {__html: item.snippet.responsibility===null?'Не указано':item.snippet.responsibility}})()}/>
        </span><br/>
        <label>Заработная плата: </label>
        <span className="vacSalary">
          {item.salary===null?"Договорная":item.salary.from===null?"Договорная":`от ${item.salary.from} рублей`}
        </span><br/>
        <label>Компания: </label>
        <span className="vacCompany">{item.employer.name}</span>
        <span className="vacRegion">, {item.area.name}</span>
      </div>);

    console.log(this.props.cities);
    let cities = this.props.cities.map(city=>city.areas.map(area=><option key={area.id}>{area.name}</option>));
    return(
    <div>
      <div className="filter">
        <select onChange={(e)=>this.onSelectCity(e)}>
          {cities}
        </select>
      </div>
      <div className="wrap">{list}</div>
    </div>
    )


    // let list=[];
    //
    // if (!(this.props.data&&this.props.data.items.length)) return <div>Данные загружаются...</div>;
    //
    //
    //
    // return <ul>{list.length?"нет данных":list}</ul>

  }
}

export default connect (
  store => ({
    list: store.items,
    cities: store.cities
  }),
  dispatch => ({
    onGetData: (data) => {
      dispatch({
        type: 'FETCH_DATA_SUCCESS',
        payload: data
      })
    },
    onGetCities: (data) => {
      dispatch({
        type: 'FETCH_CITIES_SUCCESS',
        payload: data.areas
      })
    }
  })
)(App);
