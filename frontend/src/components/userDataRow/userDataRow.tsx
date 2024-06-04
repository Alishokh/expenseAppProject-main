import { Button } from '@mui/material';
import styles from "./userDataRow.module.css"

type TUserDataRowProps = {
    title: string;
    value: string;
}
export const UserDataRow = ({ title, value }: TUserDataRowProps) => {
    return (
        <div className={styles.userRow}>
            <span>{title}: </span>
            <b>{value}</b>
            {/* <Button
                variant="contained"
                size="small"
                style={{ fontSize: "10px" }}
                onClick={() => onChangeCallback(true)}
            >
                Edit
            </Button> */}
        </div>
    )
}