import React from 'react'
import ValidationElement from '../ValidationElement/ValidationElement.jsx'
import styles from './ValidationHelper.module.scss'


function ValidationHelper({ rules, passMatch }) {


    return (
        <div className={styles.pwd_validation}>
            {rules.map((rule) => {
                return (
                    <ValidationElement
                        key={rule.title}
                        rule={rule} />
                )
            })}
        </div>)
}
export default ValidationHelper