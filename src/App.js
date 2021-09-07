import { useEffect, useState } from 'react';
import { getData, getRandomStatus } from './data';
import s from './App.module.scss'
import cl from 'classnames';

const initialData = getData(120);
let currentCol = -1;
let sortingIndex = 1;

const getGroupQuantity = (arr, group) => {
  const rest = arr.length % group > 0 ? 1 : 0;
  const total = Math.floor(arr.length / group) + rest;
  return Array(total).fill(null);
}

function App() {
  const [data, setData] = useState(initialData);
  const [groups, setGroups] = useState(getGroupQuantity(data, 50));
  const [value, setValue] = useState('');
  const [currentGroup, setCurrentGroup] = useState(0);

  useEffect(() => {
    console.log(data);
    console.log(groups);
  }, [])

  // const [currentCol, setCurrentCol] = useState(-1);
  // const [sortingIndex, setSortingIndex] = useState(1);

  const getButtonStyle = (idx) => {
    return idx !== currentCol
      ? ''
      : sortingIndex === 1
      ? 'up'
      : 'down'
  } 

  const sortingHandle = e => {
    const idx = +e.target.getAttribute('data-idx');
    const val = Object.keys(data[0])[idx];

    //setSortingIndex(idx === currentCol ? sortingIndex * -1 : 1);
    sortingIndex = idx === currentCol ? sortingIndex * -1 : 1
    currentCol = idx

    console.log(value);

    setData([
      ...initialData.filter(item => {
        let valid = false;

        Object.keys(item).forEach(prop => {
          if (item[prop].toString().indexOf(value) !== -1) valid = true;
        })

        return valid
      }).sort((prev, next) => {
          if ( prev[val] < next[val] ) return sortingIndex * -1;
          if ( prev[val] > next[val] ) return sortingIndex;
        })
    ])

    //setCurrentCol(idx);
  } 

  const changeHandle = e => {
    const newValue = e.target.value;
    setValue(newValue);

    setData([
      ...initialData.filter(item => {
        let valid = false;

        Object.keys(item).forEach(prop => {
          if (item[prop].toString().indexOf(newValue) !== -1) valid = true;
        })

        return valid
      })
    ])

  }

  const changeGroupHandle = e => {
    const idx = +e.target.getAttribute('data-idx');

    setCurrentGroup(idx);
  }
  

  return (
    <div className={s.App}>

      <h1>AAAAAAAAA</h1>
      <input type="text" value={value} onChange={changeHandle}/>
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
            data.slice(currentGroup * 50, currentGroup * 50 + 50).map(item => {
              return (
                <tr key={ item.id }>
                  <td>{ item.id }</td>
                  <td>{ item.name }</td>
                  <td>{ item.count }</td>
                  <td>{ item.status }</td>
                </tr>
              )
            })
          }

        </tbody>
      </table>

      <p>{ currentGroup }</p>

      <div>
        {
          groups.map((_, i) => {
            return <button key={i} data-idx={i} onClick={changeGroupHandle}>{ i + 1 }</button>
          })
        }
      </div>
    </div>
  );
}

export default App;
