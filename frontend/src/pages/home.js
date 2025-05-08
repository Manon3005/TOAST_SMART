import { FileButton } from "../components/fileButton";
import { TableColumn } from "../components/tableColumn";
import React, { useState } from 'react';
import '../App.css';


export function Home() {
    
    const [tableData, setTableData] = useState(Array(7).fill(''));

    return React.createElement(
        'div',
        { className: 'app-container', style: { padding: '20px', fontFamily: 'sans-serif' } },
        React.createElement('h1', null, '🍞 TOAST 🍞'),
        React.createElement('p', null, 'Tous à sa table'),
        React.createElement(FileButton, {className: 'file-button'},'📁 Charger un fichier' ),
        React.createElement(TableColumn,{tableData : tableData, setTableData : setTableData}) //disabled : disabled
    );
}
