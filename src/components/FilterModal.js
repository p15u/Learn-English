import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Text from "../components/Text";
import Modal from "react-native-modalbox";
import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import LoadingModal from "../components/LoadingModal";

const FilterModal = ({ forwardRef, onFilter }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;

  let Days = [];
  for (let index = 1; index <= 31; index++) {
    Days.push({ label: index, value: index });
  }
  const [openDay, setOpenDay] = useState(false);
  const [DayValue, setDayValue] = useState(null);
  const [DayItems, setDayItems] = useState(Days);
  const [SelectedDay, setSelectedDay] = useState("");

  const [openMonth, setOpenMonth] = useState(false);
  const [monthValue, setMonthValue] = useState(null);
  const [MonthItems, setMonthItems] = useState([
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]);
  const [selectedMonth, setSelectedMonth] = useState(0);

  var year = new Date().getFullYear();
  let years = [];
  for (let index = 2000; index <= year; index++) {
    years.push({ label: index, value: index });
  }
  const [openYear, setOpenYear] = useState(false);
  const [YearValue, setYearValue] = useState(null);
  const [YearItems, setYearItems] = useState(years);
  const [SelectedYear, setSelectedYear] = useState("");

  const [loadingModal, setLoadingModal] = useState(false);
  const [invalidDay, setInvalidDay] = useState(false);
  const [invalidMonth, setInvalidMonth] = useState(false);

  const onPressClose = () => {
    forwardRef.current.close();
  };

  const onPressApply = (day, month, year) => {
    onFilter(day, month, year);
    if (selectedMonth == 2 && SelectedDay > (SelectedYear === 2020 ? 29 : 28)) {
      console.log("February cannot have a day greater than 28(29) ");
      setInvalidDay(true);
      setInvalidMonth(true);
    } else if (
      (selectedMonth == 4 && SelectedDay > 30) ||
      (selectedMonth == 6 && SelectedDay > 30) ||
      (selectedMonth == 9 && SelectedDay > 30) ||
      (selectedMonth == 11 && SelectedDay > 30)
    ) {
      console.log("This month don't have 31st day! ");
      setInvalidDay(true);
      setInvalidMonth(true);
    } else {
      setInvalidDay(false);
      setInvalidMonth(false);
      console.log("Updated!");
      forwardRef.current.close();
    }
  };

  const onPressClearFilters = () => {
    setDayValue("");
    setMonthValue(0);
    setYearValue("");
  };

  return (
    <Modal
      style={{
        borderRadius: 10,
        shadowRadius: 10,
        width: deviceWidth - 50,
        height: 460,
      }}
      backdrop={true}
      ref={forwardRef}
      backdropOpacity={0.8}
      swipeToClose={false}
      backdropPressToClose={false}
    >
      {/* {loadingModal && <LoadingModal />} */}
      <View style={styles.container}>
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 10 }}
          onPress={onPressClose}
        >
          <AntDesign name="closecircleo" size={22} color="red" />
        </TouchableOpacity>
        <Text center title heavy>
          Filters
        </Text>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text heavy style={{ marginBottom: 5 }}>
            Filter by day
          </Text>
          <DropDownPicker
            open={openDay}
            value={DayValue}
            items={DayItems}
            setOpen={setOpenDay}
            setValue={setDayValue}
            setItems={setDayItems}
            placeholder="Choose day"
            containerStyle={{
              width: "90%",
            }}
            dropDownContainerStyle={{ height: 100 }}
            textStyle={{
              fontSize: 14,
            }}
            style={{
              borderColor: invalidDay === true ? "red" : "black",
              borderWidth: invalidDay === true ? 2 : 1,
            }}
            zIndex={300}
            onChangeValue={(value) => setSelectedDay(value)}
          />
          <Text heavy style={{ marginBottom: 5, marginTop: 20 }}>
            Filter by month
          </Text>
          <DropDownPicker
            open={openMonth}
            value={monthValue}
            items={MonthItems}
            setOpen={setOpenMonth}
            setValue={setMonthValue}
            setItems={setMonthItems}
            placeholder="Choose month"
            containerStyle={{
              width: "90%",
            }}
            dropDownContainerStyle={{ height: 100 }}
            textStyle={{
              fontSize: 14,
            }}
            style={{
              borderColor: invalidMonth === true ? "red" : "black",
              borderWidth: invalidMonth === true ? 2 : 1,
            }}
            zIndex={200}
            onChangeValue={(value) => setSelectedMonth(value)}
          />
          <Text heavy style={{ marginBottom: 5, marginTop: 20 }}>
            Filter by year
          </Text>
          <DropDownPicker
            open={openYear}
            value={YearValue}
            items={YearItems}
            setOpen={setOpenYear}
            setValue={setYearValue}
            setItems={setYearItems}
            placeholder="Choose Year"
            containerStyle={{
              width: "90%",
            }}
            dropDownContainerStyle={{ height: 100 }}
            textStyle={{
              fontSize: 14,
            }}
            zIndex={100}
            onChangeValue={(value) => setSelectedYear(value)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "90%",
            alignSelf: "center",
          }}
        >
          <TouchableHighlight
            style={{
              backgroundColor: "#68aaf7",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
            underlayColor="#388FF4"
            onPress={() =>
              onPressApply(SelectedDay, selectedMonth, SelectedYear)
            }
          >
            <Text heavy medium style={{ color: "#FFFFFF" }}>
              Apply
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              backgroundColor: "#FF4136",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
            underlayColor="#FF1103"
            onPress={onPressClearFilters}
          >
            <Text heavy medium style={{ color: "#FFFFFF" }}>
              Clear Filters
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
  },
});
