const db = require('../db')

const randomNumber = async (min, max) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
}

const types_deposit = ['cash', 'non-cash', 'credit card']

class TableController {

    async addNewData(req, res) {

        const dateNewData = req.body.data;

        const countChecks = await randomNumber(10, 30)

        const newData = {}

        for(let i = 1; i <= countChecks; i++) {

            const count_money = await randomNumber(10000, 30000)
            const number_deposit = await randomNumber(0, 2)
            const type_deposit = types_deposit[number_deposit]
            const date_deposit = dateNewData

            const thisNewData = await db.query('INSERT INTO deposits (count_money, type_deposit, date_deposit) VALUES ($1, $2, $3) RETURNING *', [count_money, type_deposit, date_deposit])

            newData[i] = thisNewData.rows
        }

        res.json(newData)
    }

    async getData(req, res) {

        const result = await db.query('SELECT deposit_id, count_money, type_deposit, date_deposit::varchar FROM deposits')
        return res.json(result.rows)
    }

}

module.exports = new TableController()