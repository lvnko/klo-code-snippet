import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  // Define a maximum character limit for each row,
  // this number will be used to limit how many characters
  // of all the labels in one row can contain.
  // ie. when row character limitation is equal to 24, then :
  // - "Hong Kong" + "Kowloon" + "New Territories" = 31 characters > 24
  //   Row #1 => "Hong Kong", "Kowloon" [characters lenght : 16]
  //   Row #2 => "New Territories" [characters lenght : 14]
  const rowStrLen = 24;

  // Define the number of label that can be contained in each row.
  const rowLabelLen = 3;

  // Color display for the demostration only
  const colorMatrix = ['red', 'darkorange', 'green', 'blue', 'pink'];
  
  // An example of array that carrys all the labels from the input
  // component, we are assuming each of this label will be carried by
  // an attribute called, 'label', inside each of the item in the array.
  const labelsArrGrp = [{
    label: 'Hong Kong'
  }, {
    label: 'Kowloon'
  }, {
    label: 'New Territories'
  }, {
    label: 'Owned'
  }, {
    label: 'Retail'
  }, {
    label: 'Mortgaged'
  }, {
    label: 'Applicant'
  }, {
    label: 'Parent(s)'
  }, {
    label: 'Relative(s)'
  }, {
    label: 'Government Estate'
  }, {
    label: 'Quarter'
  }, {
    label: 'Quarter'
  }];

  // A function to sum up the total number of characters
  // of all the strings carried by attribute 'label' from
  // each item in an array given.
  const arrStrLen = (_arr) => {
    console.log("_arr => ", _arr);
    const result = _arr.reduce((preVal, curStrObj)=>{ return preVal + curStrObj.label.length; }, 0);
    console.log("result => ", result);
    return result;
  }

  // A function to analyse array of labels of each row
  // and insert proportional sizing value into the attribute,
  // basis of each label item of the given array.
  const widthProportionApplication = (_arr, _totalStrLim, _index) => {

    const arrLongest = _arr.reduce((_prevLen, currObj)=>{
      return currObj.label.length > _prevLen ? currObj.label.length : _prevLen;
    },0);

    const requirePropostionalCal = (arrLongest > (_totalStrLim / 3) && _arr.length > 2)
      || (arrLongest > (_totalStrLim / 2) && _arr.length == 2)
      || (arrLongest > (_totalStrLim / 3 * 2) && _arr.length > 1) ?
        true : false;
    return _arr.map((itm, index)=> {
      return {
        basis: requirePropostionalCal?
          _arr.length == 3 ?
            itm.label.length > _totalStrLim/3 ?
              30 + (((itm.label.length - (_totalStrLim/3)) / _totalStrLim) * 100)
              : 30 - ((((_totalStrLim/3) - itm.label.length) / _totalStrLim) * 100)
            : _arr.length == 2 ?
              itm.label.length > _totalStrLim/2 ?
                48 + (((itm.label.length - (_totalStrLim/2)) / _totalStrLim) * 100)
                : 48 - ((((_totalStrLim/2) - itm.label.length) / _totalStrLim) * 100)
              : 99
          : _arr.length == 3 ?
            30
            : _arr.length == 2 ?
              48 : 99,
        marginLeft: index > 0 ? 1 : 0,
        marginTop: _index > 0 ? 1 : 0,
        ...itm
      };
    });
  }

  // Here is where we apply all the functions at the above to analyse the
  // array object, labelsArrGrp, and insert sizing values into each item.
  // The operational order of these function is as below:
  // 1. Based on limitation of : rowStrLen and rowLabelLen, separate the
  //    array objects of labels into rows, format is as below:
  //    [
  //      [               <----- Array item #1, an array of row #1
  //        {             <----- Object of label #1 in row #1
  //          label: '...'
  //        },
  //        {...},
  //        {...}
  //      ],
  //      [...],          <----- Array item #2, an array of row #2
  //      [...],          <----- Array item #3, an array of row #3
  //      ...
  //    ]
  const labelsLayoutFrames = labelsArrGrp.length > 0 ? labelsArrGrp.reduce((preArr, curStr)=>{
    let _preArr = preArr || [[]];
    const arrEndIndex = _preArr.length - 1;
    const currRowLen = arrStrLen(_preArr[arrEndIndex]);
    if ((currRowLen + curStr.label.length) > rowStrLen || parseInt(_preArr[arrEndIndex].length) >= rowLabelLen) {
      _preArr.push([]);
    }
    _preArr[_preArr.length - 1].push(curStr);
    return _preArr;
  }, [[]])
  // 2. Each array, as a container of labels of one row, 
  //    will be given to function, widthProportionApplication,
  //    a function that provide proportional values to each
  //    label based on the ratio of its string length in comparing
  //    to the string characters limition (rowStrLen):
  .map((rowGrp, index) => {
    return widthProportionApplication(rowGrp, rowStrLen, index);
  })
  // 3. Finally we break the complex format created at step #1,
  //    each array item of row, will be de-construted, into the
  //    original basis unit, a label, the final array format will be
  //    as same as labelsArrGrp, the only difference is that now
  //    each item carry not only the label, but also proportioanal
  //    value of width (basis):
  .reduce((_preRow, _curRow)=>{
    return [..._preRow, ..._curRow];
  }) : [];

  return (
    <View style={styles.container}>
      <Text style={{
        marginTop: 10,
      }}>Example</Text>
      <StatusBar style="auto" />
      <View style={styles.tagContainer}>
        {labelsLayoutFrames.map((labelObj, index) => {
          return (
            <View key={'labelTag-' + index} style={{
              flex: 1,
              backgroundColor: colorMatrix[index%5],
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              height: 50, //       <-----┐
              borderRadius: 16, // <--- Please dont't forget to use sw to handle this value on implementation
              marginTop: labelObj.marginTop * 5,
              marginLeft: labelObj.marginLeft * 5,
              flexBasis: labelObj.basis + "%",
              // ⟰ Above is where we apply the value of proportional widths that were calculated by function, widthProportionApplication.
            }} >
              <Text style={{
                textAlign: "center",
                fontSize: 18,
                color: '#000000'
              }}>{labelObj.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  tagContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    // backgroundColor: "#9F0045"
  }
});
