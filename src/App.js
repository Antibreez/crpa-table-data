import { useEffect, useState } from 'react';
import { getData } from './data';
import s from './App.module.scss'
import cl from 'classnames';

const GROP_MAX = 50;

const initialData = getData(120);
let currentCol = -1;
let sortingIndex = 1;
let sortingValue = '';

const getGroupQuantity = (arr) => {
  const rest = arr.length % GROP_MAX > 0 ? 1 : 0;
  const total = Math.floor(arr.length / GROP_MAX) + rest;
  return Array(total).fill(null);
}

const getButtonStyle = (idx) => {
  return idx !== currentCol
    ? ''
    : sortingIndex === 1
    ? 'up'
    : 'down'
} 

const filterData = (arr, val) => { 
  return [
    ...arr.filter(item => {
      let valid = false;
    
      Object.keys(item).forEach(prop => {
        if (item[prop].toString().indexOf(val) !== -1) valid = true;
      })
    
      return valid
    })
  ]
}

const sortData = (arr, val) => {
  return [
    ...arr.sort((prev, next) => {
      if ( prev[val] < next[val] ) return sortingIndex * -1;
      if ( prev[val] > next[val] ) return sortingIndex;
    })
  ]
}

const getMarkedMatch = (text, value) => {
  const splited = text.toString().split(value);
  return splited.map((item, i) => {
    return (
      <span key={i}>
        {item}
        {i < splited.length - 1 ? <b>{value}</b> : null }
      </span>
    )
  })
}

function App() {
  const [data, setData] = useState(initialData);
  const [groups, setGroups] = useState(getGroupQuantity(data));
  const [inputValue, setInputValue] = useState('');
  const [currentGroup, setCurrentGroup] = useState(0);

  const sortingHandle = e => {
    const idx = +e.target.getAttribute('data-idx');
    sortingValue = Object.keys(data[0])[idx];

    //setSortingIndex(idx === currentCol ? sortingIndex * -1 : 1);
    sortingIndex = idx === currentCol ? sortingIndex * -1 : 1
    currentCol = idx

    // setData([
    //   ...initialData.filter(item => {
    //     let valid = false;

    //     Object.keys(item).forEach(prop => {
    //       if (item[prop].toString().indexOf(value) !== -1) valid = true;
    //     })

    //     return valid
    //   }).sort((prev, next) => {
    //       if ( prev[val] < next[val] ) return sortingIndex * -1;
    //       if ( prev[val] > next[val] ) return sortingIndex;
    //     })
    // ])

    setData(sortData(filterData(initialData, inputValue), sortingValue))

    //setCurrentCol(idx);
  } 

  const changeHandle = e => {
    const newValue = e.target.value;
    const newData = sortData(filterData(initialData, newValue), sortingValue);
    
    setInputValue(newValue);
    setGroups(getGroupQuantity(newData))
    setData(newData);
  }

  const changeGroupHandle = e => {
    const idx = +e.target.getAttribute('data-idx');

    setCurrentGroup(idx);
  }
  

  return (
    <div className={s.App}>

      <h1>Таблица данных</h1>
      <span>Фильтр: </span>
      <input type="text" value={inputValue} onChange={changeHandle}/>
      
      <table>
        <tbody>
          <tr>
            <th>
              <button 
                className={cl(s[getButtonStyle(0)], s.sortingBtn)}
                data-idx="0" 
                onClick={sortingHandle}
              >
                Номер
              </button>
            </th>
            <th>
              <button 
                className={cl(s[getButtonStyle(1)], s.sortingBtn)}
                data-idx="1" 
                onClick={sortingHandle}
              >
                Название
              </button>
            </th>
            <th>
              <button 
                className={cl(s[getButtonStyle(2)], s.sortingBtn)}
                data-idx="2" 
                onClick={sortingHandle}
              >
                Кол-во
              </button>
            </th>
            <th>
              <button 
                className={cl(s[getButtonStyle(3)], s.sortingBtn)}
                data-idx="3" 
                onClick={sortingHandle}
              >
                Статус
              </button>
            </th>
          </tr>

          {
            data.slice(currentGroup * GROP_MAX, currentGroup * GROP_MAX + GROP_MAX).map(item => {
              return (
                <tr key={ item.id }>
                  <td className="dataCell">{ getMarkedMatch(item.id, inputValue) }</td>
                  <td className="dataCell">{ getMarkedMatch(item.name, inputValue) }</td>
                  <td className="dataCell">{ getMarkedMatch(item.count, inputValue) }</td>
                  <td className="dataCell">{ getMarkedMatch(item.status, inputValue) }</td>
                </tr>
              )
            })
          }

        </tbody>
      </table>

      <div className={s.pagination}>
        {
          groups.length > 1
          ? groups.map((_, i) => {
              return (
                <button 
                  className={cl(s.pageBtn, {[s.activePage]: currentGroup === i})}
                  key={i} 
                  data-idx={i} 
                  onClick={changeGroupHandle}
                >
                  { i + 1 }
                </button>
              )
            })
          : null
        }
      </div>
    </div>
  );
}

export default App;
