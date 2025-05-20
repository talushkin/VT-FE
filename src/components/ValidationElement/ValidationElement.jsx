import React from 'react'
import styles from './ValidationElement.module.scss'
import ValidationDot from './ValidationDot.jsx'

function ValidationElement({ rule }) {
    return (
        <li className={styles.validation + ' ' + (rule.valid ? styles.valid : styles.invalid)}>
            <ValidationDot valid={rule.valid} error={rule.error} />
            <span className='ps-1'>
                {rule.title}
            </span>
        </li>
    )

}
export default ValidationElement