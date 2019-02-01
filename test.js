const JSDiff = require('diff')


const arr1 = [1,3,4,5,7]
const arr2 = [2,3,4,6,5]
const diffArr = JSDiff.diffArrays(arr1,arr2)

const oldPl = []
const newPl = []

diffArr.forEach(diffObj => {
  diffObj.value.forEach(val => {
    if (diffObj.added) {
      newPl.push(val)
      oldPl.push(null)
    } else if (diffObj.removed) {
      newPl.push(null)
      oldPl.push(val)
    } else {
      newPl.push(val)
      oldPl.push(val)
    }
  })
})

console.log('comparing:',arr1,arr2)
console.log('oldPl','newPl')
for (let i=0; i< oldPl.length; i++) {
  console.log(oldPl[i],newPl[i])
}
