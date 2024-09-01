import React from 'react';

const TableRow = (props) => {

    return (
        <tr onClick={() => props.function(props.rowId)}>
            <td className="first_column td__left">{props.rowName}</td>
            <td className={props.rowData[0].rowColor}>{props.rowData[0].count}</td>
            <td className={props.rowData[1].rowColor}>
                <span className="td_span">
                    <p className="pairedValue pairedValueLeft">{props.rowData[1].count}</p>
                    <p className={`pairedValue pairedValueRight ${props.rowData.percentageDifferenceTextColor}`}>
                        {props.rowData.percentageDifference}%
                    </p>
                </span>
            </td>
            <td className={`td__right ${props.rowData[2].rowColor}`}>
                {props.rowData[2].count}
            </td>
        </tr>
    );
};

export default TableRow;