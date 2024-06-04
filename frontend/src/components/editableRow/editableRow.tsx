
import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import styles from "./editableRow.module.css"

type TEditableRowProps = {
    label: string;
    value: string;
    onChangeCallback: (name: string) => void;
    disabled?: boolean;
}

export const EditableRow = (
    {
        label,
        value,
        onChangeCallback,
        disabled,
    }: TEditableRowProps) => {

    const editValueHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChangeCallback(e.currentTarget.value)
    }

    return (
        <div className={styles.userRow}>
            <TextField
                disabled={disabled}
                style={{ width: "80%" }}
                type="text"
                id="text"
                label={label}
                variant="standard"
                value={value}
                onChange={editValueHandler}
            />
        </div>
    )
}