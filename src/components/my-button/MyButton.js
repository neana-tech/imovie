import { Button } from "@mui/material";
import styles from './MyButton.module.css'

function MyButton({ title, description }) {
    return (
       <div className={styles.container}>

            <Button className={styles.btn} 
            variant="contained" color="primary">
                { title }
            </Button>

            { description }
        
       </div>
    );
}

export default MyButton;