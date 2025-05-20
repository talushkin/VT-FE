import React from 'react'
import DangerExlamation from '../Icons/DangerExlamation/DangerExclamation'
import SuccessCheck from '../Icons/SuccessCheck/SuccessCheck'
import styles from './Alert.module.scss'

function Alert({ msg, type, padding = '' }) {

    const classForType = () => {
        switch (type) {
            case "success":
                return styles.success
            case "warning":
                return styles.warning
            case "danger":
                return styles.danger
            case "info":
                return styles.info
            default:
                return ''
        }
    };

    const iconForType = () => {
        switch (type) {
            case "success":
                return (<SuccessCheck size={16} />)
            case "warning":
                return (<DangerExlamation size={16} fill="#282A35" />)
            case "danger":
                return (<DangerExlamation size={16} fill="#D9212C" />)
            case "info":
                return (<DangerExlamation size={16} fill="#2171d9" />)
            default:
                return ''
        }
    };

    return (
        <div className={styles.wrapper} style={{ padding }}>
            <div className={styles.iwrp + ' ' + classForType()}>
                {iconForType()}{msg}
            </div>
        </div>
    )
}
export default Alert