import { AcceptConflictButton } from "./acceptConflictButton";
import { RefuseConflictButton } from "./refuseConflictButton";
import React, { useState } from 'react';
import '../App.css';



export function ConflictCenter({ disabled }) { // wrongValue, rightValue, nbRestants,
    return React.createElement('div',null,
        React.createElement('p',null, 'Champ entré : '),
        //React.createElement('p',null, {wrongValue}),
        React.createElement('p',null, 'Remplacer par : '),
        //React.createElement('p',null, {rightValue}),
        React.createElement(AcceptConflictButton ,{disabled : disabled}),
        React.createElement(RefuseConflictButton ,{disabled : disabled}),
        //React.createElement('p',null, {nbRestants}),
        React.createElement('p',null, ' conflits restants.'),
    );
}