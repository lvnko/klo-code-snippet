import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  // 
  const rowStrLen = 24;
  
  // Color display for the demostration only
  const colorMatrix = ['red', 'darkorange', 'green', 'blue', 'pink'];
  
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

  const arrStrLen = (_arr) => {
    console.log("_arr => ", _arr);
    const result = _arr.reduce((preVal, curStrObj)=>{ return preVal + curStrObj.label.length; }, 0);
    console.log("result => ", result);
    return result;
  }

  const widthProportionApplication = (_arr, _totalStrLim, _index) => {
    console.log("_arr, _totalStrLim => ", _arr, _totalStrLim);

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

  const labelsLayoutFrames = labelsArrGrp.length > 0 ? labelsArrGrp.reduce((preArr, curStr)=>{
    let _preArr = preArr || [[]];
    const arrEndIndex = _preArr.length - 1;
    const currRowLen = arrStrLen(_preArr[arrEndIndex]);
    if ((currRowLen + curStr.label.length) > rowStrLen || parseInt(_preArr[arrEndIndex].length) >= 3) {
      _preArr.push([]);
    }
    _preArr[_preArr.length - 1].push(curStr);
    return _preArr;
  }, [[]]).map((rowGrp, index) => {
    return widthProportionApplication(rowGrp, rowStrLen, index);
  }).reduce((_preRow, _curRow)=>{
    return [..._preRow, ..._curRow];
  }) : [];

  console.log("what is labelsLayoutFrames : ", labelsLayoutFrames);

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
              flexBasis: labelObj.basis + "%",
              backgroundColor: colorMatrix[index%5],
              height: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              borderRadius: 16,
              marginTop: labelObj.marginTop * 5,
              marginLeft: labelObj.marginLeft * 5,
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
