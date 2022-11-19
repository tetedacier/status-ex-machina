import React, { useState } from 'react';

export function MachineName() {
    const [machineName, setMachineName] = useState('');
    return (
        <label>
            <span>name of machine</span>
            <input
                name="animation-name"
                type="text"
                placeholder="spin, retract, ..."
                value={machineName}
                onInput={(event) => {
                    setMachineName(event.target.value);
                }} />
        </label>
    );
}
