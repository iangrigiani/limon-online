'use client';

import { useState } from 'react';
import styles from './NameInput.module.css';

export default function NameInput({ onSubmit, onSkip }) {
    const [name, setName] = useState('');

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase();
        if (value.length <= 3 && /^[A-Z]*$/.test(value)) {
            setName(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.length === 3) {
            onSubmit(name);
        }
    };

    return (
        <div className={styles.nameInput}>
            <h2>¡Nuevo récord!</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="AAA"
                    maxLength="3"
                    autoFocus
                />
                <div className={styles.buttons}>
                    <button 
                        type="submit" 
                        disabled={name.length !== 3}
                    >
                        Guardar
                    </button>
                    <button 
                        type="button" 
                        onClick={onSkip}
                    >
                        Omitir
                    </button>
                </div>
            </form>
        </div>
    );
} 