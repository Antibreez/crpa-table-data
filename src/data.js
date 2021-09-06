const  initialName = 'string for shuffling';

const shuffleString = str => {
   return str.split('').sort(function(){return 0.5-Math.random()}).join('');
}

const getRandomNumber = max => {
  return Math.floor(Math.random() * (max + 1))
}

export const getRandomStatus = () => {
  return ['valid', 'invalid'][Math.floor(Math.random()*2)]
}

export const getData = (qty) => {
  return Array(qty).fill(null).map(() => {
    return {
      name: shuffleString(initialName),
      count: getRandomNumber(500),
      status: getRandomStatus()
    }
  })
}