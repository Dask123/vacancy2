import React, { Component } from 'react';
import { connect } from 'react-redux';


export class App extends Component {

  constructor(props) {
    super(props);
  }


  getQuery = (url, requestBody) => {
    return new Promise((succeed, fail)=>{
      const request = new XMLHttpRequest();
      request.open('GET', url);
      request.addEventListener('load', () => {
        (request.status < 400) ? succeed(request.responseText) : fail(new Error('Error '+request.statusText))
      });
      request.addEventListener('error', ()=>{
        fail(new Error('Error'));
      });
      request.send(requestBody);
    });
  };

  componentDidMount(){
    this.getQuery('https://api.hh.ru/vacancies/').then(text=>{
      this.props.onGetData(JSON.parse(text));
    }, error=>{
      console.log('error');
    });
    this.getQuery('https://api.hh.ru/areas/113').then(text=>{
      this.props.onGetCities(JSON.parse(text));
    }, error=>{
      console.log('error');
    });
  }

  onSelectCity = (e) => {
    let id = e.target.value;
    let params = `area=${id}`;
    this.getQuery(`https://api.hh.ru/vacancies?${params}`).then(text => {
      this.props.onGetFilterCities(JSON.parse(text));
    }, error => {
      console.log('error');
    });
  };

  onFilterSalaryFrom = (e) => {
    let salaryFrom = e.target.value;
    console.log(salaryFrom);
    if(this.props.list.length){
      this.props.onGetUserFilterFrom(salaryFrom);
    }
  };

  onFilterSalaryTo = (e) =>{
    let salaryTo = e.target.value;
    console.log(salaryTo);
    if(this.props.list.length){
      this.props.onGetUserFilterTo(salaryTo);
    }
  };

  render(){
    let list=this.props.list;
    if (list&&!list.length) return <ul>нет данных</ul>;

    list = list.filter(item=>
      (item.salary!==null&&
        item.salary.from!==null&&
          item.salary.from>=this.props.userFilter.salary_from));
    if(this.props.userFilter.salary_to){
      list = list.filter(item=>
        item.salary.from<=this.props.userFilter.salary_to
      )
    };

      list = list.map(item =>
        <div className="vacWrap">
          <p className="title">{item.name}</p>
          <hr>
          </hr>
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


    let cities = this.props.cities.map(city=>city.areas.map(area=><option key={area.id} value={area.id}>{area.name}</option>));
    return(
    <div className="wrap">
      <div className="filterWrap">
        <div className="filter">
          <label>Города: </label>
          <select onChange={this.onSelectCity}>
            {cities}
          </select>
        </div>
        <div className="userFilter">
          <label>Зарплата от: </label><input className="salaryFrom" onChange={this.onFilterSalaryFrom} type="text"/>
          <label>Зарплата до: </label><input className="salaryTo" onChange={this.onFilterSalaryTo} type="text"/>
        </div>
      </div>

      <div>{list}</div>
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
    cities: store.cities,
    userFilter: store.userFilter
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
    },
    onGetFilterCities: (data)=>{
      dispatch({
        type: 'FETCH_FILTER_CITIES',
        payload: data
      })
    },
    onGetUserFilterFrom: (salary_from)=>{
      dispatch({
        type: 'FETCH_FILTER_FROM',
        salary_From: salary_from,
      })
    },
    onGetUserFilterTo: (salary_to)=>{
      dispatch({
        type: 'FETCH_FILTER_TO',
        salary_To: salary_to
      })
    }
  })
)(App);
