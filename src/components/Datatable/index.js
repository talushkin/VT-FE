import React, { useEffect } from "react";
import Icon from 'react-web-vector-icons';

import './Datatable.scss';

const Datatable = props => {
	console.log(props, "props")
	const { data, columns, bodyHeight, patchBgColor, headerBgColor, rowsBgColor, leftPad , topWidth} = props;

	useEffect(() => {
		const load = async () => { };
		load();
	}, []);

	const renderColumn = (column, index) => {
		let sortIcon = null;

		if (column.sortable) {
			sortIcon = (<Icon name='chevron-small-down' font='Entypo' color='#797979' size={40} />);
		}

		let stl = { width: column.width || 'initial' };

		if (column.headerStyle) {
			stl = { ...stl, ...column.headerStyle };
		}

		return (
			<div key={index} className="datagrid-header" style={stl}>
				{column.header ? column.header(column, index) : column.name}
				{sortIcon}
			</div>
		)
	};

	const renderCell = (row, column) => {
		// console.log(row, "row")
		return (
			<>
				<div key={Math.random()} className="datagrid-cell" style={column.cellStyle}> {column.cell ? column.cell(row) : row[column.id]}
				</div>
			</>
		)
	};

	const renderRow = (row, index) => {
		return (
			<>
				<div key={index} className="datagrid-row" style={{ paddingLeft:leftPad||'50px' , backgroundColor: rowsBgColor || '#FFF', gridTemplateColumns: widths.join(" ") }}>
					{columns.map((column) => renderCell(row, column))}
				</div>
			</>
		)
	};

	const widths = columns.map(c => c.width);

	return (
		<>
			<div className="datagrid-container ">
				<div className="datagrid-headers-scroll-patch" style={{ backgroundColor: patchBgColor || '#F9F9F7' }} />
				<div className="datagrid-headers-container" style={{ width: topWidth || '100%' }}>
					<div className="datagrid-headers" style={{ backgroundColor: headerBgColor || '#F9F9F7', gridTemplateColumns: widths.join(" ") }}>
						{columns.map((c, i) => renderColumn(c, i))}
					</div>
				</div>
				<div className="datagrid-body" style={{ height: bodyHeight || '80vh' }}>
					{data.map((row, i) => renderRow(row, i))}
				</div>
			</div>

		</>
	)
};

export default Datatable;

