import css from './css/PageCtrlModule.module.css'

export default function PageCtrlModule(props) {
  return (
    <div className={css.view}>
      <div className={css.left}>{props.LBtns}</div>
      <div className={css.right}>{props.RBtns}</div>
    </div>
  )
}
