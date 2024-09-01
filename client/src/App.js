import React, {useEffect, useState} from 'react'
import './App.css';
import {addNewData, getData} from "./http/TableData";

import TableChart from "./components/TableChart";
import TableRow from "./components/TableRow";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {

    const columns = ['Выручка, руб', 'Наличные', 'Безналичный расчёт', 'Кредитные карты']
    const weekDaysNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    const objectDataKeys = ['revenue', 'cash', 'non-cash', 'credit card']

    let chartsData = []
    const chartsDisplay = []
    const chartsObject = {}
    let tableData = {}
    let weekday = []

    const countTableBlocks = columns.length * 2
    let chartBlockId = 0

    //chartsData, chartsDisplay, chartsObject, tableData
    for(let i = 0; i <= Number(columns.length) - 1; i++) {

        let thisChartsObject = []

        for(let w = 0; w <= 6; w++) {

            let object = {
                name: weekDaysNames[w],
                revenue: 0,
            }

            thisChartsObject.push(object)
        }

        chartsData.push(thisChartsObject)

        chartsDisplay[i] = 'none';

        chartsDisplay[i] = {
            id: i, display: 'none'
        }

        chartsObject[i] = {};

        for(let q = 0; q <= 6; q++) {
            chartsObject[i][q] = 0;
        }

        tableData[i] = {}

        for(let q = 0; q <= 2; q++) {

            let rowColor;

            q === 0
                ? rowColor = 'rowColorBlue'
                : rowColor = ''

            tableData[i].percentageDifference = 0;
            tableData[i].percentageDifferenceTextColor = 'greenText';

            tableData[i][q] = {
                count: 0,
                rowColor: rowColor
            };
        }
    }

    const [thisChartsDisplay, setThisChartsDisplay] = useState(chartsDisplay)
    const [thisChartsData, setChartsData] = useState(chartsData)
    const [thisTableData, setThisTableData] = useState(tableData)

    async function getDayData(array) {

        let object = {
            'revenue': 0,
            'cash': 0,
            'non-cash': 0,
            'credit card': 0,
        }

        for(let i = 0; i <= Object.keys(array).length - 1; i++) {

            object['revenue'] += array[i].count_money;

            object[array[i].type_deposit] += array[i].count_money;
        }

        return object
    }

    async function getYesterdayColorsBlocks(todayObjectData, yesterdayObjectData) {

        let object = {}

        for(let i = 0; i <= Number(objectDataKeys.length) - 1; i++) {

            let rowColor, textColor

            if(todayObjectData[objectDataKeys[i]] > yesterdayObjectData[objectDataKeys[i]]) {
                rowColor = 'rowColorGreen'
                textColor = 'greenText'
            }
            else if(todayObjectData[objectDataKeys[i]] < yesterdayObjectData[objectDataKeys[i]]) {
                rowColor = 'rowColorRed'
                textColor = 'redText'
            }else {
                rowColor = ''
                textColor = 'greenText'
            }

            object[i] = {
                rowColor: rowColor,
                textColor: textColor,
            }
        }

        return object
    }

    async function percentageDifferenceBetweenTheNumbers(a, b) {

        if(a === 0 || b === 0) {
            return 0
        }

        if(a > b) {
            return Math.round( (a - b) * 100 / a )
        }
        else if(a < b) {
            return Math.round( (b - a) * 100 / b )
        }else {
            return 0
        }
    }

    async function getPercentageDifference(todayObjectData, yesterdayObjectData) {

        let object = {}

        for(let i = 0; i <= Number(objectDataKeys.length) - 1; i++) {

            let a = todayObjectData[objectDataKeys[i]]
            let b = yesterdayObjectData[objectDataKeys[i]]

            object[objectDataKeys[i]] = await percentageDifferenceBetweenTheNumbers(a, b)
        }

        return object
    }

    async function getDatesWeekday() {

        let current = new Date;

        let week= [];

        current.setDate((current.getDate() - current.getDay() +1));
        for (let i = 0; i < 7; i++) {
            week.push(
                new Date(current).toISOString().split('T')[0]
            );
            current.setDate(current.getDate() +1);
        }
        return week;
    }

    function formattingANumber(number) {
        return number.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    async function updateTableData(thisTableData, yesterdayPercentageDifference, yesterdayColorsBlocks, todayData, yesterdayData, thisDayOfTheWeekData) {

        for(let i = 0; i <= Number(columns.length) - 1; i++) {

            thisTableData[i].percentageDifference = yesterdayPercentageDifference[objectDataKeys[i]]
            thisTableData[i].percentageDifferenceTextColor = yesterdayColorsBlocks[i].textColor

            thisTableData[i].percentageDifferenceTextColor === 'greenText'
                ? thisTableData[i][1].rowColor = 'rowColorGreen'
                : thisTableData[i][1].rowColor = 'rowColorRed'

            for(let q = 0; q <= 2; q++) {

                q === 0 ? thisTableData[i][q].count = formattingANumber(todayData[objectDataKeys[i]])
                    : (q === 1) ? thisTableData[i][q].count = formattingANumber(yesterdayData[objectDataKeys[i]])
                        : thisTableData[i][q].count = formattingANumber(thisDayOfTheWeekData[objectDataKeys[i]])
            }
        }
    }

    async function updateChartsData(data, weekday) {

        for (let w = 0; w <= 6; w++) {

            let thisWeekDay = weekday[w]
            let thisWeekDayArray = await data.filter((row => row.date_deposit.substring(0, 10) === thisWeekDay))

            let object = {
                'revenue': 0,
                'cash': 0,
                'non-cash': 0,
                'credit card': 0,
            }

            for (let c = 0; c <= thisWeekDayArray.length - 1; c++) {

                object['revenue'] += thisWeekDayArray[c].count_money;

                if(thisWeekDayArray[c].type_deposit === 'cash') {
                    object['cash'] += thisWeekDayArray[c].count_money;
                }

                if(thisWeekDayArray[c].type_deposit === 'non-cash') {
                    object['non-cash'] += thisWeekDayArray[c].count_money;
                }

                if(thisWeekDayArray[c].type_deposit === 'credit card') {
                    object['credit card'] += thisWeekDayArray[c].count_money;
                }
            }

            for(let i = 0; i <= Number(columns.length) - 1; i++) {
                chartsObject[i][w] = object[objectDataKeys[i]]
            }
        }

        for(let i = 0; i <= 6; i++) {

            for(let q = 0; q <= Number(columns.length) - 1; q++) {

                chartsData[q][i].revenue = chartsObject[q][i]
            }
        }
    }

    async function getAllDataFromDB() {
        try {
            const response = await getData()

            if(response?.data) {

                setIsLoading('Обновление данных...')

                const data = response.data

                const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
                const today = new Date().toISOString().split('T')[0]
                const thisDayWeek = new Date().getDay()

                weekday = await getDatesWeekday()
                await updateChartsData(data, weekday)

                const today_data = await data.filter(row => row.date_deposit.substring(0, 10) === today)
                const yesterday_data = await data.filter(row => row.date_deposit.substring(0, 10) === yesterday)
                const thisDayOfTheWeek = await data.filter(row => new Date(row.date_deposit).getDay() === thisDayWeek)

                const todayData = await getDayData(today_data)
                const yesterdayData = await getDayData(yesterday_data)
                const thisDayOfTheWeekData = await getDayData(thisDayOfTheWeek)

                const yesterdayColorsBlocks = await getYesterdayColorsBlocks(todayData, yesterdayData)
                const yesterdayPercentageDifference = await getPercentageDifference(todayData, yesterdayData)

                await updateTableData(tableData, yesterdayPercentageDifference, yesterdayColorsBlocks, todayData, yesterdayData, thisDayOfTheWeekData)

                setChartsData(chartsData)
                setThisTableData(tableData)

                setIsLoading('')
            }
        } catch(e) {
            console.log(e)
        }
    }

    function setChartDisplay(chart_id) {

        let newDisplay

        thisChartsDisplay[chart_id].display === 'none'
            ? newDisplay = 'block'
            : newDisplay = 'none'

        setThisChartsDisplay(prevState =>
            prevState.map(item =>
                item.id === chart_id
                    ? { ...item, display: newDisplay }
                    : item
            )
        )
    }

    const [startDate, setStartDate] = useState(new Date());

    const [isLoading, setIsLoading] = useState('Обновление данных...')

    async function newData() {
        try {
            await addNewData(startDate.toISOString().split('T')[0])
            await getAllDataFromDB()
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getAllDataFromDB()
    }, []);

    return (
    <div className="App">

        <table>

            <thead>
            <tr>
                <th className="first_column">Показатель</th>
                <th className="rowColorBlue">Текущий день</th>
                <th>Вчера</th>
                <th>Этот день недели</th>
            </tr>
            </thead>
            <tbody>

                {
                    [...Array(countTableBlocks).keys()].map((key) => {

                        if(key % 2 === 1) {

                            chartBlockId++

                            return <TableChart
                                rowData={thisChartsData[chartBlockId - 1]}
                                chartDisplay={thisChartsDisplay[chartBlockId - 1].display}
                                key={key}
                            />
                        }else {

                            let value = columns[chartBlockId]

                            return <TableRow
                                rowName={value}
                                rowData={thisTableData[chartBlockId]}
                                rowId={chartBlockId}
                                function={setChartDisplay}
                                key={key}
                            />
                        }
                    })
                }

            </tbody>

        </table>

        <div className="newData">
            <p>Дата для занесения данных: </p>
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                id="DatePicker"
            />
            <button onClick={newData} className="button">Добавить данные</button>
        </div>

        <div className="loading">{isLoading}</div>
    </div>
    );
}

export default App;
